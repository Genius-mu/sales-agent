import { NextRequest, NextResponse } from "next/server";
import { currencyForCountry } from "@/lib/plans";

/** Returns the visitor's country (from Vercel's geo header) and display currency. */
export async function GET(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country");
  const currency = currencyForCountry(country);
  return NextResponse.json(
    { country, currency },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
