CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_email_format_check CHECK (position('@' in email) > 1)
);

CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT characters_xp_non_negative_check CHECK (xp >= 0),
  CONSTRAINT characters_level_positive_check CHECK (level >= 1)
);

CREATE TABLE quest_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  planned_duration_minutes INTEGER NOT NULL,
  actual_duration_seconds INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'created',
  started_at TIMESTAMPTZ,
  last_resumed_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT quest_sessions_planned_duration_positive_check CHECK (
    planned_duration_minutes > 0
  ),
  CONSTRAINT quest_sessions_actual_duration_non_negative_check CHECK (
    actual_duration_seconds >= 0
  ),
  CONSTRAINT quest_sessions_status_check CHECK (
    status IN ('created', 'active', 'paused', 'completed', 'cancelled')
  ),
  CONSTRAINT quest_sessions_end_after_start_check CHECK (
    ended_at IS NULL OR started_at IS NULL OR ended_at >= started_at
  )
);

CREATE INDEX idx_quest_sessions_user_id
  ON quest_sessions(user_id);

CREATE INDEX idx_quest_sessions_user_id_created_at
  ON quest_sessions(user_id, created_at DESC);

CREATE INDEX idx_quest_sessions_user_id_status
  ON quest_sessions(user_id, status);

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_characters_updated_at
BEFORE UPDATE ON characters
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_quest_sessions_updated_at
BEFORE UPDATE ON quest_sessions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
