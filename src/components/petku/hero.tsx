"use client";

import { motion } from "framer-motion";
import { BadgePercent, Headset, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: Truck, title: "Gratis Ongkir", desc: "Min. belanja Rp200rb" },
  { icon: ShieldCheck, title: "100% Original", desc: "Distributor resmi" },
  { icon: BadgePercent, title: "Harga Grosir", desc: "Hemat kemasan besar" },
  { icon: Headset, title: "CS Siaga", desc: "Balas cepat tiap hari" },
];

export function Hero({ onShop }: { onShop: () => void }) {
  return (
    <section className="bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 text-white">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-10 sm:pt-12 sm:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]"
        >
          <div>
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
              🐾 TOKO MAKANAN HEWAN TERLENGKAP
            </span>
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Gizi Terbaik untuk
              <br />
              Sahabat Kecilmu
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-orange-50 sm:text-base">
              Makanan anjing, kucing, burung, ikan, hamster sampai reptil —
              semua brand original, harga bersahabat, dan diantar cepat ke
              rumahmu.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={onShop}
                className="h-12 rounded-xl bg-white px-6 text-base font-bold text-orange-600 shadow-lg hover:bg-orange-50"
              >
                🛒 Mulai Belanja
              </Button>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur">
                  ⭐ 4.9 (12rb+ ulasan)
                </span>
                <span className="rounded-lg bg-white/15 px-3 py-2 backdrop-blur">
                  🚚 Kirim hari ini
                </span>
              </div>
            </div>
          </div>

          {/* Ilustrasi emoji */}
          <div className="hidden justify-center md:flex" aria-hidden="true">
            <div className="grid grid-cols-2 gap-3">
              {[
                { e: "🐕", r: "rotate-3" },
                { e: "🐈", r: "-rotate-3" },
                { e: "🐦", r: "-rotate-6" },
                { e: "🐠", r: "rotate-6" },
                { e: "🐹", r: "rotate-2" },
                { e: "🦎", r: "-rotate-2" },
              ].map((x, i) => (
                <motion.div
                  key={x.e}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-5xl shadow-inner backdrop-blur ${x.r}`}
                >
                  {x.e}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Keunggulan */}
      <div className="border-t border-white/20">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-4 sm:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <b.icon className="size-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-xs font-bold sm:text-sm">{b.title}</span>
                <span className="block text-[11px] text-orange-50">{b.desc}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
