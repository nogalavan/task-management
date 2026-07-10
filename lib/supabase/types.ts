/**
 * Database row types — mirror the exact columns in your Supabase tables.
 * Keep these in sync with your schema (or regenerate via `supabase gen types`).
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type ProjectStatus = "active" | "archived" | "completed";
export type UserRole = "admin" | "member" | "viewer";

// ---------------------------------------------------------------------------
// Row types (what Supabase returns from SELECT *)
// ---------------------------------------------------------------------------

export interface ProfileRow {
  id: string;           // uuid — matches auth.users.id
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface ProjectRow {
  id: string;           // uuid
  name: string;
  description: string | null;
  status: ProjectStatus;
  color: string | null;
  owner_id: string;     // uuid → profiles.id
  created_at: string;
  updated_at: string;
}

export interface TaskRow {
  id: string;           // uuid
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: string;   // uuid → projects.id
  assignee_id: string | null; // uuid → profiles.id
  due_date: string | null;    // ISO date string
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Insert types (omit server-generated fields)
// ---------------------------------------------------------------------------

export type ProjectInsert = Omit<ProjectRow, "id" | "created_at" | "updated_at">;
export type ProjectUpdate = Partial<Omit<ProjectRow, "id" | "owner_id" | "created_at" | "updated_at">>;

export type TaskInsert = Omit<TaskRow, "id" | "created_at" | "updated_at">;
export type TaskUpdate = Partial<Omit<TaskRow, "id" | "project_id" | "created_at" | "updated_at">>;

export type ProfileUpdate = Partial<Pick<ProfileRow, "full_name" | "avatar_url" | "role">>;

// ---------------------------------------------------------------------------
// Result wrapper — all DAL functions return this
// ---------------------------------------------------------------------------

export type DbResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };
