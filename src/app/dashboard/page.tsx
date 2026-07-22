import Link from "next/link";
import { FileText, Send, CheckCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTeacherMediaAction } from "@/app/admin/media/actions";
import { requireTeacher } from "@/lib/supabase/auth-guard";

export default async function TeacherDashboardPage() {
  const teacher = await requireTeacher();
  const media = await getTeacherMediaAction();
  const stats = [
    ["Draft", media.filter((item) => item.status === "draft" || (item.status === "published" && item.pending_changes && !item.pending_submitted_at)).length, FileText],
    ["Menunggu Review", media.filter((item) => item.status === "pending" || item.pending_submitted_at).length, Send],
    ["Dipublikasikan", media.filter((item) => item.status === "published").length, CheckCircle],
  ] as const;
  return <div className="space-y-7"><div className="flex items-start justify-between gap-4"><div><h1 className="text-3xl font-bold">Halo, {teacher.name}</h1><p className="text-muted-foreground">Kelola media pembelajaran Anda</p></div><Button asChild className="rounded-xl"><Link href="/dashboard/media/new"><Plus className="mr-2 h-4 w-4" />Tambah Media</Link></Button></div><div className="grid gap-4 sm:grid-cols-3">{stats.map(([label, value, Icon]) => <Card key={label} className="rounded-2xl border-0 shadow-sm"><CardContent className="flex items-center justify-between p-6"><div><p className="text-sm text-muted-foreground">{label}</p><p className="text-3xl font-bold">{value}</p></div><Icon className="h-7 w-7 text-primary" /></CardContent></Card>)}</div><Button variant="outline" asChild className="rounded-xl"><Link href="/dashboard/media">Lihat semua media</Link></Button></div>;
}
