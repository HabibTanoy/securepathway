const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');

function signAccess(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
}
function signRefresh(userId) {
  return jwt.sign({ sub: userId, type: 'refresh' }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res) => {
  const { email, password, name, orgName, role = 'learner', region = 'IE', lang = 'en', inviteToken } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'email, password, name required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be 8+ characters' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check email taken
    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length) return res.status(409).json({ error: 'Email already registered' });

    let tenantId;

    if (inviteToken) {
      // Accept invitation
      const inv = await client.query(
        'SELECT * FROM invitations WHERE token = $1 AND accepted_at IS NULL AND expires_at > NOW()',
        [inviteToken]
      );
      if (!inv.rows.length) return res.status(400).json({ error: 'Invalid or expired invitation' });
      tenantId = inv.rows[0].tenant_id;
      await client.query('UPDATE invitations SET accepted_at = NOW() WHERE id = $1', [inv.rows[0].id]);
    } else {
      // Create new tenant
      const tenant = await client.query(
        'INSERT INTO tenants (name, region, plan) VALUES ($1, $2, $3) RETURNING id',
        [orgName || `${name}'s Account`, region, role === 'manager' ? 'team' : 'individual']
      );
      tenantId = tenant.rows[0].id;
    }

    const hash = await bcrypt.hash(password, 12);
    const initials = name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const user = await client.query(
      `INSERT INTO users (tenant_id, email, password_hash, name, initials, role, lang)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, initials, role, lang, tenant_id`,
      [tenantId, email.toLowerCase(), hash, name.trim(), initials, role, lang]
    );

    const u = user.rows[0];
    const refreshToken = signRefresh(u.id);
    await client.query(
      'INSERT INTO sessions (user_id, refresh_token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'30 days\')',
      [u.id, refreshToken]
    );

    await client.query('COMMIT');

    res.status(201).json({
      accessToken: signAccess(u.id),
      refreshToken,
      user: { id: u.id, name: u.name, initials: u.initials, role: u.role, lang: u.lang, tenantId: u.tenant_id }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  } finally {
    client.release();
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  const { email, password, mfaToken } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  const { rows } = await pool.query(
    'SELECT u.*, t.name AS tenant_name, t.region, t.plan, u.totp_enabled FROM users u LEFT JOIN tenants t ON t.id = u.tenant_id WHERE u.email = $1',
    [email.toLowerCase()]
  );
  if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

  const u = rows[0];
  const valid = await bcrypt.compare(password, u.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  // MFA check — if enabled and no TOTP code supplied yet, ask the client for one
  if (u.totp_enabled) {
    if (!mfaToken) {
      return res.json({ mfaRequired: true, userId: u.id });
    }
    const { verifyTOTP } = require('../lib/totp');
    if (!verifyTOTP(u.totp_secret, mfaToken)) {
      return res.status(401).json({ error: 'Invalid authentication code' });
    }
    // Valid TOTP — fall through and issue tokens below
  }

  // Update streak
  const today = new Date().toISOString().slice(0, 10);
  const lastActive = u.last_active ? u.last_active.toISOString().slice(0, 10) : null;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let newStreak = u.streak;
  if (lastActive === today) { /* same day, no change */ }
  else if (lastActive === yesterday) newStreak++;
  else newStreak = 1;

  await pool.query('UPDATE users SET last_active = $1, streak = $2 WHERE id = $3', [today, newStreak, u.id]);

  const refreshToken = signRefresh(u.id);
  await pool.query(
    'INSERT INTO sessions (user_id, refresh_token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'30 days\')',
    [u.id, refreshToken]
  );

  res.json({
    accessToken: signAccess(u.id),
    refreshToken,
    user: {
      id: u.id, name: u.name, initials: u.initials, role: u.role, lang: u.lang,
      streak: newStreak, tenantId: u.tenant_id,
      tenant: { name: u.tenant_name, region: u.region, plan: u.plan }
    }
  });
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { rows } = await pool.query(
      'SELECT * FROM sessions WHERE refresh_token = $1 AND expires_at > NOW()',
      [refreshToken]
    );
    if (!rows.length) return res.status(401).json({ error: 'Session expired' });

    res.json({ accessToken: signAccess(payload.sub) });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// POST /api/auth/logout
router.post('/logout', requireAuth, async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) await pool.query('DELETE FROM sessions WHERE refresh_token = $1', [refreshToken]);
  res.json({ ok: true });
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  const u = req.user;
  res.json({
    id: u.id, name: u.name, initials: u.initials, role: u.role, lang: u.lang,
    streak: u.streak, activeTrack: u.active_track, tenantId: u.tenant_id,
    tenant: { name: u.tenant_name, region: u.region, plan: u.plan }
  });
});

module.exports = router;
