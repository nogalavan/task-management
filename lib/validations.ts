import { z } from "zod";

// ---------------------------------------------------------------------------
// Project schemas
// ---------------------------------------------------------------------------

export const ProjectCreateSchema = z.object({
  name: z
    .string()
    .min(2, "שם הפרויקט חייב להכיל לפחות 2 תווים")
    .max(100, "שם הפרויקט ארוך מדי"),
  description: z.string().max(500, "התיאור ארוך מדי").optional().nullable(),
});

export const ProjectUpdateSchema = ProjectCreateSchema.partial();

export type ProjectCreateInput = z.infer<typeof ProjectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof ProjectUpdateSchema>;

// ---------------------------------------------------------------------------
// Task schemas
// ---------------------------------------------------------------------------

export const TaskCreateSchema = z.object({
  title: z
    .string()
    .min(2, "כותרת המשימה חייבת להכיל לפחות 2 תווים")
    .max(200, "הכותרת ארוכה מדי"),
  description: z.string().max(2000, "התיאור ארוך מדי").optional().nullable(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  project_id: z.string().uuid("מזהה פרויקט לא תקין"),
  assigned_user: z.string().uuid("מזהה משתמש לא תקין").optional().nullable(),
  due_date: z.string().optional().nullable(),
});

export const TaskUpdateSchema = TaskCreateSchema.omit({ project_id: true }).partial();

export type TaskCreateInput = z.infer<typeof TaskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof TaskUpdateSchema>;

// ---------------------------------------------------------------------------
// Profile schemas
// ---------------------------------------------------------------------------

export const ProfileUpdateSchema = z.object({
  full_name: z
    .string()
    .min(2, "שם חייב להכיל לפחות 2 תווים")
    .max(100, "השם ארוך מדי")
    .optional(),
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function parseOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const messages = result.error.issues.map((e) => e.message).join(", ");
    throw new Error(messages);
  }
  return result.data;
}
