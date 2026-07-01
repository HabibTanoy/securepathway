const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user + tenant to request
    const { rows } = await pool.query(
      'SELECT u.*, t.name AS tenant_name, t.region, t.plan FROM users u LEFT JOIN tenants t ON t.id = u.tenant_id WHERE u.id = $1',
      [payload.sub]
    );
    if (!rows.length) return res.status(401).json({ error: 'User not found' });
    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

const requireSameTenant = (req, res, next) => {
  const tenantId = req.params.tenantId || req.body.tenantId;
  if (tenantId && tenantId !== req.user.tenant_id) {
    return res.status(403).json({ error: 'Cross-tenant access denied' });
  }
  next();
};

module.exports = { requireAuth, requireRole, requireSameTenant };
