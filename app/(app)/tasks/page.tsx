import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AllTasksBoard } from "@/components/tasks/AllTasksBoard";
import { getAllTasks } from "@/lib/tasks";
import { listProfiles } from "@/lib/profiles";
import { getProjects } from "@/lib/projects";
import { createClient } from "@/lib/supabase/server";
import type { TaskWithAssignee } from "@/components/tasks/TaskCard";

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [tasksResult, profilesResult, projectsResult] = await Promise.all([
    getAllTasks(),
    listProfiles(),
    getProjects(),
  ]);

  const profiles = profilesResult.data ?? [];
  const projects = projectsResult.data ?? [];

  const profileMap: Record<string, string> = {};
  for (const p of profiles) profileMap[p.id] = p.full_name ?? "משתמש";

  const projectMap: Record<string, string> = {};
  for (const p of projects) projectMap[p.id] = p.name;

  const tasks: TaskWithAssignee[] = (tasksResult.data ?? []).map((t) => ({
    ...t,
    assigneeName: t.assigned_user ? (profileMap[t.assigned_user] ?? "משתמש") : null,
    projectName:  projectMap[t.project_id] ?? undefined,
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
        // Suspense is required because AllTasksBoard uses useSearchParams
        <Suspense fallback={
          <div className="animate-pulse flex flex-col gap-3">
            <div className="h-10 rounded-xl bg-amber/10 w-full" />
            <div className="h-8 rounded-xl bg-amber/10 w-2/3" />
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[1,2,3].map(i => <div key={i} className="h-64 rounded-2xl bg-amber/10" />)}
            </div>
          </div>
        }>
          <AllTasksBoard
            tasks={tasks}
            profiles={profiles}
            projects={projects}
            currentUserId={user?.id ?? null}
          />
        </Suspense>
      )}
    </div>
  );
}
