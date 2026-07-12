"use client";

import { useState, useCallback } from "react";
import { Plus, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Toaster, type ToastMessage } from "@/components/ui/Toast";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { DeleteDialog } from "@/components/projects/DeleteDialog";
import type { ProjectWithDetails } from "@/lib/projects";

interface ProjectsClientProps {
  projects: ProjectWithDetails[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithDetails | null>(null);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<ProjectWithDetails | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  function openCreate() {
    setEditingProject(null);
    setModalOpen(true);
  }

  function openEdit(project: ProjectWithDetails) {
    setEditingProject(project);
    setModalOpen(true);
  }

  function openDelete(project: ProjectWithDetails) {
    setDeleteTarget(project);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingProject(null);
  }

  function closeDelete() {
    setDeleteTarget(null);
  }

  return (
    <>
      <PageHeader
        title="פרויקטים"
        description="כל הפרויקטים של הארגון במקום אחד"
        actions={
          <Button variant="primary" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            פרויקט חדש
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="אין פרויקטים עדיין"
          description="צור את הפרויקט הראשון שלך והתחל לנהל משימות בצורה יעילה"
          actionLabel="פרויקט חדש"
          onAction={openCreate}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSuccess={(msg) => addToast(msg, "success")}
        project={editingProject}
      />

      {/* Delete confirmation */}
      {deleteTarget && (
        <DeleteDialog
          isOpen={Boolean(deleteTarget)}
          onClose={closeDelete}
          onSuccess={(msg) => addToast(msg, "success")}
          projectId={deleteTarget.id}
          projectName={deleteTarget.name}
        />
      )}

      {/* Toast notifications */}
      <Toaster toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
