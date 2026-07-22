ALTER TABLE public.media
  DROP CONSTRAINT IF EXISTS media_format_check;

ALTER TABLE public.media
  ADD CONSTRAINT media_format_check
  CHECK (format IN ('pdf', 'ebook', 'website', 'video', 'audio', 'presentasi', 'other'));
