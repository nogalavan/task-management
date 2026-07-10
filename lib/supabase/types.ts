/**
 * Database row types — mirrors the exact Supabase schema.
 */

// ---------------------------------------------------------------------------
// Enums (task status only — projects have no status column)
// ---------------------------------------------------------------------------

export type TaskStatus = "todo" | "in_progress" | "done";

// ---------------------------------------------------------------------------
// Row types
// ---------------------------------------------------------------------------

export interface ProfileRow {
  id: string;           // uuid — matches auth.users.id
  full_name: string | null;
  created_at: string;
}

export interface ProjectRow {
  id: string;           // uuid
  name: string;
  description: string | null;
  created_by: string;   // uuid → profiles.id (informational only)
  created_at: string;
  updated_at: string;
}

export interface TaskRow {
  id: string;           // uuid
  project_id: string;   // uuid → projects.id
  title: string;
  description: string | null;
  status: TaskStatus;
  assigned_user: string | null; // uuid → profiles.id
  due_date: string | null;      // ISO date string
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Insert / update types
// ---------------------------------------------------------------------------

export type ProjectInsert = Omit<ProjectRow, "id" | "created_at" | "updated_at">;
export type ProjectUpdate = Partial<Pick<ProjectRow, "name" | "description">>;

export type TaskInsert = Omit<TaskRow, "id" | "created_at" | "updated_at">;
export type TaskUpdate = Partial<Omit<TaskRow, "id" | "project_id" | "created_at" | "updated_at">>;

export type ProfileUpdate = Partial<Pick<ProfileRow, "full_name">>;

// ---------------------------------------------------------------------------
// Result wrapper
// ---------------------------------------------------------------------------

export type DbResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };
