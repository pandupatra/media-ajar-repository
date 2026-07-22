import { MediaEditor } from "@/components/media-editor";
import { getAllCategories } from "@/lib/data-server";
import { requireAdmin } from "@/lib/supabase/auth-guard";

export default async function AddMediaPage() {
  await requireAdmin();
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold">Tambah Media</h1><p className="text-muted-foreground">Tambahkan media pembelajaran baru</p></div><MediaEditor categories={await getAllCategories()} basePath="/admin/media" canPublish /></div>;
}
