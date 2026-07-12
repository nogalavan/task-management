"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { EmptyState } from "@/components/ui/EmptyState";
import { Toaster, type ToastMessage } from "@/components/ui/Toast";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard, type TaskWithAssignee } from "./TaskCard";
import { TaskModal } from "./TaskModal";
import { TaskDeleteDialog } from "./TaskDeleteDialog";
import { TaskFilters } from "./TaskFilters";
import { updateTaskAction } from "@/app/actions/tasks";
import type { ProfileRow, ProjectRow, TaskStatus } from "@/lib/supabase/types";

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: "todo",        label: "לביצוע" },
  { id: "in_progress", label: "בתהליך" },
  { id: "done",        label: "הושלם" },
];

interface AllTasksBoardProps {
  tasks: TaskWithAssignee[];
  profiles: ProfileRow[];
  projects: ProjectRow[];
  currentUserId: string | null;
}

// ---------------------------------------------------------------------------
// Pure filter function — all filtering is client-side from the loaded task list
// ---------------------------------------------------------------------------
function applyFilters(
  tasks: TaskWithAssignee[],
  q: string,
  status: string,
  projectId: string,
  userId: string
): TaskWithAssignee[] {
  const query = q.trim().toLowerCase();
  return tasks.filter((task) => {
    if (query) {
      const haystack = [
        task.title,
        task.description ?? "",
        task.projectName ?? "",
      ].join(" ").toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (status && task.status !== status) return false;
    if (projectId && task.project_id !== projectId) return false;
    if (userId && task.assigned_user !== userId) return false;
    return true;
  });
}

export function AllTasksBoard({
  tasks: initialTasks,
  profiles,
  projects,
  currentUserId,
}: AllTasksBoardProps) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // Full task list — updated optimistically on DnD
  const [tasks, setTasks]         = useState<TaskWithAssignee[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<TaskWithAssignee | null>(null);

  // Re-sync when server delivers fresh data after router.refresh()
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const [modalOpen, setModalOpen]     = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithAssignee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TaskWithAssignee | null>(null);
  const [toasts, setToasts]           = useState<ToastMessage[]>([]);

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
  // Read active filters from URL
  // ---------------------------------------------------------------------------
  const q         = searchParams.get("q")       ?? "";
  const status    = searchParams.get("status")   ?? "";
  const projectId = searchParams.get("project")  ?? "";
  const userId    = searchParams.get("user")     ?? "";

  // ---------------------------------------------------------------------------
  // Derive filtered task list (memoised for performance)
  // ---------------------------------------------------------------------------
  const filteredTasks = useMemo(
    () => applyFilters(tasks, q, status, projectId, userId),
    [tasks, q, status, projectId, userId]
  );

  // Group FILTERED tasks into Kanban columns
  const grouped = useMemo(() => {
    const g: Record<string, TaskWithAssignee[]> = {
      todo: [], in_progress: [], done: [],
    };
    for (const task of filteredTasks) {
      if (g[task.status]) g[task.status].push(task);
    }
    return g;
  }, [filteredTasks]);

  // ---------------------------------------------------------------------------
  // DnD — operates on the FULL task list so drag works even when filtered
  // ---------------------------------------------------------------------------
  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId   = active.id as string;
    const newStatus = over.id as TaskStatus;
    const task      = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic update on full list
    const prevTasks = tasks;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    const result = await updateTaskAction(taskId, task.project_id, { status: newStatus });
    if (result.error) {
      setTasks(prevTasks);
      addToast("שגיאה בשמירת הסטטוס. נסה שוב.", "error");
    }
  }

  // ---------------------------------------------------------------------------
  // Empty states
  // ---------------------------------------------------------------------------
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="אין משימות עדיין"
        description="צור משימות מתוך עמודי הפרויקטים"
      />
    );
  }

  const hasActiveFilter = !!(q || status || projectId || userId);

  return (
    <>
      {/* Filter toolbar */}
      <TaskFilters
        projects={projects}
        profiles={profiles}
        currentUserId={currentUserId}
        totalCount={tasks.length}
        filteredCount={filteredTasks.length}
      />

      {/* No results message when filters active */}
      {hasActiveFilter && filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-amber/15 bg-warm py-16 text-center text-sm text-stone-400">
          לא נמצאו משימות התואמות את הסינון
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-[640px] md:min-w-0">
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
          </div>

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
      )}

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
