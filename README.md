# SecurePathway v5

Professional Security Operations Training Platform — full-stack production build.

**Stack:** React 19 + Vite · Node/Express · PostgreSQL · Anthropic API  
**Standard:** SPS (SecurePathway Professional Standard) — Levels 1–4  
**Languages:** EN / GA (Irish) / FR / AR (RTL)

---

## Quick Start

### 1. Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Anthropic API key (for AI grading and simulation feedback)

### 2. Database

```bash
createdb securepathway
psql securepathway < server/db/schema.sql
psql securepathway < server/db/seed.sql   # 7 demo users
```

### 3. Environment

```bash
cp .env.example .env
# Required: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, ANTHROPIC_API_KEY
# Optional: SMTP_* for email, LRS_* for xAPI/SCORM
```

### 4. Install + run

```bash
npm install
npm install --workspace=server
npm install --workspace=client
npm run dev          # server :3001 + client :5173
```

---

## Architecture

```
securepathway/
├── client/                  React 19 + Vite
│   └── src/
│       ├── pages/           Landing · Login · Register · Training · Onboarding · Admin
│       ├── hooks/           useAuth · useProgress · useLang
│       ├── data/            curriculum · quizzes · sops · simulations · langs …
│       ├── lib/             api.js (axios + JWT auto-refresh)
│       └── components/      atoms · layout
└── server/                  Express API
    ├── routes/              auth · mfa · progress · quiz · assessment · admin · cohorts · certificates
    ├── middleware/           auth · rateLimit · tenantScope
    ├── db/                  schema.sql · seed.sql · migrate.js · pool.js
    └── lib/                 ai.js · email.js · totp.js · xapi.js
```

---

## API Routes

```
POST /api/auth/register
POST /api/auth/login          → returns mfaRequired:true if TOTP enabled
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me

POST /api/mfa/setup           → generate TOTP secret + QR URL
POST /api/mfa/confirm         → activate MFA with first code
POST /api/mfa/verify          → verify during login
DELETE /api/mfa/disable

GET  /api/progress
PATCH /api/progress/:moduleId
GET  /api/progress/spaced     → Leitner box items due today
POST /api/progress/spaced     → flag wrong answer (box_level = 1)
PATCH /api/progress/spaced/:id { correct: bool } → Leitner promotion/demotion

POST /api/quiz/short-answer   → AI grading (Anthropic)
POST /api/quiz/response

POST /api/assessment/submit   → AI rubric assessment → xAPI emit
POST /api/assessment/simulation → AI feedback → xAPI emit
GET  /api/assessment/portfolio
GET  /api/assessment/certificates
POST /api/assessment/certificates

GET  /api/certificates/:id/pdf        → SVG certificate download
GET  /api/certificates/verify/:code  → public verification

GET  /api/cohorts
POST /api/cohorts
GET  /api/cohorts/:id
POST /api/cohorts/:id/members
DELETE /api/cohorts/:id/members/:userId
POST /api/cohorts/:id/nudge    → sends nudge emails to inactive members
PATCH /api/cohorts/:id

GET  /api/admin/team
GET  /api/admin/team/:userId
GET  /api/admin/assessments    → pending human sign-off queue
POST /api/admin/assessments/:id/sign
POST /api/admin/invite         → creates invite token + sends email
GET  /api/admin/ai-log
POST /api/admin/documents      → AI document → module generation
GET  /api/admin/documents
POST /api/admin/certificates/:id/sign
GET  /api/admin/gdpr/export/:userId
DELETE /api/admin/gdpr/delete/:userId

GET  /api/health
```

---

## Key Features

### Learning Engine
- **Hook Scenario** → Content → Mixed Quiz (MCQ/Scenario/ShortAnswer/Matching) → Spaced Rep → Portfolio → Assessment
- **Leitner Spaced Repetition**: 5-box algorithm (1→3→7→14 days → retired)
- **AI grading**: Short answers, simulations, and track assessments via Anthropic (server-proxied)
- **Human sign-off**: All SPS credentials require assessor review in Admin portal
- **Adaptive feedback**: 95%+ on 3+ modules → early assessment suggestion; <60% → remediation prompt

### B2B Features
- Multi-tenant: all DB queries scoped to `tenant_id`
- Admin portal: team tracker, cohort management, assessor sign-off, AI log, document training, GDPR matrix
- Cohort management: create intake batches, set deadlines, nudge inactive learners (sends email)
- Document upload: AI generates training module from company SOP/policy PDF

### Auth & Security
- JWT (15min) + refresh token (30d)
- TOTP/MFA: setup → confirm → login challenge flow
- Rate limiting on auth and AI endpoints
- bcryptjs password hashing

### Certificates
- SVG certificate with SHA-256 verification code
- GET /api/certificates/:id/pdf — downloadable directly from Training portal
- LinkedIn share button on certificate card
- Email notification on certificate issue

### xAPI / LRS
- Statements emitted on: module complete, track assessment, simulation attempt
- Stored locally in `xapi_statements` table
- Optional: forward to external LRS (SCORM Cloud, Learning Locker) via LRS_ENDPOINT

### Email
- nodemailer SMTP transport (Postmark, Mailgun, AWS SES, Gmail SMTP)
- Invitation emails with tokenised registration link
- Cohort nudge emails to inactive learners
- Certificate issue notification

---

## Demo Accounts (after seed.sql)

| Email | Password | Role |
|-------|----------|------|
| sarah@acme.ie | SecurePass1! | Learner (SOC track) |
| eoin@acme.ie  | SecurePass1! | Manager |
| declan@acme.ie | SecurePass1! | Learner (INTEL track) |

---

## Production Deployment

```bash
npm run build                     # builds client to client/dist
NODE_ENV=production node server/index.js
```

Set environment variables and ensure PostgreSQL is accessible. The Express server serves the built React app. Recommended: Render, Railway, or a VPS with nginx proxy.

**Before going live:**
1. Change all JWT secrets to random 64+ char strings
2. Remove seed.sql data (or change all passwords)  
3. Configure SMTP credentials
4. Set CLIENT_URL to your domain
5. Run `psql securepathway < server/db/schema.sql` on production DB

