"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { discountPercent, formatRupiah } from "@/lib/format";
import { FeedingCalculator } from "./feeding-calculator";
import { pipoReact } from "./mascot";
import { ProductVisual, Stars } from "./visual";
import type { ProductData } from "@/lib/petku-types";

export function ProductDetailDialog({
  product,
  open,
  onOpenChange,
  onBuyNow,
}: {
  product: ProductData | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onBuyNow: (p: ProductData, qty: number) => void;
}) {
  const addItem = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [prevOpen, setPrevOpen] = useState(open);

  // Reset jumlah tiap kali dialog dibuka (adjust state saat render — pola React resmi)
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setQty(1);
  }

  if (!product) return null;
  const discount = discountPercent(product.price, product.originalPrice);
  const habis = product.stock <= 0;

  function handleAdd() {
    if (!product) return;
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
      qty
    );
    toast.success(`${product.emoji} ${qty}× ${product.name} masuk keranjang`);
    pipoReact(
      qty >= 3 ? "celebrate" : "happy",
      qty >= 3
        ? `Wih, ${qty} pak sekaligus! Stok aman berbulan-bulan 🤩`
        : "Nyam! Udah aman di keranjang 🦴"
    );
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4 sm:max-w-lg sm:p-6">
        <DialogHeader className="sr-only">
          <DialogTitle>Detail {product.name}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <ProductVisual emoji={product.emoji} color={product.color} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-1.5">
                <Badge variant="outline" className="border-orange-200 bg-orange-50 text-[11px] font-semibold text-orange-700">
                  {product.category.emoji} {product.category.name}
                </Badge>
                {product.featured && (
                  <Badge className="border-transparent bg-amber-400 text-[11px] font-bold text-amber-950">
                    ⭐ Terlaris
                  </Badge>
                )}
              </div>
              <p className="text-xs font-semibold tracking-wide text-orange-500 uppercase">
                {product.brand}
              </p>
              <h3 className="text-lg leading-snug font-extrabold">{product.name}</h3>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Stars rating={product.rating} />
                <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
                <span>· {product.sold.toLocaleString("id-ID")} terjual</span>
              </div>
            </div>
          </div>

          <Separator />

          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-muted/60 p-2.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">Kemasan</p>
              <p className="text-sm font-bold">{product.weight}</p>
            </div>
            <div className="rounded-xl bg-muted/60 p-2.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">Stok</p>
              <p className={`text-sm font-bold ${product.stock <= 20 ? "text-red-600" : "text-emerald-600"}`}>
                {product.stock > 0 ? `${product.stock} pcs` : "Habis"}
              </p>
            </div>
            <div className="rounded-xl bg-muted/60 p-2.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">Original</p>
              <p className="text-sm font-bold">✅ Distributor</p>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-orange-600">
                {formatRupiah(product.price)}
              </span>
              {discount && (
                <>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatRupiah(product.originalPrice!)}
                  </span>
                  <Badge className="border-transparent bg-red-500 text-white">-{discount}%</Badge>
                </>
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              🚚 Gratis ongkir bila subtotal ≥ Rp200.000
            </p>
          </div>

          {/* 🧠 Fitur pintar: kalkulator porsi + catat pantry */}
          <FeedingCalculator product={product} />

          {/* Qty stepper */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">Jumlah</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-lg border-orange-200"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={habis}
                aria-label="Kurangi jumlah"
              >
                <Minus className="size-4" />
              </Button>
              <span className="w-10 text-center text-base font-extrabold" aria-live="polite">
                {qty}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="size-9 rounded-lg border-orange-200"
                onClick={() => setQty((q) => Math.min(q + 1, product.stock, 99))}
                disabled={habis}
                aria-label="Tambah jumlah"
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAdd}
              disabled={habis}
              variant="outline"
              className="h-12 flex-1 rounded-xl border-orange-300 font-bold text-orange-600 hover:bg-orange-50"
            >
              <ShoppingCart className="size-5" />
              + Keranjang
            </Button>
            <Button
              onClick={() => {
                handleAdd();
                onBuyNow(product, qty);
              }}
              disabled={habis}
              className="h-12 flex-1 rounded-xl bg-orange-500 font-bold hover:bg-orange-600"
            >
              <Zap className="size-5" />
              Beli Sekarang
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
