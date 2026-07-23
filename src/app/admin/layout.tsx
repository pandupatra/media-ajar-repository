import { DashboardShell } from "@/components/dashboard-shell";
import { requireAdmin } from "@/lib/supabase/auth-guard";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return <DashboardShell role="admin" profile={admin}>{children}</DashboardShell>;
}
