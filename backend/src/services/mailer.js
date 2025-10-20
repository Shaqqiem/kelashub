const nodemailer = require('nodemailer');

function createTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    } : undefined
  });
}

async function sendMail({ to, subject, html }) {
  const tr = createTransport();
  if (!tr) return;
  await tr.sendMail({
    from: process.env.SMTP_FROM || 'KelasHub <noreply@example.com>',
    to, subject, html
  });
}

module.exports = { sendMail };
