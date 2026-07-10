import { redirect } from "next/navigation";
import { createClient } from "./server";
import type { User } from "@supabase/supabase-js";

/**
 * Returns the current authenticated user, or null.
 * Uses getClaims() which validates the JWT signature — safe for server-side checks.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

/**
 * Returns the current user or redirects to /login.
 * Use in protected Server Components / Server Actions.
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Returns the display name from user metadata, falling back to email.
 */
export function getUserDisplayName(user: User): string {
  return (
    (user.user_metadata?.full_name as string) ||
    user.email?.split("@")[0] ||
    "משתמש"
  );
}
