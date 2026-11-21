"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { PLANS } from "@/lib/plans";

/**
 * Shows which websites the widget is connected to (registered automatically
 * on each site's first chat) and lets the owner remove one to free a slot.
 */
export default function ConnectedSites({ businessId }: { businessId: string | null }) {
  const [sites, setSites] = useState<string[]>([]);
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) return;
    getSupabase()
      .from("businesses")
      .select("plan, allowed_domains")
      .eq("id", businessId)
      .maybeSingle()
      .then(({ data }: { data: { plan: string | null; allowed_domains: string[] | null } | null }) => {
        setPlan(data?.plan || "free");
        setSites(data?.allowed_domains ?? []);
        setLoading(false);
      });
  }, [businessId]);

  const max = PLANS[plan]?.maxSites ?? 1;
  const limitLabel = max === null ? "Unlimited" : `${Math.min(sites.length, max)} of ${max}`;

  const remove = async (site: string) => {
    if (!businessId) return;
    if (!confirm(`Disconnect ${site}? The chat will stop working there until it reconnects.`)) return;
    setRemoving(site);
    setError(null);
    const next = sites.filter((s) => s !== site);
    const { error: e } = await getSupabase().from("businesses").update({ allowed_domains: next }).eq("id", businessId);
    setRemoving(null);
    if (e) setError("Couldn't remove that site. Please try again.");
    else setSites(next);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_8px_24px_-14px_rgba(15,23,42,0.18)]">
      <div className="flex items-start justify-between gap-4 mb-1">
        <h2 className="font-semibold text-[15px] text-slate-900">Connected websites</h2>
        <span className="shrink-0 text-[12px] font-medium text-slate-600 bg-slate-100 rounded-full px-2.5 py-1">{limitLabel}</span>
      </div>
      <p className="text-slate-500 text-[13px] leading-relaxed mb-4">
        A website connects automatically the first time someone chats on it. Your {PLANS[plan]?.name ?? "Free"} plan allows{" "}
        {max === null ? "unlimited websites" : max === 1 ? "1 website" : `${max} websites`}.
      </p>

      {loading ? (
        <div className="h-10 rounded-lg bg-slate-100 animate-pulse" />
      ) : sites.length === 0 ? (
        <p className="text-[13px] text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-lg px-3 py-3 text-center">
          No websites yet. Add the snippet to your site and send a test message.
        </p>
      ) : (
        <ul className="space-y-2">
          {sites.map((site, i) => {
            const active = max === null || i < max;
            return (
              <li key={site} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
                <span className="flex items-center gap-2 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${active ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <span className="text-[14px] text-slate-800 truncate">{site}</span>
                  {!active && <span className="text-[11px] text-amber-700 bg-amber-50 rounded-full px-2 py-0.5 shrink-0">Over plan limit</span>}
                </span>
                <button
                  type="button"
                  onClick={() => remove(site)}
                  disabled={removing === site}
                  className="text-[12px] text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50 shrink-0"
                >
                  {removing === site ? "Removing…" : "Remove"}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="text-red-600 text-[12px] mt-3">{error}</p>}

      {max !== null && sites.length >= max && (
        <p className="text-[13px] text-slate-500 mt-4">
          Need more websites?{" "}
          <Link href="/dashboard/billing" className="font-medium text-blue-600 hover:text-blue-700">
            {max < 5 ? "Pro allows 5" : "Scale allows unlimited"} →
          </Link>
        </p>
      )}
      <p className="text-[12px] text-slate-400 mt-3">Testing on localhost doesn&apos;t use a slot.</p>
    </div>
  );
}
