import nodemailer from 'nodemailer';

function response(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export default async function handler(request) {
  if (request.method !== 'POST') return response(405, { error: 'Yalnız POST sorğusu dəstəklənir.' });

  const smtpUser = process.env.BREVO_SMTP_USER;
  const smtpPassword = process.env.BREVO_SMTP_PASSWORD;
  const from = process.env.BREVO_SMTP_FROM || smtpUser;
  if (!smtpUser || !smtpPassword || !from) return response(500, { error: 'Email serveri konfiqurasiya edilməyib.' });

  try {
    const input = await request.json();
    const recipients = Array.isArray(input.to) ? input.to : [input.to];
    if (!recipients.length || recipients.some((email) => typeof email !== 'string' || !email.includes('@'))) {
      return response(400, { error: 'Email alıcısı düzgün deyil.' });
    }
    if (!input.subject || !input.text) return response(400, { error: 'Email mövzusu və mətni tələb olunur.' });

    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
      port: Number(process.env.BREVO_SMTP_PORT || 587),
      secure: false,
      auth: { user: smtpUser, pass: smtpPassword },
    });
    await transporter.sendMail({
      from: process.env.BREVO_SENDER_NAME ? { name: process.env.BREVO_SENDER_NAME, address: from } : from,
      to: recipients,
      subject: input.subject,
      text: input.text,
      html: input.html || undefined,
    });
    return response(200, { ok: true });
  } catch (error) {
    console.error('Email göndərilmə xətası:', error);
    return response(502, { error: 'Email göndərilə bilmədi.' });
  }
}
