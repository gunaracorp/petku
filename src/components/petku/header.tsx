"use client";

import { PiggyBank, PawPrint, Search, ShoppingCart } from "lucide-react";
import { Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import type { View } from "./view-types";

export function Header({
  view,
  onViewChange,
  searchValue,
  onSearchChange,
}: {
  view: View;
  onViewChange: (v: View) => void;
  searchValue: string;
  onSearchChange: (v: string) => void;
}) {
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const mounted = useMounted();

  const count = mounted ? items.reduce((s, i) => s + i.quantity, 0) : 0;

  const navItems: { key: View; label: string; icon?: typeof PawPrint }[] = [
    { key: "home", label: "Beranda" },
    { key: "pantry", label: "Pantry", icon: Boxes },
    { key: "budget", label: "Mode Hemat", icon: PiggyBank },
    { key: "orders", label: "Pesanan Saya" },
    { key: "admin", label: "Admin" },
  ];

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 border-b border-orange-100 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:h-18">
        {/* Logo */}
        <button
          onClick={() => onViewChange("home")}
          className="flex items-center gap-2 rounded-lg focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none"
          aria-label="PetKu — kembali ke beranda"
        >
          <span className="bg-primary flex h-10 w-10 items-center justify-center rounded-xl shadow-md shadow-orange-200">
            <PawPrint className="size-6 text-white" />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-xl font-extrabold tracking-tight text-orange-600">
              PetKu
            </span>
            <span className="hidden text-[11px] font-medium text-muted-foreground sm:block">
              Makanan Hewan Lengkap
            </span>
          </span>
        </button>

        {/* Search (desktop) */}
        <div className="relative mx-auto hidden w-full max-w-md md:block">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={searchValue}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (view !== "home") onViewChange("home");
            }}
            placeholder="Cari Whiskas, voer, pellet…"
            className="border-orange-200 bg-white pl-9 focus-visible:ring-orange-400"
            aria-label="Cari produk"
          />
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigasi utama">
          {navItems.map((n) => (
            <Button
              key={n.key}
              variant={view === n.key ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewChange(n.key)}
              className={cn(
                "font-medium",
                view === n.key ? "bg-orange-100 text-orange-700 hover:bg-orange-100" : "text-muted-foreground hover:text-orange-600"
              )}
            >
              {n.icon && <n.icon className="size-4" />}
              {n.label}
            </Button>
          ))}
        </nav>

        {/* Cart */}
        <Button
          onClick={openCart}
          variant="outline"
          className="relative ml-auto shrink-0 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-700 md:ml-0"
          aria-label={`Buka keranjang belanja, ${count} item`}
        >
          <ShoppingCart className="size-5" />
          <span className="hidden sm:inline">Keranjang</span>
          {count > 0 && (
            <span className="bg-primary absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold text-white shadow">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Button>
      </div>

      {/* Search (mobile) */}
      <div className="border-t border-orange-100/70 px-4 pt-2 pb-3 md:hidden">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={searchValue}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (view !== "home") onViewChange("home");
            }}
            placeholder="Cari makanan hewan…"
            className="border-orange-200 bg-white pl-9 focus-visible:ring-orange-400"
            aria-label="Cari produk"
          />
        </div>
      </div>
    </header>
  );
}
