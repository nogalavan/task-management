export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type ProjectStatus = "active" | "archived" | "completed";
export type UserRole = "admin" | "member" | "viewer";

export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  color?: string;
  owner: string | User;
  members: Array<string | User>;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  project: string | Project;
  assignee?: string | User;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface StatCard {
  label: string;
  value: number | string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
}

export interface KanbanColumn {
  id: TaskStatus;
  label: string;
  tasks: Task[];
}
