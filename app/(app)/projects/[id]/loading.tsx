export default function ProjectDetailLoading() {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-4 w-4 rounded bg-sage-light" />
        <div className="h-4 w-20 rounded bg-sage-light" />
        <div className="h-4 w-2 rounded bg-sage-light" />
        <div className="h-4 w-32 rounded bg-sage-light" />
      </div>

      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="h-8 w-56 rounded-xl bg-sage-light mb-2" />
          <div className="h-4 w-80 rounded bg-sage-light/70" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-28 rounded-xl bg-sage-light" />
          <div className="h-10 w-32 rounded-xl bg-amber/20" />
        </div>
      </div>

      {/* Meta strip skeleton */}
      <div className="flex items-center gap-6 mb-8">
        <div className="h-6 w-16 rounded-full bg-sage-light" />
        <div className="h-4 w-48 rounded bg-sage-light" />
        <div className="h-6 w-32 rounded bg-sage-light" />
      </div>

      {/* Kanban columns skeleton */}
      <div className="flex gap-5 overflow-hidden">
        {["לביצוע", "בתהליך", "הושלם"].map((label) => (
          <div key={label} className="flex-shrink-0 w-80">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className="h-4 w-16 rounded bg-sage-light" />
                <div className="h-5 w-5 rounded-full bg-sage-light" />
              </div>
              <div className="h-8 w-8 rounded-lg bg-sage-light" />
            </div>
            <div className="rounded-2xl border border-amber/10 bg-stone-50 p-3 flex flex-col gap-3 min-h-[200px]">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-cream border border-amber/15 p-3"
                >
                  <div className="h-4 w-3/4 rounded bg-sage-light mb-2" />
                  <div className="h-3 w-1/2 rounded bg-sage-light/70 mb-4" />
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-14 rounded-full bg-sage-light" />
                    <div className="h-6 w-6 rounded-full bg-sage-light" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
