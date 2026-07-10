import type { ProjectTaskCount } from "@/lib/dashboard";

const BAR_COLORS = ["#d4a373", "#ccd5ae", "#a2d2ff", "#ffafcc", "#c77dff", "#80b918"];

interface TasksPerProjectChartProps {
  data: ProjectTaskCount[];
}

export function TasksPerProjectChart({ data }: TasksPerProjectChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-stone-400 py-4 text-center">
        אין פרויקטים עדיין
      </p>
    );
  }

  const max = data[0].count;

  return (
    <div className="flex flex-col gap-4">
      {data.map((item, i) => {
        const pct = max > 0 ? Math.round((item.count / max) * 100) : 0;
        return (
          <div key={item.projectId} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-stone-700 truncate">{item.projectName}</span>
              <span className="tabular-nums text-stone-500 font-semibold mr-3 flex-shrink-0">
                {item.count}
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
    </div>
  );
}
