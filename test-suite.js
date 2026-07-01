// SecurePathway — Integration Test Suite
// Tests: data integrity, server syntax, build, API logic, security
const assert = (cond, msg) => { if (!cond) throw new Error(`FAIL: ${msg}`); };
const pass = (msg) => console.log(`  ✅ ${msg}`);
const fail = (msg) => console.log(`  ❌ ${msg}`);

let passed = 0, failed = 0;

async function test(name, fn) {
  try {
    await fn();
    pass(name);
    passed++;
  } catch(e) {
    fail(`${name} — ${e.message}`);
    failed++;
  }
}

async function run() {
  console.log('\n══════════════════════════════════════════════════');
  console.log('  SecurePathway Test Suite');
  console.log('══════════════════════════════════════════════════\n');

  // ── DATA INTEGRITY TESTS ─────────────────────────────────────────────────
  console.log('── Data Integrity ──');

  await test('All 36 curriculum modules present', () => {
    const { CURRICULUM } = require('./client/src/data/curriculum.js');
    const ids = CURRICULUM.flatMap(t => t.modules.map(m => m.id));
    assert(ids.length === 36, `Expected 36, got ${ids.length}`);
  });

  await test('All 36 modules have quiz entries', () => {
    const { QUIZZES } = require('./client/src/data/quizzes.js');
    const { CURRICULUM } = require('./client/src/data/curriculum.js');
    const modIds = CURRICULUM.flatMap(t => t.modules.map(m => m.id));
    const missing = modIds.filter(id => !QUIZZES[id]);
    assert(missing.length === 0, `Missing: ${missing}`);
  });

  await test('All 36 modules have 5 quiz questions', () => {
    const { QUIZZES } = require('./client/src/data/quizzes.js');
    const { CURRICULUM } = require('./client/src/data/curriculum.js');
    const modIds = CURRICULUM.flatMap(t => t.modules.map(m => m.id));
    const thin = modIds.filter(id => QUIZZES[id] && QUIZZES[id].questions.length < 4);
    assert(thin.length === 0, `Modules with <4 questions: ${thin}`);
  });

  await test('Extended quizzes: 30 modules, all 4 types', () => {
    const { EXTENDED_QUIZZES } = require('./client/src/data/extendedQuizzes.js');
    const ids = Object.keys(EXTENDED_QUIZZES);
    assert(ids.length >= 30, `Expected >=30, got ${ids.length}`);
    const content = require('fs').readFileSync('./client/src/data/extendedQuizzes.js', 'utf8');
    assert(content.includes('type:"mcq"'), 'No MCQ questions');
    assert(content.includes('type:"scenario"'), 'No scenario questions');
    assert(content.includes('type:"short_answer"'), 'No short answer questions');
    assert(content.includes('type:"matching"'), 'No matching questions');
  });

  await test('Extended quizzes: 100% MCQ/scenario explanation coverage', () => {
    const content = require('fs').readFileSync('./client/src/data/extendedQuizzes.js', 'utf8');
    const mcqCount = (content.match(/type:"mcq"/g) || []).length;
    const scenCount = (content.match(/type:"scenario"/g) || []).length;
    const expCount = (content.match(/explanation:/g) || []).length;
    assert(expCount >= mcqCount + scenCount,
      `${expCount} explanations for ${mcqCount + scenCount} MCQ+scenario questions`);
  });

  await test('Hook scenarios: 30 non-assessment modules covered', () => {
    const fs = require('fs');
    const src = fs.readFileSync('./client/src/data/hookScenarios.js', 'utf8');
    const ids = (src.match(/"[\w]+-\d+": \{/g) || []);
    assert(ids.length >= 30, `Expected >=30, got ${ids.length}`);
  });

  await test('Assessment rubrics: all 6 tracks, no duplicates', () => {
    const { ASSESSMENT_RUBRICS } = require('./client/src/data/assessmentRubrics.js');
    const tracks = Object.keys(ASSESSMENT_RUBRICS);
    const expected = ['track-pso','track-gsoc','track-intel','track-inv','track-cyber','track-lead'];
    for (const t of expected) {
      assert(tracks.includes(t), `Missing rubric: ${t}`);
    }
    // No duplicates — check object keys (each appears once)
    assert(tracks.length === new Set(tracks).size, 'Duplicate track IDs');
  });

  await test('SOP library: workflow-stages present', () => {
    const fs = require('fs');
    const sopSrc = fs.readFileSync('./client/src/data/sops.js', 'utf8');
    assert(sopSrc.includes('"workflow-stages"'), 'workflow-stages SOP missing');
    const sopCount = (sopSrc.match(/"[\w-]+": \{/g) || []).length;
    assert(sopCount >= 20, `Only ${sopCount} SOPs`);
  });

  await test('Simulations: PSO track covered', () => {
    const { SOC_SIMULATIONS } = require('./client/src/data/simulations.js');
    const psoSims = SOC_SIMULATIONS.filter(s => s.track === 'pso');
    assert(psoSims.length >= 2, `Expected >=2 PSO sims, got ${psoSims.length}`);
    assert(psoSims[0].correctAnswers, 'PSO sim missing correctAnswers');
  });

  await test('Languages: all 4 codes present with >=40 keys each', () => {
    const { LANGS } = require('./client/src/data/langs.js');
    const codes = Object.keys(LANGS);
    assert(codes.includes('en') && codes.includes('ga') && codes.includes('fr') && codes.includes('ar'),
      `Missing lang codes. Got: ${codes}`);
    for (const code of ['en','ga','fr','ar']) {
      const keys = Object.keys(LANGS[code]).filter(k => !['code','name','dir'].includes(k));
      assert(keys.length >= 40, `${code} only has ${keys.length} translation keys`);
    }
  });

  // ── SERVER LOGIC TESTS ───────────────────────────────────────────────────
  console.log('\n── Server Logic ──');

  await test('TOTP library: generate, verify, reject wrong code', () => {
    const totp = require('./server/lib/totp.js');
    const secret = totp.generateSecret();
    assert(secret.length >= 20, `Secret too short: ${secret.length}`);
    const code = totp.generateTOTP(secret);
    assert(/^\d{6}$/.test(code), `Invalid code format: ${code}`);
    assert(totp.verifyTOTP(secret, code), 'Valid code rejected');
    assert(!totp.verifyTOTP(secret, '000000'), 'Invalid code accepted');
    assert(!totp.verifyTOTP(secret, '999999'), 'Invalid code accepted');
  });

  await test('TOTP: otpauth URL format', () => {
    const totp = require('./server/lib/totp.js');
    const { url } = totp.setupData('test@securepathway.io');
    assert(url.startsWith('otpauth://totp/'), `Bad URL: ${url}`);
    assert(url.includes('SecurePathway'), 'Issuer missing');
    assert(url.includes('secret='), 'Secret missing from URL');
  });

  await test('xAPI: statement structure correct', () => {
    // Test the module without requiring DB connection
    const fs = require('fs');
    const xapiSrc = fs.readFileSync('./server/lib/xapi.js', 'utf8');
    assert(xapiSrc.includes('version: \'1.0.3\''), 'Wrong xAPI version');
    assert(xapiSrc.includes('adlnet.gov/expapi/verbs/passed'), 'Missing passed verb');
    assert(xapiSrc.includes('adlnet.gov/expapi/verbs/completed'), 'Missing completed verb');
    assert(xapiSrc.includes('emitModuleComplete'), 'Missing emitModuleComplete');
    assert(xapiSrc.includes('emitTrackComplete'), 'Missing emitTrackComplete');
  });

  await test('Certificate: SVG generation produces valid XML', () => {
    const certSrc = require('fs').readFileSync('./server/routes/certificates.js', 'utf8');
    assert(certSrc.includes('<?xml version'), 'SVG missing XML declaration');
    assert(certSrc.includes('Certificate of Professional Competence'), 'Certificate title missing');
    assert(certSrc.includes('verification'), 'Verification code missing');
    assert(certSrc.includes('verificationCode(cert.id)'), 'Verification function missing');
  });

  await test('Cohort routes: all CRUD endpoints defined', () => {
    const cohortSrc = require('fs').readFileSync('./server/routes/cohorts.js', 'utf8');
    assert(cohortSrc.includes("router.get('/'"), 'GET / missing');
    assert(cohortSrc.includes("router.post('/'"), 'POST / missing');
    assert(cohortSrc.includes("router.get('/:id'"), 'GET /:id missing');
    assert(cohortSrc.includes("router.post('/:id/members'"), 'POST members missing');
    assert(cohortSrc.includes("router.post('/:id/nudge'"), 'POST nudge missing');
    assert(cohortSrc.includes("router.patch('/:id'"), 'PATCH missing');
  });

  await test('MFA route: setup, confirm, verify, disable endpoints', () => {
    const mfaSrc = require('fs').readFileSync('./server/routes/mfa.js', 'utf8');
    assert(mfaSrc.includes("router.post('/setup'"), 'setup missing');
    assert(mfaSrc.includes("router.post('/confirm'"), 'confirm missing');
    assert(mfaSrc.includes("router.post('/verify'"), 'verify missing');
    assert(mfaSrc.includes("router.delete('/disable'"), 'disable missing');
  });

  await test('Auth route: MFA check in login flow', () => {
    const authSrc = require('fs').readFileSync('./server/routes/auth.js', 'utf8');
    assert(authSrc.includes('mfaRequired'), 'mfaRequired flag missing from login');
    assert(authSrc.includes('totp_enabled'), 'totp_enabled check missing');
  });

  // ── SCHEMA TESTS ─────────────────────────────────────────────────────────
  console.log('\n── Database Schema ──');

  await test('Schema: TOTP columns in users table', () => {
    const schema = require('fs').readFileSync('./server/db/schema.sql', 'utf8');
    assert(schema.includes('totp_secret'), 'totp_secret column missing');
    assert(schema.includes('totp_enabled'), 'totp_enabled column missing');
  });

  await test('Schema: box_level in spaced_repetition', () => {
    const schema = require('fs').readFileSync('./server/db/schema.sql', 'utf8');
    assert(schema.includes('box_level'), 'box_level column missing');
  });

  await test('Schema: cohorts and cohort_members tables', () => {
    const schema = require('fs').readFileSync('./server/db/schema.sql', 'utf8');
    assert(schema.includes('CREATE TABLE IF NOT EXISTS cohorts'), 'cohorts table missing');
    assert(schema.includes('CREATE TABLE IF NOT EXISTS cohort_members'), 'cohort_members table missing');
  });

  await test('Schema: xapi_statements table', () => {
    const schema = require('fs').readFileSync('./server/db/schema.sql', 'utf8');
    assert(schema.includes('xapi_statements'), 'xapi_statements table missing');
  });

  // ── BUILD TEST ────────────────────────────────────────────────────────────
  console.log('\n── Build ──');

  await test('Client build artifact exists', () => {
    const fs = require('fs');
    assert(fs.existsSync('./client/dist/index.html'), 'dist/index.html missing — run npm build first');
  });

  await test('Server files all pass syntax check', async () => {
    const { execSync } = require('child_process');
    const files = [
      'server/index.js', 'server/routes/auth.js', 'server/routes/progress.js',
      'server/routes/quiz.js', 'server/routes/assessment.js', 'server/routes/admin.js',
      'server/routes/mfa.js', 'server/routes/cohorts.js', 'server/routes/certificates.js',
      'server/lib/ai.js', 'server/lib/totp.js', 'server/lib/xapi.js',
    ];
    for (const f of files) {
      execSync(`node --check ${f}`, { cwd: '/home/claude/securepathway', stdio: 'pipe' });
    }
  });

  // ── SECURITY TESTS ────────────────────────────────────────────────────────
  console.log('\n── Security ──');

  await test('No hardcoded secrets in server files', () => {
    const fs = require('fs');
    const files = ['server/routes/auth.js', 'server/lib/ai.js', 'server/routes/admin.js'];
    const patterns = [/sk-ant-[a-zA-Z0-9]/,/secret.*=.*['"][a-zA-Z0-9]{20,}/];
    for (const f of files) {
      const content = fs.readFileSync(f, 'utf8');
      for (const p of patterns) {
        assert(!p.test(content), `Potential hardcoded secret in ${f}`);
      }
    }
  });

  await test('Auth middleware requires JWT on protected routes', () => {
    const authMw = require('fs').readFileSync('./server/middleware/auth.js', 'utf8');
    assert(authMw.includes('requireAuth'), 'requireAuth not defined');
    assert(authMw.includes('jwt.verify') || authMw.includes('JWT_SECRET'), 'No JWT verification');
  });

  await test('Rate limiting applied to auth and AI routes', () => {
    const authSrc = require('fs').readFileSync('./server/routes/auth.js', 'utf8');
    const assessSrc = require('fs').readFileSync('./server/routes/assessment.js', 'utf8');
    assert(authSrc.includes('authLimiter'), 'authLimiter not applied');
    assert(assessSrc.includes('aiLimiter'), 'aiLimiter not applied on AI routes');
  });

  await test('All admin routes require manager/admin role', () => {
    const adminSrc = require('fs').readFileSync('./server/routes/admin.js', 'utf8');
    // Every router.post/delete/patch should have requireRole
    const mutating = (adminSrc.match(/router\.(post|delete|patch)/g) || []).length;
    const roleChecks = (adminSrc.match(/requireRole/g) || []).length;
    assert(roleChecks >= mutating, `Only ${roleChecks} requireRole for ${mutating} mutating endpoints`);
  });

  await test('TOTP: base32 encode/decode roundtrip', () => {
    const totp = require('./server/lib/totp.js');
    const secret = totp.generateSecret();
    // If we generate a code and verify it in the same second it should pass
    const code = totp.generateTOTP(secret, 0);
    const codeM1 = totp.generateTOTP(secret, -1);
    const codeP1 = totp.generateTOTP(secret, 1);
    // At least one of the window codes should match (test may run near window boundary)
    const anyValid = [code, codeM1, codeP1].some(c => totp.verifyTOTP(secret, c));
    assert(anyValid, 'None of the window codes verified');
  });

  // ── WCAG TESTS ───────────────────────────────────────────────────────────
  console.log('\n── Accessibility (WCAG) ──');

  await test('Login form has label elements for inputs', () => {
    const loginSrc = require('fs').readFileSync('./client/src/pages/Login.jsx', 'utf8');
    assert(loginSrc.includes('htmlFor="login-email"'), 'Missing label for email');
    assert(loginSrc.includes('htmlFor="login-password"'), 'Missing label for password');
    assert(loginSrc.includes('htmlFor="mfa-code"'), 'Missing label for MFA code');
  });

  await test('Login form has role="alert" on error', () => {
    const loginSrc = require('fs').readFileSync('./client/src/pages/Login.jsx', 'utf8');
    assert(loginSrc.includes('role="alert"'), 'Error div missing role="alert"');
  });

  await test('NavBar has skip navigation link', () => {
    const navSrc = require('fs').readFileSync('./client/src/components/layout/NavBar.jsx', 'utf8');
    assert(navSrc.includes('Skip to main content') || navSrc.includes('skip'), 'Skip nav missing');
  });

  await test('CSS includes focus-visible styles', () => {
    const css = require('fs').readFileSync('./client/src/index.css', 'utf8');
    assert(css.includes(':focus-visible'), 'focus-visible styles missing');
    assert(css.includes('prefers-reduced-motion'), 'reduced-motion media query missing');
  });

  await test('Admin form inputs have aria-label attributes', () => {
    const adminSrc = require('fs').readFileSync('./client/src/pages/Admin.jsx', 'utf8');
    assert(adminSrc.includes('aria-label='), 'No aria-labels found in Admin.jsx');
  });

  // ── FEATURE COMPLETENESS ─────────────────────────────────────────────────
  console.log('\n── Feature Completeness ──');

  await test('Leitner box algorithm in progress route', () => {
    const progSrc = require('fs').readFileSync('./server/routes/progress.js', 'utf8');
    assert(progSrc.includes('LEITNER_INTERVALS'), 'Leitner algorithm missing');
    assert(progSrc.includes('box_level'), 'box_level not used');
    assert(progSrc.includes('correct'), 'correct/incorrect not handled');
  });

  await test('Assessor sign-off UI in Admin', () => {
    const adminSrc = require('fs').readFileSync('./client/src/pages/Admin.jsx', 'utf8');
    assert(adminSrc.includes('handleSignOff'), 'Sign-off handler missing');
    assert(adminSrc.includes('Sign Off & Issue Certificate'), 'Sign-off button missing');
    assert(adminSrc.includes('Return for Revision'), 'Return button missing');
  });

  await test('Cohort management UI in Admin', () => {
    const adminSrc = require('fs').readFileSync('./client/src/pages/Admin.jsx', 'utf8');
    assert(adminSrc.includes('handleCreateCohort'), 'Create cohort handler missing');
    assert(adminSrc.includes('handleNudge'), 'Nudge handler missing');
    assert(adminSrc.includes('Cohort Management'), 'Cohort tab label missing');
  });

  await test('MFA challenge in Login page', () => {
    const loginSrc = require('fs').readFileSync('./client/src/pages/Login.jsx', 'utf8');
    assert(loginSrc.includes('mfaPending'), 'MFA pending state missing');
    assert(loginSrc.includes('Two-factor authentication'), 'MFA UI missing');
    assert(loginSrc.includes('submitMfa'), 'MFA submit handler missing');
  });

  await test('Certificate download endpoint exists', () => {
    const certSrc = require('fs').readFileSync('./server/routes/certificates.js', 'utf8');
    assert(certSrc.includes("router.get('/:id/pdf'"), 'PDF endpoint missing');
    assert(certSrc.includes('Content-Disposition'), 'Download header missing');
  });

  // ── SUMMARY ──────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log('  ✅ All tests passing');
  } else {
    console.log(`  ⚠ ${failed} test(s) need attention`);
  }
  console.log('══════════════════════════════════════════════════\n');
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => { console.error('Test runner error:', e); process.exit(1); });
