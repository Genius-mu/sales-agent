import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const VARIANT_PLAN_MAP: Record<string, string> = {
  "1329122": "starter",
  "1329125": "scale",
  "1329127": "pro",
};

function verifySignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature") ?? "";
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? "";

  if (!verifySignature(rawBody, signature, secret)) {
    console.error("Invalid webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const eventName = event.meta?.event_name as string;
  console.log("Lemon Squeezy webhook:", eventName);

  // Use service role key so we can query auth.admin
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const attrs = event.data?.attributes;
  const variantId = String(
    attrs?.first_order_item?.variant_id ?? attrs?.variant_id ?? "",
  );
  const subscriptionId = String(event.data?.id ?? "");
  const customerEmail = attrs?.user_email as string;
  const status = attrs?.status as string;
  const plan = VARIANT_PLAN_MAP[variantId];

  const isCancellation = [
    "subscription_cancelled",
    "subscription_expired",
    "subscription_paused",
  ].includes(eventName);

  if (!plan && !isCancellation) {
    console.log("Unknown variant:", variantId);
    return NextResponse.json({ received: true });
  }

  // 1. Try to find business by subscription_id (for updates/cancellations)
  if (subscriptionId) {
    const { data: bizBySubscription } = await supabase
      .from("businesses")
      .select("id")
      .eq("subscription_id", subscriptionId)
      .maybeSingle();

    if (bizBySubscription) {
      await updateBusiness(
        supabase,
        bizBySubscription.id,
        eventName,
        plan,
        subscriptionId,
        status,
      );
      return NextResponse.json({ received: true });
    }
  }

  // 2. Fall back: find user by email via admin API, then find their business
  if (customerEmail) {
    const { data: authData } = await supabase.auth.admin.listUsers({
      perPage: 1000,
    });
    const user = authData?.users?.find((u) => u.email === customerEmail);

    if (user) {
      const { data: biz } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (biz) {
        await updateBusiness(
          supabase,
          biz.id,
          eventName,
          plan,
          subscriptionId,
          status,
        );
        return NextResponse.json({ received: true });
      }
    }
  }

  console.warn(
    "Could not find business for webhook event:",
    eventName,
    customerEmail,
  );
  return NextResponse.json({ received: true });
}

async function updateBusiness(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  businessId: string,
  eventName: string,
  plan: string,
  subscriptionId: string,
  status: string,
) {
  if (
    ["subscription_created", "subscription_updated", "order_created"].includes(
      eventName,
    )
  ) {
    const { error } = await supabase
      .from("businesses")
      .update({
        plan,
        subscription_id: subscriptionId,
        subscription_status: status || "active",
      })
      .eq("id", businessId);
    if (error) console.error("Update error:", error);
    else console.log(`Updated business ${businessId} → plan: ${plan}`);
  }

  if (
    [
      "subscription_cancelled",
      "subscription_expired",
      "subscription_paused",
    ].includes(eventName)
  ) {
    const { error } = await supabase
      .from("businesses")
      .update({
        plan: "free",
        subscription_status:
          eventName === "subscription_paused" ? "paused" : "cancelled",
      })
      .eq("id", businessId);
    if (error) console.error("Downgrade error:", error);
    else console.log(`Downgraded business ${businessId} → free`);
  }
}
