import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { PLANS, getPlanCharge, isCurrency } from "@/lib/plans";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { plan, businessId, currency: requestedCurrency } = body || {};

    if (!businessId || typeof businessId !== "string") {
      return NextResponse.json(
        { error: "businessId is required" },
        { status: 400 },
      );
    }

    const planConfig = PLANS[plan];
    if (!planConfig || planConfig.isFree || !planConfig.paystackPlanCode) {
      return NextResponse.json(
        { error: "Invalid plan selected for checkout" },
        { status: 400 },
      );
    }

    // Charge in USD only when asked for and a USD Paystack plan exists;
    // otherwise fall back to NGN.
    const usdCharge = getPlanCharge(planConfig, "USD");
    const charge =
      isCurrency(requestedCurrency) &&
      requestedCurrency === "USD" &&
      usdCharge.paystackPlanCode
        ? usdCharge
        : getPlanCharge(planConfig, "NGN");

    // Verify user owns businessId
    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("id, user_id")
      .eq("id", businessId)
      .single();

    if (bizError || !business || business.user_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this business" },
        { status: 403 },
      );
    }

    const email = user.email;
    if (!email) {
      return NextResponse.json(
        { error: "Authenticated user email is missing" },
        { status: 400 },
      );
    }

    const appUrl = (
      process.env.NEXT_PUBLIC_APP_URL || "https://sales-agent-jet.vercel.app"
    ).replace(/\/+$/, "");

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error("PAYSTACK_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Payment gateway misconfigured" },
        { status: 500 },
      );
    }

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        plan: charge.paystackPlanCode,
        amount: charge.amount,
        currency: charge.currency,
        callback_url: `${appUrl}/dashboard/billing`,
        metadata: {
          business_id: businessId,
          plan: planConfig.key,
          currency: charge.currency,
          user_id: user.id,
          cancel_action: `${appUrl}/dashboard/billing`,
        },
      }),
    });

    const data = await res.json();

    if (!data.status) {
      console.error("Paystack checkout initialize error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to create checkout transaction" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err) {
    console.error("Paystack checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 },
    );
  }
}
