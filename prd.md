# PRD — Landing Page Media Pembelajaran PTP

> Dokumen kebutuhan produk untuk landing page yang menampung dan menyajikan media pembelajaran berbagai format (e-book, website, PDF, video, dan lainnya) agar mudah diakses oleh guru dan murid, dilengkapi dashboard admin untuk pengelolaan konten oleh tim PTP.

---

## 1. Latar Belakang & Tujuan

Rekan-rekan PTP telah memproduksi berbagai media pembelajaran dalam format yang berbeda-beda. Saat ini distribusinya tersebar dan kurang terstruktur, sehingga guru dan murid kesulitan menemukan materi yang relevan.

**Tujuan**: Membangun satu pintu masuk (landing page) yang terstruktur, dengan dashboard admin agar PTP dapat mengelola, mengkategorikan, dan mempublikasikan media pembelajaran secara mandiri.

---

## 2. Target Pengguna

| Segmen | Kebutuhan Utama |
|--------|-----------------|
| **Guru** | Menemukan materi pembelajaran sesuai mata pelajaran, jenjang, dan topik dengan cepat. |
| **Murid** | Mengakses materi pembelajaran, e-book, dan media interaktif secara mandiri. |
| **Admin PTP** | Mengunggah, mengedit, mengatur kategori, dan mempublikasikan media pembelajaran. |

---

## 3. Fitur Landing Page (Publik)

### 3.1 Halaman Beranda (Home)
- **Hero Section**: Judul, tagline, dan tombol CTA utama ("Jelajahi Media Pembelajaran").
- **Kategori Populer**: Ikon/tile untuk mata pelajaran atau jenjang paling banyak diakses.
- **Media Terbaru**: Daftar media yang baru diunggah (grid/card).
- **Pencarian**: Bar pencarian global di bagian atas (filter by judul, kategori, format).

### 3.2 Halaman Katalog / Daftar Media
- **Filter & Sort**:
  - Mata pelajaran (Matematika, IPA, IPS, Bahasa Indonesia, dll.)
  - Jenjang (SD, SMP, SMA, Umum)
  - Format (E-Book, PDF, Website/Interaktif, Video, Audio)
  - Tahun / Semester
- **Tampilan**: Grid card dengan thumbnail, judul, deskripsi singkat, format badge, dan tombol akses.

### 3.3 Halaman Detail Media
- Informasi lengkap: judul, deskripsi, penulis/kreator, tanggal unggah, format, ukuran file (jika ada).
- **Pratinjau / Thumbnail** besar.
- Tombol **Akses / Unduh / Kunjungi** (sesuai format).
- Metadata: mata pelajaran, jenjang, topik, kata kunci (tags).
- Media terkait (rekomendasi).

### 3.4 Halaman Tentang / Tentang PTP
- Profil singkat tim PTP.
- Cara menggunakan platform.
- Kontak atau link ke sosial media.

---

## 4. Fitur Dashboard Admin (PTP)

### 4.1 Autentikasi & Otorisasi
- Login khusus untuk admin PTP.
- Minimal 2 level: **Admin** (full access) dan **Kontributor** (bisa tambah/edit konten, tidak bisa hapus atau kelola user).

### 4.2 Manajemen Konten (CRUD Media)
- **Tambah Media**:
  - Form: Judul, deskripsi, kategori, jenjang, format, tags/thumbnail.
  - Unggah file (PDF, e-book, gambar) atau input URL eksternal (website, video YouTube, Google Drive, dll.).
  - Status: **Draft** / **Published**.
- **Daftar Media**: Tabel dengan kolom judul, format, kategori, status, tanggal, aksi (edit/hapus).
- **Edit & Hapus**: Inline editing atau halaman edit terpisah. Konfirmasi sebelum hapus.

### 4.3 Manajemen Kategori & Metadata
- Kelola daftar mata pelajaran, jenjang, dan format.
- Penambahan/penghapusan kategori oleh admin.

### 4.4 Statistik & Analitik (Opsional Fase 2)
- Jumlah total media per kategori/format.
- Media paling banyak diakses.
- Grafik kunjungan harian/mingguan.

### 4.5 Manajemen Pengguna (Super Admin)
- Tambah/edit/hapus akun admin/kontributor.
- Reset password.

---

## 5. Alur Pengguna (User Flow)

### 5.1 Alur Guru / Murid (Publik)
```
[Home] → Cari/Browse Kategori → [Katalog] → Pilih Media → [Detail Media] → Akses/Unduh
```

### 5.2 Alur Admin PTP
```
[Login] → [Dashboard] → Tambah Media / Kelola Kategori → Publish → Lihat di Landing Page
```

---

## 6. Spesifikasi Teknis (Rekomendasi Awal)

| Komponen | Rekomendasi |
|----------|-------------|
| **Frontend** | Next.js (App Router) atau Nuxt.js — SEO-friendly, performa tinggi. |
| **Styling** | Tailwind CSS — cepat dikembangkan, konsisten. |
| **Backend / Database** | Supabase (PostgreSQL + Auth + Storage) atau Firebase — mengurangi bebas server. |
| **Storage File** | Supabase Storage / AWS S3 / Cloudflare R2 untuk file PDF, e-book, thumbnail. |
| **Autentikasi** | Supabase Auth / NextAuth.js. |
| **Deploy** | Vercel (Next.js) atau Netlify. |

### 6.1 Struktur Data Utama (Simplified)

**Tabel: `media`**
- `id`, `title`, `description`, `format` (enum: pdf, ebook, website, video, audio, other)
- `category_id`, `level_id` (jenjang)
- `file_url` atau `external_url`, `thumbnail_url`
- `status` (draft/published), `created_at`, `updated_at`, `created_by`

**Tabel: `categories`**
- `id`, `name`, `type` (subject / level / format)

**Tabel: `users`**
- `id`, `email`, `name`, `role` (admin / contributor)

---

## 7. Rencana Implementasi (Fase)

| Fase | Fitur | Estimasi |
|------|-------|----------|
| **Fase 1 — MVP** | Landing page publik (home, katalog, detail), dashboard admin CRUD media dasar, login admin, unggah file & URL. | 2–3 minggu |
| **Fase 2 — Enhance** | Statistik dashboard, fitur pencarian/filter tingkat lanjut, manajemen kategori, multi-kontributor. | 1–2 minggu |
| **Fase 3 — Scale** | SEO otomatis, komentar/rating, notifikasi, integrasi LMS (Google Classroom, Moodle). | 2–4 minggu |

---

## 8. Pertimbangan & Pertanyaan Terbuka

- Apakah media pembelajaran dihosting langsung di platform (file upload), atau sebagian besar merupakan link eksternal (Google Drive, YouTube)?
- Berapa perkiraan jumlah media dalam 1 tahun pertama? (untuk estimasi storage & database)
- Apakah ada kebutuhan untuk fitur unduhan (download counter) atau hanya sekadar link?
- Apakah perlu dukungan multi-bahasa (Indonesia & Inggris)?
- Siapa saja di tim PTP yang akan menjadi admin? Berapa orang kontributor?
