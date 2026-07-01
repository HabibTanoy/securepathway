// SecurePathway Email Service — nodemailer with SMTP
// Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM in .env
// Compatible with: Postmark, Mailgun, SendGrid, AWS SES, Gmail, any SMTP

const nodemailer = require('nodemailer');

const FROM = process.env.EMAIL_FROM || 'SecurePathway <noreply@securepathway.io>';

function createTransport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function send({ to, subject, html, text }) {
  const transport = createTransport();
  if (!transport) {
    // Dev mode — log only
    console.log(`[EMAIL DEV] To: ${to} | Subject: ${subject}`);
    return { ok: true, dev: true };
  }
  try {
    const info = await transport.sendMail({ from: FROM, to, subject, html, text });
    console.log(`[EMAIL SENT] ${info.messageId}`);
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    console.error('[EMAIL ERROR]', err.message);
    return { ok: false, error: err.message };
  }
}

function inviteEmail({ recipientEmail, orgName, role, inviteUrl }) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;background:#F7F8FA;padding:40px 0">
<div style="max-width:520px;margin:0 auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(15,32,68,.08)">
<div style="background:#0F2044;padding:28px 32px">
<div style="font-size:11px;font-weight:700;letter-spacing:.12em;color:rgba(255,255,255,.4);text-transform:uppercase;margin-bottom:6px">SecurePathway</div>
<div style="font-size:20px;font-weight:700;color:white">You've been invited to join ${orgName}</div></div>
<div style="padding:28px 32px">
<p style="font-size:14px;color:#2A4066;line-height:1.75;margin-bottom:20px">
${orgName} has invited you as a <strong>${role}</strong> to their SecurePathway professional security training programme.</p>
<a href="${inviteUrl}" style="display:inline-block;background:#1B4FE4;color:white;padding:12px 24px;border-radius:6px;font-size:13px;font-weight:700;text-decoration:none;margin-bottom:24px">Accept Invitation →</a>
<p style="font-size:11px;color:#7A8FA8">This link expires in 7 days.</p>
<hr style="border:none;border-top:1px solid #D8E0EC;margin:20px 0">
<p style="font-size:10px;color:#7A8FA8">© 2026 SecurePathway · SPS Standard</p>
</div></div></body></html>`;
  return send({ to: recipientEmail, subject: `You're invited to ${orgName} on SecurePathway`, html,
    text: `Invited to ${orgName} on SecurePathway as ${role}. Accept: ${inviteUrl} (expires 7 days)` });
}

function nudgeEmail({ recipientEmail, recipientName, cohortName, deadline, daysInactive }) {
  const deadlineStr = deadline ? `Your deadline is ${new Date(deadline).toLocaleDateString('en-IE', { day:'numeric',month:'long',year:'numeric' })}.` : '';
  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#F7F8FA;padding:40px 0">
<div style="max-width:520px;margin:0 auto;background:white;border-radius:10px;padding:32px;box-shadow:0 2px 12px rgba(15,32,68,.08)">
<div style="font-size:11px;font-weight:700;letter-spacing:.1em;color:#C8952A;text-transform:uppercase;margin-bottom:8px">Training Reminder</div>
<h2 style="font-size:18px;font-weight:700;color:#0F1F3D;margin-bottom:14px">Hi ${recipientName}, your training is waiting</h2>
<p style="font-size:14px;color:#2A4066;line-height:1.75;margin-bottom:20px">
You haven't logged in to <strong>${cohortName}</strong> for ${daysInactive} days. ${deadlineStr}</p>
<a href="${process.env.CLIENT_URL||'https://securepathway.io'}/training" style="display:inline-block;background:#1B4FE4;color:white;padding:12px 24px;border-radius:6px;font-size:13px;font-weight:700;text-decoration:none">Continue Training →</a>
</div></body></html>`;
  return send({ to: recipientEmail, subject: `Training reminder: ${cohortName}`, html,
    text: `Hi ${recipientName}, you haven't trained in ${daysInactive} days. Continue: ${process.env.CLIENT_URL}/training` });
}

function certIssuedEmail({ recipientEmail, recipientName, trackTitle, score, downloadUrl }) {
  const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#F7F8FA;padding:40px 0">
<div style="max-width:520px;margin:0 auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(15,32,68,.08)">
<div style="background:#0F2044;padding:28px 32px;text-align:center">
<div style="font-size:32px;margin-bottom:8px">🏆</div>
<div style="font-size:11px;font-weight:700;letter-spacing:.12em;color:#C8952A;text-transform:uppercase;margin-bottom:6px">Certificate Issued</div>
<div style="font-size:20px;font-weight:700;color:white">Congratulations, ${recipientName}</div></div>
<div style="padding:28px 32px;text-align:center">
<p style="font-size:14px;color:#2A4066;margin-bottom:6px">SPS certificate awarded for</p>
<div style="font-size:18px;font-weight:800;color:#0F1F3D;margin-bottom:6px">${trackTitle}</div>
<div style="display:inline-block;background:rgba(200,149,42,.1);border:1px solid rgba(200,149,42,.3);color:#C8952A;border-radius:8px;padding:4px 14px;font-size:12px;font-weight:700;margin-bottom:20px">Score: ${score}%</div>
<div><a href="${downloadUrl}" style="display:inline-block;background:#C8952A;color:white;padding:12px 24px;border-radius:6px;font-size:13px;font-weight:700;text-decoration:none">Download Certificate →</a></div>
</div></div></body></html>`;
  return send({ to: recipientEmail, subject: `Your SPS certificate: ${trackTitle}`, html,
    text: `Congratulations ${recipientName}! SPS certificate for ${trackTitle} (${score}%). Download: ${downloadUrl}` });
}

module.exports = { send, inviteEmail, nudgeEmail, certIssuedEmail };
