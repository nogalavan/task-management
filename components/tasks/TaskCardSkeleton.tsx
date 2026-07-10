export function TaskCardSkeleton() {
  return (
    <div className="rounded-xl bg-cream border border-amber/15 p-4 animate-pulse">
      <div className="h-4 w-16 rounded-full bg-stone-200 mb-2.5" />
      <div className="h-4 w-3/4 rounded bg-stone-200 mb-1.5" />
      <div className="h-3 w-full rounded bg-stone-100 mb-1" />
      <div className="h-3 w-2/3 rounded bg-stone-100 mb-3" />
      <div className="flex items-center justify-between pt-3 border-t border-amber/10">
        <div className="h-3 w-24 rounded bg-stone-100" />
        <div className="h-3 w-16 rounded bg-stone-100" />
      </div>
    </div>
  );
}
