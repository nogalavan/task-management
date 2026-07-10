export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-7 w-40 rounded-lg bg-amber/10 mb-2" />
          <div className="h-4 w-64 rounded-lg bg-amber/10" />
        </div>
        <div className="h-9 w-32 rounded-xl bg-amber/10" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl bg-warm border border-amber/15 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="h-3 w-20 rounded bg-amber/10 mb-3" />
                <div className="h-8 w-12 rounded bg-amber/10" />
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber/10" />
            </div>
          </div>
        ))}
      </div>

      {/* Main grid skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="h-72 rounded-2xl bg-warm border border-amber/15" />
          <div className="h-56 rounded-2xl bg-warm border border-amber/15" />
        </div>
        <div className="h-96 rounded-2xl bg-warm border border-amber/15" />
      </div>
    </div>
  );
}
