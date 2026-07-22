"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { Profile } from "@/types";
import { requireAdmin } from "@/lib/supabase/auth-guard";

export async function getAdminProfiles(): Promise<Profile[]> {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}
