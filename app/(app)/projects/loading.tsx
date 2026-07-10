import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectCardSkeleton } from "@/components/projects/ProjectCardSkeleton";

export default function ProjectsLoading() {
  return (
    <div>
      <PageHeader
        title="פרויקטים"
        description="כל הפרויקטים של הארגון במקום אחד"
      />
      <div className="flex items-center justify-end mb-6">
        <div className="h-10 w-32 rounded-xl bg-stone-200 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
