import { BookOpen, Mail, MapPin, Users } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function TentangPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Tentang SIMPEL Madrasah Kubar
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
          <div className="space-y-16">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Tentang Platform</h2>
              </div>
              <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
                <p>
                  SIMPEL Madrasah Kubar adalah sebuah platform digital yang dikembangkan sebagai pusat layanan media pembelajaran untuk membantu guru menciptakan proses belajar yang lebih kreatif, inovatif, dan bermakna. Website ini hadir sebagai wadah yang menyediakan beragam media pembelajaran yang dapat dimanfaatkan oleh pendidik sesuai dengan kebutuhan, karakteristik peserta didik, serta perkembangan kurikulum.
                </p>
                <p>
                  Melalui SIMPEL Madrasah Kubar, guru dapat menemukan berbagai sumber belajar dalam satu tempat, mulai dari media presentasi interaktif, video pembelajaran, modul ajar, LKPD, permainan edukatif, asesmen, infografis, hingga berbagai media digital lainnya yang siap digunakan maupun dikembangkan kembali sesuai kebutuhan pembelajaran.
                </p>
                <p>
                  Kami percaya bahwa setiap guru memiliki potensi untuk menghadirkan pengalaman belajar yang menyenangkan dan inspiratif. Oleh karena itu, Simple Madrasah Kubar dibangun dengan prinsip mudah diakses, mudah digunakan, dan mudah dikembangkan, sehingga dapat menjadi sahabat guru dalam meningkatkan kualitas pembelajaran.
                </p>
                <p>
                  SIMPEL Madrasah Kubar bukan sekadar tempat menyimpan media pembelajaran, tetapi merupakan ruang kolaborasi dan inspirasi bagi para pendidik untuk terus berinovasi. Dengan semangat berbagi dan belajar bersama, kami berharap platform ini dapat memberikan manfaat nyata dalam mendukung terciptanya pembelajaran yang efektif, menarik, dan berdampak bagi peserta didik.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Tim Pengembang</h2>
              </div>
              <Card className="overflow-hidden border-0 shadow-lg shadow-primary/5">
                <CardContent className="p-0">
                  <div className="bg-primary px-6 py-8 text-primary-foreground md:px-8">
                    <p className="max-w-2xl text-lg leading-relaxed">
                      SIMPEL Madrasah Kubar dikembangkan oleh empat anggota tim yang berkolaborasi untuk menghadirkan layanan media pembelajaran yang mudah digunakan oleh guru.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
                    {["01", "02", "03", "04"].map((number) => (
                      <div key={number} className="flex items-center gap-4 bg-card p-6 md:p-8">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                          {number}
                        </span>
                        <div>
                          <h3 className="font-semibold">Anggota Tim {Number(number)}</h3>
                          <p className="text-sm text-muted-foreground">Tim Pengembang SIMPEL</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Cara Menggunakan Platform</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { num: "1", title: "Cari Media", desc: "Gunakan fitur pencarian atau jelajahi katalog untuk menemukan media pembelajaran yang sesuai." },
                  { num: "2", title: "Filter & Pilih", desc: "Gunakan filter berdasarkan mata pelajaran, jenjang, atau format untuk mempersempit pencarian." },
                  { num: "3", title: "Akses Media", desc: "Klik pada media yang dipilih untuk melihat detail dan mengakses atau mengunduh materi." },
                ].map((step) => (
                  <Card key={step.num} className="border-0 shadow-lg shadow-primary/5 rounded-2xl hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-8 text-center">
                      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-5 text-xl font-bold">
                        {step.num}
                      </div>
                      <h3 className="font-semibold mb-2 text-lg">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Kontak Kami</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg shadow-primary/5 rounded-2xl">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Email</h3>
                    <p className="text-muted-foreground">
                      pendiskubar@gmail.com
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg shadow-primary/5 rounded-2xl">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Alamat</h3>
                    <p className="text-muted-foreground flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                      Pusat Teknologi Pembelajaran, Indonesia
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
