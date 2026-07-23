"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateProfile } from "@/lib/validations";

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function updateProfileAction(formData: FormData) {
  const profile = await requireStaff();
  const destination = profile.role === "admin" ? "/admin/profile" : "/dashboard/profile";
  const fields = {
    name: text(formData, "name"),
    madrasah: text(formData, "madrasah"),
    teaching_subject: text(formData, "teaching_subject"),
    phone: text(formData, "phone"),
  };
  const validation = validateProfile(fields);
  if (!validation.valid) redirect(`${destination}?error=${encodeURIComponent(validation.errors[0].message)}`);

  const { error } = await createAdminClient().from("profiles").update(fields).eq("id", profile.id);
  if (error) redirect(`${destination}?error=${encodeURIComponent("Profil gagal disimpan")}`);

  revalidatePath("/admin", "layout");
  revalidatePath("/dashboard", "layout");
  redirect(`${destination}?saved=1`);
}
