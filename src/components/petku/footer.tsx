"use client";

import { PawPrint, MessageCircle, MapPin, Clock } from "lucide-react";
import { waLink } from "@/lib/format";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-orange-100 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-primary flex h-9 w-9 items-center justify-center rounded-xl">
              <PawPrint className="size-5 text-white" />
            </span>
            <span className="text-xl font-extrabold text-orange-600">PetKu</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Toko makanan hewan online terlengkap — dari anjing, kucing, burung,
            ikan, sampai reptil. Gizi terbaik untuk sahabat kecilmu.
          </p>
        </div>

        <nav aria-label="Tautan cepat">
          <h3 className="mb-3 text-sm font-extrabold tracking-wide uppercase">
            Layanan
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>🚚 Gratis ongkir min. Rp200rb</li>
            <li>💳 COD, Transfer & E-Wallet</li>
            <li>🔄 Garansi produk rusak diganti</li>
            <li>💬 Konsultasi gizi gratis</li>
          </ul>
        </nav>

        <div>
          <h3 className="mb-3 text-sm font-extrabold tracking-wide uppercase">
            Jam Operasional
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Clock className="size-4 text-orange-500" /> Senin–Sabtu: 08.00–21.00
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 text-orange-500" /> Minggu: 09.00–17.00
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-orange-500" /> Jakarta, Indonesia
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-extrabold tracking-wide uppercase">
            Hubungi Kami
          </h3>
          <a
            href={waLink(
              "6281234567890",
              "Halo PetKu! Saya mau tanya-tanya produk makanan hewan 🐾"
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-600"
          >
            <MessageCircle className="size-4" />
            WhatsApp: 0812-3456-7890
          </a>
          <p className="mt-3 text-xs text-muted-foreground">
            Pembayaran: 💵 COD · 🏦 Transfer · 📱 DANA/OVO/GoPay
          </p>
        </div>
      </div>

      <div className="border-t border-orange-100 py-4">
        <p className="text-center text-xs text-muted-foreground">
          © {year} PetKu — Makanan Hewan Lengkap. Dibuat dengan 🧡 untuk para pawrents Indonesia.
        </p>
      </div>
    </footer>
  );
}
