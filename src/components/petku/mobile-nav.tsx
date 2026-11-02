"use client";

import { Home, Package, Settings, ShoppingCart, Store } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import type { View } from "./view-types";

export function MobileNav({
  view,
  onViewChange,
  onShop,
}: {
  view: View;
  onViewChange: (v: View) => void;
  onShop: () => void;
}) {
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const mounted = useMounted();
  const count = mounted ? items.reduce((s, i) => s + i.quantity, 0) : 0;

  const navs = [
    { key: "home" as View, label: "Beranda", icon: Home, action: () => onViewChange("home") },
    { key: "shop" as const, label: "Belanja", icon: Store, action: onShop },
    { key: "cart" as const, label: "Keranjang", icon: ShoppingCart, action: openCart, badge: count },
    { key: "orders" as View, label: "Pesanan", icon: Package, action: () => onViewChange("orders") },
    { key: "admin" as View, label: "Admin", icon: Settings, action: () => onViewChange("admin") },
  ];

  return (
    <nav
      aria-label="Navigasi bawah"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-orange-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <div className="grid grid-cols-5">
        {navs.map((n) => {
          const active = n.key === view;
          return (
            <button
              key={n.key}
              onClick={n.action}
              className={cn(
                "relative flex min-h-14 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-bold transition-colors active:scale-95",
                active ? "text-orange-600" : "text-muted-foreground"
              )}
              aria-label={n.label}
              aria-current={active ? "page" : undefined}
            >
              <span className="relative">
                <n.icon className={cn("size-5", active && "stroke-[2.5]")} />
                {"badge" in n && n.badge ? (
                  <span className="bg-primary absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] text-white shadow">
                    {n.badge > 99 ? "99+" : n.badge}
                  </span>
                ) : null}
              </span>
              {n.label}
              {active && (
                <span className="bg-primary absolute top-0 h-0.5 w-8 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
