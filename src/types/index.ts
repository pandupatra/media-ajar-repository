export type CategoryType = "subject" | "level" | "format";
export type MediaFormat = "pdf" | "ebook" | "website" | "video" | "audio" | "other";
export type MediaType = "file" | "url";
export type MediaStatus = "draft" | "published";
export type UserRole = "admin" | "contributor";

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
