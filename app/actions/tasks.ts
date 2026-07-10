"use server";

import { revalidatePath } from "next/cache";
import { createTask, updateTask, deleteTask, getTaskById } from "@/lib/tasks";
import { TaskCreateSchema, TaskUpdateSchema } from "@/lib/validations";
import { logActivity } from "@/lib/activity";

export type ActionResult = { error: string | null };

export async function createTaskAction(
  input: unknown
): Promise<ActionResult> {
  const parsed = TaskCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const result = await createTask(parsed.data);
  if (result.error) return { error: result.error };

  // Log without blocking
  logActivity(
    "created_task",
    { task_title: parsed.data.title },
    result.data?.id,
    parsed.data.project_id
  );

  revalidatePath(`/projects/${parsed.data.project_id}`);
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function updateTaskAction(
  id: string,
  projectId: string,
  input: unknown
): Promise<ActionResult> {
  const parsed = TaskUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  // Fetch current task to capture title + old status for the activity log
  const current = await getTaskById(id);

  const result = await updateTask(id, parsed.data);
  if (result.error) return { error: result.error };

  // Log status changes (drag & drop and modal edits)
  if (parsed.data.status && current.data) {
    logActivity(
      "updated_status",
      {
        task_title: current.data.title,
        old_status: current.data.status,
        new_status: parsed.data.status,
      },
      id,
      projectId
    );
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteTaskAction(
  id: string,
  projectId: string
): Promise<ActionResult> {
  // Capture title before deletion
  const current = await getTaskById(id);

  const result = await deleteTask(id);
  if (result.error) return { error: result.error };

  if (current.data) {
    logActivity(
      "deleted_task",
      { task_title: current.data.title },
      id,
      projectId
    );
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  return { error: null };
}
