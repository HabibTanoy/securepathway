-- SecurePathway v5 — PostgreSQL Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- TENANTS
CREATE TABLE IF NOT EXISTS tenants (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  region     TEXT NOT NULL DEFAULT 'IE',
  plan       TEXT NOT NULL DEFAULT 'individual',
  slug       TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id     UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email         TEXT UNIQUE NOT NULL,
  totp_secret   TEXT,
  totp_enabled  BOOLEAN NOT NULL DEFAULT FALSE,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  initials      TEXT NOT NULL DEFAULT '',
  role          TEXT NOT NULL DEFAULT 'learner',
  lang          TEXT NOT NULL DEFAULT 'en',
  active_track  TEXT,
  streak        INT NOT NULL DEFAULT 0,
  last_active   DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SESSIONS (refresh tokens)
CREATE TABLE IF NOT EXISTS sessions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT UNIQUE NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INVITATIONS
CREATE TABLE IF NOT EXISTS invitations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'learner',
  token       TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by  UUID REFERENCES users(id),
  accepted_at TIMESTAMPTZ,
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- MODULE PROGRESS
CREATE TABLE IF NOT EXISTS module_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id       TEXT NOT NULL,
  track_id        TEXT NOT NULL,
  sections_done   JSONB NOT NULL DEFAULT '{}',
  quiz_passed     BOOLEAN NOT NULL DEFAULT FALSE,
  quiz_score      INT,
  quiz_attempts   INT NOT NULL DEFAULT 0,
  hook_done       BOOLEAN NOT NULL DEFAULT FALSE,
  hook_response   TEXT,
  assessed        BOOLEAN NOT NULL DEFAULT FALSE,
  assess_score    INT,
  assess_passed   BOOLEAN NOT NULL DEFAULT FALSE,
  notes           TEXT,
  time_spent_secs INT NOT NULL DEFAULT 0,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- QUIZ RESPONSES
CREATE TABLE IF NOT EXISTS quiz_responses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id     TEXT NOT NULL,
  question_idx  INT NOT NULL,
  question_type TEXT NOT NULL,
  question_text TEXT NOT NULL,
  answer        JSONB,
  correct       BOOLEAN,
  ai_score      INT,
  ai_feedback   TEXT,
  ai_strength   TEXT,
  ai_gap        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SPACED REPETITION
CREATE TABLE IF NOT EXISTS spaced_repetition (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id     TEXT NOT NULL,
  question_idx  INT NOT NULL,
  question_text TEXT NOT NULL,
  next_due      TIMESTAMPTZ NOT NULL,
  attempts      INT NOT NULL DEFAULT 1,
  box_level     INT NOT NULL DEFAULT 1,
  resolved      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, module_id, question_idx)
);

-- EVIDENCE PORTFOLIO
CREATE TABLE IF NOT EXISTS portfolio_entries (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,
  module_id    TEXT NOT NULL,
  module_title TEXT NOT NULL,
  question     TEXT NOT NULL,
  answer       TEXT NOT NULL,
  ai_score     INT,
  ai_feedback  TEXT,
  rubric_json  JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CERTIFICATES
CREATE TABLE IF NOT EXISTS certificates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  track_id        TEXT NOT NULL,
  track_title     TEXT NOT NULL,
  credential_code TEXT,
  ai_score        INT,
  assessor_id     UUID REFERENCES users(id),
  assessor_signed BOOLEAN NOT NULL DEFAULT FALSE,
  signed_at       TIMESTAMPTZ,
  issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- AI LOG
CREATE TABLE IF NOT EXISTS ai_log (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id),
  tenant_id  UUID REFERENCES tenants(id),
  type       TEXT NOT NULL,
  detail     TEXT,
  tokens_in  INT,
  tokens_out INT,
  model      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- DOCUMENTS (company SOP uploads)
CREATE TABLE IF NOT EXISTS documents (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id        UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  uploaded_by      UUID REFERENCES users(id),
  filename         TEXT NOT NULL,
  file_size        INT,
  generated_module JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SOP BOOKMARKS
CREATE TABLE IF NOT EXISTS sop_bookmarks (
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sop_id     TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, sop_id)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_module_progress_user  ON module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_track ON module_progress(track_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_user   ON quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_spaced_rep_due        ON spaced_repetition(user_id, next_due) WHERE resolved = FALSE;
CREATE INDEX IF NOT EXISTS idx_portfolio_user        ON portfolio_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user     ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_log_tenant         ON ai_log(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_tenant          ON users(tenant_id);

-- UPDATE TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DO $$ DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['tenants','users','module_progress','spaced_repetition']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%I ON %I; CREATE TRIGGER trg_%I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at();', t, t, t, t);
  END LOOP;
END $$;

-- COHORTS
CREATE TABLE IF NOT EXISTS cohorts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  track_id    TEXT NOT NULL,
  deadline    DATE,
  description TEXT,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cohort_members (
  cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (cohort_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_cohorts_tenant ON cohorts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cohort_members ON cohort_members(cohort_id);

-- xAPI STATEMENTS
CREATE TABLE IF NOT EXISTS xapi_statements (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID REFERENCES tenants(id) ON DELETE CASCADE,
  statement   JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_xapi_tenant ON xapi_statements(tenant_id);
