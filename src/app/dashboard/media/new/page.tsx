import { MediaEditor } from "@/components/media-editor";
import { getAllCategories } from "@/lib/data-server";
import { requireTeacher } from "@/lib/supabase/auth-guard";

export default async function AddTeacherMediaPage() {
  await requireTeacher();
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold">Tambah Media</h1><p className="text-muted-foreground">Media disimpan sebagai draft sebelum dikirim untuk ditinjau</p></div><MediaEditor categories={await getAllCategories()} basePath="/dashboard/media" canPublish={false} /></div>;
}
