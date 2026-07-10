"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string>;
} | null;

// ---------------------------------------------------------------------------
// signup
// ---------------------------------------------------------------------------

export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const fullName = (formData.get("full_name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  // Validation
  const fieldErrors: Record<string, string> = {};
  if (!fullName || fullName.length < 2) fieldErrors.full_name = "שם חייב להכיל לפחות 2 תווים";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "כתובת אימייל אינה תקינה";
  if (!password || password.length < 6) fieldErrors.password = "הסיסמה חייבת להכיל לפחות 6 תווים";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const supabase = await createClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("already exists")) {
      return { fieldErrors: { email: "כתובת אימייל זו כבר רשומה במערכת" } };
    }
    return { error: "אירעה שגיאה בהרשמה. נסה שוב." };
  }

  redirect("/dashboard");
}

// ---------------------------------------------------------------------------
// login
// ---------------------------------------------------------------------------

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  const fieldErrors: Record<string, string> = {};
  if (!email) fieldErrors.email = "נא להזין אימייל";
  if (!password) fieldErrors.password = "נא להזין סיסמה";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { error: "האימייל שלך טרם אומת. בדוק את תיבת הדואר שלך ולחץ על קישור האימות." };
    }
    return { error: "כתובת האימייל או הסיסמה שגויים" };
  }

  redirect("/dashboard");
}

// ---------------------------------------------------------------------------
// logout
// ---------------------------------------------------------------------------

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
