import { createClient } from "@/lib/supabase/client";
import { sanitizeSearchQuery } from "@/lib/validations";
import { Media, Category, Profile, FilterOptions } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
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
  const supabase = createClient();
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
  const supabase = createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*, categories:media_categories(category_id)")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Media[];
}

export async function getLatestMedia(limit: number = 8): Promise<Media[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*, categories:media_categories(category_id)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []) as Media[];
}

export async function searchMedia(query: string): Promise<Media[]> {
  if (!query.trim()) return getPublishedMedia();
  const sanitized = sanitizeSearchQuery(query);
  const supabase = createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*, categories:media_categories(category_id)")
    .eq("status", "published")
    .or(`title.ilike.%${sanitized}%,description.ilike.%${sanitized}%`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Media[];
}

export async function getAllMediaForClient(options: FilterOptions = {}): Promise<Media[]> {
  const supabase = createClient();
  let query = supabase
    .from("media")
    .select("*, categories:media_categories(category_id)")
    .order("created_at", { ascending: false });

  if (options.status) query = query.eq("status", options.status);
  if (options.format) query = query.eq("format", options.format);
  if (options.search) {
    const sanitized = sanitizeSearchQuery(options.search);
    query = query.or(`title.ilike.%${sanitized}%,description.ilike.%${sanitized}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Media[];
}

export async function getMediaCategoryIds(mediaId: string): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("media_categories")
    .select("category_id")
    .eq("media_id", mediaId);
  if (error) throw error;
  return (data || []).map((r: { category_id: string }) => r.category_id);
}

export async function getMediaById(id: string): Promise<Media | null> {
  const supabase = createClient();
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

// NOTE: profiles queries removed to avoid RLS recursion issues.
// Use server-side admin client for profile reads (see data-server.ts or auth-guard.ts).