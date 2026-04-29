"use client";

import { useState, useEffect } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ConfirmDialog,
  ConfirmDialogContent,
  ConfirmDialogTitle,
  ConfirmDialogDescription,
  ConfirmDialogClose,
} from "@/components/ui/confirm-dialog";
import { getCategories } from "@/lib/data-client";
import { createCategoryAction, deleteCategoryAction } from "./actions";
import { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    type: "subject" as Category["type"],
  });
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  }

  const subjects = categories.filter((c) => c.type === "subject");
  const levels = categories.filter((c) => c.type === "level");
  const formats = categories.filter((c) => c.type === "format");

  const handleAdd = async () => {
    if (!newCategory.name) return;
    setAddError(null);
    const category: Omit<Category, "id" | "created_at"> = {
      name: newCategory.name,
      slug: newCategory.name.toLowerCase().replace(/\s+/g, "-"),
      type: newCategory.type,
      icon: null,
      sort_order: categories.length + 1,
      is_active: true,
    };
    const result = await createCategoryAction(category);
    if (result?.errors) {
      setAddError(Object.values(result.errors)[0]);
      return;
    }
    if (result?.data) {
      setCategories([...categories, result.data]);
      setNewCategory({ name: "", type: "subject" });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategoryAction(deleteTarget);
      setCategories(categories.filter((c) => c.id !== deleteTarget));
    } catch {
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const CategorySection = ({ title, icon: Icon, items }: { title: string; icon: React.ElementType; items: Category[] }) => (
    <Card className="border-0 shadow-md shadow-primary/5 rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div>
                <span className="font-medium">{cat.name}</span>
                <span className="text-xs text-muted-foreground ml-2">{cat.slug}</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" aria-label="Edit kategori" className="rounded-xl">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(cat.id)} aria-label="Hapus kategori" className="rounded-xl">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada kategori</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Kelola Kategori</h1>
        <p className="text-muted-foreground mt-1">Kelola kategori mata pelajaran, jenjang, dan format</p>
      </div>

      <Card className="border-0 shadow-md shadow-primary/5 rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Tambah Kategori Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="cat-name" className="sr-only">Nama kategori</label>
              <Input
                id="cat-name"
                placeholder="Nama kategori"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="rounded-xl h-11"
              />
            </div>
            <div>
              <label htmlFor="cat-type" className="sr-only">Tipe kategori</label>
              <select
                id="cat-type"
                className="h-11 rounded-xl border border-input bg-background px-4 text-sm shadow-sm"
                value={newCategory.type}
                onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as Category["type"] })}
              >
                <option value="subject">Mata Pelajaran</option>
                <option value="level">Jenjang</option>
                <option value="format">Format</option>
              </select>
            </div>
            <Button onClick={handleAdd} className="rounded-xl h-11">
              <Plus className="mr-2 h-4 w-4" />
              Tambah
            </Button>
          </div>
          {addError && <p className="text-sm text-destructive mt-2">{addError}</p>}
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12" role="status">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" aria-label="Memuat" />
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CategorySection title="Mata Pelajaran" icon={Edit} items={subjects} />
          <CategorySection title="Jenjang" icon={Edit} items={levels} />
          <CategorySection title="Format" icon={Edit} items={formats} />
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <ConfirmDialogContent>
          <ConfirmDialogTitle>Hapus Kategori</ConfirmDialogTitle>
          <ConfirmDialogDescription>
            Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan.
          </ConfirmDialogDescription>
          <div className="flex justify-end gap-2 mt-4">
            <ConfirmDialogClose asChild>
              <Button variant="outline" disabled={deleting} className="rounded-xl">Batal</Button>
            </ConfirmDialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="rounded-xl">
              {deleting ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </ConfirmDialogContent>
      </ConfirmDialog>
    </div>
  );
}