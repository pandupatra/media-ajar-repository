"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveMediaAction } from "@/app/admin/media/actions";
import type { Category, Media, MediaEditorPayload } from "@/types";

interface MediaEditorProps {
  media?: Media;
  categories: Category[];
  categoryIds?: string[];
  basePath: string;
  canPublish: boolean;
}

export function MediaEditor({ media, categories, categoryIds = [], basePath, canPublish }: MediaEditorProps) {
  const router = useRouter();
  const pending = media?.pending_changes;
  const source = pending ?? media;
  const pendingCategories = pending?.category_ids ?? categoryIds;
  const [form, setForm] = useState<MediaEditorPayload>({
    title: source?.title ?? "",
    description: source?.description ?? "",
    format: source?.format ?? "pdf",
    type: source?.type ?? "file",
    external_url: source?.external_url ?? "",
    status: media?.status ?? "draft",
    subject: pendingCategories[0] ?? "",
    level: pendingCategories[1] ?? "",
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const subjects = categories.filter((item) => item.type === "subject");
  const levels = categories.filter((item) => item.type === "level");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const uploads = new FormData();
    if (mediaFile) uploads.append("media_file", mediaFile);
    if (thumbnail) uploads.append("thumbnail", thumbnail);
    const result = await saveMediaAction(media?.id ?? null, form, uploads);
    setSaving(false);
    if (result.error || result.errors) {
      setError(result.error ?? Object.values(result.errors ?? {}).join(". "));
      return;
    }
    router.push(basePath);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <Card className="rounded-2xl border-0 shadow-md shadow-primary/5">
        <CardHeader><CardTitle>Informasi Media</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="media-title" className="text-sm font-medium">Judul</label>
            <Input id="media-title" required value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <label htmlFor="media-description" className="text-sm font-medium">Deskripsi</label>
            <textarea id="media-description" required maxLength={2000} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-32 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="media-subject" className="text-sm font-medium">Mata Pelajaran</label>
              <select id="media-subject" required value={form.subject ?? ""} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
                <option value="">Pilih mata pelajaran</option>
                {subjects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="media-level" className="text-sm font-medium">Jenjang</label>
              <select id="media-level" required value={form.level ?? ""} onChange={(e) => setForm({ ...form, level: e.target.value })} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
                <option value="">Pilih jenjang</option>
                {levels.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="media-format" className="text-sm font-medium">Format</label>
              <select id="media-format" value={form.format ?? "pdf"} onChange={(e) => {
                const format = e.target.value as Media["format"];
                setForm({ ...form, format, type: ["video", "audio", "website"].includes(format) ? "url" : form.type });
              }} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
                <option value="pdf">PDF</option><option value="ebook">E-Book</option><option value="website">Website</option><option value="video">Video</option><option value="audio">Audio</option><option value="presentasi">Presentasi</option><option value="other">Lainnya</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="media-source" className="text-sm font-medium">Sumber</label>
              <select id="media-source" value={form.type ?? "file"} onChange={(e) => setForm({ ...form, type: e.target.value as Media["type"] })} disabled={["video", "audio", "website"].includes(form.format)} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm disabled:opacity-60">
                <option value="file">{form.format === "presentasi" ? "Upload PPTX" : "Upload dokumen"}</option><option value="url">{form.format === "presentasi" ? "Link Canva" : "URL eksternal"}</option>
              </select>
            </div>
          </div>
          {form.type === "file" ? (
            <div className="space-y-2">
              <label htmlFor="media-file" className="text-sm font-medium">File dokumen</label>
              <Input key="media-file-input" id="media-file" type="file" accept={form.format === "presentasi" ? ".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation" : ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"} onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)} required={!source?.file_url} className="h-11 rounded-xl" />
              <p className="text-xs text-muted-foreground">{form.format === "presentasi" ? "File PPTX maksimal 50 MB." : "PDF, Office, atau ZIP. Maksimal 50 MB."}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="media-url" className="text-sm font-medium">{form.format === "presentasi" ? "Link Canva" : "URL eksternal"}</label>
              <Input key="media-url-input" id="media-url" type="url" required placeholder={form.format === "presentasi" ? "https://www.canva.com/design/.../view" : undefined} value={form.external_url ?? ""} onChange={(e) => setForm({ ...form, external_url: e.target.value })} className="h-11 rounded-xl" />
              {form.format === "presentasi" && <p className="text-xs text-muted-foreground">Tempel link berbagi Canva biasa, bukan kode embed.</p>}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="media-thumbnail" className="text-sm font-medium">Thumbnail</label>
            <Input id="media-thumbnail" type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)} className="h-11 rounded-xl" />
            <p className="text-xs text-muted-foreground">Opsional. JPG, PNG, atau WebP maksimal 1 MB.</p>
          </div>
          {canPublish && (
            <div className="space-y-2">
              <label htmlFor="media-status" className="text-sm font-medium">Status</label>
              <select id="media-status" value={form.status ?? "draft"} onChange={(e) => setForm({ ...form, status: e.target.value as Media["status"] })} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
                <option value="draft">Draft</option><option value="published">Dipublikasikan</option>
              </select>
            </div>
          )}
        </CardContent>
      </Card>
      {error && <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <div className="flex gap-3">
        <Button disabled={saving} className="h-11 rounded-xl">{saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : media?.status === "published" && !canPublish ? "Simpan Revisi" : "Simpan"}</Button>
        <Button variant="outline" asChild className="h-11 rounded-xl"><Link href={basePath}>Batal</Link></Button>
      </div>
    </form>
  );
}
