/**
 * Server-only Paystack helpers.
 */

const API = "https://api.paystack.co";

/**
 * Stops a Paystack subscription so the customer is never charged again.
 * Paystack's disable endpoint needs the subscription's email token, which
 * we fetch first (it isn't stored anywhere).
 */
export async function disablePaystackSubscription(code: string | null | undefined): Promise<{ ok: boolean; message: string }> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return { ok: false, message: "PAYSTACK_SECRET_KEY is not configured" };
  if (!code || !code.startsWith("SUB_")) return { ok: true, message: "No Paystack subscription to disable" };

  const headers = { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" };
  try {
    const fetched = await fetch(`${API}/subscription/${encodeURIComponent(code)}`, { headers });
    const sub = await fetched.json();
    if (!sub?.status || !sub.data) {
      return { ok: false, message: sub?.message || "Could not fetch subscription" };
    }
    // Already stopped: nothing more to do
    if (sub.data.status === "cancelled" || sub.data.status === "complete") {
      return { ok: true, message: `Subscription already ${sub.data.status}` };
    }
    const res = await fetch(`${API}/subscription/disable`, {
      method: "POST",
      headers,
      body: JSON.stringify({ code, token: sub.data.email_token }),
    });
    const out = await res.json();
    return { ok: !!out?.status, message: out?.message || "Unknown Paystack response" };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Network error" };
  }
}
