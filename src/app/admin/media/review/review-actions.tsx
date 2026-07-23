"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { approveMediaAction, returnMediaAction } from "../actions";

export function ReviewActions({ id }: { id: string }) {
  const router = useRouter();
  const showToast = useToast();
  const [busy, setBusy] = useState(false);
  async function run(action: () => Promise<void>, successMessage: string) {
    setBusy(true);
    try {
      await action();
      showToast({ title: successMessage, variant: "success" });
      router.push("/admin/media/review");
    } catch (error) {
      showToast({ title: "Tinjauan belum diproses", description: error instanceof Error ? error.message : "Silakan coba lagi.", variant: "error" });
    } finally { setBusy(false); }
  }
  return <div className="flex gap-2"><Button disabled={busy} onClick={() => run(() => approveMediaAction(id), "Media berhasil disetujui")} className="rounded-xl">Setujui</Button><Button disabled={busy} variant="outline" onClick={() => run(() => returnMediaAction(id), "Media berhasil dikembalikan")} className="rounded-xl">Kembalikan</Button></div>;
}
