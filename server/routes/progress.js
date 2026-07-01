const router = require('express').Router();
const pool = require('../db/pool');
const xapi = require('../lib/xapi');
const { requireAuth } = require('../middleware/auth');

// GET /api/progress — all module progress for current user
router.get('/', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM module_progress WHERE user_id = $1',
    [req.user.id]
  );
  // Transform to the keyed object format the frontend expects: { 'psf-1': { sections, quizPassed, ... } }
  const progress = {};
  rows.forEach(r => {
    progress[r.module_id] = {
      sections: r.sections_done,
      quizPassed: r.quiz_passed,
      quizScore: r.quiz_score,
      quizAttempts: r.quiz_attempts,
      hookDone: r.hook_done,
      hookResponse: r.hook_response,
      assessed: r.assessed,
      assessScore: r.assess_score,
      assessPassed: r.assess_passed,
      notes: r.notes,
      timeSpent: r.time_spent_secs,
    };
  });
  res.json(progress);
});

// PATCH /api/progress/:moduleId — upsert module progress
router.patch('/:moduleId', requireAuth, async (req, res) => {
  const { moduleId } = req.params;
  const {
    trackId, sections, quizPassed, quizScore, quizAttempts,
    hookDone, hookResponse, assessed, assessScore, assessPassed,
    notes, timeSpent
  } = req.body;

  await pool.query(`
    INSERT INTO module_progress
      (user_id, module_id, track_id, sections_done, quiz_passed, quiz_score, quiz_attempts,
       hook_done, hook_response, assessed, assess_score, assess_passed, notes, time_spent_secs)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    ON CONFLICT (user_id, module_id) DO UPDATE SET
      sections_done    = COALESCE($4, module_progress.sections_done),
      quiz_passed      = COALESCE($5, module_progress.quiz_passed),
      quiz_score       = COALESCE($6, module_progress.quiz_score),
      quiz_attempts    = COALESCE($7, module_progress.quiz_attempts),
      hook_done        = COALESCE($8, module_progress.hook_done),
      hook_response    = COALESCE($9, module_progress.hook_response),
      assessed         = COALESCE($10, module_progress.assessed),
      assess_score     = COALESCE($11, module_progress.assess_score),
      assess_passed    = COALESCE($12, module_progress.assess_passed),
      notes            = COALESCE($13, module_progress.notes),
      time_spent_secs  = COALESCE($14, module_progress.time_spent_secs),
      updated_at       = NOW()
  `, [
    req.user.id, moduleId, trackId || null,
    sections ? JSON.stringify(sections) : null,
    quizPassed ?? null, quizScore ?? null, quizAttempts ?? null,
    hookDone ?? null, hookResponse ?? null,
    assessed ?? null, assessScore ?? null, assessPassed ?? null,
    notes ?? null, timeSpent ?? null
  ]);

  // Emit xAPI statement when module quiz is passed
  if (quizPassed && quizScore >= 80) {
    try {
      await xapi.emitModuleComplete({
        user: req.user,
        moduleId,
        moduleTitle: moduleId,
        score: quizScore || 80,
        tenantId: req.user.tenant_id,
      });
    } catch (xErr) { /* non-fatal */ }
  }

  res.json({ ok: true });
});

// GET /api/progress/spaced — due spaced repetition items
router.get('/spaced', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM spaced_repetition WHERE user_id = $1 AND resolved = FALSE AND next_due <= NOW() ORDER BY next_due LIMIT 10',
    [req.user.id]
  );
  res.json(rows);
});

// POST /api/progress/spaced — flag question for spaced rep
router.post('/spaced', requireAuth, async (req, res) => {
  const { moduleId, questionIdx, questionText, intervalDays = 7 } = req.body;
  await pool.query(`
    INSERT INTO spaced_repetition (user_id, module_id, question_idx, question_text, next_due, box_level)
    VALUES ($1,$2,$3,$4, NOW() + '1 day'::INTERVAL, 1)
    ON CONFLICT (user_id, module_id, question_idx) DO UPDATE SET
      box_level = 1,
      next_due  = NOW() + '1 day'::INTERVAL,
      attempts  = spaced_repetition.attempts + 1,
      resolved  = FALSE,
      updated_at = NOW()
  `, [req.user.id, moduleId, questionIdx, questionText, intervalDays]);
  res.json({ ok: true });
});

// PATCH /api/progress/spaced/:id — resolve or reschedule
router.patch('/spaced/:id', requireAuth, async (req, res) => {
  // Leitner box system: correct answer promotes box, wrong answer resets to box 1
  // Box intervals: 1→1day, 2→3days, 3→7days, 4→14days, 5→retired
  const { correct } = req.body;
  const LEITNER_INTERVALS = [null, 1, 3, 7, 14]; // index = box level

  // Get current box level
  const current = await pool.query(
    'SELECT box_level FROM spaced_repetition WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user.id]
  );
  if (!current.rows.length) return res.status(404).json({ error: 'Not found' });

  const currentBox = current.rows[0].box_level || 1;

  if (correct) {
    const newBox = Math.min(currentBox + 1, 5);
    if (newBox === 5) {
      // Retired — resolved
      await pool.query(
        'UPDATE spaced_repetition SET resolved = TRUE, box_level = 5, updated_at = NOW() WHERE id = $1 AND user_id = $2',
        [req.params.id, req.user.id]
      );
    } else {
      const interval = LEITNER_INTERVALS[newBox];
      await pool.query(
        `UPDATE spaced_repetition
         SET box_level = $1, next_due = NOW() + ($2 || ' days')::INTERVAL,
             attempts = attempts + 1, updated_at = NOW()
         WHERE id = $3 AND user_id = $4`,
        [newBox, interval, req.params.id, req.user.id]
      );
    }
  } else {
    // Wrong answer — reset to box 1, review in 1 day
    await pool.query(
      `UPDATE spaced_repetition
       SET box_level = 1, next_due = NOW() + '1 day'::INTERVAL,
           attempts = attempts + 1, updated_at = NOW()
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
  }
  res.json({ ok: true });
});

// GET /api/progress/bookmarks
router.get('/bookmarks', requireAuth, async (req, res) => {
  const { rows } = await pool.query('SELECT sop_id FROM sop_bookmarks WHERE user_id = $1', [req.user.id]);
  res.json(rows.map(r => r.sop_id));
});

// POST /api/progress/bookmarks/:sopId
router.post('/bookmarks/:sopId', requireAuth, async (req, res) => {
  await pool.query(
    'INSERT INTO sop_bookmarks (user_id, sop_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
    [req.user.id, req.params.sopId]
  );
  res.json({ ok: true });
});

// DELETE /api/progress/bookmarks/:sopId
router.delete('/bookmarks/:sopId', requireAuth, async (req, res) => {
  await pool.query('DELETE FROM sop_bookmarks WHERE user_id=$1 AND sop_id=$2', [req.user.id, req.params.sopId]);
  res.json({ ok: true });
});

module.exports = router;
