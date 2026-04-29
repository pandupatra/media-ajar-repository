"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Eye, FileText, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ConfirmDialog,
  ConfirmDialogContent,
  ConfirmDialogTitle,
  ConfirmDialogDescription,
  ConfirmDialogClose,
} from "@/components/ui/confirm-dialog";
import { getAllMediaForClient } from "@/lib/data-client";
import { getFormatLabel, getFormatColor } from "@/lib/format";
import { deleteMediaAction } from "./actions";
import { Media } from "@/types";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadMedia() {
    setLoading(true);
    const data = await getAllMediaForClient();
    setMediaList(data);
    setLoading(false);
  }

  useEffect(() => {
    loadMedia();
  }, []);

  const filteredMedia = mediaList.filter((media) => {
    const matchesSearch = !searchQuery || media.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || media.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMediaAction(deleteTarget);
      setMediaList(mediaList.filter((m) => m.id !== deleteTarget));
    } catch {
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Kelola Media</h1>
          <p className="text-muted-foreground mt-1">Kelola semua media pembelajaran</p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href="/admin/media/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Media
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Cari media"
            placeholder="Cari media..."
            className="pl-9 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="rounded-xl"
            >
              {status === "all" ? "Semua" : status === "published" ? "Dipublikasikan" : "Draft"}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-background rounded-2xl border-0 shadow-md shadow-primary/5 overflow-hidden" aria-busy={loading}>
        {loading ? (
          <div className="text-center py-16" role="status">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" aria-label="Memuat" />
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table aria-label="Daftar media" className="w-full text-sm">
                <caption className="sr-only">Daftar media pembelajaran</caption>
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th scope="col" className="text-left p-4 font-medium text-muted-foreground">Judul</th>
                    <th scope="col" className="text-left p-4 font-medium text-muted-foreground">Format</th>
                    <th scope="col" className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th scope="col" className="text-left p-4 font-medium text-muted-foreground">Tanggal</th>
                    <th scope="col" className="text-right p-4 font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedia.map((media) => (
                    <tr key={media.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="font-medium line-clamp-1">{media.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{media.slug}</div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary" className={`rounded-full ${getFormatColor(media.format)}`}>
                          {getFormatLabel(media.format)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          media.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {media.status === "published" ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(media.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild aria-label="Lihat media" className="rounded-xl">
                            <Link href={`/media/${media.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild aria-label="Edit media" className="rounded-xl">
                            <Link href={`/admin/media/${media.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(media.id)} aria-label="Hapus media" className="rounded-xl">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredMedia.length === 0 && (
              <div className="text-center py-16">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Tidak ada media ditemukan</h3>
                <p className="text-muted-foreground">Coba ubah kata kunci atau filter yang digunakan</p>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <ConfirmDialogContent>
          <ConfirmDialogTitle>Hapus Media</ConfirmDialogTitle>
          <ConfirmDialogDescription>
            Apakah Anda yakin ingin menghapus media ini? Tindakan ini tidak dapat dibatalkan.
          </ConfirmDialogDescription>
          <div className="flex justify-end gap-2 mt-4">
            <ConfirmDialogClose asChild>
              <Button variant="outline" disabled={deleting} className="rounded-xl">Batal</Button>
            </ConfirmDialogClose>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting} className="rounded-xl">
              {deleting ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </ConfirmDialogContent>
      </ConfirmDialog>
    </div>
  );
}