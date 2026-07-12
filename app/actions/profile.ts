"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateCurrentProfile } from "@/lib/profiles";

export type ActionResult = { error: string | null };

export async function updateNameAction(fullName: string): Promise<ActionResult> {
  const name = fullName.trim();
  if (name.length < 2) return { error: "השם חייב להכיל לפחות 2 תווים" };
  if (name.length > 100) return { error: "השם ארוך מדי" };

  const result = await updateCurrentProfile({ full_name: name });
  if (result.error) return { error: result.error };

  // Also sync the Supabase auth user_metadata so the navbar shows the new name
  const supabase = await createClient();
  await supabase.auth.updateUser({ data: { full_name: name } });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function updatePasswordAction(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<ActionResult> {
  if (!currentPassword) return { error: "יש להזין את הסיסמה הנוכחית" };
  if (newPassword.length < 8) return { error: "הסיסמה החדשה חייבת להכיל לפחות 8 תווים" };
  if (newPassword !== confirmPassword) return { error: "הסיסמאות אינן תואמות" };

  const supabase = await createClient();

  // Verify current password by attempting a sign-in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { error: "לא מחובר" };

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (signInError) return { error: "הסיסמה הנוכחית שגויה" };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: "שגיאה בעדכון הסיסמה. נסה שוב." };

  return { error: null };
}
