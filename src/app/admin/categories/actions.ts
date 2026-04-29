"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/auth-guard";
import { validateCategory } from "@/lib/validations";
import { Category } from "@/types";

export async function createCategoryAction(
  category: Omit<Category, "id" | "created_at">
): Promise<{ data?: Category | null; errors?: Record<string, string> }> {
  await requireAdmin();

  const validation = validateCategory(category);
  if (!validation.valid) {
    const errors: Record<string, string> = {};
    for (const e of validation.errors) {
      errors[e.field] = e.message;
    }
    return { errors };
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", category.slug)
    .maybeSingle();

  if (existing) {
    return { errors: { slug: "Slug sudah digunakan, gunakan nama yang berbeda" } };
  }

  const { data, error } = await supabase
    .from("categories")
    .insert([category])
    .select()
    .single();

  if (error) {
    console.error("createCategoryAction error:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  return { data };
}

export async function deleteCategoryAction(id: string): Promise<void> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("deleteCategoryAction error:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
}