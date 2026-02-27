import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { url, businessId } = await req.json();

  if (!url || !businessId) {
    return NextResponse.json(
      { error: "url and businessId are required" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SalesAgentBot/1.0)" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${res.statusText}` },
        { status: 400 },
      );
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    $("script, style, nav, footer, header, noscript, iframe").remove();

    const content = $("body").text().replace(/\s+/g, " ").trim().slice(0, 8000);

    if (!content) {
      return NextResponse.json(
        { error: "Could not extract content from URL" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("businesses")
      .update({ scraped_content: content, website_url: url })
      .eq("id", businessId);

    if (error) {
      return NextResponse.json(
        { error: "Failed to save content" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      characters: content.length,
      preview: content.slice(0, 300),
    });
  } catch (err) {
    console.error("Scrape error:", err);
    return NextResponse.json(
      { error: "Unexpected error during scraping" },
      { status: 500 },
    );
  }
}
