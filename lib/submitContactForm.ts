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

  // Posted to /api/forms so the submission is stored AND emailed to the
  // dealership in one request.
  try {
    const res = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "contact",
        name,
        phone,
        email,
        message,
        source,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        ok: false,
        error:
          data.error ??
          "Something went wrong sending your message. Please try again.",
      };
    }
    return { ok: true };
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return {
      ok: false,
      error: "Something went wrong sending your message. Please try again.",
    };
  }
}
