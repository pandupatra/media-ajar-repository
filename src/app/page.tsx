import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Gamepad2,
  MonitorPlay,
  Play,
  Presentation,
  Quote,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MediaSuggestionForm } from "@/components/media-suggestion-form";
import { getLatestMedia } from "@/lib/data-server";
import { getFormatLabel, getFormatColor } from "@/lib/format";

const carouselImages = [
  { src: "/home-carousel/carousel-01.jpeg", alt: "Pendampingan penggunaan media digital di ruang kelas madrasah" },
  { src: "/home-carousel/carousel-02.jpeg", alt: "Tenaga pendidik Madrasah Kutai Barat di kawasan madrasah" },
  { src: "/home-carousel/carousel-03.jpeg", alt: "Narasumber berbicara dalam kegiatan inovasi media belajar digital" },
  { src: "/home-carousel/carousel-04.jpeg", alt: "Peserta sosialisasi inovasi media belajar digital untuk madrasah" },
  { src: "/home-carousel/carousel-05.jpeg", alt: "Guru mengikuti aktivitas interaktif dalam kegiatan pembelajaran" },
  { src: "/home-carousel/carousel-06.jpeg", alt: "Presentasi transformasi teknologi untuk pembelajaran madrasah" },
  { src: "/home-carousel/carousel-07.jpeg", alt: "Pendampingan guru menggunakan laptop untuk media pembelajaran" },
  { src: "/home-carousel/carousel-08.jpeg", alt: "Pelatihan media pembelajaran digital bersama guru madrasah" },
];

export default async function HomePage() {
  const latestMedia = await getLatestMedia(8);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-1">
        <section className="relative isolate overflow-hidden bg-[#f4f8ff]">
          <Image src="/hero-media-pembelajaran.png" alt="" fill priority sizes="100vw" className="-z-10 object-cover object-[68%_center] md:object-center" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/65 to-white/10 md:via-white/45" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-24 bg-gradient-to-b from-transparent to-[#f4f8ff]" />

          <div className="container mx-auto grid min-h-[640px] items-center gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6 lg:py-16">
            <div className="relative z-10 max-w-xl animate-fade-in-up">
              <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.045em] text-[#0b1b4d] sm:text-5xl lg:text-6xl">
                Selamat datang di{" "}
                <span className="text-[#0d9488]">SIMPEL</span>{" "}
                <span className="text-primary">Madrasah Kubar</span>
              </h1>
              <p className="mt-6 max-w-[58ch] text-base leading-7 text-slate-600 md:text-lg">
                Sistem Media Pembelajaran yang membantu guru dan murid
                belajar lebih kreatif, relevan, dan bermakna.
              </p>

              <blockquote className="mt-7 flex max-w-lg gap-3 border-l-2 border-primary/25 pl-4 text-sm font-medium italic leading-6 text-[#27365f]">
                <Quote className="mt-0.5 h-5 w-5 shrink-0 fill-primary/15 text-primary/60" />
                <p>Karena setiap guru berhak mendapatkan sarana terbaik untuk mencetak generasi hebat</p>
              </blockquote>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-xl px-7 text-base shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]">
                  <Link href="/katalog">
                    Jelajahi media
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 rounded-xl border-primary/30 bg-white/75 px-7 text-base text-[#14255b] shadow-sm backdrop-blur transition-transform hover:bg-white active:scale-[0.98]">
                  <Link href="/tentang">
                    <Play className="h-4 w-4 fill-current" />
                    Lihat cara kerja
                  </Link>
                </Button>
              </div>
            </div>

            <div className="hidden" aria-hidden="true">
              <div className="absolute left-[16%] top-[14%] h-56 w-56 rounded-full bg-cyan-200/35 blur-3xl" />
              <div className="absolute right-[8%] top-[8%] h-64 w-64 rounded-full bg-violet-300/30 blur-3xl" />

              <div className="absolute left-[20%] top-[22%] z-20 w-[62%] rotate-[-1.5deg] rounded-[2rem] border border-white/80 bg-white/90 p-3 shadow-[0_32px_80px_-28px_rgba(30,64,175,0.42)] backdrop-blur sm:left-[23%] sm:w-[58%]">
                <div className="overflow-hidden rounded-[1.45rem] bg-gradient-to-br from-[#edf6ff] to-[#dbeafe]">
                  <div className="flex items-center gap-1.5 border-b border-white/80 px-4 py-3">
                    <span className="h-2 w-2 rounded-full bg-[#ff7b72]" />
                    <span className="h-2 w-2 rounded-full bg-[#f8c555]" />
                    <span className="h-2 w-2 rounded-full bg-[#3fb950]" />
                    <span className="ml-2 text-[10px] font-semibold text-slate-500">simpel.madrasah.kubar</span>
                  </div>
                  <div className="grid min-h-56 place-items-center p-6 text-center sm:min-h-64">
                    <div>
                      <div className="mx-auto grid h-20 w-20 place-items-center rounded-[1.6rem] bg-primary text-white shadow-xl shadow-primary/25">
                        <BookOpen className="h-10 w-10" />
                      </div>
                      <p className="mt-4 text-lg font-bold text-[#10245d]">Belajar tanpa batas</p>
                      <p className="mt-1 text-xs text-slate-500">Video · e-book · lembar kerja · media interaktif</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="animate-float absolute left-[1%] top-[2%] z-30 w-40 rotate-[-5deg] rounded-2xl border-4 border-white bg-gradient-to-br from-[#ff9254] to-[#ff6f61] p-4 text-white shadow-xl sm:left-[4%] sm:w-44">
                <Presentation className="h-6 w-6" />
                <p className="mt-3 text-sm font-bold leading-tight">Presentasi interaktif</p>
                <div className="mt-3 h-12 rounded-lg bg-white/25" />
              </div>

              <div className="animate-float-delayed absolute right-[0%] top-[5%] z-30 w-40 rotate-[5deg] rounded-2xl border-4 border-white bg-gradient-to-br from-[#7c5cff] to-[#a855f7] p-4 text-white shadow-xl sm:right-[2%] sm:w-44">
                <MonitorPlay className="h-6 w-6" />
                <p className="mt-3 text-sm font-bold leading-tight">Video pembelajaran</p>
                <div className="mt-3 grid h-12 place-items-center rounded-lg bg-white/25">
                  <Play className="h-5 w-5 fill-white" />
                </div>
              </div>

              <div className="animate-float-delayed absolute bottom-[3%] left-[2%] z-30 w-40 rotate-[4deg] rounded-2xl border-4 border-white bg-gradient-to-br from-[#27b89b] to-[#0d9488] p-4 text-white shadow-xl sm:left-[6%] sm:w-44">
                <FileText className="h-6 w-6" />
                <p className="mt-3 text-sm font-bold leading-tight">Lembar kerja siswa</p>
                <div className="mt-3 space-y-1.5 rounded-lg bg-white/20 p-2">
                  <span className="block h-1.5 w-full rounded-full bg-white/70" />
                  <span className="block h-1.5 w-3/4 rounded-full bg-white/50" />
                </div>
              </div>

              <div className="animate-float absolute bottom-[1%] right-[1%] z-30 w-40 rotate-[-4deg] rounded-2xl border-4 border-white bg-gradient-to-br from-[#ec4899] to-[#f43f5e] p-4 text-white shadow-xl sm:right-[5%] sm:w-44">
                <Gamepad2 className="h-6 w-6" />
                <p className="mt-3 text-sm font-bold leading-tight">Permainan edukasi</p>
                <div className="mt-3 flex h-12 items-center justify-center gap-2 rounded-lg bg-white/20">
                  <span className="h-5 w-5 rounded bg-yellow-300" />
                  <span className="h-5 w-5 rounded bg-cyan-300" />
                  <span className="h-5 w-5 rounded bg-violet-300" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-[#f4f8ff] pb-16 md:pb-24" aria-labelledby="collaboration-title">
          <h2 id="collaboration-title" className="sr-only">
            Semua yang Anda Butuhkan untuk Pembelajaran
          </h2>

          <div
            className="home-carousel overflow-hidden py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary md:py-8"
            role="region"
            aria-label="Galeri kegiatan pembelajaran SIMPEL Madrasah Kubar. Arahkan kursor atau fokuskan galeri untuk menjeda gerakan."
            tabIndex={0}
          >
            <div className="home-carousel-track flex w-max">
              {[false, true].map((duplicate) => (
                <div key={String(duplicate)} className="flex gap-1.5 pr-1.5 md:gap-2 md:pr-2" aria-hidden={duplicate}>
                  {carouselImages.map((image) => (
                    <div key={`${duplicate}-${image.src}`} className="relative aspect-[3/2] w-[68vw] max-w-[520px] shrink-0 overflow-hidden md:w-[36vw] lg:w-[30vw]">
                      <Image
                        src={image.src}
                        alt={duplicate ? "" : image.alt}
                        fill
                        sizes="(max-width: 767px) 68vw, (max-width: 1023px) 36vw, 30vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="container relative z-10 mx-auto -mt-10 px-4 md:-mt-20 md:px-6">
            <div className="mx-auto flex max-w-5xl flex-col items-center rounded-[1.75rem] border border-slate-200 bg-white px-6 py-8 text-center shadow-[0_24px_70px_-35px_rgba(15,23,42,0.35)] md:px-12 md:py-10">
              <p className="max-w-4xl text-pretty text-base font-semibold leading-7 text-[#172554] md:text-xl md:leading-8">
                <span className="text-[#0d9488] font-bold">SIMPEL</span> <span className="text-primary font-bold">Madrasah Kubar</span> hadir sebagai platform yang berkomitmen mewujudkan pembelajaran yang kreatif, inovatif, dan bermakna melalui penyediaan media pembelajaran digital yang mudah diakses, digunakan, dan dikembangkan bersama.
              </p>
              <Button asChild size="lg" className="mt-6 h-11 rounded-xl px-6 shadow-lg shadow-primary/20">
                <Link href="/tentang">
                  Pelajari lebih lanjut
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
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
                    <div className="relative aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
                      {media.thumbnail_url ? (
                        <Image src={media.thumbnail_url} alt={media.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" />
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

        <section id="usulan-media" className="overflow-hidden border-y border-blue-100 bg-[#f4f8ff] py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-12 xl:gap-16">
              <div>
                <h2 className="max-w-xl text-balance text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-[#0b1b4d] md:text-5xl">
                  Punya ide media pembelajaran?
                </h2>
                <p className="mt-4 text-xl font-bold text-primary md:text-2xl">
                  Sampaikan ide Anda kepada kami!
                </p>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                  Belum menemukan media yang sesuai dengan kebutuhan pembelajaran?
                  Kirimkan usulan Anda. Tim kami akan membantu mengembangkan media
                  yang inovatif dan relevan bagi guru serta peserta didik.
                </p>

                <div className="mt-8">
                  <div className="space-y-5">
                    <div className="flex gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-bold text-[#10245d]">Gratis</h3>
                        <p className="mt-1 text-sm leading-5 text-slate-600">Tanpa biaya, dapat dimanfaatkan oleh semua guru.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 text-primary">
                        <BookOpen className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-bold text-[#10245d]">Sesuai Kurikulum</h3>
                        <p className="mt-1 text-sm leading-5 text-slate-600">Media disesuaikan dengan kurikulum yang berlaku.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-700">
                        <UsersRound className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-bold leading-5 text-[#10245d]">Berdasarkan kebutuhan guru</h3>
                        <p className="mt-1 text-sm leading-5 text-slate-600">Ide Anda membantu kami menghadirkan media yang tepat guna.</p>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="mt-8 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                  <p className="text-sm font-bold text-[#10245d]">Contoh media yang bisa diusulkan</p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-2"><MonitorPlay className="h-4 w-4 text-primary" />Video</span>
                    <span className="flex items-center gap-2"><Gamepad2 className="h-4 w-4 text-emerald-600" />Media interaktif</span>
                    <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-violet-600" />LKPD digital</span>
                    <span className="flex items-center gap-2"><Presentation className="h-4 w-4 text-orange-600" />Presentasi</span>
                    <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-sky-600" />Dan lainnya</span>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-card p-6 shadow-[0_24px_70px_-35px_rgba(15,23,42,0.35)] md:p-8">
                <MediaSuggestionForm />
                <p className="mt-6 flex items-start justify-center gap-2 text-center text-xs leading-5 text-slate-500">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  Data Anda aman dan hanya digunakan untuk keperluan pengembangan media pembelajaran.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
