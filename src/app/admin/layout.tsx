"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
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

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/media", label: "Media", icon: Library },
  { href: "/admin/suggestions", label: "Usulan", icon: MessageSquarePlus },
  { href: "/admin/categories", label: "Kategori", icon: Tag },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  const Sidebar = () => (
    <aside className="w-64 bg-foreground text-white flex flex-col h-full">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/logo.png" alt="" width={36} height={36} className="rounded-xl group-hover:scale-105 transition-transform" />
          <div>
            <span className="font-bold text-white text-lg leading-none">SIMPEL Madrasah Kubar</span>
            <p className="text-xs text-white/50 mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-white/60 hover:text-white hover:bg-white/10 rounded-xl"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Keluar
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-muted/30">
      <div className="hidden md:flex md:sticky md:top-0 md:h-screen md:shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="md:hidden bg-background border-b p-4 flex items-center justify-between sticky top-0 z-50">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="" width={32} height={32} className="rounded-lg" />
            <span className="font-bold">SIMPEL Madrasah Kubar</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} aria-label="Toggle menu" className="rounded-xl">
            {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
            <div className="relative w-64 z-50">
              <Sidebar />
            </div>
          </div>
        )}

        <main id="main-content" className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
