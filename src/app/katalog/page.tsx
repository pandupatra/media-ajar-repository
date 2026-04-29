import { Suspense } from "react";
import KatalogPage from "./katalog-page";
import { getPublishedMedia, getCategoriesByType } from "@/lib/data-server";

export default async function KatalogWrapper() {
  const initialMedia = await getPublishedMedia();
  const subjects = await getCategoriesByType("subject");
  const levels = await getCategoriesByType("level");
  const formats = await getCategoriesByType("format");

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
      <KatalogPage 
        initialMedia={initialMedia} 
        subjects={subjects}
        levels={levels}
        formats={formats}
      />
    </Suspense>
  );
}
