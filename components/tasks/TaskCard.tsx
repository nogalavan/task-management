"use client";

import { Pencil, Trash2, User, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import type { TaskRow } from "@/lib/supabase/types";

export interface TaskWithAssignee extends TaskRow {
  assigneeName: string | null;
  /** Optional — shown on the global tasks page to indicate which project the task belongs to */
  projectName?: string;
}

const STATUS_VARIANT = {
  todo: "outline" as const,
  in_progress: "warning" as const,
  done: "success" as const,
};

const STATUS_LABEL = {
  todo: "לביצוע",
  in_progress: "בתהליך",
  done: "הושלם",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "short",
  });
}

interface TaskCardProps {
  task: TaskWithAssignee;
  onEdit: (task: TaskWithAssignee) => void;
  onDelete: (task: TaskWithAssignee) => void;
  /** When true, card is rendered in a drag-and-drop context (reserved for Phase 6) */
  isDragging?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, isDragging = false }: TaskCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-xl bg-cream border border-amber/15 p-4",
        "shadow-[0_1px_4px_0_rgba(212,163,115,0.10)]",
        "transition-all duration-150",
        "hover:shadow-[0_4px_12px_0_rgba(212,163,115,0.18)] hover:-translate-y-0.5",
        isDragging && "opacity-50 scale-95"
      )}
    >
      {/* Action buttons */}
      <div className="absolute top-2.5 left-2.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(task)}
          aria-label={`ערוך משימה: ${task.title}`}
          className="h-6 w-6 p-0 bg-white/80 border border-amber/20 hover:bg-amber/10"
        >
          <Pencil className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task)}
          aria-label={`מחק משימה: ${task.title}`}
          className="h-6 w-6 p-0 bg-white/80 border border-red-200 text-red-500 hover:bg-red-50"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Status badge */}
      <div className="mb-2.5">
        <Badge variant={STATUS_VARIANT[task.status]} className="text-[10px]">
          {STATUS_LABEL[task.status]}
        </Badge>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-stone-800 leading-snug mb-1.5 line-clamp-2 pl-12">
        {task.title}
      </h4>

      {/* Project name */}
      {task.projectName && (
        <p className="text-[11px] font-medium text-amber mb-1.5 truncate">
          📁 {task.projectName}
        </p>
      )}

      {/* Description */}
      {task.description && (
        <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Footer meta */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-amber/10">
        <div className="flex items-center gap-1.5 text-xs text-stone-400 min-w-0">
          <User className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">
            {task.assigneeName ?? "לא מוקצה"}
          </span>
        </div>

        {task.due_date && (
          <div className="flex items-center gap-1 text-xs text-stone-400 flex-shrink-0">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(task.due_date)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
