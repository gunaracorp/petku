"use client";

import { ArrowDownWideNarrow, PackageSearch } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "./product-card";
import type { CategoryData, ProductData } from "@/lib/petku-types";

const SORT_OPTIONS = [
  { value: "sold", label: "🔥 Terlaris" },
  { value: "rating", label: "⭐ Rating Tertinggi" },
  { value: "price-asc", label: "💰 Harga Terendah" },
  { value: "price-desc", label: "💎 Harga Tertinggi" },
];

export function Catalog({
  products,
  categories,
  loading,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  searchValue,
  onOpenProduct,
}: {
  products: ProductData[];
  categories: CategoryData[];
  loading: boolean;
  category: string;
  onCategoryChange: (c: string) => void;
  sort: string;
  onSortChange: (s: string) => void;
  searchValue: string;
  onOpenProduct: (p: ProductData) => void;
}) {
  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <section id="katalog" aria-label="Katalog produk" className="mx-auto w-full max-w-6xl px-4 pb-10">
      <div className="flex flex-col gap-3 pt-8 pb-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight sm:text-xl">
              {activeCategory ? `${activeCategory.emoji} ${activeCategory.name}` : "🐾 Semua Produk"}
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {loading
                ? "Memuat produk…"
                : `${products.length} produk ditemukan${searchValue ? ` untuk "${searchValue}"` : ""}`}
            </p>
          </div>
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger
              className="w-44 shrink-0 rounded-lg border-orange-200 focus-visible:ring-orange-400"
              aria-label="Urutkan produk"
            >
              <ArrowDownWideNarrow className="size-4 text-orange-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter chips kategori */}
        <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <FilterChip
            active={category === "semua"}
            onClick={() => onCategoryChange("semua")}
            label="🐾 Semua"
          />
          {categories.map((c) => (
            <FilterChip
              key={c.slug}
              active={category === c.slug}
              onClick={() => onCategoryChange(c.slug)}
              label={`${c.emoji} ${c.name}`}
            />
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-2xl border p-4">
              <Skeleton className="h-24 w-24 rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50/50 py-14 text-center">
          <PackageSearch className="size-12 text-orange-300" />
          <p className="font-bold">Produk tidak ditemukan</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Coba kata kunci lain atau ganti kategori. Mungkin sahabat kecilmu
            butuh menu berbeda! 🐾
          </p>
          <Button
            variant="outline"
            className="mt-1 rounded-xl border-orange-300 text-orange-600 hover:bg-orange-50"
            onClick={() => {
              onCategoryChange("semua");
              window.dispatchEvent(new CustomEvent("petku:reset-search"));
            }}
          >
            Reset Pencarian
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onOpen={onOpenProduct} />
          ))}
        </div>
      )}
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all active:scale-95 sm:text-sm ${
        active
          ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-200"
          : "border-orange-200 bg-white text-muted-foreground hover:border-orange-400 hover:text-orange-600"
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
