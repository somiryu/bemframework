-- ==========================================================
-- BEM PLATFORM - POSTGRESQL LOCAL SCHEMA
-- Extracted directly from Supabase Cloud (Project: bem)
-- ==========================================================

-- Enable UUID extension if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. COURSE WORLDS TABLE
CREATE TABLE IF NOT EXISTS public.course_worlds (
    id SERIAL PRIMARY KEY,
    order_index INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    narrative_place TEXT NOT NULL,
    narrative_objective TEXT NOT NULL,
    narrative_mentor TEXT NOT NULL,
    narrative_intro JSONB NOT NULL DEFAULT '[]'::jsonb,
    narrative_outro JSONB NOT NULL DEFAULT '[]'::jsonb,
    workshop_modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    training_modules JSONB NOT NULL DEFAULT '{}'::jsonb,
    design_modules JSONB NOT NULL DEFAULT '{}'::jsonb,
    wiki_modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. COURSE INSTANCES TABLE
CREATE TABLE IF NOT EXISTS public.course_instances (
    code TEXT PRIMARY KEY,
    unlocked_worlds JSONB NOT NULL DEFAULT '[1]'::jsonb,
    current_workshop_state JSONB NOT NULL DEFAULT '{"world_id": 1, "slide_index": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SUPER USER TABLE (Facilitators & Administrators)
CREATE TABLE IF NOT EXISTS public.super_user (
    email TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. COURSE PLAYERS TABLE
CREATE TABLE IF NOT EXISTS public.course_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_code TEXT REFERENCES public.course_instances(code) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    alias TEXT NOT NULL,
    avatar TEXT,
    coins INTEGER NOT NULL DEFAULT 0,
    game_state JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT course_players_instance_code_email_key UNIQUE (instance_code, email)
);

-- 5. WORKSHOP FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.workshop_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_code TEXT REFERENCES public.course_instances(code) ON DELETE CASCADE,
    world_id INTEGER REFERENCES public.course_worlds(id) ON DELETE CASCADE,
    player_name TEXT NOT NULL,
    rating_engagement INTEGER NOT NULL,
    rating_difficulty INTEGER NOT NULL,
    rating_pace INTEGER NOT NULL,
    rating_relevance INTEGER NOT NULL,
    comment TEXT,
    allow_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. AI CHAT MESSAGES TABLE (GIOCHI AI logs)
CREATE TABLE IF NOT EXISTS public.ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    player_id UUID REFERENCES public.course_players(id) ON DELETE SET NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    lang TEXT NOT NULL DEFAULT 'es',
    is_fallback BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. BLOG REACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.blog_reactions (
    slug VARCHAR PRIMARY KEY,
    claps INTEGER NOT NULL DEFAULT 0,
    hearts INTEGER NOT NULL DEFAULT 0,
    shares INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 8. LEADERBOARD TABLE
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    xp INTEGER NOT NULL DEFAULT 0,
    cards_collected INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 9. QUOTES TABLE
CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR NOT NULL,
    client_email VARCHAR NOT NULL,
    audience VARCHAR,
    friction_type VARCHAR,
    product_format VARCHAR,
    estimated_price INTEGER,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ==========================================================
-- RPC FUNCTIONS
-- ==========================================================

CREATE OR REPLACE FUNCTION public.is_super_user(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.super_user
    WHERE email = email_to_check
  );
END;
$$;

-- super_user.password is a pgcrypto bf-hash (crypt(password, gen_salt('bf'))),
-- never plaintext. This is the only way the app compares a submitted
-- password against it — see loginAdmin in routes/admin/+page.server.ts.
CREATE OR REPLACE FUNCTION public.verify_super_user_password(email_to_check TEXT, password_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.super_user
    WHERE email = email_to_check
      AND password = crypt(password_to_check, password)
  );
END;
$$;


-- ==========================================================
-- TALLERES EN VIVO (/[lang]/taller) — p. ej. «¿Quién tiene la cabeza?»
-- ----------------------------------------------------------
-- Independiente de course_* (/learn). Una sesión es una sala con código;
-- los participantes entran solo con su email; cada respuesta es una fila por
-- (sesión, participante, slide). Solo el servidor (service_role) lee y escribe:
-- RLS activo y sin políticas, así que la anon key del navegador no ve nada.
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.taller_sessions (
    code TEXT PRIMARY KEY,
    workshop TEXT NOT NULL,
    title TEXT NOT NULL,
    state JSONB NOT NULL DEFAULT '{"step": 0, "phase": "vote"}'::jsonb,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.taller_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_code TEXT NOT NULL REFERENCES public.taller_sessions(code) ON DELETE CASCADE,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT taller_participants_session_email_key UNIQUE (session_code, email)
);

CREATE TABLE IF NOT EXISTS public.taller_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_code TEXT NOT NULL REFERENCES public.taller_sessions(code) ON DELETE CASCADE,
    participant_id UUID NOT NULL REFERENCES public.taller_participants(id) ON DELETE CASCADE,
    slide_id TEXT NOT NULL,
    choice INTEGER,
    scale INTEGER,
    text TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT taller_responses_unique_answer UNIQUE (session_code, participant_id, slide_id)
);

CREATE INDEX IF NOT EXISTS taller_responses_session_slide_idx
    ON public.taller_responses (session_code, slide_id);

CREATE INDEX IF NOT EXISTS taller_responses_participant_idx
    ON public.taller_responses (participant_id);

ALTER TABLE public.taller_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taller_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taller_responses ENABLE ROW LEVEL SECURITY;
