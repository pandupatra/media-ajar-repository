## ADDED Requirements

### Requirement: Hero section menampilkan judul, tagline, dan CTA
Sistem SHALL menampilkan hero section di halaman beranda dengan judul "Media Pembelajaran PTP", tagline deskriptif, dan tombol CTA "Jelajahi Media Pembelajaran" yang mengarah ke halaman katalog.

#### Scenario: Pengunjung membuka halaman beranda
- **WHEN** pengunjung mengakses halaman beranda (`/`)
- **THEN** sistem menampilkan hero section dengan judul, tagline, dan tombol CTA
- **AND** tombol CTA mengarahkan ke halaman katalog (`/katalog`)

### Requirement: Menampilkan media terbaru di beranda
Sistem SHALL menampilkan 6–8 media terbaru yang berstatus `published` di halaman beranda dalam bentuk grid card dengan thumbnail, judul, format badge, dan tombol akses.

#### Scenario: Pengunjung melihat media terbaru
- **WHEN** pengunjung mengakses halaman beranda (`/`)
- **THEN** sistem menampilkan grid card media terbaru yang berstatus `published`
- **AND** setiap card menampilkan thumbnail, judul, format badge, dan link ke detail media

### Requirement: Menampilkan katalog media dengan filter
Sistem SHALL menampilkan halaman katalog (`/katalog`) dengan grid card media dan panel filter untuk mata pelajaran, jenjang, format, dan tahun/semester.

#### Scenario: Pengunjung membuka halaman katalog
- **WHEN** pengunjung mengakses halaman katalog (`/katalog`)
- **THEN** sistem menampilkan grid card media yang berstatus `published`
- **AND** menampilkan panel filter di sisi kiri atau atas

### Requirement: Menampilkan detail media lengkap
Sistem SHALL menampilkan halaman detail media (`/media/[slug]`) dengan informasi lengkap: judul, deskripsi, penulis/kreator, tanggal unggah, format, ukuran file (jika ada), thumbnail besar, tombol akses sesuai format, metadata kategori, dan media terkait.

#### Scenario: Pengunjung membuka detail media
- **WHEN** pengunjung mengakses halaman detail media (`/media/[slug]`)
- **THEN** sistem menampilkan informasi lengkap media
- **AND** menampilkan tombol "Akses", "Unduh", atau "Kunjungi" sesuai format media
- **AND** menampilkan daftar media terkait (berdasarkan kategori yang sama)

### Requirement: Menampilkan halaman tentang PTP
Sistem SHALL menampilkan halaman tentang (`/tentang`) dengan profil singkat tim PTP, cara menggunakan platform, dan kontak atau link ke sosial media.

#### Scenario: Pengunjung membuka halaman tentang
- **WHEN** pengunjung mengakses halaman tentang (`/tentang`)
- **THEN** sistem menampilkan informasi profil tim PTP
- **AND** menampilkan panduan penggunaan platform
- **AND** menampilkan informasi kontak atau link sosial media

### Requirement: Pencarian global di navbar
Sistem SHALL menyediakan search bar di navbar yang dapat mencari media berdasarkan judul, kategori, atau format, dengan hasil ditampilkan di halaman katalog.

#### Scenario: Pengunjung mencari media dari navbar
- **WHEN** pengunjung mengetik kata kunci di search bar navbar dan submit
- **THEN** sistem mengarahkan ke halaman katalog (`/katalog?q=<keyword>`)
- **AND** menampilkan hasil pencarian yang sesuai

### Requirement: Halaman responsif untuk mobile dan desktop
Sistem SHALL menampilkan semua halaman publik dengan layout responsif yang optimal untuk perangkat mobile, tablet, dan desktop.

#### Scenario: Pengunjung mengakses dari perangkat mobile
- **WHEN** pengunjung mengakses halaman dari perangkat mobile
- **THEN** sistem menampilkan layout yang responsif dan mudah dinavigasi
- **AND** filter katalog dapat diakses melalui drawer atau dropdown
