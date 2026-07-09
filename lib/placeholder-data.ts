import type { TaskStatus, TaskPriority, ProjectStatus } from "@/types";

// ---------------------------------------------------------------------------
// Types for placeholder data (pre-database phase)
// ---------------------------------------------------------------------------

export interface PlaceholderMember {
  name: string;
}

export interface PlaceholderProject {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  color: string;
  members: PlaceholderMember[];
}

export interface PlaceholderTask {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string | null;
  dueDate: string | null;
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const PLACEHOLDER_PROJECTS: PlaceholderProject[] = [
  {
    id: "1",
    name: "עיצוב מוצר חדש",
    description: "פיתוח ממשק משתמש לאפליקציית הניהול",
    status: "active",
    color: "#d4a373",
    members: [
      { name: "ישראל ישראלי" },
      { name: "שרה כהן" },
      { name: "דוד לוי" },
    ],
  },
  {
    id: "2",
    name: "פיתוח Backend",
    description: "בניית שרת ו-API לפרויקט",
    status: "active",
    color: "#ccd5ae",
    members: [{ name: "מיכאל גרין" }, { name: "רחל כץ" }],
  },
  {
    id: "3",
    name: "קמפיין שיווק Q3",
    description: "תכנון וביצוע קמפיין שיווקי לרבעון השלישי",
    status: "completed",
    color: "#d4a373",
    members: [{ name: "נועה שמיר" }],
  },
];

// ---------------------------------------------------------------------------
// Tasks  (linked to projects via projectId)
// ---------------------------------------------------------------------------

export const PLACEHOLDER_TASKS: PlaceholderTask[] = [
  // Project 1 – עיצוב מוצר חדש
  {
    id: "t1",
    projectId: "1",
    title: "עיצוב מסך ראשי",
    status: "todo",
    priority: "high",
    assignee: "ישראל ישראלי",
    dueDate: "15 ביולי",
  },
  {
    id: "t2",
    projectId: "1",
    title: "כתיבת תיעוד API",
    status: "todo",
    priority: "medium",
    assignee: "שרה כהן",
    dueDate: "20 ביולי",
  },
  {
    id: "t3",
    projectId: "1",
    title: "בדיקות יחידה",
    status: "todo",
    priority: "low",
    assignee: null,
    dueDate: null,
  },
  {
    id: "t4",
    projectId: "1",
    title: "פיתוח מסך התחברות",
    status: "in_progress",
    priority: "urgent",
    assignee: "דוד לוי",
    dueDate: "12 ביולי",
  },
  {
    id: "t5",
    projectId: "1",
    title: "הגדרת פרויקט",
    status: "done",
    priority: "medium",
    assignee: "ישראל ישראלי",
    dueDate: "1 ביולי",
  },
  {
    id: "t6",
    projectId: "1",
    title: "עיצוב מערכת צבעים",
    status: "done",
    priority: "low",
    assignee: "שרה כהן",
    dueDate: "5 ביולי",
  },

  // Project 2 – פיתוח Backend
  {
    id: "t7",
    projectId: "2",
    title: "אינטגרציה עם MongoDB",
    status: "in_progress",
    priority: "high",
    assignee: "מיכאל גרין",
    dueDate: "14 ביולי",
  },
  {
    id: "t8",
    projectId: "2",
    title: "הגדרת משתני סביבה",
    status: "done",
    priority: "medium",
    assignee: "רחל כץ",
    dueDate: "8 ביולי",
  },
  {
    id: "t9",
    projectId: "2",
    title: "כתיבת בדיקות לנתיבי API",
    status: "todo",
    priority: "high",
    assignee: "מיכאל גרין",
    dueDate: "22 ביולי",
  },

  // Project 3 – קמפיין שיווק Q3
  {
    id: "t10",
    projectId: "3",
    title: "תכנון תוכן קמפיין",
    status: "done",
    priority: "high",
    assignee: "נועה שמיר",
    dueDate: "1 יוני",
  },
  {
    id: "t11",
    projectId: "3",
    title: "עיצוב חומרי קמפיין",
    status: "done",
    priority: "medium",
    assignee: "נועה שמיר",
    dueDate: "10 יוני",
  },
  {
    id: "t12",
    projectId: "3",
    title: "השקת הקמפיין",
    status: "done",
    priority: "urgent",
    assignee: "נועה שמיר",
    dueDate: "1 יולי",
  },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

export function getProjectById(id: string): PlaceholderProject | undefined {
  return PLACEHOLDER_PROJECTS.find((p) => p.id === id);
}

export function getTasksByProjectId(projectId: string): PlaceholderTask[] {
  return PLACEHOLDER_TASKS.filter((t) => t.projectId === projectId);
}

export function getProjectTaskCounts(projectId: string) {
  const tasks = getTasksByProjectId(projectId);
  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "done").length,
  };
}

export const KANBAN_COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: "todo", label: "לביצוע" },
  { id: "in_progress", label: "בתהליך" },
  { id: "done", label: "הושלם" },
];
