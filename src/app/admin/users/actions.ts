"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { Profile } from "@/types";

export async function getAdminProfiles(): Promise<Profile[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}
