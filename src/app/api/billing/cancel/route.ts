import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase-server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

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

    const { businessId } = await req.json();
    if (!businessId || typeof businessId !== "string") {
      return NextResponse.json(
        { error: "businessId is required" },
        { status: 400 },
      );
    }

    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: business, error: bizError } = await adminSupabase
      .from("businesses")
      .select("id, user_id, subscription_id, paystack_subscription_code, paystack_email_token")
      .eq("id", businessId)
      .single();

    if (bizError || !business || business.user_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this business" },
        { status: 403 },
      );
    }

    const subscriptionCode =
      business.paystack_subscription_code || business.subscription_id;

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (subscriptionCode && secretKey && subscriptionCode.startsWith("SUB_")) {
      try {
        const disableBody: Record<string, string> = { code: subscriptionCode };
        if (business.paystack_email_token) {
          disableBody.token = business.paystack_email_token;
        }

        const res = await fetch("https://api.paystack.co/subscription/disable", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(disableBody),
        });

        const paystackData = await res.json();
        if (!paystackData.status) {
          console.warn(
            "Paystack disable subscription returned notice:",
            paystackData.message,
          );
        }
      } catch (err) {
        console.error("Paystack subscription disable call failed:", err);
      }
    }

    // Update local business status to cancelled
    const { error: updateError } = await adminSupabase
      .from("businesses")
      .update({
        plan: "free",
        subscription_status: "cancelled",
      })
      .eq("id", businessId);

    if (updateError) {
      console.error("Failed to cancel subscription in DB:", updateError);
      return NextResponse.json(
        { error: "Failed to update subscription status" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscription cancelled successfully",
    });
  } catch (err) {
    console.error("Cancellation endpoint error:", err);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 },
    );
  }
}
