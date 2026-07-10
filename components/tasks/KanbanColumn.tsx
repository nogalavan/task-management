"use client";

import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import { DraggableTaskCard } from "./DraggableTaskCard";
import { TaskCardSkeleton } from "./TaskCardSkeleton";
import type { TaskWithAssignee } from "./TaskCard";

interface KanbanColumnProps {
  columnId: "todo" | "in_progress" | "done";
  label: string;
  tasks: TaskWithAssignee[];
  isLoading?: boolean;
  onAddTask?: () => void;
  onEditTask: (task: TaskWithAssignee) => void;
  onDeleteTask: (task: TaskWithAssignee) => void;
}

const COLUMN_ACCENT: Record<string, string> = {
  todo:        "border-t-amber",
  in_progress: "border-t-amber",
  done:        "border-t-amber",
};

const COLUMN_BG: Record<string, string> = {
  todo:        "bg-amber/5",
  in_progress: "bg-amber/5",
  done:        "bg-amber/5",
};

const COLUMN_OVER_BG: Record<string, string> = {
  todo:        "bg-amber/15",
  in_progress: "bg-amber/15",
  done:        "bg-amber/15",
};

const COUNT_ACCENT: Record<string, string> = {
  todo:        "bg-amber/20 text-amber-800",
  in_progress: "bg-amber/20 text-amber-800",
  done:        "bg-amber/20 text-amber-800",
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
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border border-amber/15 border-t-4 min-w-[280px]",
        "shadow-[0_2px_8px_0_rgba(212,163,115,0.06)]",
        "transition-colors duration-150",
        COLUMN_ACCENT[columnId],
        isOver ? COLUMN_OVER_BG[columnId] : COLUMN_BG[columnId]
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

      {/* Droppable task list */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col gap-2.5 px-3 pb-3 flex-1 min-h-[120px] rounded-b-2xl transition-colors duration-150"
        )}
        data-droppable={columnId}
      >
        {isLoading ? (
          <>
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </>
        ) : tasks.length === 0 ? (
          <div
            className={cn(
              "flex items-center justify-center py-8 rounded-xl border-2 border-dashed transition-colors",
              isOver
                ? "border-amber/50 text-amber"
                : "border-stone-200 text-stone-400"
            )}
          >
            <span className="text-xs">
              {isOver ? "שחרר כאן" : "אין משימות"}
            </span>
          </div>
        ) : (
          tasks.map((task) => (
            <DraggableTaskCard
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
