## ADDED Requirements

### Requirement: Pencarian global berdasarkan judul
Sistem SHALL menyediakan pencarian global yang mencari media berdasarkan judul menggunakan PostgreSQL Full-Text Search.

#### Scenario: Pengunjung mencari media berdasarkan judul
- **WHEN** pengunjung mengetik "matematika" di search bar dan submit
- **THEN** sistem menampilkan media yang judulnya mengandung kata "matematika"
- **AND** hasil ditampilkan di halaman katalog dengan query parameter `?q=matematika`

### Requirement: Pencarian berdasarkan deskripsi dan tags
Sistem SHALL mencari media berdasarkan judul, deskripsi, dan tags secara bersamaan.

#### Scenario: Pengunjung mencari dengan kata kunci umum
- **WHEN** pengunjung mengetik "pecahan" di search bar
- **THEN** sistem menampilkan media yang judul, deskripsi, atau tags-nya mengandung "pecahan"

### Requirement: Filter berdasarkan mata pelajaran
Sistem SHALL memungkinkan pengunjung untuk memfilter media berdasarkan satu atau lebih mata pelajaran.

#### Scenario: Pengunjung memfilter mata pelajaran Matematika
- **WHEN** pengunjung memilih filter "Matematika" di panel filter
- **THEN** sistem menampilkan hanya media dengan kategori mata pelajaran Matematika
- **AND** URL diperbarui dengan query parameter `?subject=matematika`

### Requirement: Filter berdasarkan jenjang
Sistem SHALL memungkinkan pengunjung untuk memfilter media berdasarkan jenjang (SD, SMP, SMA, Umum).

#### Scenario: Pengunjung memfilter jenjang SMP
- **WHEN** pengunjung memilih filter "SMP" di panel filter
- **THEN** sistem menampilkan hanya media dengan jenjang SMP
- **AND** URL diperbarui dengan query parameter `?level=smp`

### Requirement: Filter berdasarkan format
Sistem SHALL memungkinkan pengunjung untuk memfilter media berdasarkan format (PDF, E-Book, Website, Video, Audio).

#### Scenario: Pengunjung memfilter format Video
- **WHEN** pengunjung memilih filter "Video" di panel filter
- **THEN** sistem menampilkan hanya media dengan format Video
- **AND** URL diperbarui dengan query parameter `?format=video`

### Requirement: Kombinasi multiple filter
Sistem SHALL mendukung kombinasi multiple filter sekaligus (mata pelajaran + jenjang + format).

#### Scenario: Pengunjung menggunakan multiple filter
- **WHEN** pengunjung memilih filter mata pelajaran "Matematika" dan jenjang "SD"
- **THEN** sistem menampilkan hanya media Matematika untuk jenjang SD
- **AND** URL diperbarui dengan `?subject=matematika&level=sd`

### Requirement: Sorting hasil pencarian
Sistem SHALL menyediakan opsi sorting: terbaru (default), terlama, dan judul A-Z.

#### Scenario: Pengunjung mengurutkan media terlama
- **WHEN** pengunjung memilih opsi sort "Terlama"
- **THEN** sistem menampilkan media diurutkan dari tanggal unggah terlama

### Requirement: Reset filter
Sistem SHALL menyediakan tombol untuk mereset semua filter dan pencarian.

#### Scenario: Pengunjung mereset filter
- **WHEN** pengunjung mengklik tombol "Reset Filter"
- **THEN** sistem menghapus semua filter aktif
- **AND** menampilkan semua media yang published
- **AND** membersihkan query parameter dari URL
