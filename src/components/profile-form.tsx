import type { Profile } from "@/types";
import { updateProfileAction } from "@/app/profile-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ProfileForm({ profile, saved, error }: { profile: Profile; saved?: boolean; error?: string }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Edit profil</h1>
        <p className="mt-1 text-muted-foreground">Perbarui informasi yang tampil pada akun Anda.</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg">Informasi profil</CardTitle></CardHeader>
        <CardContent>
          <form action={updateProfileAction} className="space-y-5">
            {saved && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">Profil berhasil disimpan.</p>}
            {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/60 dark:text-red-200">{error}</p>}

            <div className="space-y-2">
              <label htmlFor="profile-name" className="text-sm font-medium">Nama lengkap</label>
              <Input id="profile-name" name="name" defaultValue={profile.name ?? ""} maxLength={100} autoComplete="name" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="profile-email" className="text-sm font-medium">Email</label>
              <Input id="profile-email" value={profile.email} disabled />
              <p className="text-xs text-muted-foreground">Email akun tidak dapat diubah dari halaman ini.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="profile-madrasah" className="text-sm font-medium">Madrasah</label>
                <Input id="profile-madrasah" name="madrasah" defaultValue={profile.madrasah ?? ""} maxLength={150} />
              </div>
              <div className="space-y-2">
                <label htmlFor="profile-subject" className="text-sm font-medium">Mata pelajaran</label>
                <Input id="profile-subject" name="teaching_subject" defaultValue={profile.teaching_subject ?? ""} maxLength={100} />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="profile-phone" className="text-sm font-medium">Nomor telepon</label>
              <Input id="profile-phone" name="phone" type="tel" defaultValue={profile.phone ?? ""} maxLength={20} autoComplete="tel" />
            </div>
            <Button type="submit">Simpan perubahan</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
