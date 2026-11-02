# 📋 CHANGELOG — PetKu

Semua perubahan penting pada proyek **PetKu** tercatat di file ini.
Format mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/).

---

## [1.1.0] — PetKu Pintar

> Rilis besar: **5 fitur cerdas** yang mengubah PetKu dari toko online biasa menjadi asisten perawatan hewan peliharaan. Nama internal: **PetKu Pintar**.

### ✨ Ditambahkan

#### 1. 🐶 Dr. Pipo — Asisten Gizi AI (`mascot.tsx`, `ai-advisor.tsx`, `api/ai/advisor/route.ts`)
- Maskot corgi melayang di sudut layar, bisa diklik untuk membuka panel chat AI.
- AI membaca **katalog live** (35 produk dari database) — bukan data statis — lalu merekomendasikan makanan sesuai jenis hewan, umur, bobot, kondisi, dan budget pengguna.
- Hasil rekomendasi muncul sebagai **kartu produk yang bisa langsung dibuka** dari dalam chat.
- Dilengkapi **fallback rule-based** (`petku-smart.ts`): bila API AI gagal/timeout, rekomendasi tetap keluar dari mesin aturan gizi lokal. Fitur ini **tidak pernah mati**.
- Endpoint baru: `POST /api/ai/advisor` (menggunakan `z-ai-web-dev-sdk`, prompt bahasa Indonesia, jawaban JSON terstruktur).

#### 2. 🧮 Kalkulator Porsi + Harga per Hari (`feeding-calculator.tsx`)
- Tersedia di **setiap detail produk**: atur jenis hewan, dewasa/anak, dan bobot → dapat:
  - porsi yang disarankan (gram/hari),
  - estimasi durasi kemasan habis,
  - **biaya per hari** (mis. Whiskas 7 kg ≈ Rp2.716/hari) — biaya besar terasa jadi murah, memancing konversi.
- Norma gizi pada `petku-smart.ts`: anjing 20 g/kg, kucing 15 g/kg, anak hewan ×1,6, plus faktor bobot kemasan yang di-parse otomatis dari label ("1,2 kg" / "500 g" / "300 ml").

#### 3. 🗂️ Pantry Anabul (`pantry.tsx`, `pantry-store.ts`)
- Pengguna bisa mencatat kemasan yang **sedang dibuka** (langsung dari kalkulator porsi).
- Ring countdown SVG beranimasi menghitung **sisa hari stok otomatis**.
- Stok ≤ 7 hari: kartu berdenyut amber + **alarm muncul di beranda**.
- Tombol **"Beli Lagi"** sekali klik → produk langsung masuk keranjang. Retensi pelanggan berjalan sendiri.
- State disimpan lokal (Zustand + persist) sehingga tetap ada setelah browser ditutup.

#### 4. 🐖 Mode Hemat (`smart-budget.tsx`)
- Pengguna menulis **anggaran + profil anabul** → algoritma greedy *gram-per-rupiah* menyusun **kombinasi kemasan** (menghormati stok, menghitung ongkir) dengan **hari makan maksimal**.
- Hasil dibandingkan dengan pilihan paling boros, mis: *"Mode Hemat dapat 12,1× lebih lama!"* — cerdas, transparan, dan persuasif.

#### 5. 🎭 Maskot Reaktif (`mascot.tsx`, terintegrasi lintas komponen)
- Pipo bereaksi pada setiap aksi: senang saat produk masuk keranjang, lompat gembira saat checkout sukses, menggumulkan saran tiap 26 detik.
- Komunikasi antar komponen lewat `CustomEvent("petku:pipo")` — komponen tidak saling kenal, arsitektur tetap bersih.

#### 6. 🧠 PetKu Smart Engine (`lib/petku-smart.ts`)
- Mesin gizi & optimasi belanja bersama yang dipakai oleh Kalkulator Porsi, Pantry, Mode Hemat, dan AI Advisor: `parseGrams()`, hitung porsi harian, durasi kemasan, biaya/hari, hingga pemilihan kombinasi termurah-per-gram.

#### 7. 🏠 Smart Hub (`smart-hub.tsx`)
- Pusat navigasi satu layar untuk semua fitur pintar (Pantry, Mode Hemat, AI Advisor) — masuk sebagai view baru `hub`.

### 🔧 Diubah

| File | Perubahan |
|------|-----------|
| `src/app/page.tsx` | Integrasi Smart Hub, alarm Pantry di beranda, dan wiring maskot (38 baris berubah). |
| `src/components/petku/header.tsx` | Tab baru **Pantry** & **Mode Hemat** di navigasi desktop. |
| `src/components/petku/mobile-nav.tsx` | Navigasi bawah mobile diperluas menjadi **6 tab**. |
| `src/components/petku/view-types.ts` | Tipe view baru: `hub`, `pantry`, `hemat`. |
| `src/components/petku/product-detail.tsx` | Kalkulator porsi tertanam di setiap halaman produk. |
| `src/components/petku/checkout-dialog.tsx` | Trigger reaksi maskot saat checkout sukses. |
| `README.md` | Dokumentasi fitur "PetKu Pintar" + peta file baru. |

### 🧪 Kualitas

- ✅ `tsc --noEmit` lolos untuk seluruh kode `src/` (tanpa error tipe).
- ✅ Dev server berjalan normal; endpoint katalog & kategori `200 OK`.
- ✅ Tanpa dependensi baru — semua fitur berjalan dengan stack yang sudah ada.
- ✅ Tanpa placeholder/TODO tersisa; teks seluruhnya berbahasa Indonesia.
- ✅ Fitur AI memiliki fallback rule-based sehingga tetap berfungsi offline/tanpa kunci API.

### 📂 Ringkasan File

**Baru (9):** `lib/petku-smart.ts`, `lib/pantry-store.ts`, `api/ai/advisor/route.ts`, `components/petku/{mascot,ai-advisor,feeding-calculator,pantry,smart-budget,smart-hub}.tsx`
**Diubah (7):** `app/page.tsx`, `components/petku/{header,mobile-nav,product-detail,checkout-dialog}.tsx`, `components/petku/view-types.ts`, `README.md`

---

## [1.0.0] — Rilis Awal

- Katalog produk (35 produk, 6 kategori) dengan Prisma + SQLite.
- Keranjang belanja & checkout via WhatsApp.
- Pelacakan pesanan, panel admin dengan statistik penjualan.
- Halaman detail produk dengan galeri & ulasan.
- Navigasi mobile bottom-tab dan header desktop responsif.
