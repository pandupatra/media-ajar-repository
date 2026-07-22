import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTeacherMediaAction } from "@/app/admin/media/actions";
import { TeacherMediaActions } from "./media-actions";

function statusLabel(media: Awaited<ReturnType<typeof getTeacherMediaAction>>[number]) {
  if (media.status === "pending") return "Menunggu Review";
  if (media.pending_submitted_at) return "Revisi Ditinjau";
  if (media.pending_changes) return "Draft Revisi";
  return media.status === "published" ? "Dipublikasikan" : "Draft";
}

export default async function TeacherMediaPage() {
  const media = await getTeacherMediaAction();
  return <div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Media Saya</h1><p className="text-muted-foreground">Hanya media yang Anda buat</p></div><Button asChild className="rounded-xl"><Link href="/dashboard/media/new"><Plus className="mr-2 h-4 w-4" />Tambah</Link></Button></div><div className="overflow-x-auto rounded-2xl bg-background shadow-sm"><table className="w-full text-sm"><thead><tr className="border-b bg-muted/30"><th className="p-4 text-left">Judul</th><th className="p-4 text-left">Status</th><th className="p-4 text-left">Tanggal</th><th className="p-4 text-right">Aksi</th></tr></thead><tbody>{media.map((item) => { const locked = item.status === "pending" || !!item.pending_submitted_at; const canSubmit = item.status === "draft" || (item.status === "published" && !!item.pending_changes && !item.pending_submitted_at); return <tr key={item.id} className="border-b last:border-0"><td className="p-4"><p className="font-medium">{item.title}</p><p className="text-xs text-muted-foreground">{item.format.toUpperCase()}</p></td><td className="p-4">{statusLabel(item)}</td><td className="p-4 text-muted-foreground">{new Date(item.updated_at).toLocaleDateString("id-ID")}</td><td className="p-4"><div className="flex items-center justify-end gap-2">{!locked && <Button size="sm" variant="outline" asChild><Link href={`/dashboard/media/${item.id}/edit`}>{item.status === "published" ? "Ajukan Perubahan" : "Edit"}</Link></Button>}<TeacherMediaActions id={item.id} canDelete={item.status === "draft"} canSubmit={canSubmit} canCancel={item.status === "published" && !!item.pending_changes && !item.pending_submitted_at} /></div></td></tr>; })}</tbody></table>{media.length === 0 && <p className="p-10 text-center text-muted-foreground">Belum ada media.</p>}</div></div>;
}
