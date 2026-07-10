"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard, type TaskWithAssignee } from "./TaskCard";

interface DraggableTaskCardProps {
  task: TaskWithAssignee;
  onEdit: (task: TaskWithAssignee) => void;
  onDelete: (task: TaskWithAssignee) => void;
}

export function DraggableTaskCard({
  task,
  onEdit,
  onDelete,
}: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id, data: { task } });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    touchAction: "none",
  };

  return (
    // suppressHydrationWarning silences the aria-describedby mismatch caused by
    // @dnd-kit generating different DndDescribedBy-N counters on server vs client.
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} suppressHydrationWarning>
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
}
