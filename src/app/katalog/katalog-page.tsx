"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookOpen, Search, SlidersHorizontal, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { searchMedia } from "@/lib/data-client";
import { getFormatLabel, getFormatColor } from "@/lib/format";
import { Media, Category } from "@/types";

interface KatalogPageProps {
  initialMedia: Media[];
  subjects: Category[];
  levels: Category[];
  formats: Category[];
}

function getCategoryIds(media: Media): string[] {
  if (!media.categories) return [];
  if (Array.isArray(media.categories) && media.categories.length > 0 && typeof media.categories[0] === "object" && "category_id" in media.categories[0]) {
    return (media.categories as { category_id: string }[]).map((c) => c.category_id);
  }
  return media.categories as unknown as string[];
}

export default function KatalogPage({ initialMedia, subjects, levels, formats }: KatalogPageProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get("subject") || "");
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get("level") || "");
  const [selectedFormat, setSelectedFormat] = useState(searchParams.get("format") || "");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredMedia, setFilteredMedia] = useState(initialMedia);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = await searchMedia(query);
      setFilteredMedia(results);
    } else {
      setFilteredMedia(initialMedia);
    }
  };

  const displayMedia = useMemo(() => {
    let result = [...filteredMedia];
    
    if (selectedSubject) {
      const subjectIds = subjects
        .filter((s) => s.slug === selectedSubject)
        .map((s) => s.id);
      result = result.filter((m) => {
        const catIds = getCategoryIds(m);
        return catIds.some((id) => subjectIds.includes(id));
      });
    }

    if (selectedLevel) {
      const levelIds = levels
        .filter((l) => l.slug === selectedLevel)
        .map((l) => l.id);
      result = result.filter((m) => {
        const catIds = getCategoryIds(m);
        return catIds.some((id) => levelIds.includes(id));
      });
    }

    if (selectedFormat) {
      result = result.filter((m) => m.format === selectedFormat);
    }

    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [filteredMedia, selectedSubject, selectedLevel, selectedFormat, sortBy, subjects, levels]);

  const hasFilters = selectedSubject || selectedLevel || selectedFormat || searchQuery;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSubject("");
    setSelectedLevel("");
    setSelectedFormat("");
    setFilteredMedia(initialMedia);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Katalog Media</h1>
            <p className="text-muted-foreground text-lg mb-8">Jelajahi semua media pembelajaran yang tersedia</p>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="katalog-search"
                  aria-label="Cari media"
                  placeholder="Cari media..."
                  className="pl-9 rounded-xl bg-background" 
                  value={searchQuery} 
                  onChange={(e) => handleSearch(e.target.value)} 
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:hidden rounded-xl">
                  <SlidersHorizontal className="h-4 w-4 mr-2" /> Filter
                </Button>
                <select
                  aria-label="Urutkan media"
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "title")} 
                  className="h-9 rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="title">Judul A-Z</option>
                </select>
                {hasFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="rounded-xl">
                    <X className="h-4 w-4 mr-1" /> Reset
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className={`md:w-64 space-y-6 ${showFilters ? "block" : "hidden md:block"}`}>
              {[
                { title: "Mata Pelajaran", items: subjects, selected: selectedSubject, setSelected: setSelectedSubject },
                { title: "Jenjang", items: levels, selected: selectedLevel, setSelected: setSelectedLevel },
                { title: "Format", items: formats, selected: selectedFormat, setSelected: setSelectedFormat },
              ].map(({ title, items, selected, setSelected: set }) => (
                <div key={title} className="bg-muted/30 rounded-2xl p-5">
                  <h3 className="font-semibold mb-3">{title}</h3>
                  <div role="radiogroup" aria-label={`Filter ${title}`} className="space-y-2">
                    {items.map((item) => (
                      <label key={item.id} className="flex items-center gap-2.5 text-sm cursor-pointer group">
                        <input 
                          type="radio" 
                          name={title} 
                          checked={selected === item.slug} 
                          onChange={() => set(item.slug)} 
                          className="accent-primary"
                        />
                        <span className="group-hover:text-primary transition-colors">{item.name}</span>
                      </label>
                    ))}
                    {selected && (
                      <Button variant="ghost" size="sm" className="h-auto py-1 text-primary rounded-xl" onClick={() => set("")}>
                        <X className="h-3 w-3 mr-1" /> Hapus filter
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </aside>

            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-6" aria-live="polite">Menampilkan {displayMedia.length} media</p>
              {displayMedia.length === 0 ? (
                <div className="text-center py-20">
                  <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Tidak ada media ditemukan</h3>
                  <p className="text-muted-foreground mb-6">Coba ubah kata kunci atau filter yang digunakan</p>
                  <Button onClick={clearFilters} className="rounded-xl">Reset Filter</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayMedia.map((media) => (
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
                          <Badge variant="secondary" className={`mb-2 w-fit rounded-full ${getFormatColor(media.format)}`}>
                            {getFormatLabel(media.format)}
                          </Badge>
                          <h3 className="font-semibold line-clamp-2 mb-2">{media.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{media.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}