import { NextRequest, NextResponse } from "next/server";

function isValidEmail(email: string): boolean {
  return /.+@.+\..+/.test(email);
}

async function maybeSendEmail({ name, email, subject, message }: { name: string; email: string; subject: string; message: string }) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO || process.env.SMTP_TO;

  if (!host || !port || !user || !pass || !to) return false;

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
    await transporter.sendMail({
      from: `Portfolio Contact <${user}>`,
      to,
      replyTo: email,
      subject: subject || `New message from ${name}`,
      text: `${name} <${email}>,\n\n${message}`,
    });
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  let data: Record<string, unknown> = {};

  if (contentType.includes("application/json")) {
    data = await req.json();
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await req.formData();
    data = Object.fromEntries(form.entries());
  } else if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    data = Object.fromEntries(form.entries());
  }

  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const subject = String(data.subject || "").trim();
  const message = String(data.message || "").trim();

  if (!name || !email || !message || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid input" }, { status: 400 });
  }

  const sent = await maybeSendEmail({ name, email, subject, message });
  if (!sent) {
    console.log("Contact form submission (email not configured)", { name, email, subject, message });
  }
  return NextResponse.json({ ok: true, sent });
}


