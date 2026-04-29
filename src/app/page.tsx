import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Layers, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getLatestMedia, getPublishedMedia } from "@/lib/data-server";
import { getFormatLabel, getFormatColor } from "@/lib/format";

export default async function HomePage() {
  const latestMedia = await getLatestMedia(8);
  const publishedMedia = await getPublishedMedia();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-background" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float-delayed" />

          <div className="relative container mx-auto px-4 md:px-6 pt-12 pb-20 md:pt-24 md:pb-32">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up animate-delay-100">
                Portal Media Belajar{" "}
                <span className="text-primary">Digital</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up animate-delay-200">
                Temukan berbagai media pembelajaran digital berkualitas untuk guru dan
                murid. E-book, video, PDF, dan materi interaktif dalam satu
                platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-300">
                <Button asChild size="lg" className="rounded-xl h-12 px-8 text-base">
                  <Link href="/katalog">
                    Jelajahi Media Pembelajaran
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl h-12 px-8 text-base">
                  <Link href="/tentang">
                    Pelajari Lebih Lanjut
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 text-center max-w-lg mx-auto animate-fade-in-up animate-delay-400">
              <div>
                <span className="block text-3xl md:text-4xl font-bold text-primary">
                  {publishedMedia.length}+
                </span>
                <span className="text-sm text-muted-foreground">Media Tersedia</span>
              </div>
              <div>
                <span className="block text-3xl md:text-4xl font-bold text-primary">
                  5+
                </span>
                <span className="text-sm text-muted-foreground">Format Media</span>
              </div>
              <div>
                <span className="block text-3xl md:text-4xl font-bold text-primary">
                  100%
                </span>
                <span className="text-sm text-muted-foreground">Gratis</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Semua yang Anda Butuhkan untuk Pembelajaran
              </h2>
              <p className="text-muted-foreground text-lg">
                Platform lengkap dengan berbagai media pembelajaran yang dikurasi untuk mendukung proses belajar mengajar yang efektif.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="border-0 shadow-lg shadow-primary/5 rounded-2xl hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <Layers className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Beragam Format</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Akses PDF, E-Book, video, website, dan materi interaktif dalam satu tempat. Semua format media pembelajaran tersedia.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg shadow-primary/5 rounded-2xl hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <GraduationCap className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Dikurasi Guru</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Setiap media dikurasi dan diverifikasi oleh pengajar berpengalaman untuk memastikan kualitas dan relevansi konten.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg shadow-primary/5 rounded-2xl hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <TrendingUp className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Mudah Digunakan</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Interface intuitif dengan pencarian dan filter canggih. Temukan materi yang tepat dalam hitungan detik.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight">Media Terbaru</h2>
              <Button variant="outline" asChild className="rounded-xl hidden sm:inline-flex">
                <Link href="/katalog">
                  Lihat Semua
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestMedia.map((media) => (
                <Link key={media.id} href={`/media/${media.slug}`}>
                  <Card className="overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col rounded-2xl border-0 shadow-md shadow-primary/5">
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
                      {media.thumbnail_url ? (
                        <img src={media.thumbnail_url} alt={media.title} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                      )}
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <Badge
                        variant="secondary"
                        className={`mb-2 w-fit rounded-full ${getFormatColor(media.format)}`}
                      >
                        {getFormatLabel(media.format)}
                      </Badge>
                      <h3 className="font-semibold line-clamp-2 mb-2">
                        {media.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                        {media.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" asChild className="rounded-xl">
                <Link href="/katalog">
                  Lihat Semua Media
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Siap Menemukan Media Pembelajaran yang Tepat?
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                Jelajahi koleksi media pembelajaran kami dan temukan materi yang sempurna untuk kebutuhan belajar mengajar Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-xl h-12 px-8 text-base">
                  <Link href="/katalog">
                    Jelajahi Katalog
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}