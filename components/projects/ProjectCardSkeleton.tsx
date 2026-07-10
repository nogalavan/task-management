export function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl bg-warm border border-amber/15 p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-xl bg-stone-200" />
        <div className="h-5 w-14 rounded-full bg-stone-200" />
      </div>
      <div className="h-4 w-3/4 rounded-lg bg-stone-200 mb-2" />
      <div className="h-3 w-full rounded-lg bg-stone-100 mb-1" />
      <div className="h-3 w-2/3 rounded-lg bg-stone-100 mb-4" />
      <div className="flex flex-col gap-2 mb-4">
        <div className="h-3 w-24 rounded bg-stone-100" />
        <div className="h-3 w-32 rounded bg-stone-100" />
        <div className="h-3 w-28 rounded bg-stone-100" />
      </div>
      <div className="h-1 w-full rounded-full bg-stone-200" />
    </div>
  );
}
