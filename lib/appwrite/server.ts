import { Client, Databases, Storage, Account } from "node-appwrite";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "japex_session";

export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "japex";
export const BUCKET_ID = "car-images";

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

/**
 * API-key client — bypasses all collection/document permissions.
 * Equivalent to Supabase's service-role client.
 *
 * Use for admin reads/writes AFTER the caller's session has been verified.
 * Never expose a route using this without requireAdmin() in front of it.
 */
export function createAdminClient() {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY!);

  return {
    client,
    databases: new Databases(client),
    storage: new Storage(client),
    account: new Account(client),
  };
}

/**
 * Session-scoped client, built from the httpOnly cookie.
 *
 * Appwrite sessions work differently from Supabase's: instead of a JWT that
 * middleware refreshes, `createEmailPasswordSession` returns a session whose
 * `secret` is attached with `.setSession()`. There's no refresh dance — the
 * session is valid until it expires or is deleted.
 *
 * Returns null when there's no session cookie at all, so callers can redirect
 * without paying for a network round trip.
 */
export async function createSessionClient() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (!session) return null;

  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setSession(session);

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
  };
}

/**
 * Returns the logged-in user, or null.
 * A cookie that no longer resolves (expired, revoked, tampered) counts as null.
 */
export async function getLoggedInUser() {
  try {
    const session = await createSessionClient();
    if (!session) return null;
    return await session.account.get();
  } catch {
    return null;
  }
}
