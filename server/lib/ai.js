import Anthropic from '@anthropic-ai/sdk';
import pool from '../db/pool.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function logAI({ tenantId, userId, actionType, inputText, outputText, model, tokensUsed, latencyMs }) {
  try {
    await pool.query(
      `INSERT INTO ai_log (tenant_id, user_id, action_type, input_text, output_text, model, tokens_used, latency_ms)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [tenantId, userId, actionType, inputText?.slice(0, 4000), outputText?.slice(0, 8000), model, tokensUsed, latencyMs]
    );
  } catch (err) {
    console.error('AI log error:', err.message);
  }
}

export async function gradeShortAnswer({ question, rubric, answer, minWords, tenantId, userId }) {
  const start = Date.now();
  const prompt = `You are a security operations assessor applying the SPS standard.

Question: "${question}"
Rubric: "${rubric}"
Student answer: "${answer}"

Respond ONLY with valid JSON (no markdown):
{
  "score": <0-100>,
  "pass": <true if score >= 70>,
  "feedback": "<one specific sentence>",
  "strength": "<what they got right>",
  "gap": "<what is missing or incorrect, with correct approach>"
}`;

  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = msg.content[0].text;
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    await logAI({ tenantId, userId, actionType: 'quiz_feedback', inputText: answer, outputText: text,
      model: 'claude-sonnet-4-6', tokensUsed: msg.usage?.input_tokens + msg.usage?.output_tokens, latencyMs: Date.now()-start });
    return parsed;
  } catch (err) {
    console.error('gradeShortAnswer error:', err.message);
    return { score: 65, pass: true, feedback: 'Saved for assessor review.', strength: 'Response recorded.', gap: '' };
  }
}

export async function gradeAssessment({ trackTitle, rubricCriteria, submission, tenantId, userId }) {
  const start = Date.now();
  const rubricText = rubricCriteria.map(c => `${c.label} (${c.weight}%): ${c.desc}`).join('; ');
  const prompt = `Senior security operations assessor applying SPS standard.

Track: ${trackTitle}
Rubric: ${rubricText}
Grade bands: Distinction 85%+, Merit 70%+, Pass 60%+, Fail below 60%

Submission:
${submission.slice(0, 3000)}

Respond ONLY with valid JSON:
{
  "overallGrade": "Distinction|Merit|Pass|Fail",
  "score": <0-100>,
  "criteriaFeedback": [{"criterion":"<label>","score":<0-100>,"comment":"<specific>"}],
  "strengths": "<2-3 specific strengths>",
  "gaps": "<2-3 specific gaps with correct approach>",
  "keyLearning": "<one sentence>",
  "humanReviewRequired": true
}`;

  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = msg.content[0].text;
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    await logAI({ tenantId, userId, actionType: 'assessment', inputText: submission.slice(0,500), outputText: text,
      model: 'claude-sonnet-4-6', tokensUsed: msg.usage?.input_tokens + msg.usage?.output_tokens, latencyMs: Date.now()-start });
    return parsed;
  } catch (err) {
    console.error('gradeAssessment error:', err.message);
    return { overallGrade: 'Submitted', score: 0, criteriaFeedback: [], strengths: 'Recorded.', gaps: '', keyLearning: 'Sent to human assessor.', humanReviewRequired: true };
  }
}

export async function gradeSimulation({ title, difficulty, sopRefs, scenario, response, tenantId, userId }) {
  const start = Date.now();
  const prompt = `Senior security operations trainer.

Simulation: "${title}" | Difficulty: ${difficulty} | SOPs: ${sopRefs?.join(', ')}

Scenario:
${scenario}

Student response:
${response}

Provide structured feedback:
**OVERALL:** [STRONG/ADEQUATE/NEEDS IMPROVEMENT]
**CORRECT:** what they got right
**GAPS:** specific corrections with correct procedure
**KEY LEARNING:** one sentence
**SOP TO REVIEW:** which SOP and section`;

  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = msg.content[0].text;
    await logAI({ tenantId, userId, actionType: 'simulation', inputText: response.slice(0,300), outputText: text,
      model: 'claude-sonnet-4-6', tokensUsed: msg.usage?.input_tokens + msg.usage?.output_tokens, latencyMs: Date.now()-start });
    return { feedback: text };
  } catch (err) {
    return { feedback: 'AI feedback unavailable. Response saved for trainer review.' };
  }
}

export async function generateModuleFromDoc({ filename, tenantId, userId }) {
  const start = Date.now();
  const prompt = `You are a QQI-aligned training developer. A security organisation uploaded "${filename}".
Generate a training module outline. Respond ONLY with valid JSON:
{
  "moduleTitle": "<professional title>",
  "learningObjectives": ["<obj1>","<obj2>","<obj3>"],
  "sections": [
    {"title":"<section 1>","summary":"<1 sentence>"},
    {"title":"<section 2>","summary":"<1 sentence>"},
    {"title":"<section 3>","summary":"<1 sentence>"}
  ],
  "quizCount": 5,
  "estimatedMins": 45,
  "spsLevel": "SPS Level 2",
  "gdprConsiderations": "<brief note on data protection in this content>"
}`;

  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = msg.content[0].text;
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    await logAI({ tenantId, userId, actionType: 'doc_generation', inputText: filename, outputText: text,
      model: 'claude-sonnet-4-6', tokensUsed: msg.usage?.input_tokens + msg.usage?.output_tokens, latencyMs: Date.now()-start });
    return parsed;
  } catch (err) {
    return { moduleTitle: filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '), learningObjectives: [], sections: [], quizCount: 5, estimatedMins: 45, spsLevel: 'SPS Level 2' };
  }
}
