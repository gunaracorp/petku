<div align="center">

# 🐾 PetKu

### Toko Makanan Hewan Online Terlengkap — Bisa Diakses dari Semua Perangkat

*Website toko makanan hewan modern: anjing, kucing, burung, ikan, hamster & kelinci, sampai reptil.*

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-database-003B57?logo=sqlite)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-animasi-EF4C95?logo=framer)
![Zustand](https://img.shields.io/badge/Zustand-state-orange)
![License](https://img.shields.io/badge/status-Produksi%20Siap-success)

</div>

---

## 📖 Tentang PetKu

**PetKu** adalah aplikasi web toko makanan hewan (e-commerce) full-stack yang dibangun dengan **satu tujuan: nyaman dipakai di layar apa pun** — HP, tablet, laptop, sampai monitor lebar. Tidak butuh install apa pun: buka browser, langsung belanja.

Di dalamnya sudah berjalan siklus toko yang **benar-benar utuh**, bukan mockup:

```
Cari produk → Lihat detail → Masuk keranjang → Checkout → Dapat kode pesanan
     → Lacak status → Admin konfirmasi → Dikirim → Stok berkurang otomatis
```

**Kondisi data saat ini:** 📦 **35 produk** dari **26 brand resmi** (Royal Canin, Whiskas, Pedigree, Purina Pro Plan, Hikari, Tetra, Oxbow, Zoo Med, dll.) tersebar di **6 kategori hewan**, dengan 11 produk ditandai *Terlaris*.

---

## ✨ Fitur Utama (Sekilas)

| # | Fitur | Status |
|---|-------|--------|
| 1 | Katalog produk responsif (grid 2/3/4 kolom otomatis) | ✅ |
| 2 | Pencarian instan anti-lag (*debounce* 350 ms) | ✅ |
| 3 | Filter 7 kategori + 4 mode pengurutan | ✅ |
| 4 | Detail produk lengkap + stepper jumlah | ✅ |
| 5 | Keranjang belanja yang **tidak hilang walau browser ditutup** | ✅ |
| 6 | Checkout 3 metode bayar (COD / Transfer / E-Wallet) | ✅ |
| 7 | Kode pesanan unik + lacak pesanan dengan timeline 4 tahap | ✅ |
| 8 | Dasbor admin: statistik, kelola status, restock stok | ✅ |
| 9 | Notifikasi WhatsApp otomatis (link terisi pesanan) | ✅ |
| 10 | Gratis ongkir otomatis + pengingat "kurang Rp X lagi" | ✅ |
| 11 | Navigasi bawah ala aplikasi mobile (safe-area iPhone) | ✅ |
| 12 | 20+ animasi & micro-interaction (dokumentasi penuh di bawah) | ✅ |

---

## 🧩 Fitur Lengkap Per Modul

### 🏠 1. Beranda & Hero
- Banner gradient oranye dengan judul, ajakan belanja, dan **rating 4.9 ⭐ (12rb+ ulasan)**.
- Baris keunggulan toko: 🚚 Gratis Ongkir (min. Rp200rb) · 🛡️ 100% Original distributor resmi · 🏷️ Harga Grosir · 🎧 CS Siaga.
- Kolase 6 emoji hewan (🐕🐈🐦🐠🐹🦎) yang muncul **satu per satu dengan animasi stagger** (lihat [bagian animasi](#-dokumentasi-animasi-lengkap)).

### 🗂️ 2. Kategori Hewan
7 kartu kategori dengan warna khas masing-masing: 🐾 Semua · 🐕 Anjing · 🐈 Kucing · 🐦 Burung · 🐟 Ikan · 🐹 Hamster & Kelinci · 🦎 Reptil. Setiap kartu menampilkan jumlah produk real-time dari database, dan kartu terpilih mendapat cincin highlight.

### 🔍 3. Pencarian Cerdas
- Mencari di **nama produk, brand, dan nama kategori** sekaligus (satu kotak, tiga target).
- *Debounce* 350 ms — ketik secepat apa pun, request ke server hanya dikirim setelah kamu berhenti mengetik.
- Ada di dua tempat: kolom header (desktop) dan baris khusus (mobile).
- Tombol **Reset Pencarian** muncul otomatis saat hasil kosong.

### 🛍️ 4. Katalog Produk
- **4 mode urutan:** 🔥 Terlaris · ⭐ Rating Tertinggi · 💰 Harga Terendah · 💎 Harga Tertinggi.
- *Filter chips* kategori yang bisa digeser horizontal (scrollbar disembunyikan, tetap bisa di-swipe).
- **Skeleton loading** — kerangka abu-abu yang berdenyut selama data dimuat, jadi tidak pernah tampil layar kosong.
- Halaman kosong yang ramah: ilustrasi + saran mencoba kata kunci lain.
- Badge otomatis: 🔴 `-XX%` kalau ada diskon, ⭐ **Terlaris** kalau produk unggulan, dan peringatan 🔥 **"Sisa X"** kalau stok ≤ 20.
- Produk stok habis: otomatis redup + tombol berubah jadi "Stok Habis" (tidak bisa diklik).

### 📄 5. Detail Produk (Dialog)
- Visual produk emoji + gradasi warna per kategori, badge kategori & Terlaris.
- Informasi ringkas 3 kolom: Kemasan · Stok · Keaslian (✅ Distributor).
- Harga + harga coret + persentase diskon.
- **Stepper jumlah** dengan batas pintar: minimal 1, maksimal mengikuti stok (maks. 99), dan angkanya diumumkan ke pembaca layar (`aria-live`).
- Dua tombol aksi: **+ Keranjang** (belanja lanjut) dan **⚡ Beli Sekarang** (langsung lompat ke checkout).

### 🛒 6. Keranjang Belanja (Panel Samping)
- Buka dari header desktop, tab bawah mobile, atau tombol "Lihat" di notifikasi.
- Ubah jumlah ± langsung di keranjang (tidak bisa melebihi stok).
- Hitung otomatis: Subtotal → Ongkir → Total.
- **Banner pengingat pintar:** *"Tambah Rp15.000 lagi untuk GRATIS ONGKIR!"* — hilang sendiri saat syarat tercapai dan berubah jadi "Gratis 🎉".
- **Persisten permanen:** disimpan di `localStorage` (key `petku-cart`) via Zustand `persist` — tutup browser, matikan HP, besok buka lagi keranjang tetap utuh.

### 💳 7. Checkout
- Form tervalidasi dua lapis (browser + server): nama min. 3 huruf, nomor WA hanya angka 9–15 digit, alamat min. 10 karakter, catatan opsional.
- **3 pilihan pembayaran** bergaya kartu: 💵 COD (bayar saat tiba) · 🏦 Transfer BCA/BRI/Mandiri · 📱 E-Wallet DANA/OVO/GoPay.
- Ringkasan pesanan item-per-item sebelum bayar.
- Saat diproses muncul spinner "Memproses…" (tombol terkunci, tidak bisa dobel-klik).
- **Layar sukses:** ikon centang beranimasi + **Kode Pesanan unik** format `PK-YYMMDD-XXXX` (contoh: `PK-260103-K7XM`) dalam kartu putus-putus, ringkasan total, lalu dua tombol: **Konfirmasi via WhatsApp** (pesan sudah terisi otomatis) dan **Lacak Pesanan**.

### 📦 8. Lacak Pesanan
- Cari dengan **nomor WhatsApp** (menampilkan semua pesanan nomor itu) **atau kode pesanan**.
- **Timeline visual 4 tahap:** `① Diterima → ② Diproses → ③ Dikirim → ④ Selesai` — tahap selesai bercentang hijau emerald, tahap aktif berwarna oranye.
- Status khusus **❌ Dibatalkan** dengan gaya merah.
- Detail lengkap: item, alamat kirim, metode bayar, rincian subtotal/ongkir/total.

### 🛠️ 9. Dasbor Admin
Dibuka lewat menu Admin dengan **gerbang PIN** (`petku2026` — ganti di `src/lib/petku-types.ts`).
- **4 kartu statistik:** Total Pesanan · Total Pendapatan (pesanan dibatalkan tidak dihitung) · Menunggu Konfirmasi · Sedang Dikirim.
- **Panel Stok Menipis** (≤ 20 pcs) berlatar merah, urut dari stok paling sedikit, tombol **+ Restock** sekali klik.
- **Kelola Pesanan:** daftar semua pesanan, ubah status lewat dropdown, klik chevron untuk membuka detail (alamat, catatan, item, metode bayar). Pesanan berstatus Selesai/Dibatalkan dikunci otomatis.
- Tombol **Refresh** dengan ikon berputar saat memuat.
- 🧠 **Logika cerdas:** pesanan yang dibatalkan **stoknya otomatis dikembalikan** ke produk.

### 💬 10. Integrasi WhatsApp
Semua tautan WA (`wa.me`) sudah terisi teks otomatis — konfirmasi pesanan memuat kode + nama pembeli; tombol di footer memuat sapaan tanya produk.

---

## 🎬 Dokumentasi Animasi Lengkap

PetKu memakai **Framer Motion** (orkestrasi JavaScript) + **tw-animate-css** (kelas utilitas) + **transition Tailwind** (micro-interaction CSS). Semuanya terdokumentasi di sini — termasuk beberapa teknik yang **jarang dipakai orang** ⚡.

### A. Animasi Masuk (Entrance)

| # | Animasi | Lokasi | Detail Teknis |
|---|---------|--------|---------------|
| 1 | **Fade-up hero** | Banner utama | `initial={{ opacity: 0, y: 16 }}` → `animate` selama 0,5 detik |
| 2 | **Emoji stagger berantai** 🐕🐈🐦🐠🐹🦎 | Hero | 6 tile muncul bergantian, jeda `0.15 + i × 0.07` detik, masing-masing `scale 0.5 → 1` dengan kemiringan statis `rotate-3 / -rotate-6` yang berbeda-beda |
| 3 | **Kartu kategori stagger** | 7 kartu kategori | `y: 10 → 0`, jeda `i × 0.04` — makin ke kanan makin telat, efek "gelombang" |
| 4 | **Kartu produk stagger dengan batas** ⚡*langka* | Semua grid produk | Jeda `index × 0.03` detik tapi **dipotong `Math.min(…, 0.3)`** — halaman 1 animasi berurutan rapi, halaman berikutnya tidak bikin pengunjung menunggu. Teknik anti-kecewa yang jarang dilakukan |
| 5 | **Ikon sukses zoom-in** | Layar checkout sukses | `animate-in zoom-in-50 duration-300` — centang hijau "muncrat" ke layar |
| 6 | **Dialog & Sheet** | Detail produk, checkout, keranjang | Animasi buka-tutup bawaan Radix UI: dialog fade+zoom dari tengah, keranjang meluncur dari kanan |

### B. Micro-Interaction (Respons Sentuhan & Kursor)

| # | Animasi | Lokasi | Detail Teknis |
|---|---------|--------|---------------|
| 7 | **Tekan-menyusut (tap physics)** ⚡*langka* | Chip filter, kartu kategori, tab bawah mobile | `active:scale-95` — elemen menyusut 5% persis saat ditekan, memberi rasa fisik seperti tombol HP asli |
| 8 | **Hover lift kartu produk** | Kartu produk | `hover:-translate-y-0.5` + border memerah ke oranye + bayangan menggelat `shadow-sm → shadow-md` — kartu "terangkat" dari permukaan |
| 9 | **Emoji membesar saat hover** | Visual produk & kartu kategori | `group-hover:scale-105` dan `group-hover:scale-110` — emoji produk mengikuti kursor dengan transform halus |
| 10 | **Cincin kategori terpilih** | Kartu kategori aktif | `ring-2 ring-orange-500 ring-offset-2` muncul saat kategori dipilih |
| 11 | **Hover warna tautan/kontak** | Footer | Tombol WhatsApp hijau berubah gelap halus saat disentuh |

### C. Animasi Status & Feedback

| # | Animasi | Lokasi | Detail Teknis |
|---|---------|--------|---------------|
| 12 | **Skeleton shimmer berdenyut** ⚡*langka* | Katalog (8 kartu) & produk unggulan (4 kartu) | Kerangka `Skeleton` berdenyut (pulse) menggantikan spinner kuno — layout tidak pernah "lompat" karena kerangka berukuran sama persis dengan konten aslinya |
| 13 | **Spinner proses** | Checkout, lacak pesanan, admin | `Loader2 animate-spin` — dipasang di dalam tombol, dan tombolnya `disabled` selama proses (anti dobel-submit) |
| 14 | **Ikon refresh berputar kondisional** ⚡*langka* | Dasbor admin | `className={cn("size-4", loading && "animate-spin")}` — ikon hanya berputar **selagi memuat**, lalu berhenti sendiri. Animasi yang dikendalikan state, bukan seterusnya |
| 15 | **Chevron berputar 180°** ⚡*langka* | Detail pesanan admin | `group-data-[state=open]:rotate-180` — panah membuka detail pesanan berputar menghadap atas memakai selektor `data-state` Radix, tanpa JavaScript tambahan |
| 16 | **Notifikasi toast** | Semua aksi | Sonner `richColors` posisi atas-tengah: hijau sukses ("masuk keranjang"), merah gagal (stok kurang), kuning info (pesanan tak ditemukan) — slide masuk & keluar otomatis |
| 17 | **Badge counter keranjang** | Header & tab mobile | Muncul/hilang mengikuti isi keranjang, membulat `99+` di atas 99 item |

### D. Animasi Tata Letak & Gerak Halaman

| # | Animasi | Lokasi | Detail Teknis |
|---|---------|--------|---------------|
| 18 | **Header kaca tempel (glassmorphism)** ⚡*langka* | Header | `sticky top-0` + `backdrop-blur` + latar tembus `bg-background/80` + fallback `supports-[backdrop-filter]` — konten bergulir **terlihat samar di balik header** seperti kaca susu. Ada deteksi dukungan browser agar browser lawas tetap solid |
| 19 | **Smooth scroll dengan kompensasi** ⚡*langka* | Tombol "Mulai Belanja", pilih kategori | `scrollIntoView({ behavior: "smooth" })` digabung `scroll-mt-24` — halaman bergulir lembut ke katalog dan **berhenti pas di bawah header tempel**, tidak tertutup |
| 20 | **Padding area aman iPhone** ⚡*langka* | Navigasi bawah mobile | `pb-[env(safe-area-inset-bottom)]` — tab bar tidak tertelan *home indicator* iPhone berponi. Detail yang 9 dari 10 toko online lupa |
| 21 | **Indikator tab aktif** | Navigasi bawah mobile | Garis oranye 8px muncul di atas tab aktif + ikon menebal `stroke-[2.5]` |
| 22 | **Transisi universal** | Semua komponen | `transition-all` / `transition-colors` pada kartu, chip, tombol — tidak ada satu pun perubahan warna/posisi yang "melompat" |

### E. Teknik yang Menopang Animasi (di Balik Layar)

| Teknik ⚡ | Penjelasan |
|-----------|------------|
| **Anti-hydration-flicker** | Badge angka keranjang hanya dirender setelah `useMounted()` — mencegah angka "melompat" saat React mengambil alih HTML awal |
| **Batasi & urutkan delay** | Semua stagger memakai formula proporsional + pembatas maksimum (`Math.min`), pola orkestrasi Framer Motion yang jarang dipakai dengan benar |
| **Aria-live pada angka** | Angka jumlah barang diumumkan otomatis ke pembaca layar setiap berubah — animasi yang juga ramah disabilitas |
| **Event antar-komponen** | Reset pencarian dikirim lintas komponen lewat `window.dispatchEvent(new CustomEvent("petku:reset-search"))` — komponen katalog dan header tidak perlu saling kenal |
| **Batal saat berganti filter** | Setiap fetch produk membawa `AbortController` — ketika pengguna mengganti kategori sebelum data lama tiba, request lama dibatalkan. Mencegah hasil lama "menimpa" hasil baru (race condition) |

---

## 🛠️ Teknologi

| Lapisan | Teknologi | Peran |
|---------|-----------|-------|
| Framework | **Next.js 16** (App Router) | SSR + API Routes dalam satu proyek |
| Bahasa | **TypeScript** | Seluruh kode, tipe data ketat |
| UI | **shadcn/ui + Radix UI** | Dialog, Sheet, Select, Collapsible, Skeleton, Toast |
| Gaya | **Tailwind CSS 4** | Tema oklch oranye, grid responsif, dark-mode variables |
| Animasi | **Framer Motion + tw-animate-css** | Semua animasi di atas |
| State | **Zustand + persist** | Keranjang global + penyimpanan localStorage |
| Database | **Prisma ORM + SQLite** | 4 tabel: Category, Product, Order, OrderItem |
| Ikon | **lucide-react** | 40+ ikon |
| Font | **Geist Sans & Mono** | Tipografi modern |

---

## 📁 Struktur Proyek

```
src/
├── app/
│   ├── layout.tsx              # Metadata SEO, tema, font, Toaster
│   ├── page.tsx                # Komposer halaman utama (state global)
│   ├── globals.css             # Tema oklch, utility scrollbar-none
│   └── api/
│       ├── categories/         # GET daftar kategori + jumlah produk
│       ├── products/           # GET katalog (filter, urut, cari)
│       │   └── [id]/           # PATCH stok (restock admin)
│       ├── orders/             # POST buat pesanan · GET lacak
│       │   └── [id]/           # PATCH ubah status (+balikin stok)
│       └── admin/stats/        # GET statistik dasbor
├── components/petku/
│   ├── header.tsx              # Header kaca tempel + pencarian
│   ├── hero.tsx                # Banner + emoji stagger + keunggulan
│   ├── category-nav.tsx        # 7 kartu kategori beranimasi
│   ├── featured-section.tsx    # Produk "Paling Dicari" 🔥
│   ├── catalog.tsx             # Grid, filter chips, urutan, skeleton
│   ├── product-card.tsx        # Kartu produk + badge + stagger
│   ├── product-detail.tsx      # Dialog detail + stepper jumlah
│   ├── cart-sheet.tsx          # Keranjang samping + pengingat ongkir
│   ├── checkout-dialog.tsx     # Form checkout + layar sukses
│   ├── order-tracking.tsx      # Lacak pesanan + timeline
│   ├── admin-panel.tsx         # PIN + dasbor + kelola stok/pesanan
│   ├── mobile-nav.tsx          # Tab bawah ala aplikasi
│   ├── visual.tsx              # Visual emoji + gradasi, komponen bintang
│   └── footer.tsx              # Footer + jam operasional + WA
├── hooks/use-mounted.ts        # Anti-hydration flicker
└── lib/
    ├── cart-store.ts           # Zustand persist (localStorage)
    ├── petku-types.ts          # Tipe + konstanta toko (PIN, ongkir)
    ├── format.ts               # Rupiah, tanggal id-ID, diskon, link WA
    └── db.ts                   # Koneksi Prisma
```

---

## 🔌 API Endpoints

| Metode | Endpoint | Fungsi |
|--------|----------|--------|
| `GET` | `/api/categories` | Semua kategori + jumlah produk |
| `GET` | `/api/products?q=&category=&sort=&featured=` | Katalog: cari (`q`), filter kategori, urutkan `sold`/`rating`/`price-asc`/`price-desc`/`newest`, filter unggulan |
| `PATCH` | `/api/products/[id]` | Atur ulang stok (0–9999, divalidasi server) |
| `POST` | `/api/orders` | Buat pesanan: validasi lengkap, cek stok, **transaksi atomik** kurangi stok + tambah `sold`, hasilkan kode `PK-YYMMDD-XXXX` |
| `GET` | `/api/orders?phone=…` / `?code=…` | Lacak pesanan (tanpa parameter = semua pesanan untuk admin) |
| `PATCH` | `/api/orders/[id]` | Ubah status; bila `DIBATALKAN` stok otomatis dikembalikan dalam transaksi |
| `GET` | `/api/admin/stats` | Total pesanan, pendapatan, antrean, stok menipis (≤20), 5 pesanan terbaru |

---

## 🗄️ Skema Database (Prisma)

```
Category 1──* Product 1──* OrderItem *──1 Order
```

| Model | Field Penting |
|-------|---------------|
| **Category** | `slug` unik, `name`, `emoji` |
| **Product** | `name`, `brand`, `price`, `originalPrice` (untuk diskon), `stock`, `weight`, `emoji`, `color` (gradasi), `rating`, `sold`, `featured`, `description` |
| **Order** | `code` unik, data pembeli, `paymentMethod`, `subtotal`, `shippingCost`, `total`, `status` (`PENDING→DIPROSES→DIKIRIM→SELESAI` / `DIBATALKAN`) |
| **OrderItem** | Snapshot item (nama, emoji, brand, harga saat dibeli) — riwayat tetap akurat walau produk berubah |

---

## 🚀 Cara Menjalankan

```bash
# 1. Pasang dependensi
bun install          # atau: npm install

# 2. Siapkan database (SQLite otomatis + isi 35 produk contoh)
bun run db:push
bun run db:generate

# 3. Jalankan mode pengembangan
bun run dev          # → http://localhost:3000

# 4. Build produksi
bun run build && bun run start
```

> 💡 Skrip seed tersedia di `scripts/seed.ts` untuk mengisi ulang data contoh.

---

## ⚙️ Konfigurasi Cepat

Semua konstanta toko ada di **`src/lib/petku-types.ts`**:

```ts
export const FREE_SHIPPING_MIN = 200_000;   // Minimal belanja gratis ongkir
export const SHIPPING_COST     = 15_000;    // Ongkir standar
export const ADMIN_PIN         = "petku2026"; // PIN masuk dasbor admin
```

Nomor WhatsApp CS diatur di `src/lib/format.ts` → `waLink("6281234567890", …)` (dipakai footer, checkout & konfirmasi).

---

## 📱 Responsif Semua Perangkat

| Perangkat | Penyesuaian |
|-----------|-------------|
| 📱 HP (< 768px) | Grid 2 kolom, pencarian baris khusus, **tab navigasi bawah 5 menu** dengan badge keranjang, dialog full-width |
| 📲 Tablet (≥ 640px) | Grid 3 kolom, form checkout 2 kolom |
| 💻 Desktop (≥ 768px) | Grid 4 kolom, nav lengkap di header, panel keranjang 28rem, ilustrasi emoji hero tampil |

---

## ♿ Aksesibilitas & 🔒 Keamanan

**Aksesibilitas**
- Semua tombol ber-`aria-label` bermakna ("Tambah Whiskas ke keranjang").
- Chip filter memakai `aria-pressed`, tab aktif `aria-current="page"`, kartu produk bisa dinavigasi keyboard (`Tab` + `Enter`).
- Angka jumlah pakai `aria-live="polite"`; judul dialog tersembunyi tetap terbaca pembaca layar (`sr-only`).
- Ring fokus oranye jelas di semua elemen interaktif (`focus-visible`).

**Keamanan & Integritas Data**
- 🛡️ **Harga dihitung ulang di server** — harga dari browser tidak pernah dipercaya.
- 🛡️ Cek stok server-side sebelum order; kurang stok → error 409 dengan nama produk.
- 🛡️ Transaksi Prisma atomik: pesanan + pengurangan stok sukses semua atau gagal semua.
- 🛡️ Validasi input ganda (client + server), whitelist metode pembayaran, batas qty 1–99.

**Performa**
- *Debounce* pencarian 350 ms + `AbortController` membatalkan request usang.
- Grid terbatas 100 produk per query; agregasi statistik paralel (`Promise.all`).

---


---

## 🧠 PetKu Pintar — 5 Fitur yang Tidak Ada di Toko Lain

| # | Fitur | Cara Kerja |
|---|-------|-----------|
| 1 | **🐶 Dr. Pipo — Asisten Gizi AI** | Maskot corgi melayang di sudut layar. Klik → chat AI yang membaca katalog live (35 produk) dan merekomendasikan makanan sesuai jenis, umur, bobot & budget anabulmu. Hasil rekomendasi muncul sebagai kartu produk yang bisa langsung dibuka. Punya fallback rule-based bila AI tumbang — tidak pernah mati. |
| 2 | **🧮 Kalkulator Porsi + Harga-per-Hari** | Di setiap detail produk: atur jenis hewan, dewasa/anak, dan bobot → dapat porsi gram/hari, durasi kemasan habis, dan **biaya per hari** (mis. Whiskas 7 kg = Rp2.716/hari — mahal terasa jadi murah). Norma gizi: anjing 20 g/kg, kucing 15 g/kg, anak ×1,6. |
| 3 | **🗂️ Pantry Anabul** | Catat kemasan yang sedang dibuka dari kalkulator → ring countdown SVG beranimasi menghitung sisa hari otomatis. ≤7 hari: kartu berdenyut amber + alarm muncul di beranda. Tombol **Beli Lagi** sekali klik langsung masuk keranjang. Retensi pelanggan jalan sendiri. |
| 4 | **🐖 Mode Hemat** | Tulis anggaran + profil anabul → algoritma greedy *gram-per-rupiah* menyusun kombinasi kemasan (hormati stok, hitung ongkir) dengan **hari makan maksimal**, lalu membandingkannya dengan pilihan paling boros: "Mode Hemat dapat 12,1× lebih lama!". |
| 5 | **🎭 Maskot Reaktif** | Pipo bereaksi pada setiap aksi: senang saat tambah keranjang, lompat gembira saat checkout sukses, menggumulkan saran tiap 26 detik. Semua lewat `CustomEvent("petku:pipo")` — komponen tidak saling kenal, arsitektur tetap bersih. |

**File baru:** `src/lib/petku-smart.ts` (mesin gizi & optimizer) · `src/lib/pantry-store.ts` (Zustand persist) · `src/app/api/ai/advisor/route.ts` (z-ai-web-dev-sdk, katalog live, fallback) · `src/components/petku/{mascot,ai-advisor,feeding-calculator,pantry,smart-budget,smart-hub}.tsx`

**Navigasi:** tab baru **Pantry** & **Mode Hemat** di header desktop + tab bawah mobile (6 tab).


<div align="center">

**PetKu** — Dibuat dengan 🧡 untuk para *pawrents* Indonesia.

*Gizi terbaik untuk sahabat kecilmu.* 🐾

</div>
