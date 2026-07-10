/**
 * Data access layer — Activity logs.
 * Logs user actions (create task, change status, create project) and fetches them for the dashboard.
 * All functions are server-only.
 */
import { createClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ActivityAction =
  | "created_task"
  | "updated_status"
  | "deleted_task"
  | "created_project";

export interface ActivityMetadata {
  task_title?: string;
  project_name?: string;
  new_status?: string;
  old_status?: string;
}

export interface ActivityLogEntry {
  id: string;
  userId: string | null;
  userName: string;
  action: ActivityAction;
  metadata: ActivityMetadata;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  todo:        "לביצוע",
  in_progress: "בתהליך",
  done:        "הושלם",
};

/** Human-readable Hebrew description of an activity entry. */
export function describeActivity(entry: ActivityLogEntry): string {
  const { action, metadata } = entry;
  switch (action) {
    case "created_task":
      return metadata.task_title
        ? `יצר/ה משימה: "${metadata.task_title}"`
        : "יצר/ה משימה חדשה";
    case "updated_status":
      return metadata.task_title && metadata.new_status
        ? `העביר/ה "${metadata.task_title}" ל${STATUS_LABEL[metadata.new_status] ?? metadata.new_status}`
        : "עדכן/ה סטטוס משימה";
    case "deleted_task":
      return metadata.task_title
        ? `מחק/ה משימה: "${metadata.task_title}"`
        : "מחק/ה משימה";
    case "created_project":
      return metadata.project_name
        ? `יצר/ה פרויקט: "${metadata.project_name}"`
        : "יצר/ה פרויקט חדש";
    default:
      return "פעולה לא ידועה";
  }
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

/**
 * Logs an activity entry. Errors are swallowed — logging must never block the main operation.
 */
export async function logActivity(
  action: ActivityAction,
  metadata: ActivityMetadata,
  taskId?: string | null,
  projectId?: string | null
): Promise<void> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("activity_logs").insert({
      user_id:    user.id,
      action,
      task_id:    taskId ?? null,
      project_id: projectId ?? null,
      metadata,
    });
  } catch {
    // Non-blocking
  }
}

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export async function getRecentActivity(): Promise<ActivityLogEntry[]> {
  try {
    const supabase = await createClient();

    const { data: logs, error } = await supabase
      .from("activity_logs")
      .select("id, user_id, action, metadata, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error || !logs || logs.length === 0) return [];

    // Fetch display names for all unique users
    const userIds = [...new Set(logs.map((l) => l.user_id).filter(Boolean))] as string[];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);

    const nameMap = Object.fromEntries(
      (profiles ?? []).map((p) => [p.id, p.full_name ?? "משתמש"])
    );

    return logs.map((log) => ({
      id:         log.id,
      userId:     log.user_id,
      userName:   log.user_id ? (nameMap[log.user_id] ?? "משתמש") : "משתמש",
      action:     log.action as ActivityAction,
      metadata:   (log.metadata ?? {}) as ActivityMetadata,
      created_at: log.created_at,
    }));
  } catch {
    return [];
  }
}
