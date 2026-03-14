"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#080809] text-white flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-red-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Page error</h2>
        <p className="text-zinc-500 text-sm leading-relaxed mb-6">
          This page ran into a problem. Try refreshing or go back to the
          overview.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
          >
            Back to overview
          </Link>
        </div>
      </div>
    </div>
  );
}
