CREATE TABLE public.media_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL CHECK (char_length(topic) BETWEEN 1 AND 150),
  subject text NOT NULL CHECK (char_length(subject) BETWEEN 1 AND 100),
  level text NOT NULL CHECK (char_length(level) BETWEEN 1 AND 100),
  preferred_format text NOT NULL CHECK (preferred_format IN ('pdf', 'ebook', 'website', 'video', 'audio', 'other')),
  notes text CHECK (char_length(notes) <= 1000),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'considering', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.media_suggestions ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.media_suggestions IS 'Anonymous teacher suggestions, accessed only through server-side admin clients.';
