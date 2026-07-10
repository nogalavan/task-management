/**
 * Data access layer — Projects.
 * All functions are server-only (use in Server Components / Server Actions).
 * Projects are organisation-wide: no filtering by current user.
 */
import { createClient } from "@/lib/supabase/server";
import { ProjectCreateSchema, ProjectUpdateSchema } from "@/lib/validations";
import type { ProjectRow, ProjectInsert, DbResult } from "@/lib/supabase/types";
import type { ProjectCreateInput, ProjectUpdateInput } from "@/lib/validations";

// ---------------------------------------------------------------------------
// Extended types
// ---------------------------------------------------------------------------

export interface ProjectWithDetails extends ProjectRow {
  /** Display name of the user who created the project */
  creatorName: string;
  /** Total task count */
  taskCount: number;
}

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/** Returns all projects (organisation-wide, newest first). */
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

/**
 * Returns all projects joined with creator profile and task count.
 * Uses two separate queries to avoid requiring a DB foreign key constraint.
 */
export async function getProjectsWithDetails(): Promise<DbResult<ProjectWithDetails[]>> {
  try {
    const supabase = await createClient();

    // 1. Fetch all projects
    const { data: rows, error: projectsError } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (projectsError) return { data: null, error: projectsError.message };
    if (!rows || rows.length === 0) return { data: [], error: null };

    // 2. Fetch task counts per project
    const { data: taskCounts, error: tasksError } = await supabase
      .from("tasks")
      .select("project_id");

    if (tasksError) return { data: null, error: tasksError.message };

    const countMap: Record<string, number> = {};
    for (const t of taskCounts ?? []) {
      countMap[t.project_id] = (countMap[t.project_id] ?? 0) + 1;
    }

    // 3. Fetch profiles for all unique created_by ids
    const creatorIds = [...new Set(rows.map((r) => r.created_by).filter(Boolean))];
    const profileMap: Record<string, string> = {};

    if (creatorIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", creatorIds);

      for (const p of profiles ?? []) {
        profileMap[p.id] = p.full_name ?? "משתמש";
      }
    }

    const projects: ProjectWithDetails[] = (rows as ProjectRow[]).map((row) => ({
      ...row,
      creatorName: profileMap[row.created_by] ?? "משתמש",
      taskCount: countMap[row.id] ?? 0,
    }));

    return { data: projects, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

/** Returns a single project by id with creator name and task count. */
export async function getProjectByIdWithDetails(
  id: string
): Promise<DbResult<ProjectWithDetails>> {
  try {
    const supabase = await createClient();

    // 1. Fetch the project
    const { data: row, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (projectError) return { data: null, error: projectError.message };

    // 2. Fetch task count
    const { count: taskCount } = await supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("project_id", id);

    // 3. Fetch creator profile
    let creatorName = "משתמש";
    if (row.created_by) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", row.created_by)
        .single();
      creatorName = profile?.full_name ?? "משתמש";
    }

    return {
      data: { ...row, creatorName, taskCount: taskCount ?? 0 },
      error: null,
    };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

/** Returns a single project row (no joins). */
export async function getProjectById(
  id: string
): Promise<DbResult<ProjectRow>> {
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

/** Creates a new project. Records creator as owner_id (informational only). */
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
      created_by: user.id,
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

/** Updates an existing project (any authenticated user). */
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

/** Deletes a project by id. Tasks are removed via ON DELETE CASCADE. */
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
