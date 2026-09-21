import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { PLANS, getPlanByPaystackCode } from "@/lib/plans";

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
    const subscriptionCode =
      data.subscription_code || data.subscription?.subscription_code || data.reference;
    const customerCode = data.customer?.customer_code;
    const authorizationCode = data.authorization?.authorization_code;
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

    if (!bizId && customerEmail) {
      const { data: authData } = await supabase.auth.admin.listUsers();
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
      const updateData: Record<string, any> = {
        plan: planKey,
        subscription_id: subscriptionCode,
        subscription_status: "active",
      };

      if (customerCode) updateData.paystack_customer_code = customerCode;
      if (authorizationCode) updateData.paystack_authorization_code = authorizationCode;
      if (subscriptionCode) updateData.paystack_subscription_code = subscriptionCode;

      const { error } = await supabase
        .from("businesses")
        .update(updateData)
        .eq("id", bizId);

      if (error) console.error("Webhook activation DB error:", error);
      else console.log(`Activated business ${bizId} on plan ${planKey}`);
    } else {
      console.warn("Could not find matching business for webhook:", customerEmail);
    }
  }

  // 4. Handle Subscription Cancellation / Non-Renewal
  if (
    eventType === "subscription.disable" ||
    eventType === "subscription.not_renew"
  ) {
    const subscriptionCode = data.subscription_code || data.code;

    if (subscriptionCode) {
      const { error } = await supabase
        .from("businesses")
        .update({ plan: "free", subscription_status: "cancelled" })
        .or(
          `subscription_id.eq.${subscriptionCode},paystack_subscription_code.eq.${subscriptionCode}`,
        );

      if (error) console.error("Webhook downgrade DB error:", error);
      else console.log(`Downgraded subscription ${subscriptionCode} to free`);
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

    if (businessId) {
      await supabase
        .from("businesses")
        .update({ subscription_status: "past_due" })
        .eq("id", businessId);
    } else if (subscriptionCode) {
      await supabase
        .from("businesses")
        .update({ subscription_status: "past_due" })
        .or(
          `subscription_id.eq.${subscriptionCode},paystack_subscription_code.eq.${subscriptionCode}`,
        );
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
