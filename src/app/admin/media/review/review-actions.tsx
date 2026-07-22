"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { approveMediaAction, returnMediaAction } from "../actions";

export function ReviewActions({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function run(action: () => Promise<void>) {
    setBusy(true);
    try { await action(); router.push("/admin/media/review"); } finally { setBusy(false); }
  }
  return <div className="flex gap-2"><Button disabled={busy} onClick={() => run(() => approveMediaAction(id))} className="rounded-xl">Setujui</Button><Button disabled={busy} variant="outline" onClick={() => run(() => returnMediaAction(id))} className="rounded-xl">Kembalikan</Button></div>;
}
