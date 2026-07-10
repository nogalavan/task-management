"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { ProjectWithDetails } from "@/lib/projects";
import {
  createProjectAction,
  updateProjectAction,
} from "@/app/actions/projects";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  /** When provided, modal is in edit mode. */
  project?: ProjectWithDetails | null;
}

export function ProjectModal({
  isOpen,
  onClose,
  onSuccess,
  project,
}: ProjectModalProps) {
  const isEdit = Boolean(project);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Populate fields when editing
  useEffect(() => {
    if (isOpen) {
      setName(project?.name ?? "");
      setDescription(project?.description ?? "");
      setError(null);
    }
  }, [isOpen, project]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const input = { name: name.trim(), description: description.trim() || null };

      const result = isEdit
        ? await updateProjectAction(project!.id, input)
        : await createProjectAction(input);

      if (result.error) {
        setError(result.error);
      } else {
        onSuccess(isEdit ? "הפרויקט עודכן בהצלחה" : "הפרויקט נוצר בהצלחה");
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
      title={isEdit ? "עריכת פרויקט" : "פרויקט חדש"}
      description={
        isEdit
          ? "ערוך את פרטי הפרויקט"
          : "מלא את הפרטים כדי ליצור פרויקט חדש"
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            ביטול
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={isPending || !name.trim()}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEdit ? "שומר..." : "יוצר..."}
              </span>
            ) : isEdit ? (
              "שמור שינויים"
            ) : (
              "צור פרויקט"
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
          label="שם הפרויקט"
          placeholder="לדוגמה: אתר החברה החדש"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <Textarea
          label="תיאור (אופציונלי)"
          placeholder="תאר את מטרות הפרויקט..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </form>
    </Modal>
  );
}
