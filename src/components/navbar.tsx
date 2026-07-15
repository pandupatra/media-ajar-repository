"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/katalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl shadow-sm border-b" : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"}`}>
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5 mr-6 group">
          <Image src="/logo.png" alt="" width={36} height={36} className="rounded-xl group-hover:scale-105 transition-transform" />
          <span className="text-lg font-bold hidden sm:inline">SIMPEL Madrasah Kubar</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4" role="search">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari media pembelajaran..."
              aria-label="Cari media pembelajaran"
              className="pl-9 w-full rounded-xl border-muted/60 bg-muted/30 focus:bg-background transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-1 ml-auto" aria-label="Navigasi utama">
          {[
            { href: "/", label: "Beranda" },
            { href: "/katalog", label: "Katalog" },
            { href: "/tentang", label: "Tentang" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary hover:bg-primary/5 px-3 py-2 rounded-xl"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden ml-auto rounded-xl"
          ref={menuButtonRef}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-nav" role="navigation" aria-label="Menu navigasi" className="md:hidden border-t px-4 py-4 space-y-1 bg-background">
          {[
            { href: "/", label: "Beranda" },
            { href: "/katalog", label: "Katalog" },
            { href: "/tentang", label: "Tentang" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium px-3 py-2.5 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
