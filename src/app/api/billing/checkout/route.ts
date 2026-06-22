import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PLAN_CODES: Record<string, string> = {
  starter: "PLN_l45c6u49b4rtphi",
  pro: "PLN_mdtlpytqpous1zr",
  scale: "PLN_jw99ak49aljjjd4",
};

export async function POST(req: NextRequest) {
  const { plan, businessId } = await req.json();

  const planCode = PLAN_CODES[plan];
  if (!planCode) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "https://sales-agent-jet.vercel.app"
  ).replace(/\/+$/, "");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Get user email from business
  const { data: business } = await supabase
    .from("businesses")
    .select("user_id")
    .eq("id", businessId)
    .single();

  let email = "";
  if (business?.user_id) {
    const { data: userData } = await supabase.auth.admin.getUserById(
      business.user_id,
    );
    email = userData?.user?.email || "";
  }

  try {
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        plan: planCode,
        callback_url: `${appUrl}/dashboard/billing?success=true&plan=${plan}`,
        metadata: {
          business_id: businessId,
          plan,
          cancel_action: `${appUrl}/dashboard/billing`,
        },
      }),
    });

    const data = await res.json();

    if (!data.status) {
      console.error("Paystack error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to create checkout" },
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