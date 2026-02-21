import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(req: NextRequest) {
  const { url, businessId } = await req.json();

  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove noise
    $("script, style, nav, footer, header").remove();

    // Extract meaningful text
    const content = $("body").text().replace(/\s+/g, " ").trim().slice(0, 8000);

    // Save to Supabase
    await supabase
      .from("businesses")
      .update({ scraped_content: content, website_url: url })
      .eq("id", businessId);

    return NextResponse.json({ success: true, preview: content.slice(0, 200) });
  } catch (err) {
    return NextResponse.json({ error: "Failed to scrape" }, { status: 500 });
  }
}
