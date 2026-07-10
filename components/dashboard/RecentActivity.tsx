import { CheckCircle2, Clock, Circle, Trash2, FolderPlus } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { describeActivity, type ActivityLogEntry, type ActivityAction } from "@/lib/activity";

/** Ensure Supabase timestamps (may lack Z/+offset) are treated as UTC. */
function toUtcMs(isoDate: string): number {
  if (!isoDate.endsWith("Z") && !isoDate.match(/[+-]\d{2}:\d{2}$/)) {
    return new Date(isoDate + "Z").getTime();
  }
  return new Date(isoDate).getTime();
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - toUtcMs(isoDate);
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);

  if (mins < 1)   return "עכשיו";
  if (mins < 60)  return `לפני ${mins} דק׳`;
  if (hours < 24) return `לפני ${hours} שעות`;
  if (days === 1) return "אתמול";
  return `לפני ${days} ימים`;
}

const ACTION_ICON: Record<ActivityAction, React.ComponentType<{ className?: string }>> = {
  created_task:    Circle,
  updated_status:  Clock,
  deleted_task:    Trash2,
  created_project: FolderPlus,
};

const ACTION_COLOR: Record<ActivityAction, string> = {
  created_task:    "text-stone-400 bg-stone-100",
  updated_status:  "text-amber-600 bg-amber/15",
  deleted_task:    "text-red-400 bg-red-50",
  created_project: "text-green-500 bg-green-50",
};

// Override icon color when status is "done"
function resolvedColor(entry: ActivityLogEntry): string {
  if (entry.action === "updated_status" && entry.metadata.new_status === "done") {
    return "text-green-500 bg-green-50";
  }
  return ACTION_COLOR[entry.action];
}

interface RecentActivityProps {
  entries: ActivityLogEntry[];
}

export function RecentActivity({ entries }: RecentActivityProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-stone-400 py-6 text-center px-5">
        אין פעילות אחרונה — פעולות יופיעו כאן
      </p>
    );
  }

  return (
    <ul className="flex flex-col">
      {entries.map((entry) => {
        const Icon = ACTION_ICON[entry.action] ?? Circle;
        const colorClass = resolvedColor(entry);

        return (
          <li
            key={entry.id}
            className="flex items-start gap-3 px-5 py-3.5 border-t border-amber/10 first:border-0"
          >
            {/* Action icon */}
            <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
              <Icon className="h-3.5 w-3.5" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-stone-700 leading-snug">
                <span className="font-semibold text-stone-800">{entry.userName}</span>{" "}
                {describeActivity(entry)}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                {timeAgo(entry.created_at)}
              </p>
            </div>

            {/* Avatar */}
            <Avatar name={entry.userName} size="xs" className="flex-shrink-0 mt-0.5" />
          </li>
        );
      })}
    </ul>
  );
}
