-- «OMIE · Sala de Crisis» (/[lang]/taller con workshop = 'sala-de-crisis').
-- Cada cadete tiene un alias visible, un gremio y un mentor de cabecera.
-- Son opcionales para no afectar a los talleres que ya existen
-- («¿Quién tiene la cabeza?» no los usa).
ALTER TABLE public.taller_participants ADD COLUMN IF NOT EXISTS alias TEXT;
ALTER TABLE public.taller_participants ADD COLUMN IF NOT EXISTS guild TEXT;
ALTER TABLE public.taller_participants ADD COLUMN IF NOT EXISTS mentor TEXT;
