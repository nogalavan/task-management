"use server";

import { revalidatePath } from "next/cache";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/projects";
import { ProjectCreateSchema, ProjectUpdateSchema } from "@/lib/validations";

export type ActionResult = { error: string | null };

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export async function createProjectAction(
  input: unknown
): Promise<ActionResult> {
  const parsed = ProjectCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const result = await createProject(parsed.data);
  if (result.error) return { error: result.error };

  revalidatePath("/projects");
  return { error: null };
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export async function updateProjectAction(
  id: string,
  input: unknown
): Promise<ActionResult> {
  const parsed = ProjectUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const result = await updateProject(id, parsed.data);
  if (result.error) return { error: result.error };

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  return { error: null };
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  const result = await deleteProject(id);
  if (result.error) return { error: result.error };

  revalidatePath("/projects");
  return { error: null };
}
