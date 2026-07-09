import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowRight, MoreHorizontal, Users, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import { PageHeader } from "@/components/layout/PageHeader";
import { KanbanBoard } from "@/components/ui/KanbanBoard";
import {
  getProjectById,
  getTasksByProjectId,
  getProjectTaskCounts,
} from "@/lib/placeholder-data";

const statusBadgeVariant = {
  active: "success" as const,
  archived: "outline" as const,
  completed: "info" as const,
};

const statusLabel = {
  active: "פעיל",
  archived: "בארכיון",
  completed: "הושלם",
};

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;

  const project = getProjectById(id);

  // Show 404 page if project ID is not found
  if (!project) {
    notFound();
  }

  const tasks = getTasksByProjectId(id);
  const { total, completed } = getProjectTaskCounts(id);
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

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
        description={project.description}
        actions={
          <>
            <Button variant="outline" size="md">
              <MoreHorizontal className="h-4 w-4" />
              אפשרויות
            </Button>
            <Button variant="primary" size="md">
              <Plus className="h-4 w-4" />
              משימה חדשה
            </Button>
          </>
        }
      />

      {/* Project meta strip */}
      <div className="flex flex-wrap items-center gap-6 mb-8 px-1">
        {/* Status badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">סטטוס:</span>
          <Badge
            variant={
              statusBadgeVariant[
                project.status as keyof typeof statusBadgeVariant
              ]
            }
          >
            {statusLabel[project.status as keyof typeof statusLabel]}
          </Badge>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-stone-400" />
          <span className="text-xs text-stone-500">
            {completed} מתוך {total} משימות הושלמו
          </span>
          <div className="w-24 h-1.5 rounded-full bg-sage-light overflow-hidden">
            <div
              className="h-full rounded-full bg-amber transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs font-medium text-stone-600">{progress}%</span>
        </div>

        {/* Members */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-stone-400" />
          <span className="text-xs text-stone-500">חברי צוות:</span>
          <AvatarGroup users={project.members} max={4} size="xs" />
          {project.members.slice(0, 4).map((m) => (
            <Avatar key={m.name} name={m.name} size="xs" className="hidden" />
          ))}
        </div>
      </div>

      {/* Kanban board — tasks grouped by status */}
      <KanbanBoard tasks={tasks} />
    </div>
  );
}
