import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const PLAN_MAP: Record<string, string> = {
  PLN_l45c6u49b4rtphi: "starter",
  PLN_mdtlpytqpous1zr: "pro",
  PLN_jw99ak49aljjjd4: "scale",
};

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature") ?? "";
  const secret = process.env.PAYSTACK_SECRET_KEY ?? "";

  // Verify webhook signature
  const hash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  if (hash !== signature) {
    console.error("Invalid Paystack webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  const eventType = event.event as string;
  console.log("Paystack webhook:", eventType);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Handle successful subscription
  if (eventType === "subscription.create" || eventType === "charge.success") {
    const data = event.data;
    const planCode = data.plan?.plan_code || data.plan_code;
    const customerEmail = data.customer?.email;
    const subscriptionCode = data.subscription_code || data.reference;
    const businessId = data.metadata?.business_id;

    const plan = PLAN_MAP[planCode];
    if (!plan) {
      console.log("Unknown plan code:", planCode);
      return NextResponse.json({ received: true });
    }

    // Find business - try by metadata first, then by customer email
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
      const { error } = await supabase
        .from("businesses")
        .update({
          plan,
          subscription_id: subscriptionCode,
          subscription_status: "active",
        })
        .eq("id", bizId);
      if (error) console.error("Update error:", error);
      else console.log(`Upgraded business ${bizId} to ${plan}`);
    }
  }

  // Handle subscription cancellation
  if (
    eventType === "subscription.disable" ||
    eventType === "subscription.not_renew"
  ) {
    const data = event.data;
    const subscriptionCode = data.subscription_code;

    const { error } = await supabase
      .from("businesses")
      .update({ plan: "free", subscription_status: "cancelled" })
      .eq("subscription_id", subscriptionCode);

    if (error) console.error("Downgrade error:", error);
    else console.log(`Downgraded subscription ${subscriptionCode} to free`);
  }

  return NextResponse.json({ received: true });
}
