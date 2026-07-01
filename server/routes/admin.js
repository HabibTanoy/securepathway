const router = require('express').Router();
const Anthropic = require('@anthropic-ai/sdk');
const multer = require('multer');
const pool = require('../db/pool');
const { requireAuth, requireRole } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimit');

const ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// All admin routes require manager or admin role
router.use(requireAuth, requireRole('manager', 'admin'));

// GET /api/admin/team — all team members with progress summary
router.get('/team', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT u.id, u.name, u.initials, u.role, u.active_track, u.streak, u.last_active,
      COUNT(mp.id) AS modules_touched,
      SUM(CASE WHEN mp.quiz_passed THEN 1 ELSE 0 END) AS quizzes_passed,
      SUM(CASE WHEN mp.assess_passed THEN 1 ELSE 0 END) AS assessments_passed,
      SUM(mp.time_spent_secs) AS total_time_secs,
      EXTRACT(DAY FROM NOW() - u.last_active)::int AS days_inactive,
      (
        SELECT COALESCE(SUM(
          (SELECT COUNT(*) FROM jsonb_object_keys(mp2.sections_done) k 
           WHERE mp2.sections_done->k = 'true') * 25
          + CASE WHEN mp2.quiz_passed THEN 100 ELSE 0 END
          + CASE WHEN mp2.quiz_score = 100 THEN 50 ELSE 0 END
          + CASE WHEN mp2.assess_passed THEN 300 ELSE 0 END
          + CASE WHEN mp2.hook_done THEN 15 ELSE 0 END
        ), 0)
        FROM module_progress mp2 WHERE mp2.user_id = u.id
      ) AS total_xp,
      CASE WHEN COUNT(mp.id) > 0
        THEN ROUND(SUM(CASE WHEN mp.quiz_passed THEN 1 ELSE 0 END)::numeric / GREATEST(COUNT(mp.id),1) * 100)
        ELSE 0
      END AS overall_pct
    FROM users u
    LEFT JOIN module_progress mp ON mp.user_id = u.id
    WHERE u.tenant_id = $1 AND u.role != 'admin'
    GROUP BY u.id
    ORDER BY u.name
  `, [req.user.tenant_id]);
  res.json({ team: rows });
});

// GET /api/admin/team/:userId — detailed progress for one learner
router.get('/team/:userId', async (req, res) => {
  const { userId } = req.params;
  const [user, progress, certs, portfolio] = await Promise.all([
    pool.query('SELECT id, name, initials, role, active_track, streak, last_active FROM users WHERE id=$1 AND tenant_id=$2', [userId, req.user.tenant_id]),
    pool.query('SELECT * FROM module_progress WHERE user_id=$1 ORDER BY updated_at DESC', [userId]),
    pool.query('SELECT * FROM certificates WHERE user_id=$1 ORDER BY issued_at DESC', [userId]),
    pool.query('SELECT id, type, module_title, ai_score, created_at FROM portfolio_entries WHERE user_id=$1 ORDER BY created_at DESC LIMIT 20', [userId]),
  ]);
  if (!user.rows.length) return res.status(404).json({ error: 'User not found' });
  res.json({ user: user.rows[0], moduleProgress: progress.rows, certificates: certs.rows, portfolio: portfolio.rows });
});

// GET /api/admin/track-stats — per-track completion across org
router.get('/track-stats', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT mp.track_id,
      COUNT(DISTINCT mp.user_id) AS enrolled,
      AVG(CASE WHEN mp.quiz_passed THEN 100 ELSE 0 END) AS avg_quiz_pass_rate,
      COUNT(CASE WHEN mp.assess_passed THEN 1 END) AS assessments_passed
    FROM module_progress mp
    JOIN users u ON u.id = mp.user_id
    WHERE u.tenant_id = $1
    GROUP BY mp.track_id
  `, [req.user.tenant_id]);
  res.json(rows);
});

// POST /api/admin/invite — invite a team member
router.post('/invite', async (req, res) => {
  const { email, role = 'learner' } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  const { rows } = await pool.query(
    `INSERT INTO invitations (tenant_id, email, role, invited_by)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT DO NOTHING
     RETURNING id, token, email, role, expires_at`,
    [req.user.tenant_id, email.toLowerCase(), role, req.user.id]
  );
  // Send invitation email
  if (rows[0]) {
    const tenant = await pool.query('SELECT name FROM tenants WHERE id = $1', [req.user.tenant_id]);
    const orgName = tenant.rows[0]?.name || 'your organisation';
    const inviteUrl = (process.env.CLIENT_URL || 'http://localhost:5173') + '/register?invite=' + rows[0].token;
    await emailLib.inviteEmail({ recipientEmail: email.toLowerCase(), orgName, role, inviteUrl }).catch(() => {});
  }
  res.json({ ok: true, invitation: rows[0] });
});

// GET /api/admin/export/csv — full gradebook CSV export
router.get('/export/csv', async (req, res) => {
  // Fetch all team members with full module-level progress
  const { rows: team } = await pool.query(`
    SELECT u.id, u.name, u.email, u.role, u.active_track, u.last_active,
      EXTRACT(DAY FROM NOW() - u.last_active)::int AS days_inactive,
      (
        SELECT COALESCE(SUM(
          (SELECT COUNT(*) FROM jsonb_object_keys(mp2.sections_done) k
           WHERE mp2.sections_done->k = 'true') * 25
          + CASE WHEN mp2.quiz_passed THEN 100 ELSE 0 END
          + CASE WHEN mp2.quiz_score = 100 THEN 50 ELSE 0 END
          + CASE WHEN mp2.assess_passed THEN 300 ELSE 0 END
          + CASE WHEN mp2.hook_done THEN 15 ELSE 0 END
        ), 0)
        FROM module_progress mp2 WHERE mp2.user_id = u.id
      ) AS total_xp,
      COUNT(mp.id) AS modules_touched,
      SUM(CASE WHEN mp.quiz_passed THEN 1 ELSE 0 END) AS quizzes_passed,
      SUM(CASE WHEN mp.assess_passed THEN 1 ELSE 0 END) AS assessments_passed,
      CASE WHEN COUNT(mp.id) > 0
        THEN ROUND(SUM(CASE WHEN mp.quiz_passed THEN 1 ELSE 0 END)::numeric / GREATEST(COUNT(mp.id),1) * 100)
        ELSE 0
      END AS overall_pct
    FROM users u
    LEFT JOIN module_progress mp ON mp.user_id = u.id
    WHERE u.tenant_id = $1 AND u.role != 'admin'
    GROUP BY u.id ORDER BY u.name
  `, [req.user.tenant_id]);

  // Fetch module-level detail for all users
  const { rows: modRows } = await pool.query(`
    SELECT mp.user_id, mp.module_id, mp.quiz_passed, mp.quiz_score,
           mp.assess_passed, mp.assess_score, mp.hook_done, mp.updated_at
    FROM module_progress mp
    JOIN users u ON u.id = mp.user_id
    WHERE u.tenant_id = $1
  `, [req.user.tenant_id]);

  // Build module map per user
  const modByUser = {};
  for (const r of modRows) {
    if (!modByUser[r.user_id]) modByUser[r.user_id] = {};
    modByUser[r.user_id][r.module_id] = r;
  }

  // Collect all unique module IDs in order
  const allModIds = [...new Set(modRows.map(r => r.module_id))].sort();

  // Build CSV
  const esc = v => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const now = new Date().toISOString().slice(0, 10);
  const headers = [
    'Name', 'Email', 'Role', 'Active Track', 'Total XP',
    'Modules Touched', 'Quizzes Passed', 'Assessments Passed', 'Overall %',
    'Days Inactive', 'Last Active',
    ...allModIds.flatMap(id => [`${id} Quiz`, `${id} Score`, `${id} Assessed`]),
  ];

  const rows = team.map(m => {
    const mods = modByUser[m.id] || {};
    return [
      esc(m.name), esc(m.email), esc(m.role), esc(m.active_track),
      esc(m.total_xp), esc(m.modules_touched), esc(m.quizzes_passed),
      esc(m.assessments_passed), esc(m.overall_pct), esc(m.days_inactive),
      esc(m.last_active ? new Date(m.last_active).toISOString().slice(0, 10) : ''),
      ...allModIds.flatMap(id => {
        const mp = mods[id];
        return [
          mp ? (mp.quiz_passed ? 'Pass' : 'Fail') : '',
          mp?.quiz_score ?? '',
          mp ? (mp.assess_passed ? 'Pass' : mp.assess_score ? 'In review' : '') : '',
        ];
      }),
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="securepathway-gradebook-${now}.csv"`);
  res.send('\uFEFF' + csv); // BOM for Excel compatibility
});


router.get('/invitations', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, email, role, accepted_at, expires_at, created_at FROM invitations WHERE tenant_id=$1 ORDER BY created_at DESC',
    [req.user.tenant_id]
  );
  res.json(rows);
});

// GET /api/admin/ai-log
router.get('/ai-log', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT al.*, u.name AS user_name FROM ai_log al
     LEFT JOIN users u ON u.id = al.user_id
     WHERE al.tenant_id = $1
     ORDER BY al.created_at DESC LIMIT 100`,
    [req.user.tenant_id]
  );
  res.json({ log: rows });
});

// POST /api/admin/documents — upload company SOP and generate module
router.post('/documents', upload.single('file'), aiLimiter, async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileText = req.file.buffer.toString('utf8').slice(0, 8000);

  try {
    const msg = await ai.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are a SecurePathway SPS training developer. Extract a training module from this company document.
Document: ${fileText}
Respond ONLY with JSON (no markdown):
{"moduleTitle":"string","spsLevel":"SPS Level 1|2|3|4","sections":[{"title":"string","summary":"string"}],"quizCount":5,"estimatedMins":45,"objectives":["string"],"keyPolicies":["string"]}`
      }]
    });

    const raw = msg.content[0].text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(raw);

    const { rows } = await pool.query(
      `INSERT INTO documents (tenant_id, uploaded_by, filename, file_size, generated_module)
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [req.user.tenant_id, req.user.id, req.file.originalname, req.file.size, JSON.stringify(parsed)]
    );

    await pool.query(
      'INSERT INTO ai_log (user_id, tenant_id, type, detail, model) VALUES ($1,$2,$3,$4,$5)',
      [req.user.id, req.user.tenant_id, 'doc_gen', req.file.originalname, 'claude-sonnet-4-6']
    );

    res.json({ document: { id: rows[0].id, filename: req.file.originalname }, module: parsed });
  } catch (err) {
    console.error('doc AI error:', err);
    res.status(500).json({ error: 'Document processing failed' });
  }
});

// GET /api/admin/documents
router.get('/documents', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, filename, file_size, generated_module, created_at FROM documents WHERE tenant_id=$1 ORDER BY created_at DESC',
    [req.user.tenant_id]
  );
  res.json({ docs: rows });
});

// POST /api/admin/certificates/:id/sign — assessor sign-off
router.post('/certificates/:id/sign', requireRole('manager', 'admin'), async (req, res) => {
  await pool.query(
    'UPDATE certificates SET assessor_signed=TRUE, assessor_id=$1, signed_at=NOW() WHERE id=$2',
    [req.user.id, req.params.id]
  );
  res.json({ ok: true });
});

// GET /api/admin/gdpr/export/:userId — Art. 20 data portability
router.get('/gdpr/export/:userId', async (req, res) => {
  const { userId } = req.params;
  const [user, progress, portfolio, certs, quizzes] = await Promise.all([
    pool.query('SELECT id,name,email,role,created_at FROM users WHERE id=$1 AND tenant_id=$2', [userId, req.user.tenant_id]),
    pool.query('SELECT * FROM module_progress WHERE user_id=$1', [userId]),
    pool.query('SELECT * FROM portfolio_entries WHERE user_id=$1', [userId]),
    pool.query('SELECT * FROM certificates WHERE user_id=$1', [userId]),
    pool.query('SELECT * FROM quiz_responses WHERE user_id=$1', [userId]),
  ]);
  if (!user.rows.length) return res.status(404).json({ error: 'User not found' });
  res.json({ user: user.rows[0], progress: progress.rows, portfolio: portfolio.rows, certificates: certs.rows, quizResponses: quizzes.rows, exportedAt: new Date().toISOString() });
});

// DELETE /api/admin/gdpr/delete/:userId — Art. 17 erasure
router.delete('/gdpr/delete/:userId', requireRole('admin'), async (req, res) => {
  const { userId } = req.params;
  // Cascade delete via FK constraints
  await pool.query('DELETE FROM users WHERE id=$1 AND tenant_id=$2', [userId, req.user.tenant_id]);
  res.json({ ok: true, message: 'User data erased per GDPR Art. 17' });
});


// GET /api/admin/assessments — pending assessments awaiting sign-off
router.get('/assessments', requireAuth, requireRole('manager', 'admin'), async (req, res) => {
  const { rows } = await pool.query(`
    SELECT pe.id, pe.user_id, pe.module_title, pe.answer, pe.ai_score, pe.ai_feedback,
           pe.rubric_json, pe.created_at,
           u.name AS learner_name, u.initials,
           c.id AS cert_id, c.assessor_signed, c.signed_at, c.credential_code, c.track_id
    FROM portfolio_entries pe
    JOIN users u ON u.id = pe.user_id
    LEFT JOIN certificates c ON c.user_id = pe.user_id
      AND pe.module_title ILIKE '%' || SPLIT_PART(c.track_id, '-', 2) || '%'
    WHERE u.tenant_id = $1
      AND pe.type = 'track_assessment'
    ORDER BY pe.created_at DESC
    LIMIT 50
  `, [req.user.tenant_id]);
  res.json({ assessments: rows });
});

// POST /api/admin/assessments/:id/sign — sign off (or reject) an assessment
router.post('/assessments/:id/sign', requireAuth, requireRole('manager', 'admin'), async (req, res) => {
  const { decision, feedback, certId } = req.body; // decision: 'approved' | 'returned'
  if (!['approved', 'returned'].includes(decision)) {
    return res.status(400).json({ error: 'decision must be approved or returned' });
  }
  if (decision === 'approved' && certId) {
    await pool.query(
      'UPDATE certificates SET assessor_signed = TRUE, assessor_id = $1, signed_at = NOW() WHERE id = $2',
      [req.user.id, certId]
    );
  }
  // Log the action
  await pool.query(
    'INSERT INTO ai_log (tenant_id, user_id, type, detail, model) VALUES ($1,$2,$3,$4,$5)',
    [req.user.tenant_id, req.user.id, 'Assessor Sign-off', 'Assessment ' + req.params.id + ': ' + decision + '. ' + (feedback || ''), 'human']
  );
  res.json({ ok: true, decision });
});

module.exports = router;
