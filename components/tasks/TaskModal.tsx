"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createTaskAction, updateTaskAction } from "@/app/actions/tasks";
import type { TaskWithAssignee } from "./TaskCard";
import type { ProfileRow } from "@/lib/supabase/types";

const STATUS_OPTIONS = [
  { value: "todo", label: "לביצוע" },
  { value: "in_progress", label: "בתהליך" },
  { value: "done", label: "הושלם" },
] as const;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  projectId: string;
  profiles: ProfileRow[];
  /** When provided the modal is in edit mode. When null/undefined it is in create mode. */
  task?: TaskWithAssignee | null;
  /** Default status to pre-select when creating a new task */
  defaultStatus?: "todo" | "in_progress" | "done";
}

export function TaskModal({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  profiles,
  task,
  defaultStatus = "todo",
}: TaskModalProps) {
  const isEdit = task != null && Boolean(task.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"todo" | "in_progress" | "done">("todo");
  const [assignedUser, setAssignedUser] = useState<string>("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(isEdit ? (task?.title ?? "") : "");
      setDescription(isEdit ? (task?.description ?? "") : "");
      setStatus(isEdit ? (task?.status ?? defaultStatus) : defaultStatus);
      setAssignedUser(isEdit ? (task?.assigned_user ?? "") : "");
      setDueDate(isEdit ? (task?.due_date ?? "") : "");
      setError(null);
    }
  }, [isOpen, isEdit, task, defaultStatus]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const input = {
        title: title.trim(),
        description: description.trim() || null,
        status,
        project_id: projectId,
        assigned_user: assignedUser || null,
        due_date: dueDate || null,
      };

      const result = isEdit
        ? await updateTaskAction(task!.id, projectId, input)
        : await createTaskAction(input);

      if (result.error) {
        setError(result.error);
      } else {
        onSuccess(isEdit ? "המשימה עודכנה בהצלחה" : "המשימה נוצרה בהצלחה");
        onClose();
      }
    } finally {
      setIsPending(false);
    }
  }

  const selectClass =
    "w-full h-10 rounded-xl border border-amber/30 bg-cream px-3 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber hover:border-amber/50 transition-colors appearance-none cursor-pointer";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "עריכת משימה" : "משימה חדשה"}
      description={isEdit ? "ערוך את פרטי המשימה" : "מלא את הפרטים כדי ליצור משימה חדשה"}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            ביטול
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={isPending || !title.trim()}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEdit ? "שומר..." : "יוצר..."}
              </span>
            ) : isEdit ? (
              "שמור שינויים"
            ) : (
              "צור משימה"
            )}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <Input
          label="כותרת *"
          placeholder="לדוגמה: עיצוב מסך הבית"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />

        <Textarea
          label="תיאור (אופציונלי)"
          placeholder="פרט את המשימה..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-stone-700">סטטוס</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className={selectClass}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned user */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-stone-700">אחראי</label>
            <select
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
              className={selectClass}
            >
              <option value="">ללא אחראי</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name ?? p.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Due date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-stone-700">
            תאריך יעד (אופציונלי)
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={selectClass}
          />
        </div>
      </form>
    </Modal>
  );
}
