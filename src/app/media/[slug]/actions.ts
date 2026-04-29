"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function incrementViewCountAction(
  slug: string
): Promise<{ success: boolean }> {
  const supabase = createAdminClient();

  // Try atomic increment via RPC first (race-condition-free)
  const { error: rpcError } = await supabase.rpc("increment_media_view_count", {
    media_slug: slug,
  });

  if (!rpcError) {
    return { success: true };
  }

  // Fallback: read current value and update (non-atomic)
  const { data: media, error: fetchError } = await supabase
    .from("media")
    .select("view_count")
    .eq("slug", slug)
    .single();

  if (fetchError || !media) {
    console.error("incrementViewCountAction fetch error:", fetchError?.message);
    return { success: false };
  }

  const { error: updateError } = await supabase
    .from("media")
    .update({ view_count: media.view_count + 1 })
    .eq("slug", slug);

  if (updateError) {
    console.error("incrementViewCountAction update error:", updateError.message);
    return { success: false };
  }

  return { success: true };
}