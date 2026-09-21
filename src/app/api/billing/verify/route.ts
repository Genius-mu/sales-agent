import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase-server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { PLANS } from "@/lib/plans";

export async function POST(req: NextRequest) {
  try {
    const supabaseServer = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { reference } = await req.json();

    if (!reference || typeof reference !== "string") {
      return NextResponse.json(
        { error: "Transaction reference is required" },
        { status: 400 },
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Payment gateway misconfigured" },
        { status: 500 },
      );
    }

    // Verify transaction directly with Paystack API
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    const paystackData = await paystackRes.json();

    if (!paystackData.status || !paystackData.data) {
      console.error("Paystack transaction verification failed:", paystackData);
      return NextResponse.json(
        { error: paystackData.message || "Transaction verification failed" },
        { status: 400 },
      );
    }

    const tx = paystackData.data;

    // Check transaction status
    if (tx.status !== "success") {
      return NextResponse.json(
        { error: `Transaction is not successful (status: ${tx.status})` },
        { status: 400 },
      );
    }

    // Check currency
    if (tx.currency !== "NGN") {
      return NextResponse.json(
        { error: "Invalid transaction currency" },
        { status: 400 },
      );
    }

    // Check metadata
    const businessId = tx.metadata?.business_id;
    const planKey = tx.metadata?.plan;

    if (!businessId || !planKey) {
      return NextResponse.json(
        { error: "Transaction metadata is incomplete" },
        { status: 400 },
      );
    }

    const planConfig = PLANS[planKey];
    if (!planConfig || planConfig.isFree) {
      return NextResponse.json(
        { error: "Invalid plan in transaction metadata" },
        { status: 400 },
      );
    }

    // Verify amount matches expected plan amount
    if (tx.amount !== planConfig.priceKobo) {
      console.error(
        `Amount mismatch for reference ${reference}: expected ${planConfig.priceKobo}, got ${tx.amount}`,
      );
      return NextResponse.json(
        { error: "Transaction amount does not match expected plan price" },
        { status: 400 },
      );
    }

    // Authorize business ownership
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: business, error: bizError } = await adminSupabase
      .from("businesses")
      .select("id, user_id")
      .eq("id", businessId)
      .single();

    if (bizError || !business || business.user_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: Business mismatch or unowned" },
        { status: 403 },
      );
    }

    const customerCode =
      tx.customer?.customer_code ||
      (typeof tx.customer === "string" ? tx.customer : null) ||
      tx.customer_code ||
      null;

    const authorizationCode =
      tx.authorization?.authorization_code ||
      (typeof tx.authorization === "string" ? tx.authorization : null) ||
      tx.authorization_code ||
      null;

    const subscriptionCode =
      tx.subscription?.subscription_code ||
      (typeof tx.subscription === "string" ? tx.subscription : null) ||
      tx.subscription_code ||
      reference;

    console.log("Paystack verify extracted codes:", {
      customerCode,
      authorizationCode,
      subscriptionCode,
    });

    // Update business subscription state
    const updateData: Record<string, any> = {
      plan: planConfig.key,
      subscription_id: subscriptionCode,
      subscription_status: "active",
    };

    if (customerCode) updateData.paystack_customer_code = customerCode;
    if (authorizationCode) updateData.paystack_authorization_code = authorizationCode;
    if (subscriptionCode) updateData.paystack_subscription_code = subscriptionCode;

    const { error: updateError } = await adminSupabase
      .from("businesses")
      .update(updateData)
      .eq("id", businessId);

    if (updateError) {
      console.error("Failed to update business subscription state:", updateError);
      return NextResponse.json(
        { error: "Failed to activate subscription" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      plan: planConfig.key,
      message: "Subscription activated successfully",
    });
  } catch (err) {
    console.error("Verification endpoint error:", err);
    return NextResponse.json(
      { error: "Failed to verify transaction" },
      { status: 500 },
    );
  }
}
