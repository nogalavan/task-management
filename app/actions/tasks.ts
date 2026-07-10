"use server";

import { revalidatePath } from "next/cache";
import { createTask, updateTask, deleteTask } from "@/lib/tasks";
import { TaskCreateSchema, TaskUpdateSchema } from "@/lib/validations";

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

  revalidatePath(`/projects/${parsed.data.project_id}`);
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

  const result = await updateTask(id, parsed.data);
  if (result.error) return { error: result.error };

  revalidatePath(`/projects/${projectId}`);
  return { error: null };
}

export async function deleteTaskAction(
  id: string,
  projectId: string
): Promise<ActionResult> {
  const result = await deleteTask(id);
  if (result.error) return { error: result.error };

  revalidatePath(`/projects/${projectId}`);
  return { error: null };
}
