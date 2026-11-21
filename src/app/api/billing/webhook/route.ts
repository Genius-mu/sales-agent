import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { PLANS, getPlanByPaystackCode } from "@/lib/plans";
import { disablePaystackSubscription } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";
  const secret = process.env.PAYSTACK_SECRET_KEY ?? "";

  if (!secret) {
    console.error("PAYSTACK_SECRET_KEY is missing in webhook handler");
    return NextResponse.json(
      { error: "Webhook secret unconfigured" },
      { status: 500 },
    );
  }

  // 1. Verify webhook signature HMAC SHA512
  const hash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  const hashBuffer = Buffer.from(hash, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  if (
    hashBuffer.length !== signatureBuffer.length ||
    !crypto.timingSafeEqual(hashBuffer, signatureBuffer)
  ) {
    console.error("Invalid Paystack webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const eventType = event.event as string;
  const data = event.data || {};
  console.log(`Paystack webhook received: ${eventType}`);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // 2. Idempotency Check
  const eventId =
    event.id !== undefined && event.id !== null
      ? String(event.id)
      : `${eventType}:${data.reference || data.subscription_code || data.id || Date.now()}`;

  const { error: idempotencyError } = await supabase
    .from("paystack_webhook_events")
    .insert({
      event_id: eventId,
      event_type: eventType,
      processed: true,
      business_id: data.metadata?.business_id || null,
      raw_metadata: data.metadata || null,
    });

  if (idempotencyError) {
    // Unique constraint violation code '23505' or duplicate event
    if (
      idempotencyError.code === "23505" ||
      idempotencyError.message?.includes("unique")
    ) {
      console.log(`Duplicate webhook event ignored (${eventId})`);
      return NextResponse.json({ received: true, duplicate: true });
    }
    // Log other DB errors, but continue processing if table doesn't exist yet
    console.warn("Webhook idempotency table warning:", idempotencyError.message);
  }

  // 3. Handle Successful Payments & Subscriptions
  if (eventType === "subscription.create" || eventType === "charge.success") {
    const planCode = data.plan?.plan_code || data.plan_code;
    const metadataPlan = data.metadata?.plan;
    const customerEmail = data.customer?.email;

    const realSubscriptionCode =
      data.subscription_code ||
      data.subscription?.subscription_code ||
      (typeof data.code === "string" && data.code.startsWith("SUB_") ? data.code : null) ||
      null;

    const subscriptionId = realSubscriptionCode || data.reference || null;

    const customerCode =
      data.customer?.customer_code ||
      (typeof data.customer === "string" ? data.customer : null) ||
      null;

    const authorizationCode =
      data.authorization?.authorization_code ||
      (typeof data.authorization === "string" ? data.authorization : null) ||
      null;

    const businessId = data.metadata?.business_id;

    // Resolve plan
    let planKey: string | undefined;
    if (metadataPlan && PLANS[metadataPlan]) {
      planKey = metadataPlan;
    } else if (planCode) {
      const planConfig = getPlanByPaystackCode(planCode);
      planKey = planConfig?.key;
    }

    if (!planKey) {
      console.log("Unknown plan in webhook event:", planCode, metadataPlan);
      return NextResponse.json({ received: true });
    }

    // Resolve target business ID
    let bizId = businessId;

    if (!bizId && realSubscriptionCode) {
      const { data: biz } = await supabase
        .from("businesses")
        .select("id")
        .or(
          `paystack_subscription_code.eq.${realSubscriptionCode},subscription_id.eq.${realSubscriptionCode}`,
        )
        .maybeSingle();
      bizId = biz?.id;
    }

    if (!bizId && customerCode) {
      const { data: biz } = await supabase
        .from("businesses")
        .select("id")
        .eq("paystack_customer_code", customerCode)
        .maybeSingle();
      bizId = biz?.id;
    }

    if (!bizId && customerEmail) {
      const { data: authData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const user = authData?.users?.find((u) => u.email === customerEmail);
      if (user) {
        const { data: biz } = await supabase
          .from("businesses")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        bizId = biz?.id;
      }
    }

    if (bizId) {
      const { data: current } = await supabase
        .from("businesses")
        .select("paystack_subscription_code")
        .eq("id", bizId)
        .maybeSingle();
      const previousCode: string | null = current?.paystack_subscription_code ?? null;

      const updateData: Record<string, any> = {
        plan: planKey,
        subscription_status: "active",
      };

      if (subscriptionId) updateData.subscription_id = subscriptionId;
      if (customerCode) updateData.paystack_customer_code = customerCode;
      if (authorizationCode) updateData.paystack_authorization_code = authorizationCode;
      if (realSubscriptionCode) updateData.paystack_subscription_code = realSubscriptionCode;

      const { error } = await supabase
        .from("businesses")
        .update(updateData)
        .eq("id", bizId);

      if (error) console.error("Webhook activation DB error:", error);
      else console.log(`Activated business ${bizId} on plan ${planKey}`);

      // Plan switch: stop the old subscription so the customer isn't billed twice
      if (!error && previousCode && realSubscriptionCode && previousCode !== realSubscriptionCode) {
        const stopped = await disablePaystackSubscription(previousCode);
        if (!stopped.ok) console.error("Failed to stop previous subscription", previousCode, stopped.message);
      }
    } else {
      console.warn("Could not find matching business for webhook:", customerEmail);
    }
  }

  // 4. Subscription ending.
  //    - subscription.not_renew: customer cancelled, but they've paid until the
  //      end of this period, so keep their plan and just mark it non-renewing.
  //    - subscription.disable: the subscription has ended -> back to Free.
  //    Only the business whose CURRENT subscription matches is touched, so
  //    stopping an old subscription during a plan switch can't downgrade them.
  if (
    eventType === "subscription.disable" ||
    eventType === "subscription.not_renew"
  ) {
    const subscriptionCode: string | undefined = data.subscription_code || data.code;
    const update =
      eventType === "subscription.not_renew"
        ? { subscription_status: "non_renewing" }
        : { plan: "free", subscription_status: "cancelled" };

    if (subscriptionCode) {
      const { error } = await supabase
        .from("businesses")
        .update(update)
        .or(
          `subscription_id.eq.${subscriptionCode},paystack_subscription_code.eq.${subscriptionCode}`,
        );
      if (error) console.error(`Webhook ${eventType} DB error:`, error);
      else console.log(`Handled ${eventType} for ${subscriptionCode}`);
    } else {
      console.warn(`${eventType} without a subscription code; ignored`);
    }
  }

  // 5. Handle Failed Payments / Invoices
  if (
    eventType === "charge.failed" ||
    eventType === "invoice.payment_failed"
  ) {
    const subscriptionCode = data.subscription_code || data.code;
    const customerCode = data.customer?.customer_code;
    const businessId = data.metadata?.business_id;

    if (subscriptionCode) {
      await supabase
        .from("businesses")
        .update({ subscription_status: "past_due" })
        .or(
          `subscription_id.eq.${subscriptionCode},paystack_subscription_code.eq.${subscriptionCode}`,
        );
    } else if (businessId) {
      const { data: biz } = await supabase
        .from("businesses")
        .select("plan")
        .eq("id", businessId)
        .single();

      if (biz && biz.plan !== "free") {
        await supabase
          .from("businesses")
          .update({ subscription_status: "past_due" })
          .eq("id", businessId);
      }
    } else if (customerCode) {
      await supabase
        .from("businesses")
        .update({ subscription_status: "past_due" })
        .eq("paystack_customer_code", customerCode);
    }

    console.log("Recorded payment failure / past_due status");
  }

  return NextResponse.json({ received: true });
}
