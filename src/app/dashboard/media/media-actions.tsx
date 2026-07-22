"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cancelRevisionAction, deleteMediaAction, submitMediaAction } from "@/app/admin/media/actions";

export function TeacherMediaActions({ id, canDelete, canSubmit, canCancel }: { id: string; canDelete: boolean; canSubmit: boolean; canCancel: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function run(action: () => Promise<void>, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(true);
    try { await action(); router.refresh(); } finally { setBusy(false); }
  }
  return <div className="flex justify-end gap-2">{canSubmit && <Button size="sm" disabled={busy} onClick={() => run(() => submitMediaAction(id))}>Kirim Review</Button>}{canCancel && <Button size="sm" variant="outline" disabled={busy} onClick={() => run(() => cancelRevisionAction(id), "Batalkan revisi ini?")}>Batalkan Revisi</Button>}{canDelete && <Button size="sm" variant="destructive" disabled={busy} onClick={() => run(() => deleteMediaAction(id), "Hapus media draft ini?")}>Hapus</Button>}</div>;
}
