"use client";

import { useState, useEffect } from "react";
import { Mail, Plus, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminProfiles } from "./actions";
import { Profile } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ email: "", name: "", role: "contributor" as "admin" | "contributor" });

  async function loadUsers() {
    setLoading(true);
    const data = await getAdminProfiles();
    setUsers(data);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = () => {
    if (!newUser.email || !newUser.name) return;
    alert("Fitur ini memerlukan integrasi Supabase Auth Admin API");
    setNewUser({ email: "", name: "", role: "contributor" });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Kelola Pengguna</h1>
        <p className="text-muted-foreground mt-1">Kelola akun admin dan kontributor</p>
      </div>

      <Card className="border-0 shadow-md shadow-primary/5 rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Tambah Pengguna Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="user-name" className="sr-only">Nama lengkap</label>
              <Input
                id="user-name"
                placeholder="Nama lengkap"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="rounded-xl h-11"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="user-email" className="sr-only">Email</label>
              <Input
                id="user-email"
                placeholder="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="rounded-xl h-11"
              />
            </div>
            <div>
              <label htmlFor="user-role" className="sr-only">Role</label>
              <select
                id="user-role"
                className="h-11 rounded-xl border border-input bg-background px-4 text-sm shadow-sm"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "admin" | "contributor" })}
              >
                <option value="contributor">Kontributor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button onClick={handleAddUser} className="rounded-xl h-11">
              <Plus className="mr-2 h-4 w-4" />
              Tambah
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12" role="status">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" aria-label="Memuat" />
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      ) : (
        <div className="bg-background rounded-2xl shadow-md shadow-primary/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table aria-label="Daftar pengguna" className="w-full text-sm">
              <caption className="sr-only">Daftar pengguna admin dan kontributor</caption>
              <thead>
                <tr className="border-b bg-muted/30">
                  <th scope="col" className="text-left p-4 font-medium text-muted-foreground">Nama</th>
                  <th scope="col" className="text-left p-4 font-medium text-muted-foreground">Email</th>
                  <th scope="col" className="text-left p-4 font-medium text-muted-foreground">Role</th>
                  <th scope="col" className="text-left p-4 font-medium text-muted-foreground">Bergabung</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{user.name || "-"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"} className="flex w-fit items-center gap-1 rounded-full">
                        <Shield className="h-3 w-3" />
                        {user.role === "admin" ? "Admin" : "Kontributor"}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}