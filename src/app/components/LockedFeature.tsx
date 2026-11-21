import Link from "next/link";
import { planFor, type Feature } from "@/lib/plans";

/**
 * Full-page "locked" state for a feature the user's plan doesn't include:
 * a blurred preview of what they'd get, a short pitch and an upgrade button.
 */
export default function LockedFeature({
  feature,
  title,
  points,
}: {
  feature: Feature;
  title: string;
  points: string[];
}) {
  const plan = planFor(feature);
  const bars = [38, 52, 44, 70, 58, 82, 64, 90, 76, 98, 84, 72];

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05),0_8px_24px_-14px_rgba(15,23,42,0.18)]">
        {/* Blurred preview */}
        <div className="pointer-events-none select-none p-6 sm:p-8 blur-[6px] opacity-60" aria-hidden="true">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {["Conversations", "Leads", "Messages", "Conversion"].map((label, i) => (
              <div key={label} className="rounded-xl border border-slate-200 p-4">
                <p className="text-[12px] text-slate-500 mb-1">{label}</p>
                <p className="text-2xl font-semibold">{[248, 41, "1.9k", "17%"][i]}</p>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-2 h-48 rounded-xl border border-slate-200 p-4">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-blue-300" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* Pitch */}
        <div className="absolute inset-0 flex items-center justify-center p-5">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 backdrop-blur p-6 sm:p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl" aria-hidden="true">
              🔒
            </div>
            <p className="text-[12px] font-semibold text-blue-600 mb-1">{plan.name} feature</p>
            <h1 className="text-[22px] font-semibold tracking-tight mb-3">{title}</h1>
            <ul className="space-y-1.5 text-[14px] text-slate-600 mb-6 text-left inline-block">
              {points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  {p}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard/billing"
              className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-[14px] py-3 rounded-xl transition-colors"
            >
              Upgrade to {plan.name}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
