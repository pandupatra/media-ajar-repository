"use client";

import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
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
  Moon,
  Settings,
  Sun,
  Tag,
  UserRoundPen,
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
  profile?: { name: string | null; email: string; madrasah: string | null };
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

  function toggleTheme() {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }

  const initials = (profile?.name || profile?.email || "U")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const renderSidebar = () => (
    <aside className="flex h-full w-64 flex-col bg-slate-950 text-white">
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
        <Button variant="ghost" className="w-full cursor-pointer justify-start rounded-xl text-white/60 hover:bg-white/10 hover:text-white" onClick={handleLogout}>
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
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} aria-label={mobileSidebarOpen ? "Tutup menu" : "Buka menu"} aria-expanded={mobileSidebarOpen} className="rounded-xl">
              {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <span className="text-sm font-semibold">SIMPEL</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Ubah tema warna" className="rounded-full">
              <Sun className="theme-icon-sun h-4 w-4" />
              <Moon className="theme-icon-moon h-4 w-4" />
            </Button>

            {profile && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="cursor-pointer rounded-full" aria-label="Buka menu profil">
                    <Avatar.Root className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground ring-2 ring-background">
                      <Avatar.Fallback className="text-xs font-semibold" delayMs={0}>{initials}</Avatar.Fallback>
                    </Avatar.Root>
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content align="end" sideOffset={8} className="z-50 min-w-56 rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-xl">
                    <div className="px-2.5 py-2">
                      <p className="truncate text-sm font-semibold">{profile.name || "Pengguna"}</p>
                      <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
                    </div>
                    <DropdownMenu.Separator className="my-1 h-px bg-border" />
                    <DropdownMenu.Item asChild>
                      <Link href={role === "admin" ? "/admin/profile" : "/dashboard/profile"} className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none hover:bg-accent focus:bg-accent">
                        <UserRoundPen className="h-4 w-4" />
                        Edit profil
                      </Link>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </div>
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
