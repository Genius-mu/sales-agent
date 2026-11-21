/**
 * Site-limit helpers: which website a widget request came from, and whether
 * that site counts toward the plan's limit.
 */

/** "https://www.Shop.com:443/page" -> "shop.com". Returns null if unusable. */
export function siteFromOrigin(origin: string | null | undefined): string | null {
  if (!origin || origin === "null") return null;
  try {
    const host = new URL(origin).hostname.toLowerCase();
    return host.replace(/^www\./, "") || null;
  } catch {
    return null;
  }
}

/** Sites that never count toward the limit: local testing and Saim itself. */
export function isExemptSite(site: string, appHosts: (string | null | undefined)[]): boolean {
  if (site === "localhost" || site === "127.0.0.1" || site === "[::1]" || site.endsWith(".localhost")) {
    return true;
  }
  return appHosts.some((h) => !!h && siteFromOrigin(h.startsWith("http") ? h : `https://${h}`) === site);
}
