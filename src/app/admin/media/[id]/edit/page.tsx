import { notFound } from "next/navigation";
import { MediaEditor } from "@/components/media-editor";
import { getAllCategories } from "@/lib/data-server";
import { getManageableMediaAction } from "../../actions";
import { requireAdmin } from "@/lib/supabase/auth-guard";

export default async function EditMediaPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const result = await getManageableMediaAction(id).catch(() => null);
  if (!result) notFound();
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold">Edit Media</h1><p className="text-muted-foreground">Perbarui media pembelajaran</p></div><MediaEditor media={result.media} categoryIds={result.categoryIds} categories={await getAllCategories()} basePath="/admin/media" canPublish /></div>;
}
