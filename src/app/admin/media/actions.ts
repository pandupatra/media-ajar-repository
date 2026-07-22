"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, requireStaff, requireTeacher } from "@/lib/supabase/auth-guard";
import { getCanvaEmbedUrl } from "@/lib/format";
import { validateMedia } from "@/lib/validations";
import type { Media, MediaStatus, PendingMediaChanges } from "@/types";

const DOCUMENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
]);
const MAX_DOCUMENT_SIZE = 50 * 1024 * 1024;
const MAX_THUMBNAIL_SIZE = 1024 * 1024;
const PPTX_TYPE = "application/vnd.openxmlformats-officedocument.presentationml.presentation";

import type { MediaEditorPayload } from "@/types";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function refreshMediaPaths() {
  revalidatePath("/");
  revalidatePath("/katalog");
  revalidatePath("/admin");
  revalidatePath("/admin/media");
  revalidatePath("/admin/media/review");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/media");
}

async function uploadFile(bucket: string, path: string, file: File) {
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: true,
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

function storagePath(url: string, bucket: string) {
  try {
    const match = new URL(url).pathname.match(new RegExp(`/storage/v1/object/public/${bucket}/(.+)`));
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

async function removeStoredUrl(url: string | null | undefined, bucket: string) {
  if (!url) return;
  const path = storagePath(url, bucket);
  if (path) await createAdminClient().storage.from(bucket).remove([path]);
}

async function replaceCategories(mediaId: string, categoryIds: string[]) {
  const supabase = createAdminClient();
  await supabase.from("media_categories").delete().eq("media_id", mediaId);
  if (categoryIds.length) {
    const { error } = await supabase.from("media_categories").insert(
      categoryIds.map((category_id) => ({ media_id: mediaId, category_id }))
    );
    if (error) throw new Error(error.message);
  }
}

async function loadOwnedMedia(id: string) {
  const staff = await requireStaff();
  const { data, error } = await createAdminClient().from("media").select("*").eq("id", id).single();
  if (error || !data) throw new Error("Media tidak ditemukan");
  if (staff.role === "contributor" && data.created_by !== staff.id) throw new Error("Anda tidak memiliki akses ke media ini");
  return { staff, media: data as Media };
}

export async function getTeacherMediaAction(): Promise<Media[]> {
  const teacher = await requireTeacher();
  const { data, error } = await createAdminClient()
    .from("media")
    .select("*")
    .eq("created_by", teacher.id)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Media[];
}

export async function getPendingReviewsAction(): Promise<Media[]> {
  await requireAdmin();
  const { data, error } = await createAdminClient()
    .from("media")
    .select("*, creator:profiles(*)")
    .or("status.eq.pending,pending_submitted_at.not.is.null")
    .order("updated_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Media[];
}

export async function getPendingReviewAction(id: string): Promise<Media | null> {
  await requireAdmin();
  const { data, error } = await createAdminClient()
    .from("media")
    .select("*, creator:profiles(*), categories:media_categories(category_id)")
    .eq("id", id)
    .or("status.eq.pending,pending_submitted_at.not.is.null")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Media | null;
}

export async function getManageableMediaAction(id: string) {
  const { media } = await loadOwnedMedia(id);
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("media_categories")
    .select("category_id")
    .eq("media_id", id);
  const ids = (data ?? []).map((row) => row.category_id as string);
  const { data: categories } = ids.length
    ? await supabase.from("categories").select("id, type").in("id", ids)
    : { data: [] };
  const subject = categories?.find((item) => item.type === "subject")?.id;
  const level = categories?.find((item) => item.type === "level")?.id;
  return { media, categoryIds: [subject, level].filter(Boolean) as string[] };
}

export async function saveMediaAction(
  id: string | null,
  payload: MediaEditorPayload,
  uploads: FormData
): Promise<{ data?: Media; errors?: Record<string, string>; error?: string }> {
  const staff = await requireStaff();
  const supabase = createAdminClient();
  const mediaId = id ?? crypto.randomUUID();
  let existing: Media | null = null;

  if (id) {
    const owned = await loadOwnedMedia(id);
    existing = owned.media;
    if (staff.role === "contributor" && (existing.status === "pending" || existing.pending_submitted_at)) {
      return { error: "Media yang sedang ditinjau tidak dapat diubah" };
    }
  }

  const pendingBase = existing?.pending_changes;
  let fileUrl = pendingBase?.file_url ?? existing?.file_url ?? null;
  let thumbnailUrl = pendingBase?.thumbnail_url ?? existing?.thumbnail_url ?? null;
  let fileSize = pendingBase?.file_size ?? existing?.file_size ?? null;
  const mediaFile = uploads.get("media_file");
  const thumbnail = uploads.get("thumbnail");

  try {
    if (payload.type === "file") {
      if (mediaFile instanceof File && mediaFile.size > 0) {
        if (payload.format === "presentasi" && (mediaFile.type !== PPTX_TYPE || !mediaFile.name.toLowerCase().endsWith(".pptx"))) {
          return { error: "Presentasi harus menggunakan file PPTX" };
        }
        if (!DOCUMENT_TYPES.has(mediaFile.type)) return { error: "File harus berupa PDF, Office, atau ZIP" };
        if (mediaFile.size > MAX_DOCUMENT_SIZE) return { error: "Ukuran file maksimal 50 MB" };
        const ext = mediaFile.name.split(".").pop() || "bin";
        fileUrl = await uploadFile("media-files", `${staff.id}/${mediaId}/media-${Date.now()}.${ext}`, mediaFile);
        fileSize = mediaFile.size;
      }
      if (!fileUrl) return { error: "Pilih file media yang akan diunggah" };
      if (payload.format === "presentasi" && !new URL(fileUrl).pathname.toLowerCase().endsWith(".pptx")) {
        return { error: "Presentasi harus menggunakan file PPTX" };
      }
    } else {
      fileUrl = null;
      fileSize = null;
    }

    if (payload.remove_thumbnail) thumbnailUrl = null;
    if (thumbnail instanceof File && thumbnail.size > 0) {
      if (!thumbnail.type.startsWith("image/")) return { error: "Thumbnail harus berupa gambar" };
      if (thumbnail.size > MAX_THUMBNAIL_SIZE) return { error: "Ukuran thumbnail maksimal 1 MB" };
      const ext = thumbnail.name.split(".").pop() || "jpg";
      thumbnailUrl = await uploadFile("media-thumbnails", `${staff.id}/${mediaId}/thumbnail-${Date.now()}.${ext}`, thumbnail);
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Upload gagal" };
  }

  const status: MediaStatus = staff.role === "admin" ? payload.status : existing?.status === "published" ? "published" : "draft";
  const externalUrl = payload.type === "url" && payload.format === "presentasi"
    ? getCanvaEmbedUrl(payload.external_url)?.replace("?embed", "") ?? payload.external_url.trim()
    : payload.type === "url" ? payload.external_url.trim() : null;
  const candidate: PendingMediaChanges = {
    title: payload.title.trim(),
    slug: slugify(payload.title),
    description: payload.description.trim() || null,
    format: payload.format,
    type: payload.type,
    file_url: fileUrl,
    external_url: externalUrl,
    thumbnail_url: thumbnailUrl,
    file_size: fileSize,
    category_ids: [payload.subject, payload.level].filter(Boolean),
  };
  const validation = validateMedia({ ...candidate, status });
  if (!validation.valid) {
    return { errors: Object.fromEntries(validation.errors.map((item) => [item.field, item.message])) };
  }

  if (staff.role === "contributor" && existing?.status === "published") {
    const { data, error } = await supabase
      .from("media")
      .update({ pending_changes: candidate, pending_submitted_at: null, updated_at: new Date().toISOString() })
      .eq("id", mediaId)
      .eq("created_by", staff.id)
      .select()
      .single();
    if (error) return { error: error.message };
    refreshMediaPaths();
    return { data: data as Media };
  }

  const row = {
    title: candidate.title,
    slug: candidate.slug,
    description: candidate.description,
    format: candidate.format,
    type: candidate.type,
    file_url: candidate.file_url,
    external_url: candidate.external_url,
    thumbnail_url: candidate.thumbnail_url,
    file_size: candidate.file_size,
    status,
    updated_at: new Date().toISOString(),
  };
  const result = existing
    ? await supabase.from("media").update(row).eq("id", mediaId).select().single()
    : await supabase.from("media").insert({ ...row, id: mediaId, created_by: staff.id, view_count: 0, download_count: 0 }).select().single();
  if (result.error) return { error: result.error.code === "23505" ? "Judul menghasilkan slug yang sudah digunakan" : result.error.message };

  try {
    await replaceCategories(mediaId, candidate.category_ids);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Kategori gagal disimpan" };
  }
  refreshMediaPaths();
  return { data: result.data as Media };
}

export async function submitMediaAction(id: string) {
  const { staff, media } = await loadOwnedMedia(id);
  if (staff.role !== "contributor") throw new Error("Hanya guru yang dapat mengirim media untuk ditinjau");
  const supabase = createAdminClient();
  if (media.status === "draft") {
    await supabase.from("media").update({ status: "pending", updated_at: new Date().toISOString() }).eq("id", id).eq("created_by", staff.id);
  } else if (media.status === "published" && media.pending_changes) {
    await supabase.from("media").update({ pending_submitted_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", id).eq("created_by", staff.id);
  } else {
    throw new Error("Simpan perubahan sebelum mengirim media");
  }
  refreshMediaPaths();
}

export async function cancelRevisionAction(id: string) {
  const { staff, media } = await loadOwnedMedia(id);
  if (staff.role !== "contributor" || media.status !== "published" || !media.pending_changes || media.pending_submitted_at) {
    throw new Error("Revisi tidak dapat dibatalkan");
  }
  const { error } = await createAdminClient().from("media").update({ pending_changes: null, updated_at: new Date().toISOString() }).eq("id", id).eq("created_by", staff.id);
  if (error) throw new Error(error.message);
  if (media.pending_changes.file_url !== media.file_url) await removeStoredUrl(media.pending_changes.file_url, "media-files");
  if (media.pending_changes.thumbnail_url !== media.thumbnail_url) await removeStoredUrl(media.pending_changes.thumbnail_url, "media-thumbnails");
  refreshMediaPaths();
}

export async function approveMediaAction(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data: media } = await supabase.from("media").select("*").eq("id", id).single();
  if (!media) throw new Error("Media tidak ditemukan");
  if (media.status === "pending") {
    await supabase.from("media").update({ status: "published", updated_at: new Date().toISOString() }).eq("id", id);
  } else if (media.status === "published" && media.pending_changes && media.pending_submitted_at) {
    const { error } = await supabase.rpc("approve_media_revision", { target_media_id: id });
    if (error) throw new Error(error.message);
    if (media.pending_changes.file_url !== media.file_url) await removeStoredUrl(media.file_url, "media-files");
    if (media.pending_changes.thumbnail_url !== media.thumbnail_url) await removeStoredUrl(media.thumbnail_url, "media-thumbnails");
  } else {
    throw new Error("Media tidak sedang menunggu persetujuan");
  }
  refreshMediaPaths();
}

export async function returnMediaAction(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data: media } = await supabase.from("media").select("status, pending_submitted_at").eq("id", id).single();
  if (!media) throw new Error("Media tidak ditemukan");
  if (media.status === "pending") {
    await supabase.from("media").update({ status: "draft", updated_at: new Date().toISOString() }).eq("id", id);
  } else if (media.pending_submitted_at) {
    await supabase.from("media").update({ pending_submitted_at: null, updated_at: new Date().toISOString() }).eq("id", id);
  }
  refreshMediaPaths();
}

export async function deleteMediaAction(id: string): Promise<void> {
  const { staff, media } = await loadOwnedMedia(id);
  if (staff.role === "contributor" && media.status !== "draft") throw new Error("Guru hanya dapat menghapus media draft");
  const supabase = createAdminClient();
  await supabase.from("media_categories").delete().eq("media_id", id);
  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await Promise.all([
    removeStoredUrl(media.file_url, "media-files"),
    removeStoredUrl(media.thumbnail_url, "media-thumbnails"),
    removeStoredUrl(media.pending_changes?.file_url, "media-files"),
    removeStoredUrl(media.pending_changes?.thumbnail_url, "media-thumbnails"),
  ]);
  refreshMediaPaths();
}
