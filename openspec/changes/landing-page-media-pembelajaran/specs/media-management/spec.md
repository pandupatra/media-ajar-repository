## ADDED Requirements

### Requirement: Admin dapat menambahkan media baru
Sistem SHALL menyediakan form untuk menambahkan media baru dengan field: judul, slug, deskripsi, kategori, jenjang, format, tags, thumbnail, dan sumber media (upload file atau URL eksternal).

#### Scenario: Admin menambahkan media dengan URL eksternal
- **WHEN** admin mengisi form tambah media dengan judul, deskripsi, kategori, jenjang, format, dan URL eksternal
- **THEN** sistem menyimpan media baru dengan status `draft`
- **AND** media ditampilkan di daftar media admin

#### Scenario: Admin menambahkan media dengan upload file
- **WHEN** admin mengisi form tambah media dan mengunggah file PDF atau gambar
- **THEN** sistem mengunggah file ke Supabase Storage
- **AND** menyimpan media baru dengan status `draft` dan `file_url` mengarah ke file yang diunggah

### Requirement: Admin dapat mengedit media
Sistem SHALL menyediakan form edit untuk mengubah semua field media yang sudah ada.

#### Scenario: Admin mengedit media yang sudah dipublikasikan
- **WHEN** admin mengubah field judul atau deskripsi media yang sudah ada
- **THEN** sistem menyimpan perubahan
- **AND** memperbarui `updated_at` timestamp

### Requirement: Admin dapat menghapus media
Sistem SHALL memungkinkan admin untuk menghapus media dengan konfirmasi sebelum penghapusan.

#### Scenario: Admin menghapus media
- **WHEN** admin memilih opsi hapus pada media dan mengkonfirmasi
- **THEN** sistem menghapus data media dari database
- **AND** menghapus file dari storage jika media diunggah sebagai file (bukan URL eksternal)

### Requirement: Admin dapat mengubah status media
Sistem SHALL memungkinkan admin untuk mengubah status media antara `draft` dan `published`.

#### Scenario: Admin mempublikasikan media dari draft
- **WHEN** admin mengubah status media dari `draft` ke `published`
- **THEN** media menjadi terlihat di halaman publik
- **AND** sistem mengupdate status di database

### Requirement: Kontributor hanya dapat CRUD media yang dibuatnya
Sistem SHALL membatasi kontributor agar hanya dapat mengedit dan menghapus media yang dibuat oleh akunnya sendiri.

#### Scenario: Kontributor mencoba mengedit media orang lain
- **WHEN** kontributor mengakses halaman edit media yang dibuat oleh admin lain
- **THEN** sistem menampilkan halaman forbidden atau redirect ke dashboard
- **AND** tidak mengizinkan perubahan pada media tersebut

### Requirement: Menampilkan daftar media di dashboard admin
Sistem SHALL menampilkan tabel daftar media di dashboard admin dengan kolom: judul, format, kategori, status, tanggal dibuat, dan aksi (edit/hapus).

#### Scenario: Admin membuka dashboard media
- **WHEN** admin mengakses halaman dashboard media
- **THEN** sistem menampilkan tabel dengan semua media
- **AND** admin dapat melakukan filter berdasarkan status (draft/published)

### Requirement: Thumbnail upload untuk media
Sistem SHALL mendukung unggah thumbnail untuk media. Jika tidak ada thumbnail yang diunggah, sistem menggunakan placeholder.

#### Scenario: Admin mengunggah thumbnail
- **WHEN** admin mengunggah file gambar sebagai thumbnail
- **THEN** sistem menyimpan thumbnail ke Supabase Storage
- **AND** menampilkan thumbnail di card dan detail media

### Requirement: Slug otomatis dari judul
Sistem SHALL menghasilkan slug otomatis dari judul media untuk URL-friendly detail page.

#### Scenario: Admin membuat media baru
- **WHEN** admin memasukkan judul "Media Belajar IPA Kelas 5"
- **THEN** sistem menghasilkan slug "media-belajar-ipa-kelas-5"
- **AND** memastikan slug unik dengan menambahkan angka jika duplikat
