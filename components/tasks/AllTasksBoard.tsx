"use client";

import { useState, useCallback } from "react";
import { CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Toaster, type ToastMessage } from "@/components/ui/Toast";
import { KanbanColumn } from "./KanbanColumn";
import { TaskModal } from "./TaskModal";
import { TaskDeleteDialog } from "./TaskDeleteDialog";
import type { TaskWithAssignee } from "./TaskCard";
import type { ProfileRow, ProjectRow } from "@/lib/supabase/types";

const COLUMNS: { id: "todo" | "in_progress" | "done"; label: string }[] = [
  { id: "todo", label: "לביצוע" },
  { id: "in_progress", label: "בתהליך" },
  { id: "done", label: "הושלם" },
];

type FilterMode = "all" | "mine";

interface AllTasksBoardProps {
  tasks: TaskWithAssignee[];
  profiles: ProfileRow[];
  projects: ProjectRow[];
}

export function AllTasksBoard({ tasks, profiles, projects }: AllTasksBoardProps) {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithAssignee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TaskWithAssignee | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Group tasks by status
  const grouped: Record<string, TaskWithAssignee[]> = {
    todo: [],
    in_progress: [],
    done: [],
  };
  for (const task of tasks) {
    if (grouped[task.status]) grouped[task.status].push(task);
  }

  const totalVisible = tasks.length;

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="אין משימות עדיין"
        description="צור משימות מתוך עמודי הפרויקטים"
      />
    );
  }

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Button
          variant={filter === "all" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          הכל
        </Button>
        <Button
          variant={filter === "mine" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setFilter("mine")}
          title="בקרוב — סינון לפי משימות שהוקצו לך"
        >
          המשימות שלי
        </Button>

        {/* Vertical divider */}
        {projects.length > 0 && (
          <div className="h-4 w-px bg-amber/30 mx-1" aria-hidden="true" />
        )}

        {/* Per-project filter buttons — coming soon */}
        {projects.map((p) => (
          <Button key={p.id} variant="ghost" size="sm" disabled title={p.name}>
            {p.name}
          </Button>
        ))}
      </div>

      {/* Count summary */}
      <div className="text-sm text-stone-500 mb-4">
        <span className="font-medium text-stone-700">{totalVisible}</span>{" "}
        {totalVisible === 1 ? "משימה" : "משימות"} מכלל הפרויקטים
        {filter === "mine" && (
          <span className="mr-2 text-amber text-xs font-medium">
            (סינון לפי משימות שלי — בקרוב)
          </span>
        )}
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            columnId={col.id}
            label={col.label}
            tasks={grouped[col.id]}
            onEditTask={(task) => { setEditingTask(task); setModalOpen(true); }}
            onDeleteTask={(task) => setDeleteTarget(task)}
          />
        ))}
      </div>

      {/* Edit modal */}
      {editingTask && (
        <TaskModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setEditingTask(null); }}
          onSuccess={(msg) => addToast(msg, "success")}
          projectId={editingTask.project_id}
          profiles={profiles}
          task={editingTask}
        />
      )}

      {/* Delete dialog */}
      {deleteTarget && (
        <TaskDeleteDialog
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onSuccess={(msg) => addToast(msg, "success")}
          taskId={deleteTarget.id}
          taskTitle={deleteTarget.title}
          projectId={deleteTarget.project_id}
        />
      )}

      <Toaster toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
