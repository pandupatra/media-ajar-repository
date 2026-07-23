import { ProfileForm } from "@/components/profile-form";
import { requireTeacher } from "@/lib/supabase/auth-guard";

export default async function TeacherProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [profile, params] = await Promise.all([requireTeacher(), searchParams]);
  return <ProfileForm profile={profile} saved={params.saved === "1"} error={params.error} />;
}
