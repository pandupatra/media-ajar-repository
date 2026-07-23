"use client";

import { useActionState, useCallback, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { submitMediaSuggestion, type SuggestionFormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

const initialState: SuggestionFormState = { status: "idle", message: "" };
const fieldClassName = "mt-2 h-11";

export function MediaSuggestionForm() {
  const showToast = useToast();
  const submitWithToast = useCallback(async (previousState: SuggestionFormState, formData: FormData) => {
    const nextState = await submitMediaSuggestion(previousState, formData);
    showToast({
      title: nextState.status === "success" ? "Usulan berhasil dikirim" : "Usulan belum terkirim",
      description: nextState.message,
      variant: nextState.status === "success" ? "success" : "error",
    });
    return nextState;
  }, [showToast]);
  const [state, formAction, pending] = useActionState(submitWithToast, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="suggestion-website">Website</label>
        <input id="suggestion-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="suggestion-topic" className="text-sm font-medium">Topik atau judul media</label>
        <Input
          id="suggestion-topic"
          name="topic"
          className={fieldClassName}
          placeholder="Contoh: Video pecahan untuk kelas 4"
          maxLength={150}
          required
          aria-invalid={Boolean(state.errors?.topic)}
          aria-describedby={state.errors?.topic ? "suggestion-topic-error" : undefined}
        />
        {state.errors?.topic && <p id="suggestion-topic-error" className="mt-1.5 text-sm text-destructive">{state.errors.topic}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="suggestion-subject" className="text-sm font-medium">Mata pelajaran</label>
          <Input id="suggestion-subject" name="subject" className={fieldClassName} placeholder="Matematika" maxLength={100} required aria-invalid={Boolean(state.errors?.subject)} aria-describedby={state.errors?.subject ? "suggestion-subject-error" : undefined} />
          {state.errors?.subject && <p id="suggestion-subject-error" className="mt-1.5 text-sm text-destructive">{state.errors.subject}</p>}
        </div>
        <div>
          <label htmlFor="suggestion-level" className="text-sm font-medium">Jenjang atau kelas</label>
          <Input id="suggestion-level" name="level" className={fieldClassName} placeholder="Kelas 4 SD" maxLength={100} required aria-invalid={Boolean(state.errors?.level)} aria-describedby={state.errors?.level ? "suggestion-level-error" : undefined} />
          {state.errors?.level && <p id="suggestion-level-error" className="mt-1.5 text-sm text-destructive">{state.errors.level}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="suggestion-format" className="text-sm font-medium">Format yang diharapkan</label>
        <select
          id="suggestion-format"
          name="preferred_format"
          defaultValue=""
          required
          aria-invalid={Boolean(state.errors?.preferred_format)}
          aria-describedby={state.errors?.preferred_format ? "suggestion-format-error" : undefined}
          className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="" disabled>Pilih format</option>
          <option value="pdf">PDF</option>
          <option value="ebook">E-book</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
          <option value="presentasi">Presentasi</option>
          <option value="website">Website</option>
          <option value="other">Lainnya</option>
        </select>
        {state.errors?.preferred_format && <p id="suggestion-format-error" className="mt-1.5 text-sm text-destructive">{state.errors.preferred_format}</p>}
      </div>

      <div>
        <label htmlFor="suggestion-notes" className="text-sm font-medium">Catatan <span className="text-muted-foreground">(opsional)</span></label>
        <textarea
          id="suggestion-notes"
          name="notes"
          rows={4}
          maxLength={1000}
          placeholder="Jelaskan kebutuhan atau konteks pembelajaran Anda"
          className="mt-2 w-full resize-y rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <Button type="submit" size="lg" className="h-12 w-full rounded-xl text-base" disabled={pending}>
        <Send className="h-4 w-4" />
        {pending ? "Mengirim..." : "Kirim Usulan Media"}
      </Button>
    </form>
  );
}
