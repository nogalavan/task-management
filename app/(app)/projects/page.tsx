import type { Metadata } from "next";

export const metadata: Metadata = { title: "פרויקטים" };
import { ProjectsClient } from "@/components/projects/ProjectsClient";
import { getProjectsWithDetails } from "@/lib/projects";

export default async function ProjectsPage() {
  const { data: projects, error } = await getProjectsWithDetails();

  return (
    <div>
      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          שגיאה בטעינת הפרויקטים: {error}
        </div>
      ) : (
        <ProjectsClient projects={projects ?? []} />
      )}
    </div>
  );
}
