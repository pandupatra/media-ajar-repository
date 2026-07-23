"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Eye, FileText, Plus, Search, Trash2 } from "lucide-react";
import { Table, Theme } from "@radix-ui/themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
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
  const showToast = useToast();
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
      showToast({ title: "Media berhasil dihapus", variant: "success" });
    } catch (error) {
      showToast({ title: "Media belum dihapus", description: error instanceof Error ? error.message : "Silakan coba lagi.", variant: "error" });
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
              <Theme accentColor="blue" grayColor="slate" radius="large">
                <Table.Root aria-label="Daftar media" variant="surface" size="2" className="min-w-[720px]">
                <caption className="sr-only">Daftar media pembelajaran</caption>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Judul</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Format</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Dibuat</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell justify="end">Aksi</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {filteredMedia.map((media) => (
                    <Table.Row key={media.id}>
                      <Table.Cell>
                        <div className="font-medium line-clamp-1">{media.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{media.slug}</div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge variant="secondary" className={`rounded-full ${getFormatColor(media.format)}`}>
                          {getFormatLabel(media.format)}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          media.status === "published"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                        }`}>
                          {media.status === "published" ? "Published" : "Draft"}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="text-muted-foreground">
                        {new Date(media.created_at).toLocaleDateString("id-ID")}
                      </Table.Cell>
                      <Table.Cell justify="end">
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
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
                </Table.Root>
              </Theme>
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
