# 📋 RECAP TERKINI PROYEK "ANTERIN" (v2.0)
### Status: ✅ Production-Ready | Update: 31 Maret 2026
*(Dokumen Konteks Lengkap untuk Review oleh Gemini AI / Developer Lain)*

---

## 1. Gambaran Umum Produk
**Anterin** adalah aplikasi web *mobile-first* premium untuk penyewaan Toyota Innova Zenix 2025 di Semarang. Target pasarnya adalah pebisnis, pejabat, dan eksekutif yang menghargai kenyamanan, kepercayaan, dan efisiensi.

**URL Live (Vercel):** `https://anterin-9qbfvomh4-bramest1654s-projects.vercel.app/`

---

## 2. Stack Teknologi

| Lapisan | Teknologi |
|---|---|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript ES6 (tanpa framework) |
| **Backend** | Node.js + Express.js |
| **Database** | Supabase (PostgreSQL) |
| **Deployment** | Vercel Serverless Functions |
| **Font** | Plus Jakarta Sans (Google Fonts) |
| **Icons** | FontAwesome 6.x |

---

## 3. Sistem Desain "VIP Ocean Navy & Gold" *(Update Terkini)*

### Palet Warna Utama (CSS Variables)
```css
/* Light Mode → Crisp White + Deep Navy + Gold */
--bg-main: #F8FAFC
--bg-app: #FFFFFF
--text-primary: #0F172A   /* Slate Navy */
--accent-sage: #D4AF37    /* Champagne Gold – WARNA KUNCI */

/* Dark Mode → Midnight Ocean */
--bg-main: #060B1E        /* Midnight Black-Blue */
--bg-app: #0A1128         /* Deep Navy */
--bg-card: #141F45        /* Elevated Navy */
--accent-sage: #FCD34D    /* Luminous Gold */
```

### Tipografi
- **Font Utama**: Plus Jakarta Sans (Weight: 400, 500, 600, 700)
- **Tagline Brand**: `font-weight: 400`, `letter-spacing: 2.5px`, `UPPERCASE`, warna **Champagne Gold**

### Komponen Utama

#### Header/Navbar
- Logo: `<img src="logo.png">` dengan `height: 56px` – representasi brand visual yang proper
- Tagline: *"DUDUK TENANG, KAMI ANTARKAN."* – warna Gold, huruf kapital, spasi agak renggang
- Tombol Dark Mode Toggle (☀️/🌙) di pojok kanan
- Efek: `sticky`, `backdrop-filter: blur(10px)`, latar Navy transparan 95%

#### Hero Section
- Sapaan dinamis otomatis berdasarkan waktu nyata (Pagi/Siang/Sore/Malam)
- Foto Toyota Innova Zenix 2025 membaur tanpa batas kotak (*immersive*)
- Tag info mobil: "Toyota Innova Zenix 2.0 G Bensin CVT 2025"

#### Badge "Hanya Dengan Sopir" *(Update Merah)*
- **Warna Background: Merah Crimson (#C0392B)** – sengaja menonjol sebagai kebijakan penting
- Teks putih solid, ikon transparan, shadow merah di bawah kotak
- Pesan yang ditangkap konsumen: *"Ini aturan, bukan pilihan"*

#### Kartu Fasilitas (Specs Grid) *(Update Copywriting)*
- ~~Mesin Bensin~~ → **Irit BBM** (lebih meyakinkan secara value proposition)
- 7-Seater
- Bagasi Luas  
- AC Dingin
- Hover Effect: Terangkat (translateY -5px) + glowing Gold shadow

#### Profil Sopir
- Nama: Pak Surono | Rating: 5.0 ⭐ | 10+ Tahun Pengalaman
- Hover Effect: Terangkat + shadow lebih dalam

#### Galeri Foto Interior (Lightbox Carousel) *(Fitur Baru)*
- Tombol "Lihat Foto Fisik Asli Mobil" membuka Lightbox pop-up
- 3 Foto Interior AI-Generated Resolusi Tinggi (Dashboard, VIP Seats, Bagasi)
- Navigasi Prev/Next + Dot Indicator
- Latar: Deep Navy blur + Gold glow shadow di foto
- Tutup: Klik tombol × atau klik area luar

---

## 4. Sistem Layout Responsif (Hybrid)

```
Layar HP (< 900px)    → 1 Kolom, scroll vertikal linear
Layar PC (≥ 900px)    → 2 Kolom Split-Screen (Airbnb-style)
                          Kiri: Info mobil + foto
                          Kanan: Kalender + Form Booking (STICKY)
```

Dikendalikan murni oleh `@media (min-width: 900px)` di `style.css`.

---

## 5. Sistem Booking & Kalender

- **Kalender Visual**: Grid mingguan tampil langsung di halaman (bukan di-klik dulu)
- **Warna Tanggal**:
  - Tersedia: Normal
  - Terisi/Booked: Merah/Blocked (dikontrol admin)
  - Hari Ini: Highlighted navy
- **Koneksi**: Async fetch ke Supabase via `/api/availability`
- **Failover**: Jika API gagal, pakai Mock Data lokal (untuk debug offline)
- **Form Fields**: Nama Lengkap, Tanggal Mulai, Tanggal Selesai, Lokasi Jemput (Dropdown), Pilih Admin

#### Tombol WhatsApp Booking
- Warna: **Hijau WhatsApp** – kontras kuat di tengah latar navy
- Menghasilkan pesan otomatis terformat (Nama, Tanggal, Lokasi Jemput, Admin tujuan)
- Target: Admin 1 (Ibu Ratih) atau Admin 2 (Bramastha) – bisa dipilih dari dropdown

---

## 6. Panel Admin (Tersembunyi)

- **URL Akses**: `/admin?pw=anterin2026` (hanya diketahui internal)
- **Fungsi**: Blokir tanggal secara manual, lihat daftar booking masuk
- **Proteksi**: Query parameter password (sederhana, cukup untuk internal use)
- **File**: `admin/index.html`, `admin/admin.css`, `admin/admin.js`

---

## 7. Struktur File Proyek

```
Rental Mobil Mobile App/
│
├── index.html              ← Halaman utama pelanggan
├── style.css               ← Semua styling (mobile + desktop + dark mode)
├── script.js               ← Logika JS: Kalender, Lightbox, Booking, Dark Mode
├── server.js               ← Express.js server (Vercel Serverless)
├── vercel.json             ← Konfigurasi deployment + routing
├── package.json
│
├── db/
│   └── database.js         ← Supabase client + Mock Data failover
│
├── admin/
│   ├── index.html          ← Dashboard admin (proteksi password)
│   ├── login.html          ← Halaman login admin
│   ├── admin.css
│   └── admin.js
│
├── images/
│   ├── zenix_interior_1_*.png   ← Foto interior slide 1 (AI-generated)
│   ├── zenix_interior_2_*.png   ← Foto interior slide 2
│   └── zenix_interior_3_*.png   ← Foto interior slide 3
│
├── logo.png                ← Logo brand Anterin (file disediakan owner)
├── foto_mobil.png          ← Foto eksterior Zenix untuk Hero Section
│
└── RECAP_ANTERIN_PROJECT.md  ← File ini
```

---

## 8. Konfigurasi Deployment (vercel.json)

```json
{
  "version": 2,
  "builds": [{
    "src": "server.js",
    "use": "@vercel/node",
    "config": {
      "includeFiles": [
        "index.html", "style.css", "script.js",
        "images/**", "logo.png", "foto_mobil.png",
        "admin/**"
      ]
    }
  }],
  "rewrites": [{ "source": "/(.*)", "destination": "/server.js" }]
}
```

> ⚠️ **Penting**: `includeFiles` wajib ada agar aset statis (gambar, CSS, JS) ikut terbungkus dalam Serverless Function Vercel. Tanpa ini, file akan 404 saat di-deploy.

---

## 9. Environment Variables (Wajib di Vercel Dashboard)

| Key | Keterangan |
|---|---|
| `SUPABASE_URL` | URL project Supabase |
| `SUPABASE_ANON_KEY` | Anon/Public key Supabase |
| `ADMIN_PASSWORD` | Password panel admin (default: `anterin2026`) |

---

## 10. Changelog Revisi Terkini (Sesi Ini)

| # | Perubahan | File |
|---|---|---|
| 1 | Ganti color scheme: Sage Green → **Navy + Gold VIP** | `style.css` |
| 2 | Tombol "Lihat Foto" → **Lightbox Carousel** 3 foto interior | `index.html`, `script.js`, `style.css` |
| 3 | Hover micro-animations: Lift + Gold glow pada kartu fasilitas | `style.css` |
| 4 | Layout Desktop **2-Kolom Split-Screen** (sticky booking panel) | `style.css` |
| 5 | Header: Teks "Anterin" → **Logo Image** + Tagline Gold | `index.html`, `style.css` |
| 6 | Logo diperbesar: 32px → **56px** (setara app ternama) | `style.css` |
| 7 | Copywriting: "Mesin Bensin" → **"Irit BBM"** | `index.html` |
| 8 | Badge "Hanya Dengan Sopir" → **Background Merah Crimson** | `style.css` |

---

## 11. Saran untuk Reviewer / Next Steps

- [ ] **Swipe Gesture** pada Lightbox (untuk pengguna HP tanpa tombol)
- [ ] **Animasi Entrance** halaman (fade-in saat pertama dibuka)
- [ ] **PWA Support** (manifest.json + service worker agar bisa "Install ke HP")
- [ ] **Google Analytics** untuk tracking konversi dari kunjungan ke klik WhatsApp
- [ ] **SEO Meta Tags** lebih lengkap (og:image, description, schema.org)
- [ ] Verifikasi koneksi Supabase di environment production Vercel
