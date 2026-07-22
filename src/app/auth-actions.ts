"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateTeacherSignup } from "@/lib/validations";
import { buildContributorProfile } from "@/lib/auth-profile";

export interface AuthState {
  error?: string;
  success?: string;
  fields?: Record<string, string>;
}

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

export async function loginAction(_state: AuthState, formData: FormData): Promise<AuthState> {
  const email = text(formData, "email");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email dan password wajib diisi" };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "Email atau password salah, atau email belum dikonfirmasi" };

  const admin = createAdminClient();
  let { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile) {
    const result = await admin
      .from("profiles")
      .insert(buildContributorProfile(data.user))
      .select("role")
      .single();
    if (result.error) {
      await supabase.auth.signOut();
      return { error: "Profil pengguna gagal dipulihkan" };
    }
    profile = result.data;
  }

  redirect(profile.role === "admin" ? "/admin" : "/dashboard");
}

export async function signupAction(_state: AuthState, formData: FormData): Promise<AuthState> {
  const fields = {
    name: text(formData, "name"),
    madrasah: text(formData, "madrasah"),
    teaching_subject: text(formData, "teaching_subject"),
    phone: text(formData, "phone"),
    email: text(formData, "email").toLowerCase(),
  };
  const password = String(formData.get("password") ?? "");
  const validation = validateTeacherSignup({ ...fields, password });
  if (!validation.valid) return { error: validation.errors[0].message, fields };

  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: fields.email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
      data: {
        name: fields.name,
        madrasah: fields.madrasah,
        teaching_subject: fields.teaching_subject,
        phone: fields.phone,
      },
    },
  });

  if (error) {
    return { error: error.message.toLowerCase().includes("registered") ? "Email sudah terdaftar" : error.message, fields };
  }
  if (data.user && data.user.identities?.length === 0) {
    return { error: "Email sudah terdaftar. Silakan masuk dengan akun tersebut.", fields };
  }

  return { success: "Pendaftaran berhasil. Periksa email Anda untuk mengaktifkan akun." };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
