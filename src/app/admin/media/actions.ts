"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/auth-guard";
import { validateMedia } from "@/lib/validations";
import { Media } from "@/types";

export async function createMediaAction(
  media: Partial<Media> & { subject?: string; level?: string }
): Promise<{ data?: Media | null; errors?: Record<string, string> }> {
  await requireAdmin();

  const validation = validateMedia(media);
  if (!validation.valid) {
    const errors: Record<string, string> = {};
    for (const e of validation.errors) {
      errors[e.field] = e.message;
    }
    return { errors };
  }

  const supabase = createAdminClient();

  const { subject, level, ...mediaData } = media;

  const { data, error } = await supabase
    .from("media")
    .insert([
      {
        ...mediaData,
        view_count: 0,
        download_count: 0,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("createMediaAction error:", error.message);
    throw new Error(error.message);
  }
  if (!data) return { data: null };

  const categoryIds = [subject, level].filter(Boolean) as string[];
  if (categoryIds.length > 0) {
    const { error: catError } = await supabase.from("media_categories").insert(
      categoryIds.map((category_id) => ({
        media_id: data.id,
        category_id,
      }))
    );
    if (catError) console.error("createMediaAction categories error:", catError.message);
  }

  revalidatePath("/admin/media");
  revalidatePath("/katalog");
  revalidatePath("/");
  return { data };
}

export async function updateMediaAction(
  id: string,
  updates: Partial<Media> & { subject?: string; level?: string }
): Promise<{ data?: Media | null; errors?: Record<string, string> }> {
  await requireAdmin();

  const validation = validateMedia(updates);
  if (!validation.valid) {
    const errors: Record<string, string> = {};
    for (const e of validation.errors) {
      errors[e.field] = e.message;
    }
    return { errors };
  }

  const supabase = createAdminClient();

  const { subject, level, ...rest } = updates;

  const mediaData = Object.fromEntries(
    Object.entries(rest).filter(([, v]) => v !== undefined)
  ) as Partial<Media>;

  const { data, error } = await supabase
    .from("media")
    .update({ ...mediaData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateMediaAction error:", error.message);
    throw new Error(error.message);
  }
  if (!data) return { data: null };

  const { error: delError } = await supabase
    .from("media_categories")
    .delete()
    .eq("media_id", id);
  if (delError) console.error("updateMediaAction delete categories error:", delError.message);

  const categoryIds = [subject, level].filter(Boolean) as string[];
  if (categoryIds.length > 0) {
    const { error: catError } = await supabase.from("media_categories").insert(
      categoryIds.map((category_id) => ({
        media_id: id,
        category_id,
      }))
    );
    if (catError) console.error("updateMediaAction insert categories error:", catError.message);
  }

  revalidatePath("/admin/media");
  revalidatePath("/katalog");
  revalidatePath("/");
  revalidatePath(`/media/${data.slug}`);
  return { data };
}

export async function uploadThumbnailAction(
  mediaId: string,
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  await requireAdmin();

  const file = formData.get("thumbnail") as File | null;
  if (!file) {
    return { error: "Tidak ada file yang dipilih" };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "File harus berupa gambar" };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { error: "Ukuran file maksimal 5MB" };
  }

  const supabase = createAdminClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `media/${mediaId}/thumbnail-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media-thumbnails")
    .upload(path, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error("uploadThumbnailAction error:", uploadError.message);
    return { error: uploadError.message };
  }

  const { data: publicUrlData } = supabase.storage
    .from("media-thumbnails")
    .getPublicUrl(path);

  return { url: publicUrlData.publicUrl };
}

export async function deleteMediaAction(id: string): Promise<void> {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: media } = await supabase
    .from("media")
    .select("thumbnail_url")
    .eq("id", id)
    .single();

  const { error: catError } = await supabase
    .from("media_categories")
    .delete()
    .eq("media_id", id);
  if (catError) console.error("deleteMediaAction categories error:", catError.message);

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) {
    console.error("deleteMediaAction error:", error.message);
    throw new Error(error.message);
  }

  if (media?.thumbnail_url) {
    try {
      const url = new URL(media.thumbnail_url);
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/media-thumbnails\/(.+)/);
      if (pathMatch?.[1]) {
        const { error: storageError } = await supabase.storage
          .from("media-thumbnails")
          .remove([decodeURIComponent(pathMatch[1])]);
        if (storageError) console.error("deleteMediaAction storage error:", storageError.message);
      }
    } catch {
      console.error("deleteMediaAction: failed to parse thumbnail URL");
    }
  }

  revalidatePath("/admin/media");
  revalidatePath("/katalog");
  revalidatePath("/");
}