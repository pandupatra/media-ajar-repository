import { requireAdmin } from "@/lib/supabase/auth-guard";

export default async function AdminGuard({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return children;
}
