import Link from "next/link";
import { FolderKanban, ArrowRight } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-sage-light">
        <FolderKanban className="h-10 w-10 text-amber" />
      </div>
      <h1 className="text-2xl font-bold text-stone-800 mb-2">
        הפרויקט לא נמצא
      </h1>
      <p className="text-sm text-stone-500 mb-8 max-w-xs leading-relaxed">
        הפרויקט שחיפשת אינו קיים או שאין לך הרשאה לצפות בו.
      </p>
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-amber text-white text-sm font-medium hover:bg-amber/90 transition-all shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber"
      >
        <ArrowRight className="h-4 w-4" />
        חזרה לפרויקטים
      </Link>
    </div>
  );
}
