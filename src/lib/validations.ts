import type { MediaFormat, MediaType, MediaStatus } from "@/types";
import { getCanvaEmbedUrl, getYouTubeEmbedUrl } from "./format.ts";

const VALID_FORMATS: MediaFormat[] = ["pdf", "ebook", "website", "video", "audio", "presentasi", "other"];
const VALID_TYPES: MediaType[] = ["file", "url"];
const VALID_STATUSES: MediaStatus[] = ["draft", "pending", "published"];
const VALID_CATEGORY_TYPES = ["subject", "level", "format"] as const;
export const VALID_SUGGESTION_FORMATS = ["pdf", "ebook", "website", "video", "audio", "presentasi", "other"] as const;
export const VALID_SUGGESTION_STATUSES = ["new", "considering", "completed"] as const;

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

function createError(field: string, message: string): ValidationError {
  return { field, message };
}

export function validateMedia(
  input: Record<string, unknown>
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!input.title || typeof input.title !== "string" || input.title.trim().length === 0) {
    errors.push(createError("title", "Judul wajib diisi"));
  } else if (input.title.length > 255) {
    errors.push(createError("title", "Judul maksimal 255 karakter"));
  }

  if (input.slug !== undefined) {
    if (typeof input.slug !== "string" || !/^[a-z0-9-]+$/.test(input.slug)) {
      errors.push(createError("slug", "Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung"));
    } else if (input.slug.length > 255) {
      errors.push(createError("slug", "Slug maksimal 255 karakter"));
    }
  }

  if (input.description !== undefined && input.description !== null) {
    if (typeof input.description !== "string") {
      errors.push(createError("description", "Deskripsi harus berupa teks"));
    } else if (input.description.length > 2000) {
      errors.push(createError("description", "Deskripsi maksimal 2000 karakter"));
    }
  }

  if (!input.format || !VALID_FORMATS.includes(input.format as MediaFormat)) {
    errors.push(createError("format", "Format tidak valid"));
  }

  if (!input.type || !VALID_TYPES.includes(input.type as MediaType)) {
    errors.push(createError("type", "Tipe tidak valid"));
  }

  if (input.type === "url") {
    if (!input.external_url || typeof input.external_url !== "string") {
      errors.push(createError("external_url", "URL eksternal wajib diisi untuk tipe URL"));
    } else {
      const url = input.external_url as string;
      if (url.length > 2048) {
        errors.push(createError("external_url", "URL maksimal 2048 karakter"));
      }
      if (url.toLowerCase().startsWith("javascript:")) {
        errors.push(createError("external_url", "Skrip JavaScript tidak diizinkan sebagai URL"));
      }
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          errors.push(createError("external_url", "URL harus dimulai dengan http:// atau https://"));
        }
      } catch {
        errors.push(createError("external_url", "Format URL tidak valid"));
      }
    }
  }

  if (
    input.format === "video" &&
    input.type === "url" &&
    typeof input.external_url === "string" &&
    !getYouTubeEmbedUrl(input.external_url)
  ) {
    errors.push(createError("external_url", "Masukkan URL video YouTube yang valid"));
  }

  if (
    input.format === "presentasi" &&
    input.type === "url" &&
    typeof input.external_url === "string" &&
    !getCanvaEmbedUrl(input.external_url)
  ) {
    errors.push(createError("external_url", "Masukkan link berbagi desain Canva yang valid"));
  }

  if (!input.status || !VALID_STATUSES.includes(input.status as MediaStatus)) {
    errors.push(createError("status", "Status tidak valid"));
  }

  return { valid: errors.length === 0, errors };
}

export function validateCategory(
  input: Record<string, unknown>
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!input.name || typeof input.name !== "string" || input.name.trim().length === 0) {
    errors.push(createError("name", "Nama kategori wajib diisi"));
  } else if (input.name.length > 100) {
    errors.push(createError("name", "Nama kategori maksimal 100 karakter"));
  }

  if (!input.type || !VALID_CATEGORY_TYPES.includes(input.type as typeof VALID_CATEGORY_TYPES[number])) {
    errors.push(createError("type", "Tipe kategori tidak valid"));
  }

  if (input.slug !== undefined) {
    if (typeof input.slug !== "string" || !/^[a-z0-9-]+$/.test(input.slug)) {
      errors.push(createError("slug", "Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung"));
    }
  }

  return { valid: errors.length === 0, errors };
}

export function sanitizeSearchQuery(query: string): string {
  let sanitized = query.trim();
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200);
  }
  sanitized = sanitized.replace(/[%()]/g, "\\$&");
  return sanitized;
}

export function validateTeacherSignup(input: Record<string, string>): ValidationResult {
  const errors: ValidationError[] = [];
  for (const [field, label] of [
    ["name", "Nama lengkap"],
    ["madrasah", "Madrasah"],
    ["teaching_subject", "Mata pelajaran"],
    ["phone", "Nomor telepon"],
    ["email", "Email"],
    ["password", "Password"],
  ] as const) {
    if (!input[field]?.trim()) errors.push(createError(field, `${label} wajib diisi`));
  }
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.push(createError("email", "Format email tidak valid"));
  }
  if (input.password && (input.password.length < 8 || !/[A-Za-z]/.test(input.password) || !/\d/.test(input.password))) {
    errors.push(createError("password", "Password minimal 8 karakter dan harus berisi huruf serta angka"));
  }
  if (input.phone && !/^\+?[0-9\s-]{8,20}$/.test(input.phone)) {
    errors.push(createError("phone", "Nomor telepon tidak valid"));
  }
  return { valid: errors.length === 0, errors };
}

export function validateProfile(input: Record<string, string>): ValidationResult {
  const errors: ValidationError[] = [];
  if (!input.name?.trim()) errors.push(createError("name", "Nama lengkap wajib diisi"));
  for (const [field, label, maxLength] of [
    ["name", "Nama lengkap", 100],
    ["madrasah", "Madrasah", 150],
    ["teaching_subject", "Mata pelajaran", 100],
  ] as const) {
    if (input[field]?.length > maxLength) errors.push(createError(field, `${label} maksimal ${maxLength} karakter`));
  }
  if (input.phone && !/^\+?[0-9\s-]{8,20}$/.test(input.phone)) {
    errors.push(createError("phone", "Nomor telepon tidak valid"));
  }
  return { valid: errors.length === 0, errors };
}

export function validateMediaSuggestion(
  input: Record<string, unknown>
): ValidationResult {
  const errors: ValidationError[] = [];
  const requiredTextFields = [
    ["topic", "Topik atau judul", 150],
    ["subject", "Mata pelajaran", 100],
    ["level", "Jenjang atau kelas", 100],
  ] as const;

  for (const [field, label, maxLength] of requiredTextFields) {
    const value = input[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      errors.push(createError(field, `${label} wajib diisi`));
    } else if (value.length > maxLength) {
      errors.push(createError(field, `${label} maksimal ${maxLength} karakter`));
    }
  }

  if (!VALID_SUGGESTION_FORMATS.includes(input.preferred_format as typeof VALID_SUGGESTION_FORMATS[number])) {
    errors.push(createError("preferred_format", "Format media tidak valid"));
  }

  if (input.notes !== undefined && input.notes !== null) {
    if (typeof input.notes !== "string") {
      errors.push(createError("notes", "Catatan harus berupa teks"));
    } else if (input.notes.length > 1000) {
      errors.push(createError("notes", "Catatan maksimal 1000 karakter"));
    }
  }

  return { valid: errors.length === 0, errors };
}
