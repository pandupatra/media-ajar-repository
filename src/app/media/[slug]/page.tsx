import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getMediaBySlug, getRelatedMedia } from "@/lib/data-server";
import { getFormatLabel, getFormatColor, formatFileSize, formatDate, getHeyzineEmbedUrl, getYouTubeEmbedUrl } from "@/lib/format";
import { ViewCounter } from "./view-counter";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function MediaDetailPage({ params }: Props) {
  const { slug } = await params;
  const media = await getMediaBySlug(slug);

  if (!media) {
    notFound();
  }

  const relatedMedia = await getRelatedMedia(media, 4);
  const heyzineEmbedUrl = media.type === "url" ? getHeyzineEmbedUrl(media.external_url) : null;
  const youtubeEmbedUrl = media.format === "video" && media.type === "url"
    ? getYouTubeEmbedUrl(media.external_url)
    : null;
  const mediaEmbedUrl = heyzineEmbedUrl ?? youtubeEmbedUrl;

  return (
    <div className="min-h-screen flex flex-col">
      <ViewCounter slug={media.slug} />
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <Button variant="ghost" asChild className="mb-6 rounded-xl">
            <Link href="/katalog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Katalog
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center overflow-hidden">
                {mediaEmbedUrl ? (
                  <iframe
                    src={mediaEmbedUrl}
                    title={media.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : media.thumbnail_url ? (
                  <img src={media.thumbnail_url} alt={media.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="h-24 w-24 text-muted-foreground/30" />
                )}
              </div>

              <div>
                <Badge className={`mb-3 rounded-full ${getFormatColor(media.format)}`}>
                  {getFormatLabel(media.format)}
                </Badge>
                <h1 className="text-3xl font-bold mb-4">{media.title}</h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {media.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(media.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {media.view_count} dilihat
                </div>
                {media.file_size && (
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {formatFileSize(media.file_size)}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {media.type === "file" && media.file_url && (
                  <Button size="lg" asChild className="rounded-xl">
                    <a href={media.file_url} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Unduh File
                    </a>
                  </Button>
                )}
                {media.type === "url" && media.external_url && (
                  <Button size="lg" asChild className="rounded-xl">
                    <a href={media.external_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {getYouTubeEmbedUrl(media.external_url) ? "Tonton di YouTube" : "Kunjungi Media"}
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-0 shadow-lg shadow-primary/5 rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold">Informasi Media</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format</span>
                      <span className="font-medium">{getFormatLabel(media.format)}</span>
                    </div>
                    {media.file_size && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ukuran File</span>
                        <span className="font-medium">{formatFileSize(media.file_size)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Diunggah</span>
                      <span className="font-medium">{formatDate(media.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dilihat</span>
                      <span className="font-medium">{media.view_count} kali</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {relatedMedia.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Media Terkait</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedMedia.map((related) => (
                  <Link key={related.id} href={`/media/${related.slug}`}>
                    <Card className="overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col rounded-2xl border-0 shadow-md shadow-primary/5">
                      <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                        {related.thumbnail_url ? (
                          <img src={related.thumbnail_url} alt={related.title} className="w-full h-full object-cover" />
                        ) : (
                          <BookOpen className="h-10 w-10 text-muted-foreground/50" />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="secondary" className={`mb-2 w-fit rounded-full ${getFormatColor(related.format)}`}>
                          {getFormatLabel(related.format)}
                        </Badge>
                        <h3 className="font-semibold line-clamp-2 text-sm">{related.title}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
