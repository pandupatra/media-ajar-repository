## Why

Rekan-rekan PTP telah memproduksi berbagai media pembelajaran dalam format yang berbeda-beda, namun distribusinya tersebar dan kurang terstruktur. Guru dan murid kesulitan menemukan materi yang relevan. Perlu dibangun satu pintu masuk (landing page) yang terstruktur dengan dashboard admin agar PTP dapat mengelola, mengkategorikan, dan mempublikasikan media pembelajaran secara mandiri.

## What Changes

- **Landing Page Publik**: Halaman beranda dengan hero section, media terbaru, dan pencarian global.
- **Halaman Katalog**: Grid card media dengan filter (mata pelajaran, jenjang, format, tahun/semester) dan sorting.
- **Halaman Detail Media**: Informasi lengkap media, pratinjau, tombol akses/unduh/kunjungi, metadata, dan rekomendasi media terkait.
- **Halaman Tentang**: Profil tim PTP, cara penggunaan, dan kontak.
- **Dashboard Admin**: Autentikasi (admin & kontributor), CRUD media (dengan upload file atau URL eksternal), manajemen kategori, dan manajemen pengguna.
- **Database & Storage**: Schema PostgreSQL untuk media, kategori, dan pengguna dengan Supabase Storage untuk file.

## Capabilities

### New Capabilities
- `public-pages`: Halaman publik (Home, Katalog, Detail Media, Tentang) untuk guru dan murid.
- `media-management`: CRUD media pembelajaran dengan upload file atau URL eksternal, thumbnail, dan metadata.
- `category-management`: Pengelolaan kategori (mata pelajaran, jenjang, format) oleh admin.
- `admin-auth`: Autentikasi dan otorisasi untuk admin dan kontributor dengan role-based access.
- `search-filter`: Pencarian global dan filter katalog berdasarkan kategori, jenjang, format, dan tahun.

### Modified Capabilities
- (No existing capabilities to modify)

## Impact

- New Next.js App Router project with Tailwind CSS and shadcn/ui.
- Supabase integration (PostgreSQL, Auth, Storage).
- New database schema: `media`, `categories`, `users` tables.
- Row Level Security (RLS) policies for admin access control.
- Deployment on Vercel.
