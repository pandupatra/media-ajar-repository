import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPendingReviewsAction } from "../actions";

export default async function MediaReviewPage() {
  const media = await getPendingReviewsAction();
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold">Review Media Kontributor</h1><p className="text-muted-foreground">Periksa detail media baru dan revisi sebelum mengambil tindakan</p></div><div className="space-y-4">{media.map((item) => { const proposed = item.pending_changes; return <article key={item.id} className="rounded-2xl bg-background p-6 shadow-sm"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-semibold">{proposed?.title ?? item.title}</h2><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">{proposed ? "Revisi" : "Media Baru"}</span></div><p className="mt-1 text-sm text-muted-foreground">Kontributor: {item.creator?.name ?? item.creator?.email ?? "-"} · {item.creator?.madrasah ?? "Madrasah belum diisi"}</p></div><Button asChild variant="outline" className="shrink-0 rounded-xl"><Link href={`/admin/media/review/${item.id}`}><Eye className="mr-2 h-4 w-4" />Lihat Detail</Link></Button></div></article>; })}{media.length === 0 && <div className="rounded-2xl bg-background p-12 text-center text-muted-foreground shadow-sm">Tidak ada media yang menunggu review.</div>}</div></div>;
}
