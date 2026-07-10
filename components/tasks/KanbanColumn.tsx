"use client";

import { Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import { TaskCard, type TaskWithAssignee } from "./TaskCard";
import { TaskCardSkeleton } from "./TaskCardSkeleton";

interface KanbanColumnProps {
  /** Column id matches TaskStatus — kept as a string prop for Phase 6 drag & drop compatibility */
  columnId: "todo" | "in_progress" | "done";
  label: string;
  tasks: TaskWithAssignee[];
  isLoading?: boolean;
  onAddTask?: () => void;
  onEditTask: (task: TaskWithAssignee) => void;
  onDeleteTask: (task: TaskWithAssignee) => void;
}

const COLUMN_ACCENT: Record<string, string> = {
  todo: "border-t-stone-300 bg-stone-50/60",
  in_progress: "border-t-amber bg-amber/5",
  done: "border-t-green-400 bg-green-50/40",
};

const COUNT_ACCENT: Record<string, string> = {
  todo: "bg-stone-200 text-stone-600",
  in_progress: "bg-amber/20 text-amber-800",
  done: "bg-green-100 text-green-800",
};

export function KanbanColumn({
  columnId,
  label,
  tasks,
  isLoading = false,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-amber/15 border-t-4 min-w-[280px]",
        "shadow-[0_2px_8px_0_rgba(212,163,115,0.06)]",
        COLUMN_ACCENT[columnId]
      )}
      aria-label={`עמודה: ${label}`}
      data-column-id={columnId}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-stone-700">{label}</h3>
          <span
            className={cn(
              "inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-medium",
              COUNT_ACCENT[columnId]
            )}
          >
            {tasks.length}
          </span>
        </div>

        {onAddTask && (
          <button
            onClick={onAddTask}
            aria-label={`הוסף משימה ל${label}`}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-stone-400 hover:bg-amber/10 hover:text-amber transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Task list — data-droppable for Phase 6 */}
      <div
        className="flex flex-col gap-2.5 px-3 pb-3 flex-1 min-h-[120px]"
        data-droppable={columnId}
      >
        {isLoading ? (
          <>
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </>
        ) : tasks.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-xs text-stone-400">
            אין משימות
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
