import { NextResponse } from "next/server";
import { getLoggedInUser } from "./server";

/**
 * Route guard. Call at the top of every /api/admin/* handler.
 *
 * These routes use the Appwrite API key, which bypasses all permissions — so
 * without this check anyone who knows the URL could create, edit or delete
 * cars, upload files, or read enquiries. The key's power is exactly why the
 * session must be verified first.
 *
 * Usage:
 *   const denied = await requireAdmin();
 *   if (denied) return denied;
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const user = await getLoggedInUser();
  if (!user) {
    return NextResponse.json(
      { error: "Not authorised. Please sign in again." },
      { status: 401 },
    );
  }
  return null;
}
