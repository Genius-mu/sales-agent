import { NextRequest, NextResponse } from "next/server";

const VARIANT_IDS: Record<string, string> = {
  starter: "1329122",
  scale: "1329125",
  pro: "1329127",
};

export async function POST(req: NextRequest) {
  const { plan, businessId } = await req.json();

  const variantId = VARIANT_IDS[plan];
  if (!variantId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://sales-agent-jet.vercel.app";

  try {
    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              custom: { business_id: businessId },
            },
            product_options: {
              redirect_url: `${appUrl}/dashboard/billing?success=true`,
            },
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: process.env.LEMON_SQUEEZY_STORE_ID,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: variantId,
              },
            },
          },
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Lemon Squeezy checkout error:", data);
      return NextResponse.json(
        { error: "Failed to create checkout" },
        { status: 500 },
      );
    }

    const checkoutUrl = data?.data?.attributes?.url;
    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 },
    );
  }
}
