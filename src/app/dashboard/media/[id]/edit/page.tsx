import { notFound } from "next/navigation";
import { MediaEditor } from "@/components/media-editor";
import { getAllCategories } from "@/lib/data-server";
import { getManageableMediaAction } from "@/app/admin/media/actions";
import { requireTeacher } from "@/lib/supabase/auth-guard";

export default async function EditTeacherMediaPage({ params }: { params: Promise<{ id: string }> }) {
  await requireTeacher();
  const { id } = await params;
  const result = await getManageableMediaAction(id).catch(() => null);
  if (!result || result.media.status === "pending" || result.media.pending_submitted_at) notFound();
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold">{result.media.status === "published" ? "Ajukan Perubahan" : "Edit Media"}</h1><p className="text-muted-foreground">{result.media.status === "published" ? "Versi publik tetap aktif sampai revisi disetujui" : "Perbarui draft media Anda"}</p></div><MediaEditor media={result.media} categoryIds={result.categoryIds} categories={await getAllCategories()} basePath="/dashboard/media" canPublish={false} /></div>;
}
