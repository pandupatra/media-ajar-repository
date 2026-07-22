import { redirect } from "next/navigation";
import { LoginForm } from "@/app/login/login-form";
import { getCurrentProfile } from "@/lib/supabase/auth-guard";

export default async function LoginPage() {
  const profile = await getCurrentProfile();

  if (profile) redirect(profile.role === "admin" ? "/admin" : "/dashboard");

  return <LoginForm />;
}
