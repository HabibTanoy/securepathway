// SecurePathway Email Service — nodemailer with SMTP
// Compatible with: Postmark, Mailgun, SendGrid, AWS SES, Gmail, any SMTP
// All templates use table-based layout for maximum email client compatibility

const nodemailer = require('nodemailer');

const FROM = process.env.EMAIL_FROM || 'SecurePathway <noreply@securepathway.io>';
const APP_URL = process.env.CLIENT_URL || 'https://securepathway.io';

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
    console.log(`[EMAIL DEV] To: ${to} | Subject: ${subject}`);
    if (process.env.NODE_ENV !== 'production') console.log('[EMAIL DEV] HTML preview:', html.slice(0, 300));
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

// Shared email wrapper — table-based, works in Gmail, Outlook, Apple Mail, mobile
function emailWrap({ preheader = '', headerBg = '#0F2044', headerContent, bodyContent, footerNote = '' }) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>SecurePathway</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    @media only screen and (max-width:600px) {
      .email-body { padding: 0 !important; }
      .email-container { border-radius: 0 !important; }
      .email-header { padding: 20px 16px !important; }
      .email-content { padding: 20px 16px !important; }
      .email-footer { padding: 14px 16px !important; }
      .btn-main { display: block !important; text-align: center !important; }
      h1 { font-size: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F7F8FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#F7F8FA;">${preheader}</div>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" border="0" class="email-body" style="background:#F7F8FA;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" class="email-container" style="max-width:560px;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(15,32,68,.08);">
        <!-- Header -->
        <tr>
          <td class="email-header" style="background:${headerBg};padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
                    <tr>
                      <td style="background:rgba(255,255,255,.1);border-radius:7px;padding:7px 10px;font-size:11px;font-weight:700;letter-spacing:.1em;color:rgba(255,255,255,.7);text-transform:uppercase;">
                        ▐▌ SecurePathway
                      </td>
                    </tr>
                  </table>
                  ${headerContent}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td class="email-content" style="padding:28px 32px;">
            ${bodyContent}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td class="email-footer" style="padding:16px 32px;background:#F7F8FA;border-top:1px solid #E8ECF3;">
            <p style="margin:0;font-size:11px;color:#7A8FA8;line-height:1.6;">
              ${footerNote || '© 2026 SecurePathway · SPS Professional Standard · <a href="' + APP_URL + '/unsubscribe" style="color:#7A8FA8;">Unsubscribe</a>'}
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── INVITATION EMAIL ──────────────────────────────────────────────────────────
function inviteEmail({ recipientEmail, orgName, role, inviteUrl }) {
  const html = emailWrap({
    preheader: `${orgName} has invited you to SecurePathway`,
    headerContent: `<h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;line-height:1.3;">You've been invited to join ${escHtml(orgName)}</h1>`,
    bodyContent: `
      <p style="margin:0 0 16px;font-size:15px;color:#2A4066;line-height:1.75;">
        <strong>${escHtml(orgName)}</strong> has invited you to join their professional security training programme on SecurePathway as a <strong>${escHtml(role)}</strong>.
      </p>
      <p style="margin:0 0 24px;font-size:14px;color:#4A6080;line-height:1.7;">
        SecurePathway delivers SPS-standard training across six career tracks — from Physical Security to Cyber Security Officer. Your progress and certificates are stored in your personal portfolio.
      </p>
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
        <tr>
          <td style="border-radius:6px;background:#1B4FE4;">
            <a href="${inviteUrl}" class="btn-main" style="display:inline-block;background:#1B4FE4;color:#ffffff;padding:13px 28px;border-radius:6px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:.01em;">
              Accept Invitation →
            </a>
          </td>
        </tr>
      </table>
      <p style="margin:0;font-size:12px;color:#7A8FA8;line-height:1.6;">
        This invitation expires in 7 days. If you weren't expecting this, you can safely ignore this email.
      </p>
      <hr style="border:none;border-top:1px solid #E8ECF3;margin:20px 0;">
      <p style="margin:0;font-size:11px;color:#9AADBD;">
        Having trouble with the button? Copy and paste this link:<br>
        <span style="color:#1B4FE4;word-break:break-all;">${inviteUrl}</span>
      </p>
    `,
  });
  return send({
    to: recipientEmail,
    subject: `You're invited to ${orgName} on SecurePathway`,
    html,
    text: `${orgName} has invited you to SecurePathway as ${role}.\n\nAccept your invitation: ${inviteUrl}\n\nThis link expires in 7 days.`,
  });
}

// ── NUDGE / REMINDER EMAIL ────────────────────────────────────────────────────
function nudgeEmail({ recipientEmail, recipientName, cohortName, deadline, daysInactive }) {
  const deadlineStr = deadline
    ? `<strong>Your deadline is ${new Date(deadline).toLocaleDateString('en-IE', { day:'numeric', month:'long', year:'numeric' })}.</strong>`
    : '';
  const trainingUrl = `${APP_URL}/training`;

  const html = emailWrap({
    preheader: `You haven't trained in ${daysInactive} days — pick up where you left off`,
    headerBg: '#0A3060',
    headerContent: `
      <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.1em;color:#C8952A;text-transform:uppercase;">Training Reminder</p>
      <h1 style="margin:0;font-size:20px;font-weight:800;color:#ffffff;line-height:1.3;">Hi ${escHtml(recipientName)}, your training is waiting</h1>
    `,
    bodyContent: `
      <p style="margin:0 0 16px;font-size:15px;color:#2A4066;line-height:1.75;">
        You haven't logged in to <strong>${escHtml(cohortName)}</strong> for <strong>${daysInactive} days</strong>. ${deadlineStr}
      </p>
      <p style="margin:0 0 24px;font-size:14px;color:#4A6080;line-height:1.7;">
        Your progress is saved — pick up exactly where you left off. Consistent practice is the fastest path to your SPS credential.
      </p>
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
        <tr>
          <td style="border-radius:6px;background:#1B4FE4;">
            <a href="${trainingUrl}" class="btn-main" style="display:inline-block;background:#1B4FE4;color:#ffffff;padding:13px 28px;border-radius:6px;font-size:14px;font-weight:700;text-decoration:none;">
              Continue Training →
            </a>
          </td>
        </tr>
      </table>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:16px;">
        <tr>
          <td style="background:#F7F8FA;border:1px solid #E8ECF3;border-radius:8px;padding:14px 18px;">
            <p style="margin:0;font-size:12px;color:#4A6080;line-height:1.7;">
              💡 <strong>Tip:</strong> Even 15 minutes of training per day adds up. Your streak resets after 24 hours of inactivity — restart it today.
            </p>
          </td>
        </tr>
      </table>
    `,
    footerNote: `You're receiving this because you're enrolled in ${escHtml(cohortName)} on SecurePathway. To adjust notifications, visit your <a href="${APP_URL}/profile" style="color:#7A8FA8;">profile settings</a>.`,
  });
  return send({
    to: recipientEmail,
    subject: `Training reminder: ${cohortName} (${daysInactive}d inactive)`,
    html,
    text: `Hi ${recipientName},\n\nYou haven't trained in ${daysInactive} days. Continue ${cohortName}: ${trainingUrl}\n\n${deadline ? `Your deadline is ${new Date(deadline).toLocaleDateString('en-IE')}.` : ''}`,
  });
}

// ── CERTIFICATE ISSUED EMAIL ──────────────────────────────────────────────────
function certIssuedEmail({ recipientEmail, recipientName, trackTitle, score, downloadUrl }) {
  const html = emailWrap({
    preheader: `Your SPS certificate for ${trackTitle} is ready to download`,
    headerBg: '#0A1428',
    headerContent: `
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="padding-bottom:12px;">
            <div style="font-size:40px;line-height:1;">🏆</div>
          </td>
        </tr>
        <tr>
          <td align="center">
            <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.1em;color:#C8952A;text-transform:uppercase;">Certificate Issued</p>
            <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;line-height:1.3;">Congratulations, ${escHtml(recipientName)}</h1>
          </td>
        </tr>
      </table>
    `,
    bodyContent: `
      <p style="margin:0 0 6px;font-size:14px;color:#4A6080;text-align:center;">SPS Professional Certificate awarded for</p>
      <p style="margin:0 0 16px;font-size:20px;font-weight:800;color:#0F1F3D;text-align:center;">${escHtml(trackTitle)}</p>
      <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px;">
        <tr>
          <td style="background:rgba(200,149,42,.08);border:1px solid rgba(200,149,42,.3);border-radius:8px;padding:8px 20px;">
            <span style="font-size:14px;font-weight:700;color:#8D691E;">Score: ${score}%</span>
          </td>
        </tr>
      </table>
      <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px;">
        <tr>
          <td style="border-radius:6px;background:#C8952A;">
            <a href="${downloadUrl}" class="btn-main" style="display:inline-block;background:#C8952A;color:#ffffff;padding:13px 28px;border-radius:6px;font-size:14px;font-weight:700;text-decoration:none;">
              Download Certificate →
            </a>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 16px;font-size:14px;color:#4A6080;line-height:1.7;text-align:center;">
        Your certificate has been added to your SecurePathway portfolio. Share it with your employer or add the credential code to LinkedIn.
      </p>
      <hr style="border:none;border-top:1px solid #E8ECF3;margin:20px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="background:#F7F8FA;border:1px solid #E8ECF3;border-radius:8px;padding:14px 18px;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#7A8FA8;text-transform:uppercase;letter-spacing:.08em;">What's next?</p>
            <p style="margin:0;font-size:13px;color:#4A6080;line-height:1.65;">
              Continue your SPS journey — explore the remaining tracks in the <a href="${APP_URL}/training" style="color:#1B4FE4;font-weight:600;">Training Portal</a>.
            </p>
          </td>
        </tr>
      </table>
    `,
  });
  return send({
    to: recipientEmail,
    subject: `Your SPS certificate: ${trackTitle}`,
    html,
    text: `Congratulations ${recipientName}!\n\nYour SPS Professional Certificate for ${trackTitle} is ready (Score: ${score}%).\n\nDownload: ${downloadUrl}`,
  });
}

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

module.exports = { send, inviteEmail, nudgeEmail, certIssuedEmail };
