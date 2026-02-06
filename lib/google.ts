import nodemailer from "nodemailer";

// Configure Google SMTP transporter
// export const googleSmtpTransporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GOOGLE_SMTP_USER,
//     pass: process.env.GOOGLE_SMTP_PASS,
//   },
// });

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
  // return googleSmtpTransporter.sendMail({
  //   from: process.env.GOOGLE_SMTP_USER,
  //   to,
  //   subject,
  //   html,
  // });
  return;
}
