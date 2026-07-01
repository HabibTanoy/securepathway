// Cohort management — group learners into intake batches with deadlines
const router = require('express').Router();
const pool = require('../db/pool');
const email = require('../lib/email');
const { requireAuth, requireRole } = require('../middleware/auth');

// GET /api/cohorts — list all cohorts for tenant
router.get('/', requireAuth, requireRole('manager', 'admin'), async (req, res) => {
  const { rows } = await pool.query(`
    SELECT c.*,
      COUNT(DISTINCT cm.user_id)::int AS member_count,
      ROUND(AVG(
        (SELECT COUNT(*)::numeric FROM module_progress mp
         WHERE mp.user_id = cm.user_id AND mp.quiz_passed = TRUE)
        / NULLIF((SELECT COUNT(*) FROM module_progress mp2 WHERE mp2.user_id = cm.user_id), 0) * 100
      ))::int AS avg_progress
    FROM cohorts c
    LEFT JOIN cohort_members cm ON cm.cohort_id = c.id
    WHERE c.tenant_id = $1
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `, [req.user.tenant_id]);
  res.json({ cohorts: rows });
});

// POST /api/cohorts — create cohort
router.post('/', requireAuth, requireRole('manager', 'admin'), async (req, res) => {
  const { name, trackId, deadline, description } = req.body;
  if (!name || !trackId) return res.status(400).json({ error: 'name and trackId required' });

  const { rows } = await pool.query(
    `INSERT INTO cohorts (tenant_id, name, track_id, deadline, description, created_by)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [req.user.tenant_id, name, trackId, deadline || null, description || null, req.user.id]
  );
  res.status(201).json(rows[0]);
});

// GET /api/cohorts/:id — cohort detail with member progress
router.get('/:id', requireAuth, requireRole('manager', 'admin'), async (req, res) => {
  const cohort = await pool.query(
    'SELECT * FROM cohorts WHERE id = $1 AND tenant_id = $2',
    [req.params.id, req.user.tenant_id]
  );
  if (!cohort.rows.length) return res.status(404).json({ error: 'Not found' });

  const members = await pool.query(`
    SELECT u.id, u.name, u.initials, u.email, u.streak, u.last_active,
      COUNT(mp.id)::int AS modules_touched,
      SUM(CASE WHEN mp.quiz_passed THEN 1 ELSE 0 END)::int AS quizzes_passed,
      EXTRACT(DAY FROM NOW() - u.last_active)::int AS days_inactive
    FROM cohort_members cm
    JOIN users u ON u.id = cm.user_id
    LEFT JOIN module_progress mp ON mp.user_id = u.id
    WHERE cm.cohort_id = $1
    GROUP BY u.id
    ORDER BY u.name
  `, [req.params.id]);

  res.json({ cohort: cohort.rows[0], members: members.rows });
});

// POST /api/cohorts/:id/members — add member(s)
router.post('/:id/members', requireAuth, requireRole('manager', 'admin'), async (req, res) => {
  const { userIds } = req.body; // array of user UUIDs
  if (!Array.isArray(userIds) || !userIds.length) return res.status(400).json({ error: 'userIds array required' });

  for (const uid of userIds) {
    await pool.query(
      'INSERT INTO cohort_members (cohort_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [req.params.id, uid]
    );
  }
  res.json({ ok: true, added: userIds.length });
});

// DELETE /api/cohorts/:id/members/:userId
router.delete('/:id/members/:userId', requireAuth, requireRole('manager', 'admin'), async (req, res) => {
  await pool.query(
    'DELETE FROM cohort_members WHERE cohort_id = $1 AND user_id = $2',
    [req.params.id, req.params.userId]
  );
  res.json({ ok: true });
});

// POST /api/cohorts/:id/nudge — send nudge notification to inactive members
router.post('/:id/nudge', requireAuth, requireRole('manager', 'admin'), async (req, res) => {
  const { message, daysInactive = 7 } = req.body;
  const { rows } = await pool.query(`
    SELECT u.id, u.name, u.email
    FROM cohort_members cm
    JOIN users u ON u.id = cm.user_id
    WHERE cm.cohort_id = $1
      AND (u.last_active IS NULL OR u.last_active < NOW() - ($2 || ' days')::INTERVAL)
  `, [req.params.id, daysInactive]);

  // Log the nudge — actual email delivery would be wired here
  await pool.query(
    'INSERT INTO ai_log (tenant_id, user_id, type, detail, model) VALUES ($1,$2,$3,$4,$5)',
    [req.user.tenant_id, req.user.id, 'Cohort Nudge',
     `Nudge sent to ${rows.length} inactive members of cohort ${req.params.id}. Message: ${message || 'Default reminder'}`,
     'system']
  );

  // Send nudge emails to inactive members
  const cohortRow = await pool.query('SELECT name, deadline FROM cohorts WHERE id = $1', [req.params.id]);
  const cohortName = cohortRow.rows[0]?.name || 'your training';
  const deadline = cohortRow.rows[0]?.deadline;
  for (const recipient of rows) {
    await email.nudgeEmail({
      recipientEmail: recipient.email,
      recipientName: recipient.name,
      cohortName,
      deadline,
      daysInactive,
    }).catch(() => {});
  }

  res.json({ ok: true, nudged: rows.length, recipients: rows.map(r => r.name) });
});

// PATCH /api/cohorts/:id — update deadline or name
router.patch('/:id', requireAuth, requireRole('manager', 'admin'), async (req, res) => {
  const { name, deadline, description } = req.body;
  await pool.query(
    `UPDATE cohorts SET
       name = COALESCE($1, name),
       deadline = COALESCE($2, deadline),
       description = COALESCE($3, description),
       updated_at = NOW()
     WHERE id = $4 AND tenant_id = $5`,
    [name, deadline, description, req.params.id, req.user.tenant_id]
  );
  res.json({ ok: true });
});

module.exports = router;
