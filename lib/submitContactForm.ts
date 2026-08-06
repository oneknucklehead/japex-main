import { ID } from "appwrite";
import { createClient, DB_ID } from "@/lib/appwrite/client";

export type ContactSource = "contact_page" | "cta";

export interface ContactFormValues {
  name: string;
  number: string;
  email: string;
  message: string;
}

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

/**
 * Shared submit path for both contact forms (the /contact page and the
 * site-wide ContactCTA). Keeping it here means validation, trimming and error
 * wording stay identical wherever the form appears.
 */
export async function submitContactForm(
  values: ContactFormValues,
  source: ContactSource,
): Promise<SubmitResult> {
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();
  const phone = values.number.trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Please fill in your name, email and message." };
  }

  // Loose check — the browser's type="email" does the strict pass. This just
  // catches obvious rubbish if validation is bypassed.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "That email address doesn't look right." };
  }

  // contact_submissions grants create to anyone (public form) but no read,
  // so this writes straight from the browser without exposing submissions.
  try {
    const { databases } = createClient();
    await databases.createDocument(DB_ID, "contact_submissions", ID.unique(), {
      name,
      phone,
      email,
      message,
      source,
      is_read: false,
    });
    return { ok: true };
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return {
      ok: false,
      error: "Something went wrong sending your message. Please try again.",
    };
  }
}
