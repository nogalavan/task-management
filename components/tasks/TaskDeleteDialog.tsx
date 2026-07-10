"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { deleteTaskAction } from "@/app/actions/tasks";

interface TaskDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  taskId: string;
  taskTitle: string;
  projectId: string;
}

export function TaskDeleteDialog({
  isOpen,
  onClose,
  onSuccess,
  taskId,
  taskTitle,
  projectId,
}: TaskDeleteDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsPending(true);
    setError(null);
    try {
      const result = await deleteTaskAction(taskId, projectId);
      if (result.error) {
        setError(result.error);
      } else {
        onSuccess("המשימה נמחקה בהצלחה");
        onClose();
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="מחיקת משימה"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            ביטול
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                מוחק...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                מחק משימה
              </span>
            )}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}
        <p className="text-sm text-stone-700 leading-relaxed">
          האם אתה בטוח שברצונך למחוק את המשימה{" "}
          <strong className="font-semibold text-stone-900">
            &quot;{taskTitle}&quot;
          </strong>
          ?
        </p>
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          ⚠️ פעולה זו אינה הפיכה.
        </p>
      </div>
    </Modal>
  );
}
