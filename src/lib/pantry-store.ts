"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PetType } from "@/lib/petku-smart";

export type PantryItem = {
  id: string;
  petName: string;
  petType: PetType;
  petWeightKg: number | null;
  productId: string | null;
  productName: string;
  productEmoji: string;
  productBrand: string;
  packGrams: number;
  dailyGrams: number;
  price: number;
  openedAt: string; // ISO — kapan kemasan mulai dibuka
};

type PantryState = {
  items: PantryItem[];
  add: (item: Omit<PantryItem, "id" | "openedAt">) => void;
  remove: (id: string) => void;
  refill: (id: string) => void;
};

export const usePantry = create<PantryState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((state) => ({
          items: [
            ...state.items,
            { ...item, id: `ptr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, openedAt: new Date().toISOString() },
          ],
        })),
      remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      refill: (id) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, openedAt: new Date().toISOString() } : i)),
        })),
    }),
    {
      name: "petku-pantry",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

/* ── Kalkulasi pantry (murni, bisa dipakai di mana saja) ── */

export function pantryDaysLeft(item: PantryItem): number {
  const elapsedDays = Math.max(0, (Date.now() - new Date(item.openedAt).getTime()) / 86_400_000);
  const remainingGrams = item.packGrams - elapsedDays * item.dailyGrams;
  if (remainingGrams <= 0) return 0;
  return Math.max(0, Math.floor(remainingGrams / item.dailyGrams));
}

/** 0..1 — seberapa penuh kemasan (untuk ring animasi). */
export function pantryRemainingRatio(item: PantryItem): number {
  const elapsedDays = Math.max(0, (Date.now() - new Date(item.openedAt).getTime()) / 86_400_000);
  const remainingGrams = item.packGrams - elapsedDays * item.dailyGrams;
  return Math.min(1, Math.max(0, remainingGrams / item.packGrams));
}
