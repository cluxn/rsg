import nodemailer from 'nodemailer';
import { getAllSettings } from './settings.service';

export async function sendLeadNotificationEmail(lead: {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  product_interest?: string | null;
  message?: string | null;
  source_page?: string | null;
  created_at?: string;
}): Promise<boolean> {
  const settings = await getAllSettings();
  const notificationEmail = settings['notification_email'];
  if (!notificationEmail) return false;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) return false;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const subject = `New lead from ${lead.name} — ${lead.product_interest ?? 'General enquiry'}`;
  const text = `New lead submitted on RSG Profile Sheets website.

Name: ${lead.name}
Phone: ${lead.phone ?? 'Not provided'}
Email: ${lead.email ?? 'Not provided'}
Product Interest: ${lead.product_interest ?? 'Not specified'}
Source Page: ${lead.source_page ?? 'Unknown'}
Submitted At: ${lead.created_at ?? new Date().toISOString()}

Message:
${lead.message ?? '(no message)'}`;

  try {
    await transporter.sendMail({ from: SMTP_FROM, to: notificationEmail, subject, text });
    return true;
  } catch {
    return false;
  }
}
