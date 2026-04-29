-- 1. Configure media-thumbnails bucket (public, images only, 5MB limit)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media-thumbnails',
  'media-thumbnails',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Configure media-files bucket (public, PDFs + common doc types, 50MB limit)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media-files',
  'media-files',
  true,
  52428800,
  ARRAY['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip']
) ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'];

-- ==========================================
-- media-thumbnails policies
-- ==========================================

-- Public read: anyone can view thumbnails
CREATE POLICY "media_thumbnails_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media-thumbnails');

-- Authenticated upload
CREATE POLICY "media_thumbnails_authenticated_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media-thumbnails'
    AND auth.role() = 'authenticated'
  );

-- Authenticated update
CREATE POLICY "media_thumbnails_authenticated_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media-thumbnails')
  WITH CHECK (
    bucket_id = 'media-thumbnails'
    AND auth.role() = 'authenticated'
  );

-- Authenticated delete
CREATE POLICY "media_thumbnails_authenticated_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media-thumbnails'
    AND auth.role() = 'authenticated'
  );

-- ==========================================
-- media-files policies
-- ==========================================

-- Public read: anyone can download media files
CREATE POLICY "media_files_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media-files');

-- Authenticated upload
CREATE POLICY "media_files_authenticated_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media-files'
    AND auth.role() = 'authenticated'
  );

-- Authenticated update
CREATE POLICY "media_files_authenticated_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media-files')
  WITH CHECK (
    bucket_id = 'media-files'
    AND auth.role() = 'authenticated'
  );

-- Authenticated delete
CREATE POLICY "media_files_authenticated_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media-files'
    AND auth.role() = 'authenticated'
  );