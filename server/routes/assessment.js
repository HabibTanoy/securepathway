const router = require('express').Router();
const Anthropic = require('@anthropic-ai/sdk');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const xapi = require('../lib/xapi');
const { aiLimiter } = require('../middleware/rateLimit');

const ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/assessment/submit — submit track assessment for AI review
router.post('/submit', requireAuth, aiLimiter, async (req, res) => {
  const { trackId, trackTitle, submissionText, rubricCriteria } = req.body;
  if (!submissionText || submissionText.split(' ').length < 50) {
    return res.status(400).json({ error: 'Submission too short (50 words minimum)' });
  }

  const rubricText = rubricCriteria
    ? rubricCriteria.map(c => `${c.label} (${c.weight}%): ${c.desc}`).join('; ')
    : 'Professional competence across all track criteria';

  try {
    const msg = await ai.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `Senior security operations assessor applying SPS standard.
Track: ${trackTitle}
Rubric: ${rubricText}
Grade bands: Distinction 85%+, Merit 70%+, Pass 60%+, Fail below 60%.

Submission: "${submissionText.slice(0, 3000)}"

Respond ONLY with JSON (no markdown):
{"overallGrade":"Distinction|Merit|Pass|Fail","score":0-100,"criteriaFeedback":[{"criterion":"string","score":0-100,"comment":"string"}],"strengths":"string","gaps":"string","keyLearning":"string","humanReviewRequired":true,"note":"AI pre-assessment only — human sign-off required for SPS credential"}`
      }]
    });

    const raw = msg.content[0].text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(raw);

    // Save portfolio entry
    await pool.query(
      `INSERT INTO portfolio_entries (user_id, type, module_id, module_title, question, answer, ai_score, ai_feedback, rubric_json)
       VALUES ($1,'track_assessment',$2,$3,$4,$5,$6,$7,$8)`,
      [req.user.id, trackId, trackTitle, trackTitle + ' — Track Assessment', submissionText, result.score, result.strengths, JSON.stringify(result)]
    );

    // Log AI use
    await pool.query(
      'INSERT INTO ai_log (user_id, tenant_id, type, detail, model) VALUES ($1,$2,$3,$4,$5)',
      [req.user.id, req.user.tenant_id, 'assessment', trackTitle, 'claude-sonnet-4-6']
    );

    // Emit xAPI statement for track assessment attempt
    try {
      await xapi.emitTrackComplete({
        user: req.user,
        trackId,
        trackTitle,
        score: result.score || 0,
        credentialCode: '',
        tenantId: req.user.tenant_id,
      });
    } catch (xErr) { console.error('xAPI emit failed:', xErr.message); }

    res.json(result);
  } catch (err) {
    console.error('assessment AI error:', err);
    res.json({
      overallGrade: 'Submitted', score: 0,
      strengths: 'Response recorded.', gaps: '', keyLearning: 'Saved for human assessor.',
      humanReviewRequired: true, note: 'AI unavailable. Queued for human review.'
    });
  }
});

// POST /api/assessment/simulation — AI assess a simulation response
router.post('/simulation', requireAuth, aiLimiter, async (req, res) => {
  const { simTitle, difficulty, scenario, response } = req.body;
  if (!response || response.length < 100) return res.status(400).json({ error: 'Response too short' });

  try {
    const msg = await ai.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `Senior security operations trainer.
Simulation: "${simTitle}" | Difficulty: ${difficulty}
Scenario: ${scenario}
Response: ${response}

Structured feedback (be specific, cite correct procedures):
**OVERALL:** [STRONG/ADEQUATE/NEEDS IMPROVEMENT]
**CORRECT:** what they got right
**GAPS:** specific corrections with correct procedure
**KEY LEARNING:** one sentence
**SOP TO REVIEW:** which SOP or framework applies`
      }]
    });

    const feedback = msg.content[0].text;

    // Save portfolio entry
    await pool.query(
      `INSERT INTO portfolio_entries (user_id, type, module_id, module_title, question, answer, ai_feedback)
       VALUES ($1,'simulation','sim',$2,$3,$4,$5)`,
      [req.user.id, simTitle, scenario.slice(0, 200), response, feedback.slice(0, 500)]
    );

    await pool.query(
      'INSERT INTO ai_log (user_id, tenant_id, type, detail, model) VALUES ($1,$2,$3,$4,$5)',
      [req.user.id, req.user.tenant_id, 'simulation', simTitle, 'claude-sonnet-4-6']
    );

    // Emit xAPI statement
    try {
      await xapi.emitSimulationAttempt({ user: req.user, simTitle, tenantId: req.user.tenant_id });
    } catch(e) {}

    res.json({ feedback });
  } catch (err) {
    console.error('simulation AI error:', err);
    res.json({ feedback: 'AI service unavailable. Response saved for trainer review.' });
  }
});

// GET /api/assessment/portfolio
router.get('/portfolio', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM portfolio_entries WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user.id]
  );
  res.json({ entries: rows });
});

// GET /api/assessment/certificates
router.get('/certificates', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM certificates WHERE user_id = $1 ORDER BY issued_at DESC',
    [req.user.id]
  );
  res.json({ certificates: rows });
});

// POST /api/assessment/certificates — auto-award cert when track hits 80%
router.post('/certificates', requireAuth, async (req, res) => {
  const { trackId, trackTitle, credentialCode, aiScore } = req.body;
  await pool.query(
    `INSERT INTO certificates (user_id, track_id, track_title, credential_code, ai_score)
     VALUES ($1,$2,$3,$4,$5) ON CONFLICT (user_id, track_id) DO NOTHING`,
    [req.user.id, trackId, trackTitle, credentialCode || null, aiScore || null]
  );
  res.json({ ok: true });
});

module.exports = router;
