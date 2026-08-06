import { NextRequest, NextResponse } from "next/server";
import { Client, Account, Users } from "node-appwrite";
import { SESSION_COOKIE } from "@/lib/appwrite/server";

// Login runs server-side so the session secret goes straight into an httpOnly
// cookie and is never readable by JavaScript.

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    // Two steps, and the reason matters.
    //
    // Step 1 verifies the password using a KEYLESS client — it authenticates
    // as the user, so a wrong password throws here and nothing else happens.
    //
    // Step 2 mints the session we actually store. Appwrite only populates
    // `session.secret` when the response is produced with an API key (see the
    // Session model docs: "will return an empty string unless the response is
    // returned using an API key"). A keyless createEmailPasswordSession
    // therefore returns secret === "", and setting that as the cookie value
    // produces a cookie that exists but is empty — login looks successful and
    // every subsequent request is unauthenticated, with no error anywhere.
    const publicClient = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

    const verified = await new Account(publicClient).createEmailPasswordSession(
      email,
      password,
    );

    let session = verified;

    if (!verified.secret) {
      // Mint a real session with the API key so we get a usable secret.
      const adminClient = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
        .setKey(process.env.APPWRITE_API_KEY!);

      session = await new Users(adminClient).createSession(verified.userId);

      // Drop the throwaway verification session so it doesn't linger.
      try {
        await new Users(adminClient).deleteSession(
          verified.userId,
          verified.$id,
        );
      } catch {
        /* best effort */
      }
    }

    if (!session.secret) {
      console.error(
        "Appwrite returned a session with no secret — cannot set a cookie.",
      );
      return NextResponse.json(
        {
          error:
            "Sign-in succeeded but no session could be created. Check the API key has the Users scope.",
        },
        { status: 500 },
      );
    }

    // IMPORTANT: set the cookie on the response, not via cookies().set().
    // Mutating the cookies() store inside a Route Handler doesn't reliably
    // attach Set-Cookie to the outgoing response in Next 15+, which silently
    // produces a successful login that never persists — the browser gets a
    // 200, then bounces straight back to /admin/login.
    // Work out the cookie lifetime defensively.
    //
    // `session.expire` has been an ISO-8601 string in some Appwrite versions
    // and a unix timestamp in others. Passing a unix number to `new Date()`
    // yields a date in 1970, so the browser discards the cookie the instant it
    // arrives — a successful login that never persists, with no error anywhere.
    // Parse both shapes, sanity-check the result, and fall back to a fixed
    // window rather than ever emitting an already-expired cookie.
    const ONE_YEAR = 60 * 60 * 24 * 365;
    let maxAge = ONE_YEAR;

    const raw: any = (session as any).expire;
    let expiryMs = NaN;
    if (typeof raw === "number") {
      // seconds vs milliseconds — anything below ~1e12 is seconds
      expiryMs = raw < 1e12 ? raw * 1000 : raw;
    } else if (typeof raw === "string") {
      const asDate = Date.parse(raw);
      if (!Number.isNaN(asDate)) expiryMs = asDate;
      else if (/^\d+$/.test(raw)) {
        const n = Number(raw);
        expiryMs = n < 1e12 ? n * 1000 : n;
      }
    }

    if (!Number.isNaN(expiryMs)) {
      const seconds = Math.floor((expiryMs - Date.now()) / 1000);
      if (seconds > 60) maxAge = Math.min(seconds, ONE_YEAR);
      else {
        console.warn(
          `Session expiry looked invalid (raw=${JSON.stringify(raw)}, ` +
            `computed ${seconds}s). Falling back to a 1-year cookie.`,
        );
      }
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set({
      name: SESSION_COOKIE,
      value: session.secret,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
    return res;
  } catch (e: any) {
    console.error("Login failed:", e?.code, e?.type, e?.message);

    // Only genuine credential failures get the generic message — telling an
    // attacker apart "no such user" from "wrong password" reveals which emails
    // are registered. Everything else (rate limits, blocked accounts, config
    // problems) is reported accurately, because a user staring at "invalid
    // credentials" while actually being rate-limited has no way forward.
    const type = String(e?.type ?? "");

    if (type === "user_invalid_credentials") {
      return NextResponse.json(
        { error: "Invalid credentials. Access denied." },
        { status: 401 },
      );
    }
    if (type === "general_rate_limit_exceeded") {
      return NextResponse.json(
        {
          error:
            "Too many sign-in attempts. Appwrite has temporarily rate-limited this IP — wait a few minutes and try again.",
        },
        { status: 429 },
      );
    }
    if (type === "user_blocked") {
      return NextResponse.json(
        {
          error: "This account is blocked. Enable it in the Appwrite console.",
        },
        { status: 403 },
      );
    }
    if (type === "user_session_already_exists") {
      return NextResponse.json(
        {
          error:
            "A session already exists. Clear cookies for this site and try again.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: `Sign-in failed: ${e?.message ?? "unknown error"}${type ? ` (${type})` : ""}`,
      },
      { status: 500 },
    );
  }
}
