import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { UpcomingTask } from "@/lib/dashboard";

const STATUS_VARIANT = {
  todo:        "outline"  as const,
  in_progress: "warning"  as const,
  done:        "success"  as const,
};

const STATUS_LABEL = {
  todo:        "לביצוע",
  in_progress: "בתהליך",
  done:        "הושלם",
};

function daysUntil(isoDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(isoDate);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return "היום";
  if (diff === 1) return "מחר";
  return `בעוד ${diff} ימים`;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "short",
  });
}

interface UpcomingTasksProps {
  tasks: UpcomingTask[];
}

export function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  if (tasks.length === 0) {
    return (
      <p className="text-sm text-stone-400 py-4 text-center">
        אין משימות עם מועד יעד קרוב
      </p>
    );
  }

  return (
    <ul className="flex flex-col">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center gap-3 px-5 py-3.5 border-t border-amber/10 first:border-0 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber/10 flex-shrink-0">
            <Calendar className="h-4 w-4 text-amber" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-stone-800 truncate">{task.title}</p>
            <p className="text-xs text-stone-400 truncate">{task.projectName}</p>
          </div>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <Badge variant={STATUS_VARIANT[task.status]} className="text-[10px]">
              {STATUS_LABEL[task.status]}
            </Badge>
            <span className="text-[11px] text-stone-500 font-medium">
              {daysUntil(task.due_date)}
              <span className="text-stone-400"> · {formatDate(task.due_date)}</span>
            </span>
          </div>

          <Link
            href={`/projects/${task.project_id}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            aria-label="פתח פרויקט"
          >
            <ArrowLeft className="h-4 w-4 text-stone-400" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
