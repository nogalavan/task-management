import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/projects", "/tasks", "/profile", "/settings"];
const AUTH_ROUTES = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  // Start with a pass-through response — Supabase will update its cookies on this object
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write to request so Server Components see refreshed cookies
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Re-create the response so the refreshed cookies flow to the browser
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session (validates JWT, writes updated tokens if needed).
  // Must use getUser() here — getSession() is not safe for server-side auth checks.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some(
    (route) => path === route || path.startsWith(route + "/")
  );
  const isAuthRoute = AUTH_ROUTES.includes(path);

  // Unauthenticated user trying to reach a protected page → /login
  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.nextUrl);
    loginUrl.searchParams.set("from", path);
    const redirectResponse = NextResponse.redirect(loginUrl);
    // Copy Supabase cookies to the redirect response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // Already-authenticated user hitting /login or /register → /dashboard
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  // IMPORTANT: return supabaseResponse as-is so cookies are forwarded correctly
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
