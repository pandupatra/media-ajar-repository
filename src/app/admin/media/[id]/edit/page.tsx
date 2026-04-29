"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllCategories, getMediaById, getMediaCategoryIds } from "@/lib/data-client";
import { updateMediaAction, uploadThumbnailAction } from "../../actions";
import { Media, Category } from "@/types";

export default function EditMediaPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [media, setMedia] = useState<Media | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    format: "pdf" as Media["format"],
    type: "file" as Media["type"],
    external_url: "",
    status: "draft" as "draft" | "published",
    subject: "",
    level: "",
    thumbnail_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  useEffect(() => {
    async function load() {
      const [m, cats] = await Promise.all([getMediaById(id), getAllCategories()]);
      setMedia(m);
      setCategories(cats);

      if (m) {
        const catIds = await getMediaCategoryIds(id);
        const subject = cats.find((c) => c.type === "subject" && catIds.includes(c.id))?.id || "";
        const level = cats.find((c) => c.type === "level" && catIds.includes(c.id))?.id || "";
        setFormData({
          title: m.title,
          description: m.description || "",
          format: m.format,
          type: m.type,
          external_url: m.external_url || "",
          status: m.status,
          subject,
          level,
          thumbnail_url: m.thumbnail_url || "",
        });
      }

      setLoading(false);
    }
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!media) return;
    setSaving(true);
    const updates: Parameters<typeof updateMediaAction>[1] = { ...formData };
    if (!formData.thumbnail_url) {
      updates.thumbnail_url = null;
    }
    await updateMediaAction(media.id, updates);
    setSaving(false);
    router.push("/admin/media");
  };

  if (loading) {
    return (
      <div className="text-center py-12" role="status">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" aria-label="Memuat" />
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-2">Media tidak ditemukan</h2>
        <Button asChild className="rounded-xl">
          <Link href="/admin/media">Kembali ke Daftar Media</Link>
        </Button>
      </div>
    );
  }

  const subjectCategories = categories.filter((c) => c.type === "subject");
  const levelCategories = categories.filter((c) => c.type === "level");

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-xl">
          <Link href="/admin/media">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Edit Media</h1>
          <p className="text-muted-foreground mt-1">Edit informasi media pembelajaran</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-0 shadow-md shadow-primary/5 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium">Judul</label>
              <Input id="edit-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required aria-required="true" className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium">Deskripsi</label>
              <textarea
                id="edit-description"
                className="flex min-h-[120px] w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-subject" className="text-sm font-medium">Mata Pelajaran</label>
                <select
                  id="edit-subject"
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="">Pilih Mata Pelajaran</option>
                  {subjectCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-level" className="text-sm font-medium">Jenjang</label>
                <select
                  id="edit-level"
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  <option value="">Pilih Jenjang</option>
                  {levelCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-format" className="text-sm font-medium">Format</label>
              <select
                id="edit-format"
                className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value as Media["format"] })}
              >
                <option value="pdf">PDF</option>
                <option value="ebook">E-Book</option>
                <option value="website">Website</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {formData.type === "url" && (
          <Card className="border-0 shadow-md shadow-primary/5 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">URL Eksternal</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="https://..."
                value={formData.external_url}
                onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                className="rounded-xl h-11"
              />
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-md shadow-primary/5 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Thumbnail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.thumbnail_url && (
              <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden">
                <img
                  src={formData.thumbnail_url}
                  alt="Thumbnail saat ini"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {!formData.thumbnail_url ? (
              <label className="block border-2 border-dashed border-input rounded-2xl p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingThumbnail}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !media) return;
                    setUploadingThumbnail(true);
                    const data = new FormData();
                    data.append("thumbnail", file);
                    const result = await uploadThumbnailAction(media.id, data);
                    setUploadingThumbnail(false);
                    if (result.url) {
                      const url = result.url;
                      setFormData((prev) => ({ ...prev, thumbnail_url: url }));
                    } else if (result.error) {
                      alert("Gagal mengunggah thumbnail: " + result.error);
                    }
                    e.target.value = "";
                  }}
                />
                {uploadingThumbnail ? (
                  <Loader2 className="h-8 w-8 mx-auto text-muted-foreground mb-2 animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                )}
                <p className="text-sm text-muted-foreground">
                  {uploadingThumbnail ? "Mengunggah..." : "Klik atau seret gambar ke sini untuk mengunggah thumbnail"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG (maks. 5MB)</p>
              </label>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive rounded-xl"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, thumbnail_url: "" }));
                }}
              >
                Hapus Thumbnail
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving} className="rounded-xl h-11">
            {saving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
          {formData.status === "published" ? (
            <Button type="button" variant="outline" onClick={() => setFormData({ ...formData, status: "draft" })} className="rounded-xl h-11">
              Batal Publikasi
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => setFormData({ ...formData, status: "published" })} className="rounded-xl h-11">
              Publikasikan
            </Button>
          )}
          <Button variant="outline" asChild className="rounded-xl h-11">
            <Link href="/admin/media">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}