import { ProfileForm } from "@/components/profile-form";
import { requireAdmin } from "@/lib/supabase/auth-guard";

export default async function AdminProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [profile, params] = await Promise.all([requireAdmin(), searchParams]);
  return <ProfileForm profile={profile} saved={params.saved === "1"} error={params.error} />;
}
