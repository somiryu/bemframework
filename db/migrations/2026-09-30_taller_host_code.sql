-- Co-facilitator access per room: the main facilitator generates a code in
-- the room's controls; whoever has it can drive that room only (no reset, no
-- CSV, no /admin). NULL = no co-facilitator. Regenerating or revoking it
-- invalidates the previous one immediately.
ALTER TABLE public.taller_sessions ADD COLUMN IF NOT EXISTS host_code TEXT;
