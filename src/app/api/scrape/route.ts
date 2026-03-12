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
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL (${res.status}: ${res.statusText})` },
        { status: 400 },
      );
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove noise elements
    $(
      "script, style, nav, footer, header, noscript, iframe, [aria-hidden='true']",
    ).remove();

    // Try progressively broader selectors
    let content = "";

    const selectors = [
      "main",
      "article",
      '[role="main"]',
      ".content, #content, .main, #main",
      ".container, #container, .wrapper, #wrapper",
      "section",
      "body",
    ];

    for (const selector of selectors) {
      const text = $(selector).text().replace(/\s+/g, " ").trim();
      if (text.length > 100) {
        content = text.slice(0, 8000);
        break;
      }
    }

    // Last resort: grab all visible text from the entire HTML
    if (!content || content.length < 50) {
      content = $("*")
        .map((_, el) => $(el).clone().children().remove().end().text())
        .get()
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 8000);
    }

    // If still nothing, try grabbing meta description + title as fallback
    if (!content || content.length < 30) {
      const title = $("title").text().trim();
      const metaDesc = $('meta[name="description"]').attr("content") || "";
      const ogDesc = $('meta[property="og:description"]').attr("content") || "";
      const combined = [title, metaDesc, ogDesc].filter(Boolean).join(". ");

      if (combined.length > 10) {
        content = combined;
      }
    }

    if (!content || content.length < 10) {
      return NextResponse.json(
        {
          error:
            "Could not extract content — this site may be fully JavaScript-rendered. Try adding a description manually in the field above instead.",
        },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("businesses")
      .update({ scraped_content: content, website_url: url })
      .eq("id", businessId);

    if (error) {
      return NextResponse.json(
        { error: "Failed to save content to database" },
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
      {
        error: "Could not reach the URL. Make sure it's public and try again.",
      },
      { status: 500 },
    );
  }
}
