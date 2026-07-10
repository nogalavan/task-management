import { type LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  /** Optional small caption under the value */
  caption?: string;
}

export function StatCard({ label, value, icon: Icon, iconColor, iconBg, caption }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-warm border border-amber/15 p-5 shadow-[0_2px_12px_0_rgba(212,163,115,0.08)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-stone-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-stone-800 tabular-nums">
            {value.toLocaleString("he-IL")}
          </p>
          {caption && (
            <p className="mt-1 text-xs text-stone-400">{caption}</p>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
    </div>
  );
}
