# 📘 Panduan Integrasi Notion Database ke Blog Portfolio

Website portofolio ini sudah dilengkapi dengan client Notion API `@notionhq/client` dan renderer blok bawaan. Jika token belum diisi, website otomatis berjalan dengan aman menggunakan mock data bawaan sehingga tidak terjadi error.

Ikuti 4 langkah mudah berikut untuk menghubungkan tulisan live dari Notion kamu:

---

### Langkah 1: Buat Integrasi di Notion Developers

1. Buka [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations).
2. Klik tombol **New integration** (+).
3. Beri nama integrasi (misalnya: `Portfolio Blog Sync`).
4. Pilih workspace Notion yang ingin kamu gunakan.
5. Klik **Submit / Save**.
6. Salin **Internal Integration Secret** (berawalan `secret_...`).

---

### Langkah 2: Buat Database di Notion

Buat halaman baru di Notion sebagai **Database (Full page atau Inline Table)** dengan struktur kolom (properti) berikut:

| Nama Kolom | Tipe Properti di Notion | Keterangan |
| :--- | :--- | :--- |
| **Title** | `Title` | Judul artikel |
| **Slug** | `Text` | URL slug unik (contoh: `belajar-nextjs-notion`) |
| **Date** | `Date` | Tanggal publikasi artikel |
| **Tags** | `Multi-select` | Kategori atau topik (contoh: `Tech`, `UI/UX`, `AI`) |
| **Summary** | `Text` | Ringkasan singkat artikel untuk preview card |
| **Published** | `Checkbox` | Centang (✓) untuk menampilkan artikel di website |

> **Catatan:** Kamu juga bisa menambahkan **Cover Image** pada halaman Notion untuk dijadikan cover banner artikel di website.

---

### Langkah 3: Beri Akses (Share) Database ke Integrasi

1. Buka database Notion yang baru kamu buat.
2. Klik ikon tiga titik **(•••)** di pojok kanan atas halaman.
3. Gulir ke bawah dan klik menu **Connections** (atau **Connect to**).
4. Pilih nama integrasi yang kamu buat di Langkah 1.
5. Klik **Confirm**. Database sekarang sudah bisa diakses secara aman oleh integrasi.

---

### Langkah 4: Ambil Database ID & Simpan ke `.env.local`

1. Salin link database Notion kamu (klik **Share** > **Copy link**).
2. URL Notion memiliki format seperti ini:
   ```text
   https://www.notion.so/workspace/32_CHARACTER_DATABASE_ID?v=...
   ```
   Bagian 32 karakter alfanumerik sebelum tanda `?v=` adalah **DATABASE_ID** kamu.
3. Buat file `.env.local` di folder root project:
   ```env
   NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Restart development server:
   ```bash
   npm run dev
   ```

Selamat! Artikel kamu di Notion sekarang otomatis muncul dan disinkronkan secara live di halaman **Blog** website portofolio kamu.
