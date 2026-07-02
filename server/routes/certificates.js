// Certificate PDF generation using SVG → PDF approach (no external deps)
const router = require('express').Router();
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const crypto = require('crypto');

function verificationCode(certId) {
  return crypto.createHash('sha256').update(certId + (process.env.JWT_SECRET || 'sp')).digest('hex').slice(0, 12).toUpperCase();
}

// GET /api/certificates/:id/pdf — generate certificate as SVG (renders as PDF-quality in browser)
router.get('/:id/pdf', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT c.*, u.name AS learner_name, u.email, t.name AS org_name
     FROM certificates c
     JOIN users u ON u.id = c.user_id
     JOIN tenants t ON t.id = u.tenant_id
     WHERE c.id = $1 AND c.user_id = $2`,
    [req.params.id, req.user.id]
  );

  if (!rows.length) return res.status(404).json({ error: 'Certificate not found' });
  const cert = rows[0];
  const vCode = verificationCode(cert.id);
  const issued = new Date(cert.issued_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' });
  const signed = cert.signed_at ? new Date(cert.signed_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="842" height="595" viewBox="0 0 842 595">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A1428"/>
      <stop offset="100%" stop-color="#0F2044"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#C8952A"/>
      <stop offset="100%" stop-color="#F0BC4A"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="842" height="595" fill="url(#bg)"/>

  <!-- Gold border -->
  <rect x="20" y="20" width="802" height="555" fill="none" stroke="url(#gold)" stroke-width="1.5" rx="4"/>
  <rect x="26" y="26" width="790" height="543" fill="none" stroke="rgba(200,149,42,0.3)" stroke-width="0.5" rx="3"/>

  <!-- Header bar -->
  <rect x="20" y="20" width="802" height="80" fill="rgba(200,149,42,0.08)" rx="4"/>

  <!-- Logo mark -->
  <rect x="54" y="42" width="36" height="5" rx="2.5" fill="url(#gold)"/>
  <rect x="54" y="52" width="26" height="5" rx="2.5" fill="url(#gold)"/>
  <rect x="54" y="62" width="16" height="5" rx="2.5" fill="url(#gold)"/>

  <!-- Organisation name -->
  <text x="104" y="58" font-family="Georgia, serif" font-size="13" fill="rgba(255,255,255,0.5)" letter-spacing="0.05em">SECUREPATHWAY</text>
  <text x="104" y="76" font-family="Georgia, serif" font-size="9" fill="rgba(200,149,42,0.8)" letter-spacing="0.15em" text-transform="uppercase">SPS PROFESSIONAL STANDARD</text>

  <!-- Right: verification -->
  <text x="788" y="54" font-family="monospace" font-size="9" fill="rgba(255,255,255,0.3)" text-anchor="end">VERIFICATION: ${vCode}</text>
  <text x="788" y="68" font-family="monospace" font-size="9" fill="rgba(255,255,255,0.25)" text-anchor="end">securepathway.io/verify/${vCode}</text>

  <!-- Certificate of title -->
  <text x="421" y="155" font-family="Georgia, serif" font-size="11" fill="rgba(200,149,42,0.8)" text-anchor="middle" letter-spacing="0.25em">Certificate of Professional Competence</text>

  <!-- Decorative line -->
  <line x1="150" y1="168" x2="692" y2="168" stroke="url(#gold)" stroke-width="0.75" opacity="0.5"/>

  <!-- This is to certify -->
  <text x="421" y="200" font-family="Georgia, serif" font-size="13" fill="rgba(255,255,255,0.5)" text-anchor="middle" font-style="italic">This is to certify that</text>

  <!-- Learner name -->
  <text x="421" y="248" font-family="Georgia, serif" font-size="36" fill="white" text-anchor="middle" font-weight="normal" letter-spacing="-0.01em">${cert.learner_name}</text>

  <!-- Underline -->
  <line x1="200" y1="260" x2="642" y2="260" stroke="rgba(255,255,255,0.15)" stroke-width="0.75"/>

  <!-- has successfully completed -->
  <text x="421" y="290" font-family="Georgia, serif" font-size="13" fill="rgba(255,255,255,0.5)" text-anchor="middle" font-style="italic">has successfully completed all requirements of the</text>

  <!-- Track name -->
  <text x="421" y="330" font-family="Georgia, serif" font-size="22" fill="url(#gold)" text-anchor="middle" font-weight="normal">${cert.track_title}</text>

  <!-- Credential code -->
  ${cert.credential_code ? `<text x="421" y="356" font-family="Georgia, serif" font-size="11" fill="rgba(200,149,42,0.7)" text-anchor="middle" letter-spacing="0.12em">${cert.credential_code}</text>` : ''}

  <!-- Score badge -->
  ${cert.ai_score ? `
  <rect x="371" y="368" width="100" height="28" rx="14" fill="rgba(200,149,42,0.12)" stroke="rgba(200,149,42,0.4)" stroke-width="1"/>
  <text x="421" y="387" font-family="Georgia, serif" font-size="12" fill="url(#gold)" text-anchor="middle">Score: ${cert.ai_score}%</text>
  ` : ''}

  <!-- Divider -->
  <line x1="150" y1="415" x2="692" y2="415" stroke="url(#gold)" stroke-width="0.75" opacity="0.3"/>

  <!-- Footer: dates and org -->
  <text x="160" y="450" font-family="Georgia, serif" font-size="10" fill="rgba(255,255,255,0.4)">Issued: ${issued}</text>
  ${signed ? `<text x="160" y="466" font-family="Georgia, serif" font-size="10" fill="rgba(255,255,255,0.4)">Assessor signed: ${signed}</text>` : ''}
  <text x="421" y="450" font-family="Georgia, serif" font-size="10" fill="rgba(255,255,255,0.3)" text-anchor="middle">${cert.org_name}</text>

  <!-- Signature line -->
  <line x1="580" y1="455" x2="740" y2="455" stroke="rgba(255,255,255,0.2)" stroke-width="0.75"/>
  <text x="660" y="468" font-family="Georgia, serif" font-size="9" fill="rgba(255,255,255,0.35)" text-anchor="middle" font-style="italic">Authorised Assessor</text>

  <!-- Bottom -->
  <text x="421" y="520" font-family="Georgia, serif" font-size="9" fill="rgba(255,255,255,0.2)" text-anchor="middle" letter-spacing="0.1em">SecurePathway Professional Standard (SPS) · securepathway.io</text>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Disposition', `attachment; filename="certificate-${vCode}.svg"`);
  res.send(svg);
});

// GET /api/certificates/verify/:code — public verification endpoint
router.get('/verify/:code', async (req, res) => {
  // In production: look up code in DB. For now, just confirm format is valid
  const code = req.params.code.toUpperCase();
  if (!/^[A-F0-9]{12}$/.test(code)) return res.status(404).json({ valid: false });
  res.json({ valid: true, message: 'Certificate format valid. Full verification requires database lookup.', code });
});

module.exports = router;
