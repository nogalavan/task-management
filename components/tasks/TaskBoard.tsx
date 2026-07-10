"use client";

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Toaster, type ToastMessage } from "@/components/ui/Toast";
import { KanbanColumn } from "./KanbanColumn";
import { TaskModal } from "./TaskModal";
import { TaskDeleteDialog } from "./TaskDeleteDialog";
import type { TaskWithAssignee } from "./TaskCard";
import type { ProfileRow } from "@/lib/supabase/types";

const COLUMNS: { id: "todo" | "in_progress" | "done"; label: string }[] = [
  { id: "todo", label: "לביצוע" },
  { id: "in_progress", label: "בתהליך" },
  { id: "done", label: "הושלם" },
];

interface TaskBoardProps {
  projectId: string;
  tasks: TaskWithAssignee[];
  profiles: ProfileRow[];
}

export function TaskBoard({ projectId, tasks, profiles }: TaskBoardProps) {
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithAssignee | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<"todo" | "in_progress" | "done">("todo");

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<TaskWithAssignee | null>(null);

  // Toasts
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

  function openCreate(status: "todo" | "in_progress" | "done" = "todo") {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  }

  function openEdit(task: TaskWithAssignee) {
    setEditingTask(task);
    setModalOpen(true);
  }

  function openDelete(task: TaskWithAssignee) {
    setDeleteTarget(task);
  }

  // Group tasks by status
  const grouped: Record<string, TaskWithAssignee[]> = {
    todo: [],
    in_progress: [],
    done: [],
  };
  for (const task of tasks) {
    if (grouped[task.status]) {
      grouped[task.status].push(task);
    }
  }

  return (
    <>
      {/* Board header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-stone-500">
          <span className="font-medium text-stone-700">{tasks.length}</span>{" "}
          {tasks.length === 1 ? "משימה" : "משימות"}
        </div>
        <Button variant="primary" size="sm" onClick={() => openCreate()}>
          <Plus className="h-4 w-4" />
          משימה חדשה
        </Button>
      </div>

      {/* Board columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            columnId={col.id}
            label={col.label}
            tasks={grouped[col.id]}
            onAddTask={() => openCreate(col.id)}
            onEditTask={openEdit}
            onDeleteTask={openDelete}
          />
        ))}
      </div>

      {/* Create / Edit modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSuccess={(msg) => addToast(msg, "success")}
        projectId={projectId}
        profiles={profiles}
        task={editingTask}
        defaultStatus={defaultStatus}
      />

      {/* Delete dialog */}
      {deleteTarget && (
        <TaskDeleteDialog
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onSuccess={(msg) => addToast(msg, "success")}
          taskId={deleteTarget.id}
          taskTitle={deleteTarget.title}
          projectId={projectId}
        />
      )}

      <Toaster toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
