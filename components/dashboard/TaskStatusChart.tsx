"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { StatusBreakdown } from "@/lib/dashboard";

interface TaskStatusChartProps {
  data: StatusBreakdown[];
}

export function TaskStatusChart({ data }: TaskStatusChartProps) {
  const total = data.reduce((s, d) => s + d.count, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-stone-400">
        אין משימות עדיין
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="count"
            nameKey="label"
          >
            {data.map((entry) => (
              <Cell key={entry.status} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [Number(value), String(name)]}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid rgba(212,163,115,0.2)",
              background: "#faf7f2",
              direction: "rtl",
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend rows */}
      <div className="flex flex-col gap-2">
        {data.map((item) => (
          <div key={item.status} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-stone-600">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-stone-800 tabular-nums">
                {item.count}
              </span>
              <span className="text-xs text-stone-400 w-8 text-left">
                {total > 0 ? Math.round((item.count / total) * 100) : 0}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
