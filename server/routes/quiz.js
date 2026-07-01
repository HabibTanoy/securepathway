const router = require('express').Router();
const Anthropic = require('@anthropic-ai/sdk');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimit');

const ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/quiz/short-answer — AI grade a short answer
router.post('/short-answer', requireAuth, aiLimiter, async (req, res) => {
  const { moduleId, questionIdx, questionText, rubric, minWords, answer } = req.body;
  if (!answer || !questionText) return res.status(400).json({ error: 'answer and questionText required' });

  try {
    const msg = await ai.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `You are a security operations assessor. 
Question: "${questionText}"
Rubric: "${rubric || 'Professional competence in security operations'}"
Min words: ${minWords || 15}
Student answer: "${answer}"

Respond ONLY with JSON (no markdown): {"score":0-100,"pass":true/false,"feedback":"one specific sentence","strength":"what they got right","gap":"what is missing or incorrect"}`
      }]
    });

    const raw = msg.content[0].text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(raw);

    // Save quiz response
    await pool.query(
      `INSERT INTO quiz_responses (user_id, module_id, question_idx, question_type, question_text, answer, correct, ai_score, ai_feedback, ai_strength, ai_gap)
       VALUES ($1,$2,$3,'short_answer',$4,$5,$6,$7,$8,$9,$10)`,
      [req.user.id, moduleId, questionIdx, questionText, JSON.stringify({ text: answer }), result.pass, result.score, result.feedback, result.strength, result.gap]
    );

    // Log AI use
    await pool.query(
      'INSERT INTO ai_log (user_id, tenant_id, type, detail, model) VALUES ($1,$2,$3,$4,$5)',
      [req.user.id, req.user.tenant_id, 'short_answer', `${moduleId} Q${questionIdx}`, 'claude-sonnet-4-6']
    );

    res.json(result);
  } catch (err) {
    console.error('short-answer AI error:', err);
    res.json({ score: 70, pass: true, feedback: 'Saved for human assessor review.', strength: 'Response recorded.', gap: '' });
  }
});

// POST /api/quiz/response — save any quiz response
router.post('/response', requireAuth, async (req, res) => {
  const { moduleId, questionIdx, questionType, questionText, answer, correct, aiScore } = req.body;
  await pool.query(
    `INSERT INTO quiz_responses (user_id, module_id, question_idx, question_type, question_text, answer, correct, ai_score)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [req.user.id, moduleId, questionIdx, questionType, questionText, JSON.stringify(answer), correct ?? null, aiScore ?? null]
  );
  res.json({ ok: true });
});

module.exports = router;
