/**
 * Data access layer — Tasks.
 * All functions are server-only (use in Server Components / Server Actions).
 */
import { createClient } from "@/lib/supabase/server";
import { TaskCreateSchema, TaskUpdateSchema } from "@/lib/validations";
import type { TaskRow, TaskInsert, DbResult } from "@/lib/supabase/types";
import type { TaskCreateInput, TaskUpdateInput } from "@/lib/validations";

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/** Returns all tasks for a given project, ordered by creation date. */
export async function getTasksByProject(
  projectId: string
): Promise<DbResult<TaskRow[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) return { data: null, error: error.message };
    return { data: data ?? [], error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

/** Returns all tasks across all projects (organisation-wide). */
export async function getAllTasks(): Promise<DbResult<TaskRow[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data: data ?? [], error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

/** Returns all tasks assigned to the current user. */
export async function getMyTasks(): Promise<DbResult<TaskRow[]>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { data: null, error: "לא מחובר" };

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("assigned_user", user.id)
      .order("due_date", { ascending: true });

    if (error) return { data: null, error: error.message };
    return { data: data ?? [], error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

/** Returns a single task by id. */
export async function getTaskById(id: string): Promise<DbResult<TaskRow>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

/** Creates a new task. */
export async function createTask(
  input: TaskCreateInput
): Promise<DbResult<TaskRow>> {
  try {
    const validated = TaskCreateSchema.parse(input);

    const insert: TaskInsert = {
      title: validated.title,
      description: validated.description ?? null,
      status: validated.status,
      project_id: validated.project_id,
      assigned_user: validated.assigned_user ?? null,
      due_date: validated.due_date ?? null,
    };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tasks")
      .insert(insert)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

/** Updates an existing task (only fields provided). */
export async function updateTask(
  id: string,
  input: TaskUpdateInput
): Promise<DbResult<TaskRow>> {
  try {
    const validated = TaskUpdateSchema.parse(input);

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tasks")
      .update({ ...validated, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

/** Deletes a task by id. */
export async function deleteTask(id: string): Promise<DbResult<true>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) return { data: null, error: error.message };
    return { data: true, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}
