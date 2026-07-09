import Link from "next/link";
import { Plus, FolderKanban, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AvatarGroup } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  PLACEHOLDER_PROJECTS,
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

export default function ProjectsPage() {
  return (
    <div>
      <PageHeader
        title="פרויקטים"
        description="נהל את כל הפרויקטים שלך במקום אחד"
        actions={
          <Button variant="primary">
            <Plus className="h-4 w-4" />
            פרויקט חדש
          </Button>
        }
      />

      {/* Filters bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            הכל
          </Button>
          <Button variant="ghost" size="sm">
            פעילים
          </Button>
          <Button variant="ghost" size="sm">
            הושלמו
          </Button>
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
          <input
            type="search"
            placeholder="חיפוש פרויקט..."
            className="w-full h-9 rounded-xl border border-amber/30 bg-cream pr-10 pl-4 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber/30 focus:border-amber/50 transition-all"
          />
        </div>
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {PLACEHOLDER_PROJECTS.map((project) => {
          const { total, completed } = getProjectTaskCounts(project.id);
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
              aria-label={`פתח פרויקט: ${project.name}`}
            >
              <Card hover padding="md" className="h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: project.color + "33" }}
                    >
                      <FolderKanban
                        className="h-5 w-5"
                        style={{ color: project.color }}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-stone-800 text-sm leading-snug">
                        {project.name}
                      </h3>
                    </div>
                  </div>
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

                <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-stone-500">התקדמות</span>
                    <span className="text-xs font-medium text-stone-700">
                      {completed}/{total} משימות
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-sage-light overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <AvatarGroup users={project.members} max={3} size="xs" />
                  <span className="text-xs text-stone-400">{progress}%</span>
                </div>
              </Card>
            </Link>
          );
        })}

        {/* Add project card */}
        <button className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-amber/30 p-8 text-center transition-all duration-200 hover:border-amber/60 hover:bg-warm/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-light group-hover:bg-amber/10 transition-colors">
            <Plus className="h-6 w-6 text-amber" />
          </div>
          <p className="text-sm font-medium text-stone-500 group-hover:text-amber transition-colors">
            הוסף פרויקט חדש
          </p>
        </button>
      </div>

      {/* Empty state — shown when list is empty */}
      {PLACEHOLDER_PROJECTS.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="אין פרויקטים עדיין"
          description="צור את הפרויקט הראשון שלך והתחל לנהל משימות בצורה יעילה"
          actionLabel="צור פרויקט"
        />
      )}
    </div>
  );
}
