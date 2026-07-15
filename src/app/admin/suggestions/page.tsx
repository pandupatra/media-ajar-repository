import { revalidatePath } from "next/cache";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/auth-guard";
import { VALID_SUGGESTION_STATUSES } from "@/lib/validations";

const statusLabels = {
  new: "Baru",
  considering: "Dipertimbangkan",
  completed: "Selesai",
} as const;

async function updateSuggestionStatus(formData: FormData) {
  "use server";
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id) || !VALID_SUGGESTION_STATUSES.includes(status as typeof VALID_SUGGESTION_STATUSES[number])) return;

  const { error } = await createAdminClient().from("media_suggestions").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/suggestions");
}

export default async function SuggestionsPage() {
  await requireAdmin();
  const { data: suggestions, error } = await createAdminClient()
    .from("media_suggestions")
    .select("id, topic, subject, level, preferred_format, notes, status, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Usulan Media</h1>
        <p className="mt-1 text-muted-foreground">Masukan kebutuhan media pembelajaran dari guru</p>
      </div>

      {suggestions?.length ? (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="rounded-2xl border-0 shadow-md shadow-primary/5">
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{suggestion.topic}</h2>
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{statusLabels[suggestion.status as keyof typeof statusLabels]}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.subject} / {suggestion.level} / {suggestion.preferred_format.toUpperCase()}
                    </p>
                    {suggestion.notes && <p className="max-w-3xl text-sm leading-relaxed">{suggestion.notes}</p>}
                    <p className="text-xs text-muted-foreground">{new Date(suggestion.created_at).toLocaleDateString("id-ID", { dateStyle: "medium" })}</p>
                  </div>

                  <form action={updateSuggestionStatus} className="flex shrink-0 items-center gap-2">
                    <input type="hidden" name="id" value={suggestion.id} />
                    <label htmlFor={`status-${suggestion.id}`} className="sr-only">Status usulan</label>
                    <select id={`status-${suggestion.id}`} name="status" defaultValue={suggestion.status} className="h-9 rounded-xl border border-input bg-background px-3 text-sm">
                      {VALID_SUGGESTION_STATUSES.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                    </select>
                    <Button type="submit" variant="outline">Simpan</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed bg-background py-16 text-center">
          <Inbox className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <h2 className="mt-4 font-semibold">Belum ada usulan</h2>
          <p className="mt-1 text-sm text-muted-foreground">Usulan dari halaman utama akan muncul di sini.</p>
        </div>
      )}
    </div>
  );
}
