import { BookOpen, Database, Lock, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground mt-1">Pengaturan aplikasi Media Pembelajaran PTP</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md shadow-primary/5 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Informasi Aplikasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nama Aplikasi</label>
              <p className="text-sm font-medium mt-1">
                Media Pembelajaran PTP
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Versi</label>
              <p className="text-sm font-medium mt-1">1.0.0 (MVP)</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Deskripsi</label>
              <p className="text-sm font-medium mt-1 leading-relaxed">
                Platform penyedia media pembelajaran berkualitas untuk guru dan murid Indonesia.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md shadow-primary/5 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              Status Sistem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Database", icon: Database, status: "Terhubung" },
              { label: "Storage", icon: Database, status: "Aktif" },
              { label: "Autentikasi", icon: Lock, status: "Aktif" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                    {item.status}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}