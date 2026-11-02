"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock, PackageOpen, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { pantryDaysLeft, pantryRemainingRatio, usePantry, type PantryItem } from "@/lib/pantry-store";
import { formatDays, PET_META } from "@/lib/petku-smart";
import { formatRupiah } from "@/lib/format";
import { useCart } from "@/lib/cart-store";
import { pipoReact } from "./mascot";
import type { ProductData } from "@/lib/petku-types";
import { cn } from "@/lib/utils";

/* Ring countdown SVG beranimasi */
function CountdownRing({ item }: { item: PantryItem }) {
  const ratio = pantryRemainingRatio(item);
  const daysLeft = pantryDaysLeft(item);
  const R = 34;
  const C = 2 * Math.PI * R;
  const color = daysLeft <= 0 ? "#dc2626" : daysLeft <= 7 ? "#d97706" : ratio <= 0.25 ? "#ea580c" : "#059669";

  return (
    <div className="relative size-[86px] shrink-0">
      <svg viewBox="0 0 80 80" className="size-full -rotate-90">
        <circle cx="40" cy="40" r={R} fill="none" stroke="#f1f5f9" strokeWidth="8" />
        <motion.circle
          cx="40"
          cy="40"
          r={R}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - ratio) }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg leading-none font-extrabold" style={{ color }}>
          {daysLeft}
        </span>
        <span className="text-[9px] font-bold tracking-wide text-muted-foreground uppercase">
          hari lagi
        </span>
      </div>
    </div>
  );
}

export function Pantry() {
  const { items, remove, refill } = usePantry();
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.open);
  const [allProducts, setAllProducts] = useState<ProductData[] | null>(null);

  // Muat katalog sekali untuk fitur "Beli Lagi"
  useEffect(() => {
    fetch("/api/products?category=semua&sort=sold")
      .then((r) => r.json())
      .then((d) => setAllProducts(d.products ?? []))
      .catch(() => setAllProducts([]));
  }, []);

  const sorted = useMemo(
    () => [...items].sort((a, b) => pantryDaysLeft(a) - pantryDaysLeft(b)),
    [items]
  );
  const urgent = sorted.filter((i) => pantryDaysLeft(i) <= 7);
  const totalPerDay = sorted.reduce((s, i) => s + i.dailyGrams, 0);
  const totalCostPerDay = sorted.reduce(
    (s, i) => s + (i.packGrams && i.packGrams > 0 ? i.price / (i.packGrams / i.dailyGrams) : 0),
    0
  );

  function reorder(item: PantryItem) {
    if (!allProducts) return;
    const p = allProducts.find((x) => x.id === item.productId);
    if (!p || p.stock <= 0) {
      toast.error("Produk ini sedang tidak tersedia, coba cari yang serupa ya 🙏");
      return;
    }
    addItem(
      {
        productId: p.id,
        name: p.name,
        brand: p.brand,
        emoji: p.emoji,
        color: p.color,
        weight: p.weight,
        price: p.price,
        stock: p.stock,
      },
      1
    );
    openCart();
    toast.success(`🛒 ${p.name} masuk keranjang — isi ulang ${item.petName}!`);
    pipoReact("happy", "Isi ulang dipesan! Guk guk 🐶");
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto mb-5 flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-amber-50 text-5xl shadow-inner"
        >
          🗂️
        </motion.div>
        <h2 className="text-xl font-extrabold">Pantry Anabul masih kosong</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Catat kemasan makanan yang sedang dibuka: PetKu akan <b>menghitung sisa hari</b>{" "}
          otomatis dan <b>mengingatkanmu sebelum habis</b> — jadi anabul tidak pernah kelaparan
          mendadak.
        </p>
        <div className="mt-6 rounded-2xl border border-dashed border-orange-300 bg-orange-50/60 p-4 text-left text-sm">
          <p className="mb-2 font-bold text-orange-800">Cara mulai 🐾</p>
          <ol className="list-inside list-decimal space-y-1.5 text-muted-foreground">
            <li>Buka produk apa pun di katalog</li>
            <li>Gulir ke kotak hijau “Kalkulator Porsi”</li>
            <li>Atur bobot anabul → tekan “Catat ke Pantry Anabul”</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6">
      {/* Header */}
      <div>
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          🗂️ Pantry Anabul
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pantau sisa makanan tiap anabul — hitungan mundur otomatis dari porsi harian.
        </p>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-orange-100 bg-white p-3 text-center shadow-sm">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Anabul tercatat</p>
          <p className="text-base font-extrabold text-orange-600 sm:text-lg">{items.length}</p>
        </div>
        <div className="rounded-2xl border border-orange-100 bg-white p-3 text-center shadow-sm">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Total porsi</p>
          <p className="text-base font-extrabold text-orange-600 sm:text-lg">{totalPerDay} g/hari</p>
        </div>
        <div className="rounded-2xl border border-orange-100 bg-white p-3 text-center shadow-sm">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Biaya rata²</p>
          <p className="text-base font-extrabold text-amber-600 sm:text-lg">
            {formatRupiah(Math.round(totalCostPerDay))}
            <span className="text-[10px] font-bold text-muted-foreground">/hari</span>
          </p>
        </div>
      </div>

      {/* Peringatan proaktif */}
      {urgent.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex items-start gap-3 rounded-2xl border p-3.5",
            urgent.some((i) => pantryDaysLeft(i) <= 0)
              ? "animate-pulse border-red-200 bg-red-50"
              : "border-amber-200 bg-amber-50"
          )}
          role="alert"
        >
          <span className="text-2xl">{urgent.some((i) => pantryDaysLeft(i) <= 0) ? "🚨" : "⏰"}</span>
          <div className="text-sm">
            <p className="font-extrabold text-amber-900">
              {urgent.some((i) => pantryDaysLeft(i) <= 0)
                ? "Makanan sudah habis hari ini!"
                : `Makanan ${urgent.map((u) => u.petName).join(" & ")} mau habis dalam ${Math.min(...urgent.map(pantryDaysLeft))} hari`}
            </p>
            <p className="text-amber-800">
              Tekan <b>Beli Lagi</b> di kartu di bawah — sekali klik langsung masuk keranjang.
            </p>
          </div>
        </motion.div>
      )}

      {/* Kartu pantry */}
      <div className="grid gap-3 sm:grid-cols-2">
        {sorted.map((item, idx) => {
          const daysLeft = pantryDaysLeft(item);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.3) }}
              className={cn(
                "rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md",
                daysLeft <= 0
                  ? "border-red-200"
                  : daysLeft <= 7
                    ? "animate-pulse border-amber-300"
                    : "border-orange-100"
              )}
            >
              <div className="flex items-center gap-3.5">
                <CountdownRing item={item} />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold text-orange-500">
                    {PET_META[item.petType].emoji} {item.petName}
                    <span className="text-muted-foreground">· {PET_META[item.petType].label}</span>
                  </p>
                  <p className="truncate text-sm font-extrabold">
                    {item.productEmoji} {item.productName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {item.dailyGrams} g/hari
                    {item.petWeightKg ? ` · ${item.petWeightKg} kg` : ""} ·{" "}
                    {Math.round(item.packGrams / 100) / 10} kg/kemasan
                  </p>
                  <p className="mt-1 text-xs font-bold text-emerald-700">
                    {daysLeft > 0
                      ? `Sisa stok ${formatDays(daysLeft)}`
                      : "Stok habis — saatnya belanja!"}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  onClick={() => reorder(item)}
                  disabled={!allProducts}
                  className="h-9 flex-1 rounded-xl bg-orange-500 text-xs font-bold hover:bg-orange-600"
                  aria-label={`Beli lagi ${item.productName} untuk ${item.petName}`}
                >
                  <PackageOpen className="size-4" />
                  Beli Lagi
                </Button>
                <Button
                  onClick={() => {
                    refill(item.id);
                    toast.success(`${PET_META[item.petType].emoji} Kemasan baru ${item.petName} dicatat!`);
                    pipoReact("celebrate", "Stok baru! Enak nih 🎉");
                  }}
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-xl border-orange-200"
                  aria-label={`Tandai kemasan baru untuk ${item.petName}`}
                >
                  <RotateCcw className="size-4" />
                </Button>
                <Button
                  onClick={() => {
                    remove(item.id);
                    toast("Catatan dihapus");
                  }}
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-xl border-red-100 text-red-500 hover:bg-red-50"
                  aria-label={`Hapus catatan ${item.petName}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="flex items-center justify-center gap-1.5 pb-2 text-center text-xs text-muted-foreground">
        <CalendarClock className="size-3.5" />
        Penghitungan berdasarkan porsi harian di Kalkulator — sesuaikan bila anabul sedang diet.
      </p>
    </div>
  );
}
