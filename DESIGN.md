# DESIGN.md — Anterin Mobile Web App

> Dokumen ini berisi design system lengkap dan prompt siap pakai untuk Google Stitch AI.
> Buka: https://stitch.withgoogle.com → Paste prompt dari Section 7 di bawah.

---

## 1. Brand Identity

| Property       | Value                                                         |
|----------------|---------------------------------------------------------------|
| **Nama**       | Anterin                                                       |
| **Tagline**    | Solusi perjalanan premium Anda di Semarang                    |
| **Tone**       | Premium, terpercaya, lokal, hangat                            |
| **Target**     | Profesional & keluarga di Semarang yang butuh sewa mobil + sopir |
| **Produk**     | Toyota Innova Zenix Tipe G Bensin (1 unit, hanya dengan sopir)|
| **Checkout**   | Via WhatsApp (bukan payment gateway)                          |

---

## 2. Design Tokens

### Color Palette — "Kalcer" Theme

#### Light Mode
| Token              | Hex       | Usage                        |
|--------------------|-----------|------------------------------|
| bg-main            | `#FBF9F6` | Page background              |
| bg-app             | `#FFFFFF` | App container                |
| bg-card            | `#F4F1EA` | Card backgrounds             |
| text-primary       | `#2E3436` | Headings, body text          |
| text-secondary     | `#555C5E` | Subtitles, captions          |
| accent-sage        | `#7FA998` | Primary accent, buttons, icons |
| accent-sage-hover  | `#648A7A` | Hover states                 |
| border-color       | `#E6E1D8` | Card borders, dividers       |
| alert-bg           | `#FBEAE4` | Warning badge background     |
| alert-text         | `#C85A3D` | Warning badge text           |

#### Dark Mode
| Token              | Hex       | Usage                        |
|--------------------|-----------|------------------------------|
| bg-main            | `#141617` | Page background              |
| bg-app             | `#1A1D1E` | App container                |
| bg-card            | `#262A2B` | Card backgrounds             |
| text-primary       | `#EAE6DF` | Headings, body text          |
| text-secondary     | `#A9ADA9` | Subtitles, captions          |
| border-color       | `#333839` | Card borders, dividers       |
| alert-bg           | `#3D2722` | Warning badge background     |
| alert-text         | `#E8866E` | Warning badge text           |

### Typography
- **Font:** Plus Jakarta Sans (Google Fonts)
- **Weights:** 400 (body), 500 (labels), 600 (emphasis), 700 (headings)
- **Scale:** 0.8rem → 0.85rem → 0.9rem → 0.95rem → 1rem → 1.1rem → 1.25rem → 1.75rem

### Spacing & Layout
- **Max Width:** 480px (mobile-first vertical layout)
- **Padding:** 24px horizontal
- **Section Gap:** 32px vertical
- **Border Radius:** 12px (cards), 16px (form wrapper), 50% (avatars)
- **Shadows:** Subtle — `0 2px 4px rgba(0,0,0,0.02)` to `0 8px 16px rgba(0,0,0,0.04)`

---

## 3. Screen Inventory

### Screen A: Onboarding (3 slides, full-screen overlay)
| Slide | Icon       | Title                            | Subtitle                                                      |
|-------|------------|----------------------------------|---------------------------------------------------------------|
| 1     | 🚗 fa-car  | Selamat Datang di Anterin        | Solusi perjalanan premium Anda di Semarang.                   |
| 2     | 💎 fa-gem  | Kenyamanan Maksimal              | Armada Innova Zenix Tipe G Bensin terawat, lengkap dengan sopir profesional. |
| 3     | ✈️ fa-paper-plane | Pesan dalam Hitungan Detik  | Pilih jadwal Anda dan konfirmasi instan langsung via WhatsApp.|

- Dot indicators (3 dots, active = sage green pill shape)
- Button: "Lanjut" → last slide changes to "Mulai Jelajahi"

### Screen B: Dashboard (scrollable single page)
1. **Header** — Logo "Anterin." + dark mode toggle (moon/sun icon)
2. **Hero Image** — Full-width car photo with gradient overlay fading into background
3. **Alert Badge** — ⚠️ "Hanya Dengan Sopir (Tidak melayani lepas kunci)" (terracotta accent)
4. **Hero Text** — H1: "Perjalanan Premium Anda" + subtitle
5. **Price Card** — "Harga Sewa / Hari" → "Rp 800.000" (sage green)
6. **Specs Grid** — 2x2 grid: Mesin Bensin, 7-Seater, Bagasi Luas, AC Dingin
7. **Driver Profile Card** — Avatar (silhouette icon), "Pak Surono", 5.0 ⭐ (10+ Tahun Pengalaman), bio quote
8. **Booking Form Card** — Nama Lengkap, Tanggal Mulai/Selesai (side by side), Lokasi Jemput (dropdown), WhatsApp green submit button
9. **Payment Disclaimer** — Small muted text below CTA
10. **Footer** — "Anterin." + © 2026

---

## 4. Component Specifications

### Header
- Sticky top, backdrop blur, 1px bottom border
- Left: Brand name "Anterin." (dot in sage green)
- Right: Circle button with moon/sun icon for theme toggle

### Alert Badge
- Rounded card with icon + text side by side
- Background: terracotta-tinted (warm orange/coral)
- Icon: shield icon in darker terracotta circle
- Text: Bold title + smaller subtitle

### Price Card
- Horizontal layout: label left, price right
- Price in sage green, bold, 1.25rem

### Spec Grid
- 2-column CSS grid, 12px gap
- Each item: icon (sage green bg circle) + label text
- 12px border-radius, 1px border

### Driver Profile Card
- Header: circular avatar (60px, sage gradient) + name + star rating
- Body: italic bio quote with 3px sage left border

### Booking Form
- Stacked inputs with 12px rounded corners
- Date inputs side by side in 2-column grid
- Dropdown with custom chevron icon
- CTA: Full-width WhatsApp green (#25D366) button with WA icon
- Disclaimer: centered muted text below

---

## 5. Business Rules & Constraints

1. **Hanya Dengan Sopir** — Tidak melayani lepas kunci (self-drive)
2. **1 Unit Armada** — Toyota Innova Zenix Tipe G Bensin
3. **Sopir Tetap** — Pak Surono (10+ tahun pengalaman)
4. **Area Jemput** — Semarang: Garasi Rental, Bandara Ahmad Yani, Stasiun Tawang, Alamat Lain
5. **Checkout** — Via WhatsApp redirect (bukan online payment)
6. **Harga** — Rp 800.000 / hari
7. **Bahasa** — Indonesian (Bahasa Indonesia)

---

## 6. User Flow

```
[First Visit] → Onboarding Slide 1 → Slide 2 → Slide 3 → "Mulai Jelajahi"
                                                                    ↓
[Dashboard] → Hero + Badge → Scroll → Specs → Driver Profile → Booking Form
                                                                    ↓
[Fill Form] → Nama + Tanggal + Lokasi → "Pesan via WhatsApp"
                                                                    ↓
[Redirect] → wa.me/6281227539199?text=<pre-filled message>
```

---

## 7. 🚀 Stitch AI Prompt (SIAP COPY-PASTE)

### Prompt untuk Standard Mode:

```
Design a premium mobile web app (max-width 480px, vertical orientation) for "Anterin" — a single-car chauffeur rental service in Semarang, Indonesia.

BRAND: "Anterin" — premium, trustworthy, warm, local Indonesian feel.

COLOR PALETTE (called "Kalcer"):
- Light Mode: Off-white background (#FBF9F6), cream card backgrounds (#F4F1EA), deep charcoal text (#2E3436), muted secondary text (#555C5E), sage/mint green accents (#7FA998), warm terracotta for alerts (#C85A3D on #FBEAE4).
- Dark Mode: Slate charcoal background (#1A1D1E), dark card backgrounds (#262A2B), soft cream text (#EAE6DF), muted grey borders (#333839).
- NO pure black (#000000) or pure white (#FFFFFF).

TYPOGRAPHY: Plus Jakarta Sans. Clean, modern, well-spaced.

SCREENS NEEDED:

SCREEN 1 — ONBOARDING (full-screen overlay, 3 slides):
- Slide 1: Large car icon, title "Selamat Datang di Anterin", subtitle "Solusi perjalanan premium Anda di Semarang."
- Slide 2: Gem icon, title "Kenyamanan Maksimal", subtitle "Armada Innova Zenix Tipe G Bensin terawat, lengkap dengan sopir profesional."
- Slide 3: Paper plane icon, title "Pesan dalam Hitungan Detik", subtitle "Pilih jadwal Anda dan konfirmasi instan langsung via WhatsApp."
- Bottom: 3 dot indicators (active dot is elongated sage green pill), button says "Lanjut" (last slide: "Mulai Jelajahi").

SCREEN 2 — DASHBOARD (single scrollable page, these sections in order):

1. HEADER: Sticky top bar with brand name "Anterin." (dot colored sage green) on left, circular dark mode toggle button (moon icon) on right. Use backdrop blur effect.

2. HERO: Full-width photo area (car image) with a bottom gradient overlay fading into the page background. Below the image, an eye-catching ALERT BADGE in warm terracotta/coral style that says: "Hanya Dengan Sopir" (bold) with subtitle "(Tidak melayani lepas kunci)". This badge has a shield icon on the left.

3. HERO TEXT: Large heading "Perjalanan Premium Anda" with subtitle "Sewa Toyota Innova Zenix Tipe G Bensin untuk kenyamanan bisnis dan keluarga di Semarang."

4. PRICE CARD: Horizontal card showing "Harga Sewa / Hari" on the left and "Rp 800.000" in bold sage green on the right.

5. SPECS GRID: 2x2 grid of small cards, each with a sage-green icon and label:
   - Gas pump icon: "Mesin Bensin"
   - Users icon: "7-Seater"
   - Suitcase icon: "Bagasi Luas"
   - Snowflake icon: "AC Dingin"

6. DRIVER PROFILE CARD: Section title "Profil Sopir Kami". Card with:
   - Circular avatar (professional driver silhouette icon, sage green gradient background)
   - Name: "Pak Surono"
   - Rating: "5.0 ⭐ (10+ Tahun Pengalaman)"
   - Bio quote in italic with sage green left border: "Berpengalaman lebih dari 10 tahun melayani tamu VIP dan perjalanan bisnis. Sangat hafal rute dalam dan luar kota Semarang. Mengutamakan kelancaran, keselamatan, serta kenyamanan penumpang. Selalu tampil rapi, ramah, dan tepat waktu."

7. BOOKING FORM CARD: Section title "Jadwalkan Perjalanan". Card with:
   - Text input: "Nama Lengkap"
   - Two date inputs side by side: "Tanggal Mulai" and "Tanggal Selesai"
   - Dropdown select: "Lokasi Jemput" with options (Garasi Rental, Bandara Ahmad Yani, Stasiun Tawang, Alamat Lain)
   - Full-width WhatsApp green (#25D366) button: "Pesan via WhatsApp" with WhatsApp icon
   - Small centered muted text below: "Pembayaran aman dilakukan setelah konfirmasi jadwal melalui WhatsApp."

8. FOOTER: Centered "Anterin." logo text and "© 2026 Anterin Semarang."

DESIGN STYLE: Modern, minimal, premium feel. Generous spacing. Subtle shadows. Smooth rounded corners (12-16px). The design should feel like a native mobile app, not a website. Make it look like a high-end startup product.
```

### Prompt untuk Experimental Mode (Image-to-Design):

Upload screenshot app kita yang sudah di-capture, lalu tambahkan prompt ini:

```
Redesign this mobile web app with a more premium and polished look. Keep the exact same layout structure and content. Use the "Kalcer" color palette: off-white (#FBF9F6), cream (#F4F1EA), charcoal text (#2E3436), sage green accents (#7FA998), terracotta alerts (#C85A3D). Font: Plus Jakarta Sans. Make it feel like a native mobile app from a premium startup. Add subtle micro-interactions and depth.
```

---

## 8. 🔧 Stitch AI Prompt — ADMIN DASHBOARD (Backend UI)

> Prompt ini khusus untuk mendesain **Admin Dashboard** — halaman terpisah dari customer app. Paste langsung ke Google Stitch AI.

### Prompt Standard Mode (Siap Copy):

```
Design an admin dashboard for "Anterin" — a car rental management panel. This is a DARK MODE ONLY, desktop-responsive web interface (max-width 720px centered). It must follow the "Kalcer" dark theme exactly.

BRAND: "Anterin. Admin" — professional, clean, data-focused.

COLOR PALETTE (Dark Kalcer):
- Background: #141617
- Cards/Containers: #1A1D1E with 1px border #333839
- Elevated surfaces: #262A2B
- Primary text: #EAE6DF (soft cream)
- Secondary text: #A9ADA9 (muted grey)
- Accent (sage green): #7FA998 and #648A7A for hover
- Warning/Pending: #F59E0B (amber)
- Danger/Cancelled: #E8866E on #3D2722
- Success/Confirmed: #7FA998 on rgba(127,169,152,0.15)
- NO pure black or pure white.

TYPOGRAPHY: Plus Jakarta Sans. Clean, modern. Font weights: 400, 500, 600, 700.

LAYOUT — single scrollable page with these sections:

1. HEADER BAR:
   - Left: Brand name "Anterin." (dot in sage green) followed by "Admin" in normal weight
   - Right: A small bordered button "← App" linking back to customer app
   - Bottom 1px border separator

2. STATS GRID (2x2):
   Four equally-sized stat cards in a 2-column grid:
   - Card 1: Large number + label "Total Booking" (white text)
   - Card 2: Large number + label "Bulan Ini" (white text)
   - Card 3: Large number + label "Pending" (amber/yellow #F59E0B number)
   - Card 4: Large number + label "Confirmed" (sage green #7FA998 number)
   Each card: Dark background (#1A1D1E), 14px border-radius, centered text, border #333839.

3. AVAILABILITY CALENDAR section:
   - Section title with calendar icon (sage green): "Kelola Ketersediaan"
   - A calendar widget inside a dark card:
     - Header row: left arrow, "Maret 2026" center, right arrow
     - Day-of-week headers: Min, Sen, Sel, Rab, Kam, Jum, Sab
     - 7-column grid of day cells, each is a small square (aspect-ratio 1:1)
     - Normal days: dark background (#262A2B), light text
     - Blocked days: warm terracotta background (#3D2722), coral text (#E8866E), border #5A3328
     - Past days: reduced opacity (0.3)
     - Clickable days to toggle block/unblock
   - Below calendar: small hint text "Klik tanggal untuk block/unblock. □ = Terblokir"

4. BOOKING LIST section:
   - Section title with clipboard icon (sage green): "Daftar Booking"
   - Container card with list of booking entries, each entry is a card-like row:
     - Top row: Customer name (bold, left) + Status badge (right)
     - Badges: "pending" (amber bg tint), "confirmed" (sage green bg tint), "done" (darker sage), "cancelled" (coral bg tint). All uppercase, small rounded pill badges.
     - Detail row: Calendar icon + date range, Location pin icon + pickup location. Small text, muted grey, with sage green icons.
     - Action buttons row: Small pill buttons for "pending", "confirmed", "done" — the active status button is highlighted (sage green bg, white text). Plus a "✕ Batal" cancel button in coral/terracotta style.
   - Empty state: Inbox icon + "Belum ada booking." centered text

5. OVERALL FEEL:
   - Professional and clean, like a modern SaaS admin panel
   - Generous spacing between sections (32px)
   - Smooth 14px border-radius on all cards
   - Subtle 1px borders, no heavy shadows
   - Interactive feel: hover states on calendar days and buttons
   - Must look like the admin panel of a premium startup, not a basic CRUD interface
```

### Prompt Experimental Mode (Upload Screenshot Admin):

Upload screenshot admin dashboard kita, lalu tambahkan:

```
Redesign this admin dashboard with a more premium SaaS-like appearance. Keep the same layout: stats grid, interactive calendar, and booking list. Use the dark "Kalcer" palette: #141617 background, #1A1D1E cards, #262A2B surfaces, #EAE6DF text, #7FA998 sage green accents, #F59E0B amber for pending, #E8866E coral for cancelled. Font: Plus Jakarta Sans. Make it feel like a modern startup admin panel with clean data visualization.
```
