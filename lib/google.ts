import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email using Google SMTP
 * @param to recipient email
 * @param subject email subject
 * @param html email body (HTML)
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  await resend.emails.send({
    from:
      (process.env.NEXT_PUBLIC_VERIFICATION_EMAIL_FROM as string) ||
      "onboarding!@resend.dev",
    to,
    subject,
    html,
  });
  return;
}
