-- Run this in your Supabase SQL Editor to enable atomic view count increments
-- This prevents race conditions when multiple users view the same media simultaneously

create or replace function increment_media_view_count(media_slug text)
returns void
language plpgsql
as $$
begin
  update media
  set view_count = view_count + 1
  where slug = media_slug;
end;
$$;

-- Optional: grant execute permission to the anon role if you plan to call this from client-side RLS contexts
-- (not needed when using the service role key from server actions)
-- grant execute on function increment_media_view_count(text) to anon;
-- grant execute on function increment_media_view_count(text) to authenticated;
