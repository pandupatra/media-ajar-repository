## ADDED Requirements

### Requirement: Admin dapat melihat daftar kategori
Sistem SHALL menampilkan daftar kategori yang dikelompokkan berdasarkan tipe: mata pelajaran, jenjang, dan format.

#### Scenario: Admin membuka halaman kategori
- **WHEN** admin mengakses halaman manajemen kategori
- **THEN** sistem menampilkan daftar kategori yang dikelompokkan berdasarkan tipe
- **AND** menampilkan jumlah media yang menggunakan setiap kategori

### Requirement: Admin dapat menambahkan kategori baru
Sistem SHALL menyediakan form untuk menambahkan kategori baru dengan field: nama, tipe (subject/level/format), slug, dan ikon (opsional).

#### Scenario: Admin menambahkan kategori baru
- **WHEN** admin mengisi form nama kategori "Fisika" dengan tipe "subject"
- **THEN** sistem menyimpan kategori baru
- **AND** kategori baru muncul di daftar kategori dan panel filter publik

### Requirement: Admin dapat mengedit kategori
Sistem SHALL memungkinkan admin untuk mengubah nama dan ikon kategori yang sudah ada.

#### Scenario: Admin mengubah nama kategori
- **WHEN** admin mengubah nama kategori dari "IPA" menjadi "Ilmu Pengetahuan Alam"
- **THEN** sistem menyimpan perubahan nama
- **AND** memperbarui tampilan kategori di seluruh aplikasi

### Requirement: Admin dapat menghapus kategori yang tidak terpakai
Sistem SHALL memungkinkan admin untuk menghapus kategori yang tidak memiliki media terkait.

#### Scenario: Admin menghapus kategori kosong
- **WHEN** admin memilih menghapus kategori yang tidak memiliki media
- **THEN** sistem menghapus kategori dari database

#### Scenario: Admin mencoba menghapus kategori yang masih terpakai
- **WHEN** admin memilih menghapus kategori yang masih memiliki media terkait
- **THEN** sistem menampilkan pesan error
- **AND** tidak menghapus kategori tersebut

### Requirement: Kategori ditampilkan di filter publik
Sistem SHALL menampilkan kategori aktif di panel filter halaman katalog publik, dikelompokkan berdasarkan tipe.

#### Scenario: Pengunjung melihat filter kategori
- **WHEN** pengunjung membuka halaman katalog
- **THEN** sistem menampilkan daftar kategori untuk filter
- **AND** pengunjung dapat memilih satu atau lebih kategori untuk memfilter media

### Requirement: Kategori memiliki urutan tampilan
Sistem SHALL mendukung pengaturan urutan tampilan (sort_order) untuk kategori agar admin dapat mengatur prioritas tampilan.

#### Scenario: Admin mengatur urutan kategori
- **WHEN** admin mengubah nilai sort_order pada kategori
- **THEN** sistem menyimpan perubahan urutan
- **AND** daftar kategori diurutkan berdasarkan sort_order
