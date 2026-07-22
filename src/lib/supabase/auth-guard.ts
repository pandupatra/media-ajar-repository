import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile, UserRole } from "@/types";

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await createAdminClient()
    .from("profiles")
    .select("id, email, name, role, madrasah, teaching_subject, phone, created_at")
    .eq("id", user.id)
    .single();

  return (data as Profile | null) ?? null;
}

async function requireRole(roles: UserRole[]) {
  const profile = await getCurrentProfile();
  if (!profile || !roles.includes(profile.role)) redirect("/login");
  return profile;
}

export async function requireAdmin() {
  return requireRole(["admin"]);
}

export async function requireTeacher() {
  return requireRole(["contributor"]);
}

export async function requireStaff() {
  return requireRole(["admin", "contributor"]);
}
