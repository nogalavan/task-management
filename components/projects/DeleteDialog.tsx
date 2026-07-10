"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { deleteProjectAction } from "@/app/actions/projects";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  projectId: string;
  projectName: string;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  projectName,
}: DeleteDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsPending(true);
    setError(null);
    try {
      const result = await deleteProjectAction(projectId);
      if (result.error) {
        setError(result.error);
      } else {
        onSuccess("הפרויקט נמחק בהצלחה");
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
      title="מחיקת פרויקט"
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
                מחק פרויקט
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
          האם אתה בטוח שברצונך למחוק את הפרויקט{" "}
          <strong className="font-semibold text-stone-900">
            &quot;{projectName}&quot;
          </strong>
          ?
        </p>

        <div className="rounded-xl border border-red-100 bg-red-50/60 px-4 py-3">
          <p className="text-sm text-red-700 leading-relaxed">
            ⚠️ פעולה זו אינה הפיכה. כל המשימות השייכות לפרויקט זה יימחקו
            אוטומטית.
          </p>
        </div>
      </div>
    </Modal>
  );
}
