import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-foreground text-foreground/80 mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image src="/logo.png" alt="" width={36} height={36} className="rounded-xl" />
              <span className="font-bold text-white text-lg">SIMPEL Madrasah Kubar</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Sistem Media Pembelajaran untuk guru dan murid. Temukan berbagai
              format media yang mendukung proses belajar mengajar.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Navigasi</h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-white transition-colors">
                  Katalog
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-white transition-colors">
                  Tentang
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Kontak</h3>
            <p className="text-sm text-white/60">
              Email: pendiskubar@gmail.com
            </p>
            <p className="text-sm text-white/60 mt-2">
              SIMPEL Madrasah Kubar
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-8 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} SIMPEL Madrasah Kubar. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
