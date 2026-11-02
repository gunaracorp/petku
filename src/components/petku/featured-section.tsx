"use client";

import { Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "./product-card";
import type { ProductData } from "@/lib/petku-types";

export function FeaturedSection({
  products,
  loading,
  onOpenProduct,
}: {
  products: ProductData[];
  loading: boolean;
  onOpenProduct: (p: ProductData) => void;
}) {
  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 pt-8">
        <Skeleton className="mb-4 h-7 w-56" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section aria-label="Produk terlaris" className="mx-auto w-full max-w-6xl px-4">
      <div className="flex items-center gap-2 pt-8 pb-4">
        <span className="bg-primary flex h-9 w-9 items-center justify-center rounded-xl">
          <Flame className="size-5 text-white" />
        </span>
        <div>
          <h2 className="text-lg font-bold tracking-tight sm:text-xl">Paling Dicari 🐾</h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Makanan hewan favorit pelanggan PetKu bulan ini
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {products.slice(0, 4).map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} onOpen={onOpenProduct} />
        ))}
      </div>
    </section>
  );
}
