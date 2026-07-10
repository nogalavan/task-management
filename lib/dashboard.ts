/**
 * Data access layer — Dashboard aggregations.
 * Server-only. Gathers all stats needed for the dashboard in a minimal number of queries.
 */
import { createClient } from "@/lib/supabase/server";
import { getRecentActivity, type ActivityLogEntry } from "@/lib/activity";
import type { DbResult } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StatusBreakdown {
  status: "todo" | "in_progress" | "done";
  label: string;
  count: number;
  color: string;
}

export interface ProjectTaskCount {
  projectId: string;
  projectName: string;
  count: number;
}

export interface UpcomingTask {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  due_date: string;
  project_id: string;
  projectName: string;
}

export type { ActivityLogEntry };

export interface TopPerformer {
  userId: string;
  displayName: string;
  completedCount: number;
}

export interface DashboardStats {
  projectsCount: number;
  tasksCount: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  /** Structured breakdown for charts */
  statusBreakdown: StatusBreakdown[];
  /** Top projects by task count (max 6) */
  tasksByProject: ProjectTaskCount[];
  /** Tasks with a due date in the future, sorted soonest-first (max 5) */
  upcomingTasks: UpcomingTask[];
  /** 10 most recent activity log entries */
  recentActivity: ActivityLogEntry[];
  /** Top 5 users by number of completed tasks */
  topPerformers: TopPerformer[];
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  todo:        { label: "לביצוע",  color: "#a8a29e" },
  in_progress: { label: "בתהליך",  color: "#d4a373" },
  done:        { label: "הושלם",   color: "#4ade80" },
};

// ---------------------------------------------------------------------------
// Main aggregation
// ---------------------------------------------------------------------------

export async function getDashboardStats(): Promise<DbResult<DashboardStats>> {
  try {
    const supabase = await createClient();

    // Run all queries in parallel
    const [projectsRes, tasksRes, upcomingRes, recentActivity] = await Promise.all([
      supabase.from("projects").select("id, name"),
      // Include assigned_user so we can compute top performers from this one fetch
      supabase.from("tasks").select("id, status, project_id, assigned_user"),
      supabase
        .from("tasks")
        .select("id, title, status, due_date, project_id")
        .not("due_date", "is", null)
        .gte("due_date", new Date().toISOString().slice(0, 10))
        .order("due_date", { ascending: true })
        .limit(5),
      getRecentActivity(),
    ]);

    if (projectsRes.error) return { data: null, error: projectsRes.error.message };
    if (tasksRes.error)    return { data: null, error: tasksRes.error.message };

    const projects = projectsRes.data ?? [];
    const tasks    = tasksRes.data ?? [];
    const upcoming = upcomingRes.data ?? [];

    // Build a project name lookup
    const projectNameMap = Object.fromEntries(projects.map((p) => [p.id, p.name]));

    // Status counts
    const counts = { todo: 0, in_progress: 0, done: 0 };
    for (const t of tasks) {
      const s = t.status as keyof typeof counts;
      if (s in counts) counts[s]++;
    }

    const statusBreakdown: StatusBreakdown[] = (
      ["todo", "in_progress", "done"] as const
    ).map((s) => ({
      status: s,
      label:  STATUS_META[s].label,
      count:  counts[s],
      color:  STATUS_META[s].color,
    }));

    // Tasks per project
    const projectCounts: Record<string, number> = {};
    for (const t of tasks) {
      projectCounts[t.project_id] = (projectCounts[t.project_id] ?? 0) + 1;
    }

    const tasksByProject: ProjectTaskCount[] = Object.entries(projectCounts)
      .map(([pid, count]) => ({
        projectId:   pid,
        projectName: projectNameMap[pid] ?? "פרויקט לא ידוע",
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Top performers — users with most done tasks
    const performerCounts: Record<string, number> = {};
    for (const t of tasks) {
      if (t.status === "done" && t.assigned_user) {
        performerCounts[t.assigned_user] =
          (performerCounts[t.assigned_user] ?? 0) + 1;
      }
    }

    const performerIds = Object.keys(performerCounts);
    let topPerformers: TopPerformer[] = [];

    if (performerIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", performerIds);

      const nameMap = Object.fromEntries(
        (profiles ?? []).map((p) => [p.id, p.full_name ?? "משתמש"])
      );

      topPerformers = Object.entries(performerCounts)
        .map(([uid, completedCount]) => ({
          userId:        uid,
          displayName:   nameMap[uid] ?? "משתמש",
          completedCount,
        }))
        .sort((a, b) => b.completedCount - a.completedCount)
        .slice(0, 5);
    }

    // Upcoming tasks
    const upcomingTasks: UpcomingTask[] = upcoming.map((t) => ({
      id:          t.id,
      title:       t.title,
      status:      t.status as UpcomingTask["status"],
      due_date:    t.due_date!,
      project_id:  t.project_id,
      projectName: projectNameMap[t.project_id] ?? "—",
    }));

    return {
      data: {
        projectsCount: projects.length,
        tasksCount:    tasks.length,
        todoCount:     counts.todo,
        inProgressCount: counts.in_progress,
        doneCount:     counts.done,
        statusBreakdown,
        tasksByProject,
        upcomingTasks,
        recentActivity,
        topPerformers,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}
