/**
 * ═══════════════════════════════════════════════════════════════
 *  PETKU SMART ENGINE — mesin gizi & optimasi belanja
 *  Dipakai bersama oleh: Kalkulator Porsi, Pantry Anabul,
 *  Mode Hemat, dan AI Gizi Advisor.
 * ═══════════════════════════════════════════════════════════════
 */

export type PetType =
  | "anjing"
  | "kucing"
  | "burung"
  | "ikan"
  | "hamster"
  | "kelinci"
  | "reptil";

export type AgeGroup = "dewasa" | "anak";

/** Konversi label kemasan ("1,2 kg" / "500 g" / "300 ml") → gram. null bila tak terbaca. */
export function parseGrams(weight: string): number | null {
  const clean = weight.toLowerCase().replace(/,/g, ".").trim();
  const m = clean.match(/([\d.]+)\s*(kg|g|ml|l)\b/);
  if (!m) return null;
  const value = Number.parseFloat(m[1]);
  if (!Number.isFinite(value) || value <= 0) return null;
  switch (m[2]) {
    case "kg":
      return Math.round(value * 1000);
    case "l":
      return Math.round(value * 1000);
    case "ml":
      return Math.round(value); // ml ≈ gram untuk cairan pakan
    default:
      return Math.round(value);
  }
}

export type PetMeta = {
  label: string;
  emoji: string;
  /** jenis hewan yang bobotnya diinput pengguna (g per kg bobot badan per hari) */
  gramsPerKgPerDay?: number;
  /** jenis hewan porsi tetap (gram per hari) */
  fixedGramsPerDay?: number;
  defaultWeightKg: number;
  minWeightKg: number;
  maxWeightKg: number;
  note: string;
};

export const PET_META: Record<PetType, PetMeta> = {
  anjing: {
    label: "Anjing",
    emoji: "🐕",
    gramsPerKgPerDay: 20,
    defaultWeightKg: 10,
    minWeightKg: 1,
    maxWeightKg: 60,
    note: "Patokan peletakan kering dewasa ± 2% bobot badan per hari.",
  },
  kucing: {
    label: "Kucing",
    emoji: "🐈",
    gramsPerKgPerDay: 15,
    defaultWeightKg: 4,
    minWeightKg: 1,
    maxWeightKg: 12,
    note: "Kucing dewasa ± 15 g per kg bobot badan per hari.",
  },
  burung: {
    label: "Burung",
    emoji: "🐦",
    fixedGramsPerDay: 15,
    defaultWeightKg: 0.1,
    minWeightKg: 0.02,
    maxWeightKg: 1.5,
    note: "Lovebird / parkit / kutilang ± 15 g seed per hari.",
  },
  ikan: {
    label: "Ikan",
    emoji: "🐠",
    fixedGramsPerDay: 8,
    defaultWeightKg: 0,
    minWeightKg: 0,
    maxWeightKg: 0,
    note: "Akuarium ± 8 g voer per hari (2-3 kali pakan kecil).",
  },
  hamster: {
    label: "Hamster",
    emoji: "🐹",
    fixedGramsPerDay: 15,
    defaultWeightKg: 0.1,
    minWeightKg: 0.02,
    maxWeightKg: 0.3,
    note: "Hamster dewasa ± 15 g seed mix per hari.",
  },
  kelinci: {
    label: "Kelinci",
    emoji: "🐇",
    fixedGramsPerDay: 120,
    defaultWeightKg: 2,
    minWeightKg: 0.5,
    maxWeightKg: 8,
    note: "Kelinci dewasa ± 120 g pellet per hari (plus jerami tak terbatas).",
  },
  reptil: {
    label: "Reptil",
    emoji: "🦎",
    fixedGramsPerDay: 25,
    defaultWeightKg: 0.3,
    minWeightKg: 0.05,
    maxWeightKg: 20,
    note: "Kura / iguana kecil ± 25 g pakan kering per hari.",
  },
};

/** Kategori produk → pilihan jenis hewan yang relevan. */
export function petTypesForCategory(slug: string): PetType[] {
  switch (slug) {
    case "makanan-anjing":
      return ["anjing"];
    case "makanan-kucing":
      return ["kucing"];
    case "makanan-burung":
      return ["burung"];
    case "makanan-ikan":
      return ["ikan"];
    case "hamster-kelinci":
      return ["hamster", "kelinci"];
    case "reptil":
      return ["reptil"];
    default:
      return ["anjing", "kucing", "burung", "ikan", "hamster", "kelinci", "reptil"];
  }
}

/** Porsi harian (gram/hari). Anak hewan makan lebih banyak (± 1,6×). */
export function computeDailyGrams(
  petType: PetType,
  petWeightKg: number | null,
  age: AgeGroup = "dewasa"
): number {
  const meta = PET_META[petType];
  let grams: number;
  if (meta.gramsPerKgPerDay && petWeightKg && petWeightKg > 0) {
    grams = meta.gramsPerKgPerDay * petWeightKg;
  } else if (meta.fixedGramsPerDay) {
    grams = meta.fixedGramsPerDay;
  } else {
    grams = 50; // fallback aman
  }
  if (age === "anak") grams *= 1.6;
  return Math.round(grams);
}

export type FeedingEstimate = {
  dailyGrams: number;
  packGrams: number | null;
  packDays: number | null;
  costPerDay: number | null;
};

/** Estimasi lengkap satu kemasan: porsi/hari, tahan berapa hari, biaya per hari. */
export function estimateFeeding(
  price: number,
  weight: string,
  petType: PetType,
  petWeightKg: number | null,
  age: AgeGroup = "dewasa"
): FeedingEstimate {
  const dailyGrams = computeDailyGrams(petType, petWeightKg, age);
  const packGrams = parseGrams(weight);
  const packDays = packGrams && packGrams > 0 ? Math.floor(packGrams / dailyGrams) : null;
  const costPerDay = packDays && packDays >= 1 ? Math.round(price / packDays) : null;
  return { dailyGrams, packGrams, packDays, costPerDay };
}

export function formatDays(days: number): string {
  if (days >= 60) {
    const months = Math.floor(days / 30);
    return `± ${months} bulan`;
  }
  if (days >= 30) {
    const months = Math.floor(days / 30);
    const rest = days % 30;
    return rest > 0 ? `± ${months} bln ${rest} hr` : `± ${months} bulan`;
  }
  return `${days} hari`;
}

/** Etiket pintar harga per hari untuk kartu produk. */
export function smartBadgeLabel(price: number, weight: string, slug: string): string | null {
  const types = petTypesForCategory(slug);
  const est = estimateFeeding(price, weight, types[0], null);
  if (!est.costPerDay || est.costPerDay <= 0) return null;
  return `± ${formatRupiahShort(est.costPerDay)}/hari`;
}

function formatRupiahShort(value: number): string {
  if (value >= 1000) {
    const rb = value / 1000;
    return `Rp${rb % 1 === 0 ? rb.toFixed(0) : rb.toFixed(1)}rb`;
  }
  return `Rp${value}`;
}

/* ═══════════════════════════════════════════════════════════════
 *  MODE HEMAT — optimizer "budget → hari makan maksimal"
 *  Greedy knapsack: pilih kemasan dengan gram termurah per rupiah,
 *  hormati stok, hitung ongkir, lalu bandingkan dengan pilihan
 *  paling boros di kategori yang sama.
 * ═══════════════════════════════════════════════════════════════ */

import type { ProductData } from "@/lib/petku-types";
import { FREE_SHIPPING_MIN, SHIPPING_COST } from "@/lib/petku-types";

export type BudgetPick = {
  product: ProductData;
  qty: number;
  subtotal: number;
  days: number;
};

export type BudgetResult = {
  ok: boolean;
  reason?: string;
  picks: BudgetPick[];
  goodsTotal: number;
  shipping: number;
  total: number;
  leftover: number;
  totalDays: number;
  worstProduct: ProductData | null;
  worstDays: number;
  multiple: number | null; // berapa kali lebih hemat dibanding pilihan boros
};

export function optimizeBudget(
  products: ProductData[],
  categorySlug: string,
  budget: number,
  dailyGrams: number
): BudgetResult {
  const candidates = products.filter((p) => {
    if (p.category.slug !== categorySlug || p.stock <= 0) return false;
    const g = parseGrams(p.weight);
    return g !== null && g > 0 && p.price > 0;
  });

  if (candidates.length === 0 || budget < Math.min(...candidates.map((c) => c.price))) {
    return {
      ok: false,
      reason: "Anggaran belum cukup untuk satu kemasan pun di kategori ini.",
      picks: [],
      goodsTotal: 0,
      shipping: 0,
      total: 0,
      leftover: budget,
      totalDays: 0,
      worstProduct: null,
      worstDays: 0,
      multiple: null,
    };
  }

  const enriched = candidates.map((p) => {
    const grams = parseGrams(p.weight)!;
    return { product: p, grams, value: grams / p.price };
  });

  // Greedy: gram per rupiah tertinggi dulu
  const sorted = [...enriched].sort((a, b) => b.value - a.value);
  let remaining = budget;
  const picks: BudgetPick[] = [];

  for (const item of sorted) {
    if (remaining < item.product.price) continue;
    const maxQty = Math.min(item.product.stock, Math.floor(remaining / item.product.price), 10);
    if (maxQty < 1) continue;
    const subtotal = maxQty * item.product.price;
    remaining -= subtotal;
    picks.push({
      product: item.product,
      qty: maxQty,
      subtotal,
      days: Math.floor((maxQty * item.grams) / dailyGrams),
    });
  }

  const goodsTotal = picks.reduce((s, p) => s + p.subtotal, 0);
  const shipping = goodsTotal > 0 && goodsTotal < FREE_SHIPPING_MIN ? SHIPPING_COST : 0;
  const total = goodsTotal + shipping;
  const totalDays = picks.reduce((s, p) => s + p.days, 0);

  // Pilihan paling boros = nilai gram/rupiah terendah di kategori
  const worst = sorted[sorted.length - 1];
  const worstPackQty = Math.min(Math.floor(budget / worst.product.price), 10);
  const worstDays = worstPackQty >= 1 ? Math.floor((worstPackQty * worst.grams) / dailyGrams) : 0;
  const multiple = worstDays > 0 && totalDays > 0 ? Math.round((totalDays / worstDays) * 10) / 10 : null;

  return {
    ok: picks.length > 0 && totalDays > 0,
    reason: picks.length === 0 ? "Tidak ada kombinasi yang muat di anggaran." : undefined,
    picks,
    goodsTotal,
    shipping,
    total,
    leftover: Math.max(0, budget - total),
    totalDays,
    worstProduct: worst.product,
    worstDays,
    multiple,
  };
}
