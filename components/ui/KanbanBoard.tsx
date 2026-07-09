import { Plus, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { CheckSquare } from "lucide-react";
import type { PlaceholderTask } from "@/lib/placeholder-data";
import { KANBAN_COLUMNS } from "@/lib/placeholder-data";
import { cn } from "@/utils/cn";

// ---------------------------------------------------------------------------
// Priority config
// ---------------------------------------------------------------------------

const priorityConfig: Record<
  string,
  { label: string; variant: "danger" | "warning" | "default" | "outline" }
> = {
  urgent: { label: "דחוף", variant: "danger" },
  high: { label: "גבוה", variant: "warning" },
  medium: { label: "בינוני", variant: "default" },
  low: { label: "נמוך", variant: "outline" },
};

// Column accent colours (top border + badge bg)
const columnAccent: Record<string, string> = {
  todo: "border-t-stone-300",
  in_progress: "border-t-blue-400",
  done: "border-t-sage",
};

const columnBg: Record<string, string> = {
  todo: "bg-stone-50",
  in_progress: "bg-blue-50/60",
  done: "bg-sage/10",
};

// ---------------------------------------------------------------------------
// TaskCard — individual task card inside a column
// ---------------------------------------------------------------------------

interface TaskCardProps {
  task: PlaceholderTask;
  /** Optional: show which project a task belongs to (used on the global tasks page) */
  showProject?: boolean;
  projectName?: string;
}

function TaskCard({ task, showProject, projectName }: TaskCardProps) {
  const priority = priorityConfig[task.priority] ?? priorityConfig.medium;

  return (
    <Card
      hover
      padding="sm"
      className="bg-cream cursor-pointer select-none"
      role="article"
      aria-label={task.title}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-medium text-stone-800 leading-snug">
          {task.title}
        </h3>
        <button
          className="text-stone-400 hover:text-stone-600 transition-colors flex-shrink-0"
          aria-label="אפשרויות משימה"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Optional project label */}
      {showProject && projectName && (
        <p className="text-xs text-amber mb-2 font-medium">{projectName}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <Badge variant={priority.variant}>{priority.label}</Badge>

        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className="text-xs text-stone-400">{task.dueDate}</span>
          )}
          {task.assignee ? (
            <Avatar name={task.assignee} size="xs" />
          ) : (
            <div
              className="h-6 w-6 rounded-full border-2 border-dashed border-stone-300"
              aria-label="לא שויך"
            />
          )}
        </div>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// KanbanColumn — one status column
// ---------------------------------------------------------------------------

interface KanbanColumnProps {
  id: string;
  label: string;
  tasks: PlaceholderTask[];
  showProject?: boolean;
  getProjectName?: (projectId: string) => string;
}

function KanbanColumn({
  id,
  label,
  tasks,
  showProject,
  getProjectName,
}: KanbanColumnProps) {
  return (
    <div
      className="flex-shrink-0 w-80"
      aria-label={`עמודה: ${label}`}
      role="region"
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-stone-700 text-sm">{label}</h2>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sage-light px-1.5 text-xs font-medium text-stone-600">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`הוסף משימה ל${label}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Drop zone */}
      <div
        className={cn(
          "rounded-2xl border border-amber/10 border-t-2 p-3 flex flex-col gap-3 min-h-[200px]",
          columnBg[id],
          columnAccent[id]
        )}
      >
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-8">
            <p className="text-xs text-stone-400">אין משימות</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              showProject={showProject}
              projectName={getProjectName ? getProjectName(task.projectId) : undefined}
            />
          ))
        )}

        {/* Add task inline button */}
        <button className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-amber/30 px-4 py-3 text-sm text-stone-400 hover:border-amber/60 hover:text-amber hover:bg-warm/50 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber">
          <Plus className="h-4 w-4" />
          הוסף משימה
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// KanbanBoard — the full board (exported)
// ---------------------------------------------------------------------------

interface KanbanBoardProps {
  tasks: PlaceholderTask[];
  /** When true, each task card shows its project name (for the global tasks page) */
  showProject?: boolean;
  getProjectName?: (projectId: string) => string;
}

export function KanbanBoard({
  tasks,
  showProject = false,
  getProjectName,
}: KanbanBoardProps) {
  if (tasks.length === 0 && !showProject) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="אין משימות עדיין"
        description="צור את המשימה הראשונה שלך והתחל לעבוד"
        actionLabel="צור משימה"
      />
    );
  }

  const byStatus = Object.fromEntries(
    KANBAN_COLUMNS.map((col) => [
      col.id,
      tasks.filter((t) => t.status === col.id),
    ])
  );

  return (
    <div
      className="flex gap-5 overflow-x-auto pb-6"
      aria-label="לוח קנבן"
      role="main"
    >
      {KANBAN_COLUMNS.map((col) => (
        <KanbanColumn
          key={col.id}
          id={col.id}
          label={col.label}
          tasks={byStatus[col.id] ?? []}
          showProject={showProject}
          getProjectName={getProjectName}
        />
      ))}
    </div>
  );
}
