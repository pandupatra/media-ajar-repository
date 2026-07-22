import { Badge } from "@/components/ui/badge";
import { getAdminProfiles } from "./actions";

export default async function AdminUsersPage() {
  const users = await getAdminProfiles();
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold">Pengguna</h1><p className="text-muted-foreground">Daftar admin dan guru yang mendaftar melalui sistem</p></div><div className="overflow-x-auto rounded-2xl bg-background shadow-sm"><table className="w-full text-sm"><thead><tr className="border-b bg-muted/30"><th className="p-4 text-left">Nama</th><th className="p-4 text-left">Email</th><th className="p-4 text-left">Peran</th><th className="p-4 text-left">Madrasah</th><th className="p-4 text-left">Mapel</th><th className="p-4 text-left">Telepon</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-b last:border-0"><td className="p-4 font-medium">{user.name ?? "-"}</td><td className="p-4">{user.email}</td><td className="p-4"><Badge>{user.role === "admin" ? "Admin" : "Guru"}</Badge></td><td className="p-4">{user.madrasah ?? "-"}</td><td className="p-4">{user.teaching_subject ?? "-"}</td><td className="p-4">{user.phone ?? "-"}</td></tr>)}</tbody></table></div></div>;
}
