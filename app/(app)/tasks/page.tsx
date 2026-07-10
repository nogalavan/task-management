import { PageHeader } from "@/components/layout/PageHeader";
import { AllTasksBoard } from "@/components/tasks/AllTasksBoard";
import { getAllTasks } from "@/lib/tasks";
import { listProfiles } from "@/lib/profiles";
import { getProjects } from "@/lib/projects";
import type { TaskWithAssignee } from "@/components/tasks/TaskCard";

export default async function TasksPage() {
  const [tasksResult, profilesResult, projectsResult] = await Promise.all([
    getAllTasks(),
    listProfiles(),
    getProjects(),
  ]);

  const profiles = profilesResult.data ?? [];
  const projects = projectsResult.data ?? [];

  // Build assignee name lookup
  const profileMap: Record<string, string> = {};
  for (const p of profiles) {
    profileMap[p.id] = p.full_name ?? "משתמש";
  }

  // Build project name lookup
  const projectMap: Record<string, string> = {};
  for (const p of projects) {
    projectMap[p.id] = p.name;
  }

  const tasks: TaskWithAssignee[] = (tasksResult.data ?? []).map((t) => ({
    ...t,
    assigneeName: t.assigned_user ? (profileMap[t.assigned_user] ?? "משתמש") : null,
    projectName: projectMap[t.project_id] ?? undefined,
  }));

  return (
    <div>
      <PageHeader
        title="משימות"
        description="כל המשימות מכלל הפרויקטים"
      />

      {tasksResult.error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          שגיאה בטעינת המשימות: {tasksResult.error}
        </div>
      ) : (
        <AllTasksBoard tasks={tasks} profiles={profiles} projects={projects} />
      )}
    </div>
  );
}
