"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Check, PiggyBank, Sparkles, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-store";
import { formatRupiah } from "@/lib/format";
import { FREE_SHIPPING_MIN } from "@/lib/petku-types";
import { pipoReact } from "./mascot";
import {
  computeDailyGrams,
  formatDays,
  optimizeBudget,
  petTypesForCategory,
  PET_META,
  type BudgetResult,
  type PetType,
} from "@/lib/petku-smart";
import type { CategoryData, ProductData } from "@/lib/petku-types";
import { cn } from "@/lib/utils";

const BUDGET_PRESETS = [100_000, 200_000, 350_000, 500_000];

export function SmartBudget({
  products,
  categories,
  loading,
}: {
  products: ProductData[];
  categories: CategoryData[];
  loading: boolean;
}) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.open);

  const catsWithProducts = categories.filter((c) => c.productCount > 0);
  const [slug, setSlug] = useState(catsWithProducts[0]?.slug ?? "makanan-kucing");
  const types = petTypesForCategory(slug);
  const [petType, setPetType] = useState<PetType>(types[0]);
  const meta = PET_META[petType];
  const [weight, setWeight] = useState(meta.defaultWeightKg);
  const [age, setAge] = useState<"dewasa" | "anak">("dewasa");
  const [budget, setBudget] = useState(200_000);
  const [result, setResult] = useState<BudgetResult | null>(null);

  const isWeighed = Boolean(meta.gramsPerKgPerDay);
  const dailyGrams = computeDailyGrams(petType, isWeighed ? weight : null, age);

  function switchCategory(s: string) {
    setSlug(s);
    const t = petTypesForCategory(s)[0];
    setPetType(t);
    setWeight(PET_META[t].defaultWeightKg);
    setResult(null);
  }

  function switchType(t: PetType) {
    setPetType(t);
    setWeight(PET_META[t].defaultWeightKg);
    setResult(null);
  }

  const run = () => {
    const res = optimizeBudget(products, slug, budget, dailyGrams);
    setResult(res);
    if (res.ok) {
      pipoReact("celebrate", `Wih! ${res.totalDays} hari makan dari ${formatRupiah(budget)} 🤩`);
    } else {
      pipoReact("think", "Budgetnya kurang guk guk… coba naikin sedikit 🐶");
    }
  };

  const addAll = () => {
    if (!result?.ok) return;
    for (const pick of result.picks) {
      const p = pick.product;
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
        pick.qty
      );
    }
    openCart();
    toast.success(`🛒 ${result.picks.length} produk hasil optimasi masuk keranjang!`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-6">
      {/* Header */}
      <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-amber-50 to-white p-5">
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <PiggyBank className="size-6 text-orange-500" />
          Mode Hemat
        </h2>
        <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Ceritakan anabulmu + anggaranmu — mesin optimasi PetKu akan menyusun{" "}
          <b>kombinasi kemasan dengan hari makan maksimal</b> dari kategori pilihanmu, lengkap
          dengan hitungan ongkir. Tidak ada toko lain yang melakukan ini.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          {/* Langkah 1: kategori */}
          <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
            <p className="mb-2.5 text-sm font-extrabold">
              <span className="mr-1.5 inline-flex size-5 items-center justify-center rounded-full bg-orange-500 text-[11px] text-white">1</span>
              Hewan apa yang mau kamu mandiri-makani?
            </p>
            <div className="flex flex-wrap gap-1.5">
              {catsWithProducts.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => switchCategory(c.slug)}
                  aria-pressed={slug === c.slug}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95",
                    slug === c.slug
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-orange-50 text-orange-700 ring-1 ring-orange-200 hover:bg-orange-100"
                  )}
                >
                  {c.emoji} {c.name}
                </button>
              ))}
            </div>
            {types.length > 1 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-dashed border-orange-100 pt-2.5">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => switchType(t)}
                    aria-pressed={petType === t}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold transition-all active:scale-95",
                      petType === t
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-100"
                    )}
                  >
                    {PET_META[t].emoji} {PET_META[t].label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Langkah 2: profil */}
          <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
            <p className="mb-2.5 text-sm font-extrabold">
              <span className="mr-1.5 inline-flex size-5 items-center justify-center rounded-full bg-orange-500 text-[11px] text-white">2</span>
              Profil makan
            </p>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <div className="flex gap-1" role="group" aria-label="Umur hewan">
                {(["dewasa", "anak"] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAge(a)}
                    aria-pressed={age === a}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95",
                      age === a
                        ? "bg-orange-500 text-white shadow-sm"
                        : "bg-orange-50 text-orange-700 ring-1 ring-orange-200 hover:bg-orange-100"
                    )}
                  >
                    {a === "dewasa" ? "Dewasa" : "Anak (×1,6 porsi)"}
                  </button>
                ))}
              </div>
              {isWeighed && (
                <span className="ml-auto rounded-lg bg-muted px-2.5 py-1 text-xs font-extrabold">
                  {weight.toLocaleString("id-ID")} kg
                </span>
              )}
            </div>
            {isWeighed && (
              <input
                type="range"
                min={meta.minWeightKg}
                max={meta.maxWeightKg}
                step={meta.maxWeightKg <= 1 ? 0.05 : meta.maxWeightKg <= 12 ? 0.5 : 1}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-orange-200 accent-orange-600"
                aria-label={`Bobot ${PET_META[petType].label}`}
              />
            )}
            <p className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
              🍚 Porsi hitungan: <b>{dailyGrams} gram/hari</b> — {PET_META[petType].note}
            </p>
          </div>

          {/* Langkah 3: budget */}
          <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
            <p className="mb-2.5 text-sm font-extrabold">
              <span className="mr-1.5 inline-flex size-5 items-center justify-center rounded-full bg-orange-500 text-[11px] text-white">3</span>
              Berapa anggaranmu?
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50/50 px-3 py-2">
                <span className="text-sm font-bold text-orange-500">Rp</span>
                <input
                  type="number"
                  min={10_000}
                  max={10_000_000}
                  step={10_000}
                  value={budget}
                  onChange={(e) => {
                    setBudget(Math.max(0, Math.min(10_000_000, Number(e.target.value) || 0)));
                    setResult(null);
                  }}
                  className="w-28 bg-transparent text-base font-extrabold outline-none"
                  aria-label="Anggaran dalam rupiah"
                />
              </div>
              {BUDGET_PRESETS.map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setBudget(b);
                    setResult(null);
                  }}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95",
                    budget === b
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-orange-50 text-orange-700 ring-1 ring-orange-200 hover:bg-orange-100"
                  )}
                >
                  {b / 1000}rb
                </button>
              ))}
            </div>
            <Button
              onClick={run}
              disabled={loading}
              className="mt-3.5 h-12 w-full rounded-xl bg-orange-500 text-base font-extrabold shadow-md shadow-orange-200 hover:bg-orange-600"
            >
              <Sparkles className="size-5" />
              Optimalkan Sekarang!
            </Button>
          </div>

          {/* Hasil optimasi */}
          {result && (
            result.ok ? (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-md"
              >
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
                  <p className="text-xs font-bold tracking-wide uppercase opacity-90">Hasil optimasi</p>
                  <p className="mt-1 text-2xl font-extrabold">
                    {formatDays(result.totalDays)} makan
                  </p>
                  <p className="text-sm font-medium opacity-95">
                    cuma dengan {formatRupiah(result.total)}
                    {result.shipping > 0
                      ? ` (termasuk ongkir ${formatRupiah(result.shipping)})`
                      : " — GRATIS ONGKIR 🎉"}
                  </p>
                </div>
                <div className="space-y-2 p-4">
                  {result.picks.map((pick) => (
                    <div key={pick.product.id} className="flex items-center gap-3 rounded-xl bg-muted/50 p-2.5">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-xl shadow-sm">
                        {pick.product.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">{pick.product.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {pick.qty} × {pick.product.weight} · ⭐ {pick.product.rating.toFixed(1)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-orange-600">{formatRupiah(pick.subtotal)}</p>
                        <p className="text-[11px] font-semibold text-emerald-600">± {formatDays(pick.days)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t border-dashed pt-2.5 text-sm">
                    <span className="font-semibold text-muted-foreground">
                      Total barang {formatRupiah(result.goodsTotal)}
                      {result.leftover > 0 ? ` · sisa anggaran ${formatRupiah(result.leftover)}` : ""}
                    </span>
                    <span className="font-extrabold text-emerald-700">± {result.totalDays} hari 🍚</span>
                  </div>
                  {result.multiple !== null && result.multiple > 1.15 && result.worstProduct && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
                      <TrendingDown className="mt-0.5 size-4 shrink-0 text-amber-600" />
                      <span>
                        <b>Fakta seru:</b> dengan anggaran sama, kalau beli{" "}
                        {result.worstProduct.name} saja kamu hanya dapat ± {result.worstDays} hari —
                        Mode Hemat mendapat <b>{result.multiple}× lebih lama</b>!
                      </span>
                    </div>
                  )}
                  <Button
                    onClick={addAll}
                    className="h-12 w-full rounded-xl bg-emerald-600 text-base font-extrabold hover:bg-emerald-700"
                  >
                    <Check className="size-5" />
                    Masukkan Semua ke Keranjang
                  </Button>
                  <p className="text-center text-[11px] text-muted-foreground">
                    💡 {result.goodsTotal < FREE_SHIPPING_MIN
                      ? `Tambah ${formatRupiah(FREE_SHIPPING_MIN - result.goodsTotal)} lagi agar gratis ongkir.`
                      : "Selamat, belanjaanmu bebas ongkir!"}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                😿 {result.reason ?? "Tidak ada kombinasi yang pas."} Kategori ini dimulai dari{" "}
                {formatRupiah(Math.min(...products.filter((p) => p.category.slug === slug).map((p) => p.price)))}.
                Coba naikkan anggaranmu sedikit ya!
              </div>
            )
          )}

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <Calculator className="size-3.5" />
            Optimasi memakai algoritma greedy gram-per-rupiah + cek stok real-time.
          </p>
        </>
      )}
    </div>
  );
}
