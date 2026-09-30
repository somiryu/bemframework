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
