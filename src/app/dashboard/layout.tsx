import { DashboardShell } from "@/components/dashboard-shell";
import { requireTeacher } from "@/lib/supabase/auth-guard";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const teacher = await requireTeacher();
  return (
    <DashboardShell role="teacher" profile={teacher}>
      {children}
    </DashboardShell>
  );
}
