import Link from "next/link";
import { BookOpen, FileText, Tag, Users, TrendingUp, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPublishedMedia, getAllMedia, getCategories, getLatestMedia } from "@/lib/data-server";

export default async function AdminDashboardPage() {
  const allMedia = await getAllMedia();
  const publishedMedia = await getPublishedMedia();
  const draftMedia = allMedia.filter((m) => m.status === "draft");
  const categories = await getCategories();
  const latestMedia = await getLatestMedia(5);

  const stats = [
    { title: "Total Media", value: allMedia.length, icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Dipublikasikan", value: publishedMedia.length, icon: BookOpen, color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { title: "Draft", value: draftMedia.length, icon: TrendingUp, color: "text-amber-600", bgColor: "bg-amber-50" },
    { title: "Kategori", value: categories.length, icon: Tag, color: "text-purple-600", bgColor: "bg-purple-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Ringkasan data media pembelajaran</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-0 shadow-md shadow-primary/5 rounded-2xl hover:shadow-lg hover:shadow-primary/10 transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md shadow-primary/5 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Media Terbaru</CardTitle>
            <Button variant="ghost" size="sm" asChild className="rounded-xl text-primary">
              <Link href="/admin/media">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {latestMedia.map((media) => (
                <div key={media.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{media.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{new Date(media.created_at).toLocaleDateString("id-ID")}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ml-3 whitespace-nowrap ${
                    media.status === "published" 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "bg-amber-50 text-amber-700"
                  }`}>
                    {media.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md shadow-primary/5 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start rounded-xl h-11" asChild>
              <Link href="/admin/media/new">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Media Baru
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl h-11" asChild>
              <Link href="/admin/categories">
                <Tag className="mr-2 h-4 w-4" />
                Kelola Kategori
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl h-11" asChild>
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Kelola Pengguna
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}