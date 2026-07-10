import type { TopPerformer } from "@/lib/dashboard";

const BAR_COLORS = ["#d4a373", "#ccd5ae", "#a2d2ff", "#ffafcc", "#c77dff"];

interface TopPerformersProps {
  performers: TopPerformer[];
  totalDone: number;
}

export function TopPerformers({ performers, totalDone }: TopPerformersProps) {
  if (performers.length === 0) {
    return (
      <p className="text-sm text-stone-400 py-4 text-center px-5">
        אין משימות שהושלמו עדיין
      </p>
    );
  }

  const max = performers[0].completedCount;

  return (
    <div className="flex flex-col gap-4 px-5 pb-5">
      {performers.map((p, i) => {
        const pct = max > 0 ? Math.round((p.completedCount / max) * 100) : 0;
        return (
          <div key={p.userId} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-stone-700">{p.displayName}</span>
              <span className="tabular-nums text-stone-500 font-semibold">
                {p.completedCount}
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-stone-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                }}
              />
            </div>
          </div>
        );
      })}

      <p className="text-xs text-stone-400 text-center pt-1">
        סה״כ {totalDone} משימות הושלמו
      </p>
    </div>
  );
}
