# Recap Proyek Anterin (VIP Rental Zenix Semarang)

Dokumen ini berisi ringkasan teknis dan fitur aplikasi **Anterin** untuk keperluan review oleh Gemini AI.

---

## 1. Ringkasan Proyek
**Anterin** adalah aplikasi web *mobile-first* premium untuk penyewaan Toyota Innova Zenix 2025 di Semarang. Aplikasi ini telah melewati overhaul UI/UX untuk memberikan nuansa **VIP Executive** dengan skema warna *Midnight Navy Blue & Champagne Gold*.

## 2. Arsitektur Teknis
- **Frontend**: Vanilla HTML5, CSS3, JavaScript.
- **Backend (Node.js/Express)**: 
  - `server.js`: Entry point Express.
  - `routes/api.js`: Endpoint untuk booking dan ketersediaan jadwal.
  - `db/database.js`: Manajemen database (SQLite/Supabase).
- **External Integration**:
  - **Google Maps API**: Places Autocomplete (Lokasi Jemput) & Geocoder (Reverse GPS).
  - **WhatsApp**: Integrasi pesan otomatis untuk konfirmasi pemesanan.
- **Deployment**: Mendukung Vercel & Render (`vercel.json`, `render.yaml`).

## 3. Fitur Utama & File Core

### A. UI/UX & Branding (`index.html`, `style.css`)
- **Midnight Navy & Gold Theme**: Variabel CSS adaptif (`--accent-icon`) yang berubah warna secara dinamis antara Light dan Dark Mode.
- **Premium Intro Screen**: Animasi *fade-in* dan *scale-up* logo/slogan saat aplikasi dimuat pertama kali dalam satu sesi (`sessionStorage`).
- **Hero Section**: 
  - *Dynamic Greeting*: Salam berubah (Pagi/Siang/Malam) berdasarkan jam saat ini.
  - *Immersive Car Photo*: Foto mobil dengan efek gradasi transparan di bagian bawah agar menyatu dengan background.
  - *Strict Rule Badge*: Penegasan bahwa layanan hanya melayani sewa dengan sopir.

### B. Interaktivitas & Booking Flow (`script.js`)
- **Interactive Availability Calendar**: 
  - Pengguna bisa memilih rentang tanggal (*Date Range Selection*).
  - Validasi otomatis: Tanggal yang sudah terisi (*blocked*) tidak bisa dipilih.
  - Sinkronisasi otomatis dengan input form.
- **Smart Location Input**:
  - Google Places Autocomplete untuk pencarian alamat yang akurat.
  - Tombol GPS 📍: Mendeteksi lokasi saat ini via browser dan melakukan *Reverse Geocoding*.
- **Booking Form**: 
  - Input Waktu (Jam Keberangkatan & Estimasi Selesai).
  - Pilihan Admin (WhatsApp API dinamis).
- **Interior Gallery**: Tombol "Lihat Foto Fisik" membuka *VIP Lightbox Gallery* yang responsif.

### C. Manajemen Sesi & Data
- **Onboarding Overlay**: Muncul hanya sekali (`localStorage`) untuk memperkenalkan fitur aplikasi kepada pengguna baru.
- **Session Managed Intro**: Intro hanya muncul sekali per tab sesi (`sessionStorage`).

---

## 4. Struktur File Utama
- `index.html`: Struktur utama (Intro, Hero, Specs, Driver, Calendar, Booking, Footer).
- `style.css`: Logika desain (Grid System, Dark Mode, Animations, Responsive Desktop 2-Column).
- `script.js`: Logika interaksi (Calendar rendering, GPS detection, WhatsApp message construction).
- `server.js`: API proxy dan route handling.
- `db/database.js`: Koneksi database SQLite/Supabase.

## 5. Status Terakhir & Rekomendasi Review
- **Status Sekarang**: Aplikasi sudah *fully functional* secara visual dan logika frontend. Integrasi Google Maps API sudah aktif menggunakan key yang dibatasi.
- **Fokus Review Gemini AI**:
  1. Efisiensi rendering kalender pada `script.js`.
  2. Keamanan variabel environment pada Vercel.
  3. Responsivitas tampilan Desktop 2-Kolom pada layar ukuran menengah (tablet).

---
*Dibuat otomatis oleh Antigravity untuk review Gemini AI.*
