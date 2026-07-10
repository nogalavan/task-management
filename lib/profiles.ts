/**
 * Data access layer — Profiles.
 * All functions are server-only (use in Server Components / Server Actions).
 */
import { createClient } from "@/lib/supabase/server";
import { ProfileUpdateSchema } from "@/lib/validations";
import type { ProfileRow, DbResult } from "@/lib/supabase/types";
import type { ProfileUpdateInput } from "@/lib/validations";

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/** Returns the profile of the currently authenticated user. */
export async function getCurrentProfile(): Promise<DbResult<ProfileRow>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { data: null, error: "לא מחובר" };

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

/** Returns a single profile by user id. */
export async function getProfileById(id: string): Promise<DbResult<ProfileRow>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

/** Returns all profiles (admin use). */
export async function listProfiles(): Promise<DbResult<ProfileRow[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("full_name", { ascending: true });

    if (error) return { data: null, error: error.message };
    return { data: data ?? [], error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

/** Updates the current user's profile. */
export async function updateCurrentProfile(
  input: ProfileUpdateInput
): Promise<DbResult<ProfileRow>> {
  try {
    const validated = ProfileUpdateSchema.parse(input);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { data: null, error: "לא מחובר" };

    const { data, error } = await supabase
      .from("profiles")
      .update({ ...validated, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}
