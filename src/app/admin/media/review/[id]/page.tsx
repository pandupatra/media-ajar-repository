import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Calendar, Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllCategories } from "@/lib/data-server";
import { formatDate, formatFileSize, getCanvaEmbedUrl, getFormatColor, getFormatLabel, getHeyzineEmbedUrl, getYouTubeEmbedUrl } from "@/lib/format";
import type { Media } from "@/types";
import { getPendingReviewAction } from "../../actions";
import { ReviewActions } from "../review-actions";

function getCategoryIds(categories: Media["categories"]) {
  return (categories ?? []).map((category) => "category_id" in category ? category.category_id : category.id);
}

export default async function MediaReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [media, categories] = await Promise.all([getPendingReviewAction(id), getAllCategories()]);
  if (!media) notFound();

  const proposed = media.pending_changes;
  const submission = proposed ? { ...media, ...proposed } : media;
  const categoryIds = proposed?.category_ids ?? getCategoryIds(media.categories);
  const categoryNames = categories.filter((category) => categoryIds.includes(category.id)).map((category) => category.name);
  const canvaEmbedUrl = submission.format === "presentasi" && submission.type === "url" ? getCanvaEmbedUrl(submission.external_url) : null;
  const youtubeEmbedUrl = submission.format === "video" && submission.type === "url" ? getYouTubeEmbedUrl(submission.external_url) : null;
  const mediaEmbedUrl = canvaEmbedUrl ?? getHeyzineEmbedUrl(submission.external_url) ?? youtubeEmbedUrl;

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="rounded-xl">
        <Link href="/admin/media/review"><ArrowLeft className="mr-2 h-4 w-4" />Kembali ke Review</Link>
      </Button>

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge className={getFormatColor(submission.format)}>{getFormatLabel(submission.format)}</Badge>
            <Badge variant="outline">{proposed ? "Revisi" : "Media Baru"}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-balance">{submission.title}</h1>
          <p className="mt-1 text-muted-foreground">Periksa isi dan informasi media sebelum menyetujui atau mengembalikannya.</p>
        </div>
        <ReviewActions id={media.id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="space-y-6">
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-muted">
            {mediaEmbedUrl ? (
              <iframe src={mediaEmbedUrl} title={submission.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
            ) : submission.thumbnail_url ? (
              <Image src={submission.thumbnail_url} alt={submission.title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
            ) : (
              <BookOpen className="h-20 w-20 text-muted-foreground/30" />
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold">Deskripsi</h2>
            <p className="mt-2 max-w-[75ch] whitespace-pre-wrap leading-7 text-muted-foreground">{submission.description || "Tidak ada deskripsi."}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {submission.type === "file" && submission.file_url && <Button asChild className="rounded-xl"><a href={submission.file_url} target="_blank" rel="noopener noreferrer"><Download className="mr-2 h-4 w-4" />Buka File</a></Button>}
            {submission.type === "url" && submission.external_url && <Button asChild className="rounded-xl"><a href={submission.external_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2 h-4 w-4" />Buka Media</a></Button>}
          </div>

          {proposed && (
            <section className="rounded-2xl border bg-background p-6">
              <h2 className="text-lg font-semibold">Perbandingan Revisi</h2>
              <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                <div><p className="text-muted-foreground">Judul saat ini</p><p className="mt-1 font-medium">{media.title}</p></div>
                <div><p className="text-muted-foreground">Judul revisi</p><p className="mt-1 font-medium">{proposed.title}</p></div>
                <div><p className="text-muted-foreground">Format saat ini</p><p className="mt-1 font-medium">{getFormatLabel(media.format)}</p></div>
                <div><p className="text-muted-foreground">Format revisi</p><p className="mt-1 font-medium">{getFormatLabel(proposed.format)}</p></div>
                <div className="sm:col-span-2"><p className="text-muted-foreground">Deskripsi saat ini</p><p className="mt-1 whitespace-pre-wrap">{media.description || "Tidak ada deskripsi."}</p></div>
              </div>
            </section>
          )}
        </div>

        <Card className="h-fit border-0 shadow-sm">
          <CardContent className="space-y-5 p-6">
            <div><p className="text-sm text-muted-foreground">Kontributor</p><p className="mt-1 font-semibold">{media.creator?.name ?? "-"}</p><p className="text-sm text-muted-foreground">{media.creator?.email ?? "-"}</p></div>
            <div className="border-t pt-4"><p className="text-sm text-muted-foreground">Madrasah</p><p className="mt-1 font-medium">{media.creator?.madrasah ?? "Belum diisi"}</p></div>
            <div className="border-t pt-4"><p className="text-sm text-muted-foreground">Kategori</p><p className="mt-1 font-medium">{categoryNames.join(", ") || "Belum dipilih"}</p></div>
            <div className="border-t pt-4"><p className="text-sm text-muted-foreground">Jenis sumber</p><p className="mt-1 font-medium">{submission.type === "file" ? "File" : "Tautan"}</p></div>
            {submission.file_size && <div className="border-t pt-4"><p className="text-sm text-muted-foreground">Ukuran file</p><p className="mt-1 font-medium">{formatFileSize(submission.file_size)}</p></div>}
            <div className="flex items-center gap-2 border-t pt-4 text-sm text-muted-foreground"><Calendar className="h-4 w-4" />Diajukan {formatDate(media.pending_submitted_at ?? media.updated_at)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
