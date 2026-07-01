const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many auth attempts' } });
const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, message: { error: 'AI rate limit — wait 60s' } });

module.exports = { apiLimiter, authLimiter, aiLimiter };
