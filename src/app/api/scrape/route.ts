import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import dns from "dns";
import { createClient as createServerClient } from "@/lib/supabase-server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

function isPrivateOrReservedIP(ip: string): boolean {
  let address = ip.trim();
  if (address.startsWith("::ffff:")) {
    address = address.substring(7);
  }

  // IPv4 Check
  const ipv4Match = address.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [, aStr, bStr] = ipv4Match;
    const a = parseInt(aStr, 10);
    const b = parseInt(bStr, 10);

    if (a === 0 || a === 127) return true; // Unspecified / Loopback (127.0.0.0/8)
    if (a === 10) return true; // Private 10.0.0.0/8
    if (a === 172 && b >= 16 && b <= 31) return true; // Private 172.16.0.0/12
    if (a === 192 && b === 168) return true; // Private 192.168.0.0/16
    if (a === 169 && b === 254) return true; // Link-local / AWS Metadata 169.254.0.0/16
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT 100.64.0.0/10
    if (a >= 224) return true; // Multicast / Reserved 224.0.0.0/4+
    return false;
  }

  // IPv6 Check
  const lowerIp = address.toLowerCase();
  if (
    lowerIp === "::1" ||
    lowerIp === "::" ||
    lowerIp.startsWith("fe8") ||
    lowerIp.startsWith("fe9") ||
    lowerIp.startsWith("fea") ||
    lowerIp.startsWith("feb") ||
    lowerIp.startsWith("fc") ||
    lowerIp.startsWith("fd")
  ) {
    return true; // Loopback / Link-local / Unique Local
  }

  return false;
}

async function validateUrlForSSRF(urlString: string): Promise<{
  valid: boolean;
  error?: string;
  url?: URL;
}> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlString);
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return {
      valid: false,
      error: "Only standard http: and https: protocols are permitted",
    };
  }

  if (parsedUrl.username || parsedUrl.password) {
    return { valid: false, error: "Embedded URL credentials are not allowed" };
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname === "[::1]"
  ) {
    return { valid: false, error: "Access to local hostnames is restricted" };
  }

  try {
    const addresses = await dns.promises.lookup(hostname, { all: true });
    if (!addresses || addresses.length === 0) {
      return { valid: false, error: "Could not resolve domain name" };
    }

    for (const addr of addresses) {
      if (isPrivateOrReservedIP(addr.address)) {
        return {
          valid: false,
          error: "Access to private or internal network addresses is restricted",
        };
      }
    }
  } catch {
    return { valid: false, error: "DNS lookup failed for the target URL" };
  }

  return { valid: true, url: parsedUrl };
}

export async function POST(req: NextRequest) {
  try {
    // 1. PHASE 1: Server-side Authentication
    const supabase = await createServerClient();
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

    // 2. PHASE 5: Rate Limiting
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`scrape:${user.id}:${clientIp}`, 5, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many scrape requests. Please wait a minute and try again." },
        { status: 429 },
      );
    }

    const { url, businessId } = await req.json();

    if (!url || typeof url !== "string" || !businessId || typeof businessId !== "string") {
      return NextResponse.json(
        { error: "url and businessId are required" },
        { status: 400 },
      );
    }

    // 3. PHASE 1: Verify Business Ownership
    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .select("id, user_id")
      .eq("id", businessId)
      .maybeSingle();

    if (bizError || !business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 },
      );
    }

    if (business.user_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this business" },
        { status: 403 },
      );
    }

    // 4. PHASE 2: SSRF URL & IP Validation
    const ssrfCheck = await validateUrlForSSRF(url);
    if (!ssrfCheck.valid || !ssrfCheck.url) {
      return NextResponse.json(
        { error: ssrfCheck.error || "Unsafe URL provided" },
        { status: 400 },
      );
    }

    // 5. PHASE 2: Manual Safe Fetching with Redirect Validation
    let currentUrl = ssrfCheck.url.toString();
    let redirects = 0;
    const maxRedirects = 3;
    let finalRes: Response | null = null;

    while (redirects <= maxRedirects) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      try {
        const res = await fetch(currentUrl, {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
          },
          redirect: "manual",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.status >= 300 && res.status < 400) {
          const location = res.headers.get("location");
          if (!location) {
            return NextResponse.json(
              { error: "Redirect destination missing in server response" },
              { status: 400 },
            );
          }
          const redirectTarget = new URL(location, currentUrl);
          const redirectSsrfCheck = await validateUrlForSSRF(redirectTarget.toString());
          if (!redirectSsrfCheck.valid || !redirectSsrfCheck.url) {
            return NextResponse.json(
              { error: `Redirect rejected: ${redirectSsrfCheck.error}` },
              { status: 400 },
            );
          }
          currentUrl = redirectSsrfCheck.url.toString();
          redirects++;
          continue;
        }

        finalRes = res;
        break;
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === "AbortError") {
          return NextResponse.json(
            { error: "Website fetch timed out (10s limit)" },
            { status: 400 },
          );
        }
        throw err;
      }
    }

    if (!finalRes || !finalRes.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL (${finalRes?.status || 400})` },
        { status: 400 },
      );
    }

    const htmlText = await finalRes.text();
    // Cap raw HTML processing size to 2MB
    const safeHtml = htmlText.slice(0, 2000000);
    const $ = cheerio.load(safeHtml);

    // Remove noise elements
    $(
      "script, style, nav, footer, header, noscript, iframe, [aria-hidden='true']",
    ).remove();

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

    if (!content || content.length < 50) {
      content = $("*")
        .map((_, el) => $(el).clone().children().remove().end().text())
        .get()
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 8000);
    }

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

    const { error: updateError } = await supabase
      .from("businesses")
      .update({ scraped_content: content, website_url: url })
      .eq("id", businessId);

    if (updateError) {
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
    console.error("Scrape endpoint error:", err);
    return NextResponse.json(
      { error: "Could not reach the URL. Make sure it's public and try again." },
      { status: 500 },
    );
  }
}
