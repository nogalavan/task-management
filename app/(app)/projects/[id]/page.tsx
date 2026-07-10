import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CheckSquare,
  Calendar,
  User,
  Layers,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { getProjectByIdWithDetails } from "@/lib/projects";

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

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;

  const { data: project, error } = await getProjectByIdWithDetails(id);

  if (error || !project) {
    notFound();
  }

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
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex items-center gap-1.5 text-sm text-stone-500">
          <CheckSquare className="h-4 w-4 text-stone-400" />
          <span>
            {project.taskCount === 0
              ? "אין משימות"
              : `${project.taskCount} משימות`}
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

      {/* Project info card */}
      <div className="rounded-2xl bg-warm border border-amber/15 p-6 mb-8 shadow-[0_2px_12px_0_rgba(212,163,115,0.08)]">
        <h2 className="text-sm font-semibold text-stone-600 mb-4">פרטי פרויקט</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <dt className="text-xs text-stone-400 mb-1">נוצר על ידי</dt>
            <dd className="text-sm font-medium text-stone-700">
              {project.creatorName}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-stone-400 mb-1">תאריך יצירה</dt>
            <dd className="text-sm font-medium text-stone-700">
              {formatDate(project.created_at)}
            </dd>
          </div>
          {project.description && (
            <div className="sm:col-span-2">
              <dt className="text-xs text-stone-400 mb-1">תיאור</dt>
              <dd className="text-sm text-stone-700 leading-relaxed">
                {project.description}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Kanban board placeholder */}
      <div className="rounded-2xl border-2 border-dashed border-amber/30 bg-warm/40 p-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-light">
          <Layers className="h-7 w-7 text-amber" />
        </div>
        <h3 className="text-base font-semibold text-stone-700 mb-1">
          לוח הקאנבן
        </h3>
        <p className="text-sm text-stone-500">
          לוח המשימות יוצג כאן בשלב הבא
        </p>
      </div>
    </div>
  );
}
