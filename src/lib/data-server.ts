import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Media, Category, Profile, FilterOptions } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export const getAllCategories = getCategories;

export async function getCategoriesByType(type: Category["type"]): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("type", type)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getPublishedMedia(): Promise<Media[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*, categories:media_categories(category_id)")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Media[];
}

export async function getLatestMedia(limit: number = 8): Promise<Media[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*, categories:media_categories(category_id)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []) as Media[];
}

export async function getMediaBySlug(slug: string): Promise<Media | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*, categories:media_categories(category_id)")
    .eq("slug", slug)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Media;
}

export async function getMediaById(id: string): Promise<Media | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*, categories:media_categories(category_id)")
    .eq("id", id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Media;
}

export async function getMediaCategoryIds(mediaId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_categories")
    .select("category_id")
    .eq("media_id", mediaId);
  if (error) throw error;
  return (data || []).map((r: { category_id: string }) => r.category_id);
}

export async function getRelatedMedia(media: Media, limit: number = 4): Promise<Media[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("status", "published")
    .eq("format", media.format)
    .neq("id", media.id)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function getAllMedia(options: FilterOptions = {}): Promise<Media[]> {
  const supabase = await createClient();
  let query = supabase
    .from("media")
    .select("*, categories:media_categories(category_id)")
    .order("created_at", { ascending: false });

  if (options.status) query = query.eq("status", options.status);
  if (options.format) query = query.eq("format", options.format);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Media[];
}

export async function getProfiles(): Promise<Profile[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// NOTE: getProfile removed to avoid RLS recursion on the profiles table.
// For admin reads, use getProfiles() with the admin client.
// For auth checks, use requireAdmin() in auth-guard.ts.