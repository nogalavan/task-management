/**
 * Data access layer — Projects.
 * All functions are server-only (use in Server Components / Server Actions).
 */
import { createClient } from "@/lib/supabase/server";
import { ProjectCreateSchema, ProjectUpdateSchema } from "@/lib/validations";
import type {
  ProjectRow,
  ProjectInsert,
  DbResult,
} from "@/lib/supabase/types";
import type { ProjectCreateInput, ProjectUpdateInput } from "@/lib/validations";

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/** Returns all projects owned by or shared with the current user. */
export async function getProjects(): Promise<DbResult<ProjectRow[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data: data ?? [], error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

/** Returns a single project by id. */
export async function getProjectById(id: string): Promise<DbResult<ProjectRow>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
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

/** Creates a new project for the current user. */
export async function createProject(
  input: ProjectCreateInput
): Promise<DbResult<ProjectRow>> {
  try {
    const validated = ProjectCreateSchema.parse(input);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { data: null, error: "לא מחובר" };

    const insert: ProjectInsert = {
      name: validated.name,
      description: validated.description ?? null,
      status: validated.status,
      color: validated.color ?? null,
      owner_id: user.id,
    };

    const { data, error } = await supabase
      .from("projects")
      .insert(insert)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

/** Updates an existing project (only fields provided). */
export async function updateProject(
  id: string,
  input: ProjectUpdateInput
): Promise<DbResult<ProjectRow>> {
  try {
    const validated = ProjectUpdateSchema.parse(input);

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
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

/** Deletes a project by id. */
export async function deleteProject(id: string): Promise<DbResult<true>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) return { data: null, error: error.message };
    return { data: true, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}
