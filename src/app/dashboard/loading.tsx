export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      {/* Nav skeleton */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-[#f7f8fc]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-100 animate-pulse" />
          <div className="w-24 h-4 rounded-md bg-slate-100 animate-pulse" />
        </div>
        <div className="flex items-center gap-1">
          {[80, 100, 60, 56, 52].map((w, i) => (
            <div
              key={i}
              className="h-7 rounded-md bg-slate-100 animate-pulse"
              style={{ width: w }}
            />
          ))}
        </div>
        <div className="w-7 h-7 rounded-full bg-slate-100 animate-pulse" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header skeleton */}
        <div className="mb-10">
          <div className="w-16 h-3 rounded bg-slate-100 animate-pulse mb-3" />
          <div className="w-48 h-10 rounded-xl bg-slate-100 animate-pulse mb-3" />
          <div className="w-80 h-4 rounded bg-slate-100 animate-pulse" />
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-5"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-100 animate-pulse mb-3" />
              <div className="w-16 h-7 rounded-lg bg-slate-100 animate-pulse mb-2" />
              <div className="w-24 h-3 rounded bg-slate-100 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div
                    className="h-3.5 rounded bg-slate-100 animate-pulse"
                    style={{ width: `${40 + i * 8}%` }}
                  />
                  <div
                    className="h-3 rounded bg-slate-100 animate-pulse"
                    style={{ width: `${25 + i * 5}%` }}
                  />
                </div>
                <div className="w-12 h-3 rounded bg-slate-100 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
