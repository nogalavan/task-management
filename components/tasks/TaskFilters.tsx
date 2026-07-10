"use client";

import { useRef, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X, User } from "lucide-react";
import { cn } from "@/utils/cn";
import type { ProfileRow, ProjectRow } from "@/lib/supabase/types";

interface TaskFiltersProps {
  projects: ProjectRow[];
  profiles: ProfileRow[];
  currentUserId: string | null;
  totalCount: number;
  filteredCount: number;
}

export function TaskFilters({
  projects,
  profiles,
  currentUserId,
  totalCount,
  filteredCount,
}: TaskFiltersProps) {
  const router     = useRouter();
  const pathname   = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const q         = searchParams.get("q")       ?? "";
  const projectId = searchParams.get("project")  ?? "";
  const userId    = searchParams.get("user")     ?? "";

  const hasFilters = !!(q || projectId || userId);
  const isMyTasks = !!currentUserId && userId === currentUserId;

  // ---------------------------------------------------------------------------
  // URL helpers
  // ---------------------------------------------------------------------------

  function buildUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(overrides)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function push(overrides: Record<string, string>) {
    startTransition(() => {
      router.push(buildUrl(overrides), { scroll: false });
    });
  }

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function handleSearchChange(value: string) {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => push({ q: value }), 280);
  }

  function toggleMyTasks() {
    if (!currentUserId) return;
    push({ user: isMyTasks ? "" : currentUserId });
  }

  function clearAll() {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-3 mb-6">

      {/* ── Search input ── */}
      <div className="relative">
        <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          type="search"
          placeholder="חיפוש לפי כותרת, תיאור או שם פרויקט..."
          defaultValue={q}
          onChange={(e) => handleSearchChange(e.target.value)}
          dir="rtl"
          className={cn(
            "w-full rounded-xl border bg-warm py-2.5 pr-9 pl-9 text-sm text-stone-800",
            "placeholder:text-stone-400",
            "focus:outline-none focus:ring-2 focus:ring-amber/40",
            q ? "border-amber/40" : "border-amber/20"
          )}
        />
        {q && (
          <button
            onClick={() => push({ q: "" })}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
            aria-label="נקה חיפוש"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Filter row ── */}
      <div className="flex flex-wrap items-center gap-2">

        {/* My Tasks quick filter */}
        {currentUserId && (
          <button
            onClick={toggleMyTasks}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              isMyTasks
                ? "bg-amber text-white shadow-sm"
                : "bg-amber/10 text-amber-800 hover:bg-amber/20"
            )}
          >
            <User className="h-3.5 w-3.5" />
            המשימות שלי
          </button>
        )}

        {/* Project dropdown */}
        {projects.length > 0 && (
          <select
            value={projectId}
            onChange={(e) => push({ project: e.target.value })}
            dir="rtl"
            className={cn(
              "rounded-xl border px-3 py-1.5 text-xs text-stone-600 bg-warm",
              "focus:outline-none focus:ring-2 focus:ring-amber/30 cursor-pointer",
              projectId ? "border-amber/40 text-amber-800" : "border-amber/20"
            )}
            aria-label="סינון לפי פרויקט"
          >
            <option value="">כל הפרויקטים</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}

        {/* User dropdown */}
        {profiles.length > 0 && (
          <select
            value={userId}
            onChange={(e) => push({ user: e.target.value })}
            dir="rtl"
            className={cn(
              "rounded-xl border px-3 py-1.5 text-xs text-stone-600 bg-warm",
              "focus:outline-none focus:ring-2 focus:ring-amber/30 cursor-pointer",
              userId ? "border-amber/40 text-amber-800" : "border-amber/20"
            )}
            aria-label="סינון לפי משתמש"
          >
            <option value="">כל המשתמשים</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>{p.full_name ?? "משתמש"}</option>
            ))}
          </select>
        )}

        {/* Clear all */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="נקה את כל הסינונים"
          >
            <X className="h-3.5 w-3.5" />
            נקה הכל
          </button>
        )}

        {/* Results counter */}
        <span className="mr-auto text-xs text-stone-400 tabular-nums">
          {hasFilters
            ? `${filteredCount} מתוך ${totalCount} משימות`
            : `${totalCount} משימות`}
        </span>
      </div>
    </div>
  );
}
