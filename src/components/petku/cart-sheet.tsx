"use client";

import { Minus, Plus, ShoppingCart, Trash2, Truck } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/lib/cart-store";
import { formatRupiah } from "@/lib/format";
import { FREE_SHIPPING_MIN, SHIPPING_COST } from "@/lib/petku-types";
import { ProductVisual } from "./visual";

export function CartSheet({
  onCheckout,
}: {
  onCheckout: () => void;
}) {
  const { items, isOpen, close, setQuantity, removeItem } = useCart();

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  const kurang = FREE_SHIPPING_MIN - subtotal;

  return (
    <Sheet open={isOpen} onOpenChange={(v) => (v ? undefined : close())}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2 text-base font-extrabold">
            <ShoppingCart className="size-5 text-orange-500" />
            Keranjang Belanja
            {items.length > 0 && (
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
                {items.reduce((s, i) => s + i.quantity, 0)} item
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="text-xs">
            Review pesananmu sebelum checkout
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="text-6xl" aria-hidden="true">🛒</span>
            <p className="font-bold">Keranjang masih kosong</p>
            <p className="max-w-60 text-sm text-muted-foreground">
              Yuk pilih makanan favorit sahabat kecilmu dulu!
            </p>
            <Button
              onClick={close}
              className="mt-2 rounded-xl bg-orange-500 font-bold hover:bg-orange-600"
            >
              🐾 Mulai Belanja
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-4">
              <ul className="flex flex-col gap-3 py-4">
                {items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex gap-3 rounded-2xl border border-orange-100 bg-white p-3 shadow-sm"
                  >
                    <ProductVisual emoji={item.emoji} color={item.color} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold tracking-wide text-orange-500 uppercase">
                        {item.brand}
                      </p>
                      <p className="line-clamp-2 text-sm leading-snug font-bold">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.weight}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7 rounded-md border-orange-200"
                            onClick={() => setQuantity(item.productId, item.quantity - 1)}
                            aria-label={`Kurangi ${item.name}`}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-7 text-center text-sm font-bold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7 rounded-md border-orange-200"
                            onClick={() => setQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            aria-label={`Tambah ${item.name}`}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                        <span className="text-sm font-extrabold text-orange-600">
                          {formatRupiah(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 shrink-0 self-start rounded-md text-muted-foreground hover:text-red-600"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Hapus ${item.name} dari keranjang`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>

            <SheetFooter className="gap-2 border-t p-4">
              {kurang > 0 && (
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                  <Truck className="size-4 shrink-0" />
                  Tambah {formatRupiah(kurang)} lagi untuk <strong>GRATIS ONGKIR</strong>!
                </div>
              )}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Ongkir</span>
                  <span className="font-semibold text-foreground">
                    {shipping === 0 ? "Gratis 🎉" : formatRupiah(shipping)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-extrabold">
                  <span>Total</span>
                  <span className="text-orange-600">{formatRupiah(total)}</span>
                </div>
              </div>
              <Button
                size="lg"
                onClick={onCheckout}
                className="h-12 rounded-xl bg-orange-500 text-base font-bold hover:bg-orange-600"
              >
                Lanjut ke Checkout →
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
