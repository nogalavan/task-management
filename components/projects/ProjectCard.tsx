"use client";

import Link from "next/link";
import { FolderKanban, CheckSquare, Pencil, Trash2, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import type { ProjectWithDetails } from "@/lib/projects";

const PROJECT_COLORS = [
  "#d4a373", "#ccd5ae", "#a2d2ff", "#bde0fe", "#ffafcc",
  "#c77dff", "#80b918", "#f4a261",
];

function colorForId(id: string): string {
  const idx = id.charCodeAt(0) % PROJECT_COLORS.length;
  return PROJECT_COLORS[idx];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface ProjectCardProps {
  project: ProjectWithDetails;
  onEdit: (project: ProjectWithDetails) => void;
  onDelete: (project: ProjectWithDetails) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const color = colorForId(project.id);

  return (
    <div className="group relative rounded-2xl bg-warm border border-amber/15 shadow-[0_2px_12px_0_rgba(212,163,115,0.08)] transition-all duration-200 hover:shadow-[0_4px_20px_0_rgba(212,163,115,0.18)] hover:-translate-y-0.5">
      {/* Action buttons — visible on hover */}
      <div className="absolute top-3 left-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.preventDefault(); onEdit(project); }}
          aria-label={`ערוך פרויקט: ${project.name}`}
          title="עריכה"
          className="h-7 w-7 p-0 bg-white/80 backdrop-blur-sm border border-amber/20 hover:bg-amber/10"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => { e.preventDefault(); onDelete(project); }}
          aria-label={`מחק פרויקט: ${project.name}`}
          title="מחיקה"
          className="h-7 w-7 p-0 bg-white/80 backdrop-blur-sm border border-red-200 text-red-500 hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Card is fully clickable via Link */}
      <Link
        href={`/projects/${project.id}`}
        className={cn(
          "block p-5 rounded-2xl h-full",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
        )}
        aria-label={`פתח פרויקט: ${project.name}`}
      >
        {/* Header: icon */}
        <div className="flex items-start justify-between mb-3">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: color + "33" }}
          >
            <FolderKanban className="h-5 w-5" style={{ color }} />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-stone-800 text-sm leading-snug mb-1.5 line-clamp-2">
          {project.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-stone-500 mb-4 leading-relaxed line-clamp-2 min-h-[2rem]">
          {project.description ?? "אין תיאור"}
        </p>

        {/* Meta */}
        <div className="flex flex-col gap-1.5 text-xs text-stone-400 mb-4">
          <div className="flex items-center gap-1.5">
            <CheckSquare className="h-3.5 w-3.5 flex-shrink-0" />
            <span>
              {project.taskCount === 0
                ? "אין משימות"
                : `${project.taskCount} משימות`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">נוצר על ידי {project.creatorName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{formatDate(project.created_at)}</span>
          </div>
        </div>

        {/* Divider color strip */}
        <div
          className="h-1 w-full rounded-full opacity-60"
          style={{ backgroundColor: color }}
        />
      </Link>
    </div>
  );
}
