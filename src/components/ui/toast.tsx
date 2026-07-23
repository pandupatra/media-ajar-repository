"use client";

import { createContext, useCallback, useContext, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

type ToastMessage = {
  id: number;
  title: string;
  description?: string;
  variant: "success" | "error";
};

let toastId = 0;
const ToastContext = createContext<((message: Omit<ToastMessage, "id">) => void) | null>(null);

export function useToast() {
  const showToast = useContext(ToastContext);
  if (!showToast) throw new Error("useToast must be used within ToastProvider");
  return showToast;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const showToast = useCallback((next: Omit<ToastMessage, "id">) => setMessage({ ...next, id: ++toastId }), []);

  const Icon = message?.variant === "error" ? AlertCircle : CheckCircle2;

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Toast.Provider swipeDirection="right" duration={4500}>
        {message && (
        <Toast.Root
          key={message.id}
          open={Boolean(message)}
          onOpenChange={(open) => { if (!open) setMessage(null); }}
          className={`toast-root grid grid-cols-[auto_1fr_auto] items-start gap-x-3 rounded-xl border p-4 shadow-lg ${
            message.variant === "error"
              ? "border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
              : "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
          }`}
        >
          <Icon className={`mt-0.5 h-5 w-5 ${message.variant === "error" ? "text-red-600 dark:text-red-300" : "text-emerald-600 dark:text-emerald-300"}`} aria-hidden="true" />
          <div className="min-w-0">
            <Toast.Title className="text-sm font-semibold">{message.title}</Toast.Title>
            {message.description && <Toast.Description className="mt-1 text-sm opacity-80">{message.description}</Toast.Description>}
          </div>
          <Toast.Close className="rounded-md p-0.5 opacity-60 transition-opacity hover:opacity-100" aria-label="Tutup notifikasi">
            <X className="h-4 w-4" />
          </Toast.Close>
        </Toast.Root>
        )}
        <Toast.Viewport className="fixed inset-x-4 bottom-4 z-50 flex max-h-screen flex-col gap-2 sm:left-auto sm:w-full sm:max-w-sm" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
