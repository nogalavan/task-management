"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Toaster, type ToastMessage } from "@/components/ui/Toast";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard, type TaskWithAssignee } from "./TaskCard";
import { TaskModal } from "./TaskModal";
import { TaskDeleteDialog } from "./TaskDeleteDialog";
import { updateTaskAction } from "@/app/actions/tasks";
import type { ProfileRow, ProjectRow, TaskStatus } from "@/lib/supabase/types";

const COLUMNS: { id: TaskStatus; label: string }[] = [
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

export function AllTasksBoard({ tasks: initialTasks, profiles, projects }: AllTasksBoardProps) {
  const router = useRouter();

  // Local task state for optimistic DnD updates
  const [tasks, setTasks] = useState<TaskWithAssignee[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<TaskWithAssignee | null>(null);

  // Re-sync whenever server component delivers fresh initialTasks
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const [filter, setFilter] = useState<FilterMode>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithAssignee | null>(null);
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

    // Persist to Supabase
    const result = await updateTaskAction(taskId, task.project_id, { status: newStatus });

    if (result.error) {
      // Revert on failure
      setTasks(prevTasks);
      addToast("שגיאה בשמירת הסטטוס. נסה שוב.", "error");
    }
  }

  // ---------------------------------------------------------------------------
  // Group tasks by status
  // ---------------------------------------------------------------------------

  const grouped: Record<string, TaskWithAssignee[]> = {
    todo: [],
    in_progress: [],
    done: [],
  };
  for (const task of tasks) {
    if (grouped[task.status]) grouped[task.status].push(task);
  }

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

        {projects.length > 0 && (
          <div className="h-4 w-px bg-amber/30 mx-1" aria-hidden="true" />
        )}

        {projects.map((p) => (
          <Button key={p.id} variant="ghost" size="sm" disabled title={p.name}>
            {p.name}
          </Button>
        ))}
      </div>

      {/* Count summary */}
      <div className="text-sm text-stone-500 mb-4">
        <span className="font-medium text-stone-700">{tasks.length}</span>{" "}
        {tasks.length === 1 ? "משימה" : "משימות"} מכלל הפרויקטים
        {filter === "mine" && (
          <span className="mr-2 text-amber text-xs font-medium">
            (סינון לפי משימות שלי — בקרוב)
          </span>
        )}
      </div>

      {/* DnD context wraps the board */}
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
              onEditTask={(task) => { setEditingTask(task); setModalOpen(true); }}
              onDeleteTask={(task) => setDeleteTarget(task)}
            />
          ))}
        </div>

        {/* Floating drag preview */}
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

      {/* Edit modal */}
      {editingTask && (
        <TaskModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setEditingTask(null); }}
          onSuccess={(msg) => {
            addToast(msg, "success");
            setModalOpen(false);
            setEditingTask(null);
            router.refresh();
          }}
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
          onSuccess={(msg) => {
            addToast(msg, "success");
            setTasks((prev) => prev.filter((t) => t.id !== deleteTarget.id));
            setDeleteTarget(null);
            router.refresh();
          }}
          taskId={deleteTarget.id}
          taskTitle={deleteTarget.title}
          projectId={deleteTarget.project_id}
        />
      )}

      <Toaster toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
