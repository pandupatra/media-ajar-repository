"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cancelRevisionAction, deleteMediaAction, submitMediaAction } from "@/app/admin/media/actions";

export function TeacherMediaActions({ id, canDelete, canSubmit, canCancel }: { id: string; canDelete: boolean; canSubmit: boolean; canCancel: boolean }) {
  const router = useRouter();
  const showToast = useToast();
  const [busy, setBusy] = useState(false);
  async function run(action: () => Promise<void>, successMessage: string, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(true);
    try {
      await action();
      showToast({ title: successMessage, variant: "success" });
      router.refresh();
    } catch (error) {
      showToast({ title: "Tindakan belum selesai", description: error instanceof Error ? error.message : "Silakan coba lagi.", variant: "error" });
    } finally { setBusy(false); }
  }
  return <div className="flex justify-end gap-2">{canSubmit && <Button size="sm" disabled={busy} onClick={() => run(() => submitMediaAction(id), "Media berhasil dikirim untuk ditinjau")}>Kirim Review</Button>}{canCancel && <Button size="sm" variant="outline" disabled={busy} onClick={() => run(() => cancelRevisionAction(id), "Revisi berhasil dibatalkan", "Batalkan revisi ini?")}>Batalkan Revisi</Button>}{canDelete && <Button size="sm" variant="destructive" disabled={busy} onClick={() => run(() => deleteMediaAction(id), "Media berhasil dihapus", "Hapus media draft ini?")}>Hapus</Button>}</div>;
}
