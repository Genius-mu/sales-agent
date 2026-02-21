import { NextRequest, NextResponse } from "next/server";

const VARIANT_MAP: Record<string, string> = {
  starter: process.env.LEMONSQUEEZY_STARTER_VARIANT_ID!,
  pro: process.env.LEMONSQUEEZY_PRO_VARIANT_ID!,
  scale: process.env.LEMONSQUEEZY_SCALE_VARIANT_ID!,
};

export async function POST(req: NextRequest) {
  const { plan, businessId, email } = await req.json();

  if (!plan || !businessId) {
    return NextResponse.json(
      { error: "plan and businessId are required" },
      { status: 400 },
    );
  }

  const variantId = VARIANT_MAP[plan.toLowerCase()];
  if (!variantId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: email || undefined,
              custom: { business_id: businessId },
            },
            product_options: {
              redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
            },
            checkout_options: {
              embed: true,
              media: false,
              logo: true,
            },
          },
          relationships: {
            store: {
              data: { type: "stores", id: process.env.LEMONSQUEEZY_STORE_ID },
            },
            variant: {
              data: { type: "variants", id: variantId },
            },
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Lemon Squeezy error:", data);
      return NextResponse.json(
        { error: "Failed to create checkout" },
        { status: 500 },
      );
    }

    const checkoutUrl = data?.data?.attributes?.url;
    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
