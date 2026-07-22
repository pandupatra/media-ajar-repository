"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContributorSignupPage() {
  const [state, action, pending] = useActionState(signupAction, {});

  return (
    <main className="min-h-screen bg-primary/5 px-4 py-10">
      <div className="mx-auto max-w-xl rounded-2xl bg-background p-8 shadow-xl shadow-primary/10">
        <h1 className="text-2xl font-bold">Daftar Akun Kontributor</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gunakan data aktif Anda. Konfirmasi akun akan dikirim melalui email.</p>
        {state.success ? (
          <div className="mt-6 space-y-4">
            <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{state.success}</p>
            <Button asChild className="w-full rounded-xl"><Link href="/login">Kembali ke Login</Link></Button>
          </div>
        ) : (
          <form action={action} className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ["name", "Nama lengkap", "text"],
              ["madrasah", "Madrasah", "text"],
              ["teaching_subject", "Mata pelajaran yang diampu", "text"],
              ["phone", "Nomor telepon", "tel"],
              ["email", "Email", "email"],
              ["password", "Password", "password"],
            ].map(([name, label, type]) => (
              <div key={name} className="space-y-2">
                <label htmlFor={name} className="text-sm font-medium">{label}</label>
                <Input id={name} name={name} type={type} required defaultValue={state.fields?.[name]} className="h-11 rounded-xl" />
              </div>
            ))}
            {state.error && <p role="alert" className="sm:col-span-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>}
            <Button disabled={pending} className="sm:col-span-2 h-11 rounded-xl">{pending ? "Mendaftarkan..." : "Daftar"}</Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-muted-foreground">Sudah punya akun? <Link href="/login" className="font-medium text-primary">Masuk</Link></p>
      </div>
    </main>
  );
}
