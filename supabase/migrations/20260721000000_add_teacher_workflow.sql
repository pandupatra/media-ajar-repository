ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS madrasah text,
  ADD COLUMN IF NOT EXISTS teaching_subject text,
  ADD COLUMN IF NOT EXISTS phone text;

ALTER TABLE public.media
  ADD COLUMN IF NOT EXISTS pending_changes jsonb,
  ADD COLUMN IF NOT EXISTS pending_submitted_at timestamptz;

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  constraint_name text;
BEGIN
  FOR constraint_name IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'public.media'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%status%'
  LOOP
    EXECUTE format('ALTER TABLE public.media DROP CONSTRAINT %I', constraint_name);
  END LOOP;
END $$;

ALTER TABLE public.media
  ADD CONSTRAINT media_status_check
  CHECK (status IN ('draft', 'pending', 'published'));

CREATE OR REPLACE FUNCTION public.handle_teacher_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, madrasah, teaching_subject, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'name'), ''),
    'contributor',
    NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'madrasah'), ''),
    NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'teaching_subject'), ''),
    NULLIF(BTRIM(NEW.raw_user_meta_data ->> 'phone'), '')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    madrasah = EXCLUDED.madrasah,
    teaching_subject = EXCLUDED.teaching_subject,
    phone = EXCLUDED.phone;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_teacher_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_teacher_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_teacher_signup();

CREATE OR REPLACE FUNCTION public.approve_media_revision(target_media_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  changes jsonb;
BEGIN
  SELECT pending_changes INTO changes
  FROM public.media
  WHERE id = target_media_id
  FOR UPDATE;

  IF changes IS NULL THEN
    RAISE EXCEPTION 'No pending revision for media %', target_media_id;
  END IF;

  UPDATE public.media SET
    title = changes ->> 'title',
    slug = changes ->> 'slug',
    description = changes ->> 'description',
    format = changes ->> 'format',
    type = changes ->> 'type',
    file_url = NULLIF(changes ->> 'file_url', ''),
    external_url = NULLIF(changes ->> 'external_url', ''),
    thumbnail_url = NULLIF(changes ->> 'thumbnail_url', ''),
    file_size = NULLIF(changes ->> 'file_size', '')::bigint,
    pending_changes = NULL,
    pending_submitted_at = NULL,
    updated_at = now()
  WHERE id = target_media_id;

  DELETE FROM public.media_categories WHERE media_id = target_media_id;
  INSERT INTO public.media_categories (media_id, category_id)
  SELECT target_media_id, value::uuid
  FROM jsonb_array_elements_text(COALESCE(changes -> 'category_ids', '[]'::jsonb));
END;
$$;

REVOKE ALL ON FUNCTION public.approve_media_revision(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.approve_media_revision(uuid) TO service_role;

DROP POLICY IF EXISTS "media_select" ON public.media;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.media;
CREATE POLICY "media_select" ON public.media
  FOR SELECT USING (
    status = 'published'
    OR created_by = auth.uid()
    OR public.is_admin(auth.uid())
  );

DO $$
DECLARE
  policy_name text;
BEGIN
  FOR policy_name IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'media' AND cmd <> 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.media', policy_name);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "media_thumbnails_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "media_thumbnails_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "media_thumbnails_authenticated_delete" ON storage.objects;
DROP POLICY IF EXISTS "media_files_authenticated_upload" ON storage.objects;
DROP POLICY IF EXISTS "media_files_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "media_files_authenticated_delete" ON storage.objects;
