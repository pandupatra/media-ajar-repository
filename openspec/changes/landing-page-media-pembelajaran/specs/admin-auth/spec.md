## ADDED Requirements

### Requirement: Admin dapat login dengan email dan password
Sistem SHALL menyediakan halaman login untuk admin dengan autentikasi email dan password melalui Supabase Auth.

#### Scenario: Admin login dengan kredensial valid
- **WHEN** admin memasukkan email dan password yang valid
- **THEN** sistem mengautentikasi admin
- **AND** mengarahkan ke dashboard admin
- **AND** menyimpan session di browser

#### Scenario: Admin login dengan kredensial invalid
- **WHEN** admin memasukkan email atau password yang salah
- **THEN** sistem menampilkan pesan error autentikasi
- **AND** tidak mengizinkan akses ke dashboard

### Requirement: Sistem mendukung dua level role
Sistem SHALL mengelola dua level role pengguna: `admin` (full access) dan `contributor` (bisa tambah/edit konten yang dibuatnya, tidak bisa hapus atau kelola user).

#### Scenario: Admin mengakses manajemen pengguna
- **WHEN** pengguna dengan role `admin` mengakses halaman manajemen pengguna
- **THEN** sistem mengizinkan akses dan menampilkan daftar pengguna

#### Scenario: Kontributor mencoba akses manajemen pengguna
- **WHEN** pengguna dengan role `contributor` mengakses halaman manajemen pengguna
- **THEN** sistem menampilkan halaman forbidden (403)
- **AND** tidak mengizinkan akses

### Requirement: Kontributor hanya dapat mengelola media sendiri
Sistem SHALL membatasi kontributor agar hanya dapat mengedit dan menghapus media yang `created_by`-nya sesuai dengan ID kontributor tersebut.

#### Scenario: Kontributor mengedit media sendiri
- **WHEN** kontributor mengakses halaman edit media yang dibuatnya sendiri
- **THEN** sistem mengizinkan akses dan menampilkan form edit

#### Scenario: Kontributor menghapus media sendiri
- **WHEN** kontributor menghapus media yang dibuatnya sendiri
- **THEN** sistem mengizinkan penghapusan setelah konfirmasi

### Requirement: Sesi admin diperbarui otomatis
Sistem SHALL memperbarui session token secara otomatis dan mengarahkan ke login jika session expired.

#### Scenario: Session admin expired
- **WHEN** session token admin expired
- **THEN** sistem mengarahkan pengguna ke halaman login
- **AND** menampilkan pesan bahwa session telah berakhir

### Requirement: Admin dapat logout
Sistem SHALL menyediakan tombol logout yang menghapus session dan mengarahkan ke halaman login.

#### Scenario: Admin logout
- **WHEN** admin mengklik tombol logout
- **THEN** sistem menghapus session dari browser
- **AND** mengarahkan ke halaman login

### Requirement: Middleware proteksi route admin
Sistem SHALL melindungi semua route dashboard admin dengan middleware yang memeriksa autentikasi dan role pengguna.

#### Scenario: Pengguna tidak terautentikasi mengakses dashboard
- **WHEN** pengguna yang belum login mengakses `/admin/*`
- **THEN** sistem mengarahkan ke halaman login
- **AND** menyimpan URL tujuan untuk redirect setelah login
