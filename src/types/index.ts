export type CategoryType = "subject" | "level" | "format";
export type MediaFormat = "pdf" | "ebook" | "website" | "video" | "audio" | "presentasi" | "other";
export type MediaType = "file" | "url";
export type MediaStatus = "draft" | "pending" | "published";
export type UserRole = "admin" | "contributor";

export interface PendingMediaChanges {
  title: string;
  slug: string;
  description: string | null;
  format: MediaFormat;
  type: MediaType;
  file_url: string | null;
  external_url: string | null;
  thumbnail_url: string | null;
  file_size: number | null;
  category_ids: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Media {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  format: MediaFormat;
  type: MediaType;
  file_url: string | null;
  external_url: string | null;
  thumbnail_url: string | null;
  file_size: number | null;
  status: MediaStatus;
  view_count: number;
  download_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  pending_changes?: PendingMediaChanges | null;
  pending_submitted_at?: string | null;
  search_vector?: string | null;
  // Joined fields
  creator?: Profile;
  categories?: Category[] | { category_id: string }[];
}

export interface MediaCategory {
  media_id: string;
  category_id: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  madrasah: string | null;
  teaching_subject: string | null;
  phone: string | null;
  created_at: string;
}

export interface MediaWithCategories extends Media {
  categories: Category[];
}

export interface FilterOptions {
  subject?: string;
  level?: string;
  format?: string;
  status?: MediaStatus;
  search?: string;
  sortBy?: "newest" | "oldest" | "title";
}

export interface MediaEditorPayload {
  title: string;
  description: string;
  format: MediaFormat;
  type: MediaType;
  external_url: string;
  status: MediaStatus;
  subject: string;
  level: string;
  remove_thumbnail?: boolean;
}
