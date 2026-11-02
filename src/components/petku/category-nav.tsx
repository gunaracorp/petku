"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CategoryData } from "@/lib/petku-types";

const CATEGORY_HUES: Record<string, string> = {
  "makanan-anjing": "bg-orange-50 border-orange-200 hover:border-orange-400",
  "makanan-kucing": "bg-rose-50 border-rose-200 hover:border-rose-400",
  "makanan-burung": "bg-amber-50 border-amber-200 hover:border-amber-400",
  "makanan-ikan": "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
  "hamster-kelinci": "bg-lime-50 border-lime-200 hover:border-lime-400",
  reptil: "bg-teal-50 border-teal-200 hover:border-teal-400",
};

export function CategoryNav({
  categories,
  selected,
  onSelect,
}: {
  categories: CategoryData[];
  selected: string;
  onSelect: (slug: string) => void;
}) {
  const all = {
    id: "all",
    slug: "semua",
    name: "Semua",
    emoji: "🐾",
    description: "Semua produk",
    productCount: categories.reduce((s, c) => s + c.productCount, 0),
  } satisfies CategoryData;

  const list = [all, ...categories];

  return (
    <section aria-label="Kategori makanan hewan" className="mx-auto w-full max-w-6xl px-4">
      <div className="flex items-end justify-between gap-2 pt-8 pb-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight sm:text-xl">
            Kategori Hewan
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Pilih kategori sesuai sahabat kecilmu
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-7 sm:gap-3">
        {list.map((c, i) => (
          <motion.button
            key={c.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onSelect(c.slug)}
            className={cn(
              "group flex flex-col items-center gap-1.5 rounded-2xl border-2 p-2.5 text-center transition-all active:scale-95 sm:gap-2 sm:p-4",
              CATEGORY_HUES[c.slug] ?? CATEGORY_HUES["makanan-anjing"],
              selected === c.slug
                ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-white"
                : ""
            )}
            aria-pressed={selected === c.slug}
          >
            <span className="text-3xl transition-transform group-hover:scale-110 sm:text-4xl">
              {c.emoji}
            </span>
            <span className="text-[11px] leading-tight font-bold sm:text-xs">
              {c.name}
            </span>
            <span className="text-[10px] text-muted-foreground sm:text-[11px]">
              {c.productCount} produk
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
