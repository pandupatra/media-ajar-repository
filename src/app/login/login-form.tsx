"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});

  return (
    <main className="min-h-screen flex items-center justify-center bg-primary/5 px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-3">
          <Image src="/logo.png" alt="" width={44} height={44} className="rounded-xl" />
          <span className="text-xl font-bold">SIMPEL Madrasah Kubar</span>
        </Link>
        <div className="rounded-2xl bg-background p-8 shadow-xl shadow-primary/10">
          <h1 className="text-2xl text-center font-bold">Masuk</h1>
          <form action={action} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" name="email" type="email" required autoComplete="email" className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input id="password" name="password" type="password" required autoComplete="current-password" className="h-11 rounded-xl" />
            </div>
            {state.error && <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>}
            <Button disabled={pending} className="h-11 w-full rounded-xl">{pending ? "Memuat..." : "Masuk"}</Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun kontributor? <Link href="/signup" className="font-medium text-primary">Daftar</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
