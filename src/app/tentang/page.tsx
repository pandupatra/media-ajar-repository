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
              Tentang Media Pembelajaran PTP
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
          <div className="space-y-16">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Profil Tim Pengembang</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
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
                      info@ptp-pembelajaran.id
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