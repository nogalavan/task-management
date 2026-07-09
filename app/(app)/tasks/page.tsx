import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { KanbanBoard } from "@/components/ui/KanbanBoard";
import {
  PLACEHOLDER_TASKS,
  PLACEHOLDER_PROJECTS,
} from "@/lib/placeholder-data";

/** Build a projectId → name lookup so task cards can show the project name */
const projectNameMap = Object.fromEntries(
  PLACEHOLDER_PROJECTS.map((p) => [p.id, p.name])
);

export default function TasksPage() {
  return (
    <div>
      <PageHeader
        title="משימות"
        description="כל המשימות שלך מקובצות לפי סטטוס"
        actions={
          <Button variant="primary">
            <Plus className="h-4 w-4" />
            משימה חדשה
          </Button>
        }
      />

      {/* Filter strip */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Button variant="secondary" size="sm">
          הכל
        </Button>
        <Button variant="ghost" size="sm">
          המשימות שלי
        </Button>
        <div className="h-4 w-px bg-amber/30 mx-1" aria-hidden="true" />
        {PLACEHOLDER_PROJECTS.map((p) => (
          <Button key={p.id} variant="ghost" size="sm">
            {p.name}
          </Button>
        ))}
      </div>

      {/* Kanban board — all tasks across all projects, grouped by status */}
      <KanbanBoard
        tasks={PLACEHOLDER_TASKS}
        showProject
        getProjectName={(projectId) =>
          projectNameMap[projectId] ?? "פרויקט לא ידוע"
        }
      />
    </div>
  );
}
