// xAPI (Tin Can API) statement emitter
// Sends statements to configured LRS endpoint or logs locally
// Spec: https://github.com/adlnet/xAPI-Spec

const pool = require('../db/pool');

function makeStatement({ actorEmail, actorName, verb, objectId, objectName, result, contextExtensions }) {
  return {
    version: '1.0.3',
    timestamp: new Date().toISOString(),
    actor: {
      objectType: 'Agent',
      name: actorName,
      mbox: `mailto:${actorEmail}`,
    },
    verb: {
      id: verb.id,
      display: { 'en-US': verb.display },
    },
    object: {
      objectType: 'Activity',
      id: objectId,
      definition: {
        name: { 'en-US': objectName },
        type: 'http://adlnet.gov/expapi/activities/lesson',
      },
    },
    ...(result && { result }),
    context: {
      platform: 'SecurePathway',
      language: 'en-IE',
      extensions: {
        'https://securepathway.io/xapi/ext/sps-standard': 'SPS Level 1-4',
        ...contextExtensions,
      },
    },
  };
}

async function emit(statement, tenantId) {
  const lrsEndpoint = process.env.LRS_ENDPOINT;
  const lrsKey = process.env.LRS_KEY;
  const lrsSecret = process.env.LRS_SECRET;

  // Store locally always
  try {
    await pool.query(
      'INSERT INTO xapi_statements (tenant_id, statement) VALUES ($1, $2)',
      [tenantId, JSON.stringify(statement)]
    );
  } catch (e) {
    // Table may not exist yet — non-fatal
  }

  // Forward to LRS if configured
  if (lrsEndpoint && lrsKey) {
    try {
      const credentials = Buffer.from(`${lrsKey}:${lrsSecret || ''}`).toString('base64');
      await fetch(`${lrsEndpoint}/statements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Experience-API-Version': '1.0.3',
          Authorization: `Basic ${credentials}`,
        },
        body: JSON.stringify(statement),
      });
    } catch (e) {
      console.error('xAPI LRS forward failed:', e.message);
    }
  }
}

// Standard verbs
const VERBS = {
  completed:   { id: 'http://adlnet.gov/expapi/verbs/completed',   display: 'completed' },
  passed:      { id: 'http://adlnet.gov/expapi/verbs/passed',       display: 'passed' },
  failed:      { id: 'http://adlnet.gov/expapi/verbs/failed',       display: 'failed' },
  attempted:   { id: 'http://adlnet.gov/expapi/verbs/attempted',    display: 'attempted' },
  experienced: { id: 'http://adlnet.gov/expapi/verbs/experienced',  display: 'experienced' },
  earned:      { id: 'http://adlnet.gov/expapi/verbs/earned',       display: 'earned' },
};

async function emitModuleComplete({ user, moduleId, moduleTitle, score, tenantId }) {
  const verb = score >= 80 ? VERBS.passed : VERBS.attempted;
  const statement = makeStatement({
    actorEmail: user.email,
    actorName: user.name,
    verb,
    objectId: `https://securepathway.io/modules/${moduleId}`,
    objectName: moduleTitle,
    result: {
      score: { scaled: score / 100, raw: score, min: 0, max: 100 },
      success: score >= 80,
      completion: true,
    },
    contextExtensions: { 'https://securepathway.io/xapi/ext/module-id': moduleId },
  });
  await emit(statement, tenantId);
}

async function emitTrackComplete({ user, trackId, trackTitle, score, credentialCode, tenantId }) {
  const statement = makeStatement({
    actorEmail: user.email,
    actorName: user.name,
    verb: VERBS.earned,
    objectId: `https://securepathway.io/tracks/${trackId}`,
    objectName: `${trackTitle} — SPS Certificate`,
    result: {
      score: { scaled: score / 100, raw: score, min: 0, max: 100 },
      success: true,
      completion: true,
      extensions: {
        'https://securepathway.io/xapi/ext/credential-code': credentialCode,
      },
    },
  });
  await emit(statement, tenantId);
}

async function emitSimulationAttempt({ user, simTitle, tenantId }) {
  const statement = makeStatement({
    actorEmail: user.email,
    actorName: user.name,
    verb: VERBS.experienced,
    objectId: `https://securepathway.io/simulations/${encodeURIComponent(simTitle)}`,
    objectName: simTitle,
  });
  await emit(statement, tenantId);
}

module.exports = { emitModuleComplete, emitTrackComplete, emitSimulationAttempt, VERBS };
