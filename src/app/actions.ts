"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateMediaSuggestion } from "@/lib/validations";

export type SuggestionFormState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string>;
};

export async function submitMediaSuggestion(
  _previousState: SuggestionFormState,
  formData: FormData
): Promise<SuggestionFormState> {
  if (formData.get("website")) {
    return { status: "success", message: "Terima kasih, usulan Anda sudah diterima." };
  }

  const suggestion = {
    topic: String(formData.get("topic") ?? "").trim(),
    subject: String(formData.get("subject") ?? "").trim(),
    level: String(formData.get("level") ?? "").trim(),
    preferred_format: String(formData.get("preferred_format") ?? ""),
    notes: String(formData.get("notes") ?? "").trim(),
  };
  const validation = validateMediaSuggestion(suggestion);

  if (!validation.valid) {
    return {
      status: "error",
      message: "Periksa kembali isian Anda.",
      errors: Object.fromEntries(validation.errors.map(({ field, message }) => [field, message])),
    };
  }

  const { error } = await createAdminClient().from("media_suggestions").insert(suggestion);
  if (error) {
    console.error("submitMediaSuggestion error:", error.message);
    return { status: "error", message: "Usulan belum dapat dikirim. Silakan coba lagi." };
  }

  revalidatePath("/admin/suggestions");
  return { status: "success", message: "Terima kasih, usulan Anda sudah diterima." };
}
