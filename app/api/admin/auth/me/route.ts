import { NextRequest, NextResponse } from "next/server";
import { getLoggedInUser, SESSION_COOKIE } from "@/lib/appwrite/server";

// Auth diagnostic. Visit /api/admin/auth/me in the browser.
//
// Tells you three things independently:
//   1. did the browser send the session cookie at all?
//   2. does Appwrite still consider that session valid?
//   3. who does it resolve to?
//
// Deliberately unguarded — it reveals nothing an unauthenticated caller
// doesn't already know about their own request, and gating it behind the
// guard would make it useless for diagnosing the guard.

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE);
  const allCookies = req.cookies.getAll().map((c) => c.name);

  const user = await getLoggedInUser();

  return NextResponse.json({
    cookieName: SESSION_COOKIE,
    cookiePresent: Boolean(cookie?.value),
    cookieLength: cookie?.value?.length ?? 0,
    allCookieNames: allCookies,
    sessionValid: Boolean(user),
    user: user ? { id: user.$id, email: user.email, name: user.name } : null,
    hint: !cookie?.value
      ? "No session cookie was sent. Either login didn't set it, or the browser rejected it (check the expiry date on the Set-Cookie header)."
      : !user
        ? "Cookie present but Appwrite rejected the session — it may be expired or deleted."
        : "All good.",
  });
}
