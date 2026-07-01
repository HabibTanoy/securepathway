const router = require('express').Router();
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');
const { setupData, verifyTOTP, generateSecret } = require('../lib/totp');

// POST /api/mfa/setup — generate secret + QR URL (requires auth, MFA not yet enabled)
router.post('/setup', requireAuth, async (req, res) => {
  const { secret, url } = setupData(req.user.email);
  // Store pending secret (not yet confirmed)
  await pool.query('UPDATE users SET totp_secret = $1 WHERE id = $2', [secret, req.user.id]);
  res.json({ secret, url });
});

// POST /api/mfa/confirm — verify first code to activate MFA
router.post('/confirm', requireAuth, authLimiter, async (req, res) => {
  const { token } = req.body;
  if (!token || token.length !== 6) return res.status(400).json({ error: 'Invalid token format' });

  const { rows } = await pool.query('SELECT totp_secret FROM users WHERE id = $1', [req.user.id]);
  if (!rows.length || !rows[0].totp_secret) return res.status(400).json({ error: 'MFA not set up' });

  if (!verifyTOTP(rows[0].totp_secret, token)) {
    return res.status(401).json({ error: 'Invalid code — check your authenticator app and try again' });
  }

  await pool.query('UPDATE users SET totp_enabled = TRUE WHERE id = $1', [req.user.id]);
  res.json({ ok: true, message: 'MFA enabled successfully' });
});

// POST /api/mfa/verify — standalone TOTP check (not used by the login flow,
// which validates mfaToken directly in POST /auth/login)
router.post('/verify', authLimiter, async (req, res) => {
  const { userId, token } = req.body;
  if (!userId || !token) return res.status(400).json({ error: 'userId and token required' });

  const { rows } = await pool.query(
    'SELECT totp_secret, totp_enabled FROM users WHERE id = $1',
    [userId]
  );
  if (!rows.length || !rows[0].totp_enabled) return res.status(400).json({ error: 'MFA not enabled' });
  if (!verifyTOTP(rows[0].totp_secret, token)) {
    return res.status(401).json({ error: 'Invalid code' });
  }
  res.json({ ok: true });
});

// DELETE /api/mfa/disable — disable MFA (requires current token to confirm)
router.delete('/disable', requireAuth, authLimiter, async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Current MFA token required to disable' });

  const { rows } = await pool.query('SELECT totp_secret FROM users WHERE id = $1', [req.user.id]);
  if (!rows.length || !rows[0].totp_secret) return res.status(400).json({ error: 'MFA not set up' });

  if (!verifyTOTP(rows[0].totp_secret, token)) {
    return res.status(401).json({ error: 'Invalid code' });
  }

  await pool.query('UPDATE users SET totp_enabled = FALSE, totp_secret = NULL WHERE id = $1', [req.user.id]);
  res.json({ ok: true, message: 'MFA disabled' });
});

// GET /api/mfa/status
router.get('/status', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT totp_enabled FROM users WHERE id = $1', [req.user.id]);
  res.json({ enabled: rows[0]?.totp_enabled ?? false });
});

module.exports = router;
