import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { getProjectByIdWithDetails } = await import("@/lib/projects");
  const { data } = await getProjectByIdWithDetails(id);
  return { title: data ? `${data.name} | פרויקטים` : "פרויקט" };
}
import { ArrowRight, CheckSquare, Calendar, User } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { getProjectByIdWithDetails } from "@/lib/projects";
import { getTasksByProject } from "@/lib/tasks";
import { listProfiles } from "@/lib/profiles";
import type { TaskWithAssignee } from "@/components/tasks/TaskCard";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;

  // Parallel fetches
  const [projectResult, tasksResult, profilesResult] = await Promise.all([
    getProjectByIdWithDetails(id),
    getTasksByProject(id),
    listProfiles(),
  ]);

  if (projectResult.error || !projectResult.data) {
    notFound();
  }

  const project = projectResult.data;
  const profiles = profilesResult.data ?? [];

  // Build a lookup map for assignee names
  const profileMap: Record<string, string> = {};
  for (const p of profiles) {
    profileMap[p.id] = p.full_name ?? "משתמש";
  }

  // Enrich tasks with assignee names
  const tasks: TaskWithAssignee[] = (tasksResult.data ?? []).map((t) => ({
    ...t,
    assigneeName: t.assigned_user ? (profileMap[t.assigned_user] ?? "משתמש") : null,
  }));

  return (
    <div>
      {/* Breadcrumb */}
      <nav
        aria-label="מיקום נוכחי"
        className="flex items-center gap-2 text-sm text-stone-500 mb-4"
      >
        <Link
          href="/projects"
          className="hover:text-amber transition-colors flex items-center gap-1"
        >
          <ArrowRight className="h-4 w-4" />
          פרויקטים
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-stone-700 font-medium">{project.name}</span>
      </nav>

      {/* Page header */}
      <PageHeader
        title={project.name}
        description={project.description ?? undefined}
      />

      {/* Meta strip */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-1.5 text-sm text-stone-500">
          <CheckSquare className="h-4 w-4 text-stone-400" />
          <span>
            {tasks.length === 0 ? "אין משימות" : `${tasks.length} משימות`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-stone-500">
          <User className="h-4 w-4 text-stone-400" />
          <span>נוצר על ידי {project.creatorName}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-stone-500">
          <Calendar className="h-4 w-4 text-stone-400" />
          <span>{formatDate(project.created_at)}</span>
        </div>
      </div>

      {/* Task board */}
      {tasksResult.error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          שגיאה בטעינת המשימות: {tasksResult.error}
        </div>
      ) : (
        <TaskBoard
          projectId={id}
          tasks={tasks}
          profiles={profiles}
        />
      )}
    </div>
  );
}
