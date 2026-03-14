import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-[#080809] text-white min-h-screen flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative text-center max-w-md">
        {/* Big 404 */}
        <div className="relative mb-8">
          <p className="text-[120px] sm:text-[160px] font-black text-zinc-900 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.172 14.828 12 12m0 0 2.828-2.828M12 12 9.172 9.172M12 12l2.828 2.828M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-zinc-500 text-sm leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
