INSERT INTO public.categories (id, name, slug, type, icon, sort_order, is_active)
VALUES ('c6666666-6666-6666-6666-666666666666', 'Presentasi', 'presentasi', 'format', 'presentation', 6, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

ALTER TABLE public.media_suggestions
  DROP CONSTRAINT IF EXISTS media_suggestions_preferred_format_check;

ALTER TABLE public.media_suggestions
  ADD CONSTRAINT media_suggestions_preferred_format_check
  CHECK (preferred_format IN ('pdf', 'ebook', 'website', 'video', 'audio', 'presentasi', 'other'));
