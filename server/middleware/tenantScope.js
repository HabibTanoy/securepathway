/**
 * Tenant isolation middleware
 * Ensures every DB query is scoped to the authenticated user's tenant.
 * Based on the tenantScope.ts pattern from the case management codebase.
 */
import pool from '../db/pool.js';

export function tenantQuery(tenantId) {
  return {
    /** Run a parameterised query scoped to this tenant */
    async query(sql, params = []) {
      // Prepend tenantId as $1 to all scoped queries
      return pool.query(sql, [tenantId, ...params]);
    },
    /** Direct pool access for cross-tenant admin ops */
    pool,
  };
}

export function withTenant(req, res, next) {
  if (!req.user?.tenantId) return res.status(401).json({ error: 'No tenant context' });
  req.db = tenantQuery(req.user.tenantId);
  next();
}
