"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllCategories } from "@/lib/data-client";
import { createMediaAction } from "../actions";
import { Category } from "@/types";

export default function AddMediaPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const cats = await getAllCategories();
      setCategories(cats);
      setLoading(false);
    }
    load();
  }, []);

  const subjectCategories = categories.filter((c) => c.type === "subject");
  const levelCategories = categories.filter((c) => c.type === "level");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    format: "pdf" as "pdf" | "ebook" | "website" | "video" | "audio" | "other",
    type: "file" as "file" | "url",
    external_url: "",
    status: "draft" as "draft" | "published",
    subject: "",
    level: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await createMediaAction({
      ...formData,
      slug: generateSlug(formData.title),
      file_url: formData.type === "file" ? "#" : null,
      external_url: formData.type === "url" ? formData.external_url : null,
      thumbnail_url: null,
      file_size: null,
    });
    setSaving(false);
    if (result.errors) {
      alert(Object.values(result.errors).join("\n"));
      return;
    }
    router.push("/admin/media");
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  if (loading) {
    return (
      <div className="text-center py-12" role="status">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" aria-label="Memuat" />
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-xl">
          <Link href="/admin/media">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tambah Media Baru</h1>
          <p className="text-muted-foreground mt-1">Isi formulir di bawah untuk menambahkan media pembelajaran baru</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-0 shadow-md shadow-primary/5 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="media-title" className="text-sm font-medium">Judul</label>
              <Input
                id="media-title"
                placeholder="Masukkan judul media"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                aria-required="true"
                className="rounded-xl h-11"
              />
              {formData.title && (
                <p className="text-xs text-muted-foreground">Slug: {generateSlug(formData.title)}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="media-description" className="text-sm font-medium">Deskripsi</label>
              <textarea
                id="media-description"
                className="flex min-h-[120px] w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Masukkan deskripsi media"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="media-subject" className="text-sm font-medium">Mata Pelajaran</label>
                <select
                  id="media-subject"
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                >
                  <option value="">Pilih Mata Pelajaran</option>
                  {subjectCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="media-level" className="text-sm font-medium">Jenjang</label>
                <select
                  id="media-level"
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  required
                >
                  <option value="">Pilih Jenjang</option>
                  {levelCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="media-format" className="text-sm font-medium">Format</label>
                <select
                  id="media-format"
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.format}
                  onChange={(e) => {
                    const format = e.target.value as typeof formData.format;
                    setFormData({ ...formData, format, type: format === "website" ? "url" : formData.type });
                  }}
                >
                  <option value="pdf">PDF</option>
                  <option value="ebook">E-Book</option>
                  <option value="website">Website</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="media-status" className="text-sm font-medium">Status</label>
                <select
                  id="media-status"
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Dipublikasikan</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md shadow-primary/5 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Sumber Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="media-source" className="text-sm font-medium">Sumber</label>
              <select
                id="media-source"
                className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.type}
                onChange={(e) => setFormData({
                  ...formData,
                  type: e.target.value as typeof formData.type,
                  external_url: e.target.value === "url" ? formData.external_url : "",
                })}
              >
                {formData.format !== "website" && <option value="file">Upload Manual</option>}
                <option value="url">{formData.format === "video" ? "YouTube" : "URL Eksternal"}</option>
              </select>
            </div>

            {formData.type === "file" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload File</label>
                <div className="border-2 border-dashed border-input rounded-2xl p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Klik atau seret file ke sini untuk mengunggah</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, gambar, atau dokumen (maks. 50MB)</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {formData.format === "video" ? "URL YouTube" : "URL Eksternal"}
                </label>
                <Input
                  type="url"
                  placeholder={formData.format === "video" ? "https://www.youtube.com/watch?v=..." : "https://..."}
                  value={formData.external_url}
                  onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                  required={formData.type === "url"}
                  className="rounded-xl h-11"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md shadow-primary/5 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Thumbnail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-input rounded-2xl p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Klik atau seret gambar ke sini untuk mengunggah thumbnail</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG (maks. 1 MB)</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={saving} className="rounded-xl h-11">
            {saving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
            ) : (
              "Simpan Media"
            )}
          </Button>
          <Button variant="outline" asChild className="rounded-xl h-11">
            <Link href="/admin/media">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
