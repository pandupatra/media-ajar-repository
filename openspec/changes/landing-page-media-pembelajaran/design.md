## Context

Saat ini, media pembelajaran PTP tersebar di berbagai platform (Google Drive, YouTube, website) tanpa satu pintu masuk terstruktur. PRD menentukan kebutuhan untuk landing page publik dan dashboard admin. Project ini akan dibangun dari nol menggunakan Next.js App Router dan Supabase.

## Goals / Non-Goals

**Goals:**
- Landing page publik yang SEO-friendly dan responsif untuk guru dan murid.
- Dashboard admin dengan autentikasi role-based (admin & kontributor).
- CRUD media dengan dukungan upload file dan URL eksternal.
- Manajemen kategori dinamis oleh admin.
- Pencarian dan filter katalog yang cepat.

**Non-Goals:**
- Hosting video langsung (YouTube/Google Drive URL preferred).
- Multi-bahasa (hanya Bahasa Indonesia untuk MVP).
- Statistik/analitik dashboard (Fase 2).
- Integrasi LMS eksternal (Fase 3).
- Komentar/rating pada media (Fase 3).
- Progressive Web App (PWA) features.

## Decisions

### 1. Next.js App Router (App Directory)
**Decision**: Gunakan Next.js 15 dengan App Router.
**Rationale**: SEO-friendly melalui Server Components, performa tinggi, dan routing sederhana. Halaman publik menggunakan SSR/SSG, halaman admin menggunakan client components di mana diperlukan.
**Alternatives considered**: Nuxt.js (kurang familiar untuk tim), Remix (kurang mature ecosystem).

### 2. Supabase sebagai Backend-as-a-Service
**Decision**: Gunakan Supabase untuk database, auth, dan storage.
**Rationale**: Mengurangi beban serverless. PostgreSQL dengan Row Level Security (RLS) memudahkan kontrol akses. Auth built-in dengan email/password dan magic link. Storage gratis tier cukup untuk file PDF/thumbnail.
**Alternatives considered**: Firebase (kurang fleksibel query), self-hosted PostgreSQL + NextAuth (lebih kompleks).

### 3. Tailwind CSS + shadcn/ui
**Decision**: Gunakan Tailwind CSS untuk styling dan shadcn/ui untuk komponen UI.
**Rationale**: Cepat dikembangkan, konsisten, accessible, dan komponen shadcn bisa dikustomisasi sepenuhnya tanpa dependency tambahan.
**Alternatives considered**: Chakra UI (lebih berat), Material UI (kurang fleksibel desain).

### 4. File Storage Strategy
**Decision**: Dukung URL eksternal sebagai default, upload file sebagai opsi.
**Rationale**: Mayoritas media kemungkinan sudah di-host di Google Drive/YouTube. URL eksternal menghindari biaya storage dan kompleksitas upload. Upload file tetap didukung untuk PDF/thumbnail.
**Alternatives considered**: AWS S3 (lebih kompleks setup), hanya upload file (tidak realistis untuk video).

### 5. Search Implementation
**Decision**: Gunakan PostgreSQL Full-Text Search dengan GIN index.
**Rationale**: Cukup untuk MVP dengan <10.000 records. Tidak perlu Elasticsearch/Algolia yang menambah biaya dan kompleksitas.
**Alternatives considered**: Algolia (biaya tambahan), Meilisearch (perlu self-host).

### 6. Role-Based Access Control (RBAC)
**Decision**: 2 level role: `admin` (full access) dan `contributor` (CRUD media, read-only kategori, no user management).
**Rationale**: Sederhana dan sesuai kebutuhan PRD. Role disimpan di tabel `users` dan dicek di RLS policies serta UI.
**Alternatives considered**: ACL granular (terlalu kompleks untuk MVP).

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Supabase free tier limits (500MB storage, 2GB transfer) | Monitor usage, upgrade ke Pro jika perlu. Prioritaskan URL eksternal untuk media besar. |
| Thumbnail generation untuk URL eksternal sulit | Gunakan placeholder image atau upload thumbnail manual. Untuk YouTube, extract thumbnail dari video ID. |
| Next.js learning curve untuk tim | Dokumentasi komprehensif, gunakan App Router pattern yang standar. |
| RLS policies terlalu restrictive/permisif | Testing menyeluruh dengan test accounts untuk kedua role. |
| SEO untuk halaman detail media | Gunakan generateMetadata dengan data dari Supabase. Static generation untuk media published. |

## Migration Plan

1. Setup project Next.js dengan shadcn/ui.
2. Setup project Supabase dan definisikan schema database.
3. Implementasi halaman publik (Home, Katalog, Detail, Tentang).
4. Implementasi autentikasi admin.
5. Implementasi dashboard admin (CRUD media, kategori).
6. Testing end-to-end dengan kedua role.
7. Deploy ke Vercel dan konfigurasi environment variables.

## Open Questions

- Berapa jumlah estimasi media dalam 6 bulan pertama? (mempengaruhi kebutuhan index/search)
- Apakah butuh fitur "featured" atau "pinned" media di homepage?
- Apakah perlu tracking view count atau download count untuk MVP?
