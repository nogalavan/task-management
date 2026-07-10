"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Toaster, type ToastMessage } from "@/components/ui/Toast";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard, type TaskWithAssignee } from "./TaskCard";
import { TaskModal } from "./TaskModal";
import { TaskDeleteDialog } from "./TaskDeleteDialog";
import { updateTaskAction } from "@/app/actions/tasks";
import type { ProfileRow, TaskStatus } from "@/lib/supabase/types";

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: "todo", label: "לביצוע" },
  { id: "in_progress", label: "בתהליך" },
  { id: "done", label: "הושלם" },
];

interface TaskBoardProps {
  projectId: string;
  tasks: TaskWithAssignee[];
  profiles: ProfileRow[];
}

export function TaskBoard({ projectId, tasks: initialTasks, profiles }: TaskBoardProps) {
  // Local state for optimistic drag & drop
  const [tasks, setTasks] = useState<TaskWithAssignee[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<TaskWithAssignee | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithAssignee | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");
  const [deleteTarget, setDeleteTarget] = useState<TaskWithAssignee | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

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

  // ---------------------------------------------------------------------------
  // DnD handlers
  // ---------------------------------------------------------------------------

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const task = tasks.find((t) => t.id === taskId);

    if (!task || task.status === newStatus) return;

    // Optimistic update
    const prevTasks = tasks;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    const result = await updateTaskAction(taskId, projectId, { status: newStatus });

    if (result.error) {
      setTasks(prevTasks);
      addToast("שגיאה בשמירת הסטטוס. נסה שוב.", "error");
    }
  }

  // ---------------------------------------------------------------------------
  // Modal helpers
  // ---------------------------------------------------------------------------

  function openCreate(status: TaskStatus = "todo") {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalOpen(true);
  }

  function openEdit(task: TaskWithAssignee) {
    setEditingTask(task);
    setModalOpen(true);
  }

  // ---------------------------------------------------------------------------
  // Group tasks
  // ---------------------------------------------------------------------------

  const grouped: Record<string, TaskWithAssignee[]> = {
    todo: [],
    in_progress: [],
    done: [],
  };
  for (const task of tasks) {
    if (grouped[task.status]) grouped[task.status].push(task);
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

      {/* DnD context */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              columnId={col.id}
              label={col.label}
              tasks={grouped[col.id]}
              onAddTask={() => openCreate(col.id)}
              onEditTask={openEdit}
              onDeleteTask={(task) => setDeleteTarget(task)}
            />
          ))}
        </div>

        {/* Drag overlay */}
        <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
          {activeTask && (
            <div className="rotate-1 scale-105 opacity-95 shadow-xl rounded-xl">
              <TaskCard
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
                isDragging
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Create / Edit modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSuccess={(msg) => {
          addToast(msg, "success");
          // After create/edit, the page revalidates via server action;
          // local state will sync on next server render.
        }}
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
          onSuccess={(msg) => {
            addToast(msg, "success");
            setTasks((prev) => prev.filter((t) => t.id !== deleteTarget.id));
            setDeleteTarget(null);
          }}
          taskId={deleteTarget.id}
          taskTitle={deleteTarget.title}
          projectId={projectId}
        />
      )}

      <Toaster toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
