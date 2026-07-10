import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Supabase redirects here after email confirmation / OAuth / magic link.
 * We exchange the one-time `code` for a real session, then send the user on.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // If Supabase returned an error (e.g. expired link), show it on the login page
  if (error) {
    const loginUrl = new URL("/login", origin);
    if (errorDescription?.toLowerCase().includes("expired")) {
      loginUrl.searchParams.set(
        "message",
        "קישור האימות פג תוקף. נסה להתחבר שוב ואנחנו נשלח קישור חדש."
      );
    } else {
      loginUrl.searchParams.set("message", "הקישור אינו תקין. נסה שוב.");
    }
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      const loginUrl = new URL("/login", origin);
      loginUrl.searchParams.set("message", "האימות נכשל. נסה להתחבר שוב.");
      return NextResponse.redirect(loginUrl);
    }

    // Successfully confirmed — go to dashboard
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  // No code and no error — just send to login
  return NextResponse.redirect(new URL("/login", origin));
}
