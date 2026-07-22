"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardCheck,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  MessageSquarePlus,
  Settings,
  Tag,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/media", label: "Media", icon: Library },
  { href: "/admin/media/review", label: "Review Guru", icon: ClipboardCheck },
  { href: "/admin/suggestions", label: "Usulan", icon: MessageSquarePlus },
  { href: "/admin/categories", label: "Kategori", icon: Tag },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

const teacherNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/media", label: "Media Saya", icon: Library },
];

export function DashboardShell({
  children,
  role,
  profile,
}: {
  children: React.ReactNode;
  role: "admin" | "teacher";
  profile?: { name: string | null; madrasah: string | null };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navItems = role === "admin" ? adminNav : teacherNav;

  if (pathname === "/admin/login") return <>{children}</>;

  async function handleLogout() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const renderSidebar = () => (
    <aside className="flex h-full w-64 flex-col bg-foreground text-white">
      <div className="p-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image src="/logo.png" alt="" width={36} height={36} className="rounded-xl transition-transform group-hover:scale-105" />
          <div>
            <span className="text-lg font-bold leading-none text-white">SIMPEL Madrasah Kubar</span>
            <p className="mt-0.5 text-xs text-white/50">{role === "admin" ? "Admin Panel" : "Dashboard Kontributor"}</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        {profile && (
          <div className="mb-2 border-b border-white/10 px-3 pb-3">
            <p className="truncate text-sm font-medium">{profile.name}</p>
            <p className="truncate text-xs text-white/50">{profile.madrasah || "Kontributor"}</p>
          </div>
        )}
        <Button variant="ghost" className="w-full justify-start rounded-xl text-white/60 hover:bg-white/10 hover:text-white" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Keluar
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      <div className="hidden md:sticky md:top-0 md:flex md:h-screen md:shrink-0">{renderSidebar()}</div>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background p-4 md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="" width={32} height={32} className="rounded-lg" />
            <span className="font-bold">SIMPEL Madrasah Kubar</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} aria-label={mobileSidebarOpen ? "Tutup menu" : "Buka menu"} aria-expanded={mobileSidebarOpen} className="rounded-xl">
            {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <button className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} aria-label="Tutup menu" />
            <div className="relative z-50 w-64">{renderSidebar()}</div>
          </div>
        )}

        <main id="main-content" className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
