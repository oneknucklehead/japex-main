// Transactional email — notifies the dealership when a form is submitted.
//
// Why not Appwrite Messaging: it's built for messaging your app's USERS, where
// every send targets a registered user account. Notifying a fixed address about
// an anonymous form submission doesn't fit that model, and the custom-SMTP path
// has an open bug where Gmail shows no "To" header.
//
// PROVIDER IS SWAPPABLE via EMAIL_PROVIDER. These emails go to the dealership's
// own inbox, not to customers, so deliverability matters far less than usual —
// which makes plain SMTP a perfectly good choice here.
//
//   EMAIL_PROVIDER=resend   3,000/month, 1,000/day free. Nothing to install.
//   EMAIL_PROVIDER=brevo    300/day (~9,000/month) free forever. Nothing to install.
//   EMAIL_PROVIDER=smtp     Gmail/Workspace or any SMTP host. Needs `npm i nodemailer`.
//                           Workspace allows 2,000/day, free Gmail 500/day.
//
// Env for each:
//   resend  RESEND_API_KEY
//   brevo   BREVO_API_KEY
//   smtp    SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS
//           (Gmail: smtp.gmail.com / 465 / the address / an App Password —
//            NOT the account password; App Passwords need 2FA enabled.)
//
// Always:
//   NOTIFY_TO=info@japexmotors.com.au
//   NOTIFY_FROM=website@japexmotors.com.au

const PROVIDER = (process.env.EMAIL_PROVIDER ?? "resend").toLowerCase();
const TO = process.env.NOTIFY_TO;
const FROM = process.env.NOTIFY_FROM ?? "onboarding@resend.dev";

export interface NotifyInput {
  subject: string;
  /** Ordered label/value pairs rendered as a table. */
  rows: [string, string][];
  /** Free text shown under the table. */
  body?: string;
  /** Set so "Reply" in the mail client goes to the customer, not to us. */
  replyTo?: string;
}

function renderHtml(subject: string, rows: [string, string][], body?: string) {
  const cells = rows
    .filter(([, v]) => v)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#666;font-size:13px;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#111;font-size:14px;font-weight:600;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">
    <div style="background:#CA281C;padding:16px 20px;">
      <h1 style="margin:0;color:#fff;font-size:16px;font-weight:700;">${escapeHtml(subject)}</h1>
    </div>
    <table style="width:100%;border-collapse:collapse;">${cells}</table>
    ${
      body
        ? `<div style="padding:16px 20px;color:#333;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(body)}</div>`
        : ""
    }
    <div style="padding:12px 20px;background:#fafafa;color:#999;font-size:11px;border-top:1px solid #eee;">
      Sent from japexmotors.com.au
    </div>
  </div>
</body></html>`;
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendViaResend(subject: string, html: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Japex Website <${FROM}>`,
      to: [TO],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

async function sendViaBrevo(subject: string, html: string, replyTo?: string) {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new Error("BREVO_API_KEY is not set");

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": key,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Japex Website", email: FROM },
      to: [{ email: TO }],
      subject,
      htmlContent: html,
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Brevo ${res.status}: ${await res.text()}`);
}

async function sendViaSmtp(subject: string, html: string, replyTo?: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP_HOST, SMTP_USER and SMTP_PASS must all be set");
  }

  // Resolved at RUNTIME, deliberately hidden from the bundler.
  //
  // A plain `await import("nodemailer")` doesn't work here: Next resolves every
  // import specifier statically, whether or not the branch can execute. So the
  // build fails with "Can't resolve 'nodemailer'" even when EMAIL_PROVIDER is
  // "resend" and this function is never called.
  //
  // Going through eval() means the specifier isn't a literal the compiler can
  // see, so nodemailer only has to exist if you actually switch to SMTP.
  const req = eval("require") as NodeRequire;
  let nodemailer: any;
  try {
    nodemailer = req("nodemailer");
  } catch {
    throw new Error(
      'EMAIL_PROVIDER is "smtp" but nodemailer is not installed. Run: npm install nodemailer',
    );
  }

  const port = Number(SMTP_PORT ?? 465);
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // 465 is implicit TLS; 587 upgrades via STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transport.sendMail({
    from: `Japex Website <${FROM}>`,
    to: TO,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
}

/**
 * Notify the dealership. Returns false rather than throwing — a failed
 * notification must never fail the customer's submission, because the record
 * is already safely in Appwrite either way.
 */
export async function sendNotification(input: NotifyInput): Promise<boolean> {
  if (!TO) {
    console.warn("Email notification skipped: NOTIFY_TO is not set.");
    return false;
  }

  const html = renderHtml(input.subject, input.rows, input.body);

  try {
    switch (PROVIDER) {
      case "brevo":
        await sendViaBrevo(input.subject, html, input.replyTo);
        break;
      case "smtp":
        await sendViaSmtp(input.subject, html, input.replyTo);
        break;
      case "resend":
        await sendViaResend(input.subject, html, input.replyTo);
        break;
      default:
        console.warn(`Unknown EMAIL_PROVIDER "${PROVIDER}" — no email sent.`);
        return false;
    }
    return true;
  } catch (e: any) {
    console.error(`Email notification failed (${PROVIDER}):`, e?.message);
    return false;
  }
}
