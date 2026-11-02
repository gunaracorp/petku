"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { discountPercent, formatRupiah } from "@/lib/format";
import { ProductVisual, Stars } from "./visual";
import type { ProductData } from "@/lib/petku-types";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  index = 0,
  onOpen,
}: {
  product: ProductData;
  index?: number;
  onOpen: (p: ProductData) => void;
}) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.open);
  const discount = discountPercent(product.price, product.originalPrice);
  const habis = product.stock <= 0;

  function add(e: React.MouseEvent) {
    e.stopPropagation();
    if (habis) return;
    addItem(
      {
        productId: product.id,
        name: product.name,
        brand: product.brand,
        emoji: product.emoji,
        color: product.color,
        weight: product.weight,
        price: product.price,
        stock: product.stock,
      },
      1
    );
    toast.success(`${product.emoji} ${product.name} masuk keranjang`, {
      description: formatRupiah(product.price),
      action: { label: "Lihat", onClick: openCart },
    });
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      onClick={() => onOpen(product)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen(product);
      }}
      tabIndex={0}
      role="button"
      aria-label={`Lihat detail ${product.name}`}
      className={cn(
        "group flex cursor-pointer flex-col gap-2.5 rounded-2xl border border-orange-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none sm:gap-3 sm:p-4",
        habis && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <ProductVisual
          emoji={product.emoji}
          color={product.color}
          className="transition-transform group-hover:scale-105"
        />
        <div className="flex flex-col items-end gap-1">
          {discount && (
            <Badge className="border-transparent bg-red-500 px-1.5 text-[11px] font-bold text-white">
              -{discount}%
            </Badge>
          )}
          {product.featured && !habis && (
            <Badge className="border-transparent bg-amber-400 px-1.5 text-[10px] font-bold text-amber-950">
              ⭐ Terlaris
            </Badge>
          )}
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold tracking-wide text-orange-500 uppercase">
          {product.brand}
        </p>
        <h3 className="line-clamp-2 min-h-10 text-sm leading-snug font-bold sm:min-h-9">
          {product.name}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {product.weight}
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Stars rating={product.rating} />
        <span className="font-medium">{product.rating.toFixed(1)}</span>
        <span>· {product.sold.toLocaleString("id-ID")} terjual</span>
      </div>

      <div className="mt-auto">
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-extrabold text-orange-600 sm:text-lg">
            {formatRupiah(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatRupiah(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          {habis ? (
            <Button disabled variant="secondary" className="h-9 flex-1 rounded-lg text-xs">
              Stok Habis
            </Button>
          ) : (
            <Button
              onClick={add}
              className="h-9 flex-1 rounded-lg bg-orange-500 text-xs font-bold hover:bg-orange-600"
              aria-label={`Tambah ${product.name} ke keranjang`}
            >
              <ShoppingCart className="size-3.5" />
              + Keranjang
            </Button>
          )}
          {product.stock <= 20 && !habis && (
            <span className="text-[10px] font-semibold text-red-500">
              Sisa {product.stock}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
