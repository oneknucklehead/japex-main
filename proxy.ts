// MIDDLEWARE PAGE --> Changed to PROXY PAGE

import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "japex_session";

/**
 * Cheap cookie-presence check only — NOT the real auth guard.
 *
 * Middleware runs on the Edge runtime, where node-appwrite (a Node SDK) can't
 * run, so the session can't be validated here. That's fine: this exists purely
 * to bounce obvious cases without rendering a page. The actual verification
 * lives in app/admin/(protected)/layout.tsx via getLoggedInUser(), which asks
 * Appwrite whether the session is genuinely valid.
 *
 * A forged cookie gets past this and is rejected by the layout.
 *
 * This also replaces the Supabase session-refresh that used to run on every
 * request — Appwrite sessions don't need refreshing, which removes roughly a
 * second of latency per admin page load.
 */
export async function proxy(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  // No session cookie → send to login
  if (isAdminRoute && !isLoginPage && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Already has one → skip the login page
  if (isLoginPage && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
