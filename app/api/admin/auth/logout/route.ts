import { NextResponse } from "next/server";
import { createSessionClient, SESSION_COOKIE } from "@/lib/appwrite/server";

export async function POST() {
  // Delete the session server-side so it can't be replayed, then clear the
  // cookie. If the server call fails (already expired, network) the cookie is
  // still cleared — the user must end up logged out either way.
  try {
    const session = await createSessionClient();
    if (session) await session.account.deleteSession("current");
  } catch (e: any) {
    console.error(
      "Session delete failed (clearing cookie anyway):",
      e?.message,
    );
  }

  // Cleared on the response for the same reason login sets it there.
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
