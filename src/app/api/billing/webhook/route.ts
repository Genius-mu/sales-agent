import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Do NOT init Supabase at module level — init inside the handler
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

function getPlanFromVariant(variantId: string): string {
  if (variantId === process.env.LEMONSQUEEZY_STARTER_VARIANT_ID)
    return "starter";
  if (variantId === process.env.LEMONSQUEEZY_PRO_VARIANT_ID) return "pro";
  if (variantId === process.env.LEMONSQUEEZY_SCALE_VARIANT_ID) return "scale";
  return "free";
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature");

  const hmac = crypto
    .createHmac("sha256", process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (hmac !== signature) {
    console.error("Invalid webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName = payload.meta?.event_name;
  const attributes = payload.data?.attributes;
  const businessId = payload.meta?.custom_data?.business_id;

  console.log("Webhook received:", eventName, "for business:", businessId);

  if (!businessId) {
    return NextResponse.json(
      { error: "No business_id in custom data" },
      { status: 400 },
    );
  }

  const variantId = String(
    attributes?.first_subscription_item?.variant_id || "",
  );
  const plan = getPlanFromVariant(variantId);
  const subscriptionId = String(payload.data?.id || "");
  const status = attributes?.status;

  switch (eventName) {
    case "subscription_created":
    case "subscription_updated":
      await supabase
        .from("businesses")
        .update({
          plan,
          subscription_id: subscriptionId,
          subscription_status: status,
        })
        .eq("id", businessId);
      break;

    case "subscription_cancelled":
    case "subscription_expired":
      await supabase
        .from("businesses")
        .update({ plan: "free", subscription_status: "cancelled" })
        .eq("id", businessId);
      break;

    default:
      console.log("Unhandled event:", eventName);
  }

  return NextResponse.json({ received: true });
}
