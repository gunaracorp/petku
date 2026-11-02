"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock, Calculator, PiggyBank } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { usePantry } from "@/lib/pantry-store";
import { pipoReact } from "./mascot";
import {
  computeDailyGrams,
  estimateFeeding,
  formatDays,
  petTypesForCategory,
  PET_META,
  type AgeGroup,
  type PetType,
} from "@/lib/petku-smart";
import { formatRupiah } from "@/lib/format";
import type { ProductData } from "@/lib/petku-types";
import { cn } from "@/lib/utils";

export function FeedingCalculator({ product }: { product: ProductData }) {
  const addPantry = usePantry((s) => s.add);
  const types = useMemo(() => petTypesForCategory(product.category.slug), [product.category.slug]);

  const [petType, setPetType] = useState<PetType>(types[0]);
  const [age, setAge] = useState<AgeGroup>("dewasa");
  const meta = PET_META[petType];
  const [weight, setWeight] = useState(meta.defaultWeightKg);
  const [formOpen, setFormOpen] = useState(false);
  const [petName, setPetName] = useState("");

  const est = estimateFeeding(product.price, product.weight, petType, weight, age);
  const isWeighed = Boolean(PET_META[petType].gramsPerKgPerDay);
  const hasGrams = est.packGrams !== null && est.packGrams > 0;

  function switchType(t: PetType) {
    setPetType(t);
    setWeight(PET_META[t].defaultWeightKg);
  }

  function saveToPantry() {
    if (!hasGrams || !est.packGrams) return;
    addPantry({
      petName: petName.trim() || "Anabul",
      petType,
      petWeightKg: isWeighed ? weight : null,
      productId: product.id,
      productName: product.name,
      productEmoji: product.emoji,
      productBrand: product.brand,
      packGrams: est.packGrams,
      dailyGrams: est.dailyGrams,
      price: product.price,
    });
    setFormOpen(false);
    setPetName("");
    toast.success(
      `${PET_META[petType].emoji} ${petName.trim() || "Anabul"} tercatat di Pantry — kami ingatkan sebelum makanannya habis!`
    );
    pipoReact("love", "Siap! Pantau Pantry ya, biar guk guk ingatin 🐶");
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/60 p-3.5">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-sm font-extrabold text-emerald-800">
          <Calculator className="size-4" />
          Kalkulator Porsi
        </p>
        <div className="flex gap-1" role="group" aria-label="Pilih umur hewan">
          {(["dewasa", "anak"] as AgeGroup[]).map((a) => (
            <button
              key={a}
              onClick={() => setAge(a)}
              aria-pressed={age === a}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-bold transition-all active:scale-95",
                age === a
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50"
              )}
            >
              {a === "dewasa" ? "Dewasa" : "Anak"}
            </button>
          ))}
        </div>
      </div>

      {/* Pilih jenis hewan */}
      {types.length > 1 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => switchType(t)}
              aria-pressed={petType === t}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-bold transition-all active:scale-95",
                petType === t
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50"
              )}
            >
              {PET_META[t].emoji} {PET_META[t].label}
            </button>
          ))}
        </div>
      )}

      {/* Slider bobot untuk anjing/kucing/kelinci/reptil */}
      {isWeighed && (
        <div className="mb-2.5">
          <div className="mb-1 flex items-center justify-between text-xs font-semibold text-emerald-900">
            <span>Bobot {PET_META[petType].label.toLowerCase()}</span>
            <span className="rounded-md bg-white px-2 py-0.5 font-extrabold shadow-sm">
              {weight.toLocaleString("id-ID")} kg
            </span>
          </div>
          <input
            type="range"
            min={meta.minWeightKg}
            max={meta.maxWeightKg}
            step={meta.maxWeightKg <= 1 ? 0.05 : meta.maxWeightKg <= 12 ? 0.5 : 1}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-600"
            aria-label={`Bobot ${PET_META[petType].label} dalam kilogram`}
          />
        </div>
      )}

      {/* Hasil */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-white/90 p-2.5 text-center shadow-sm">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Porsi/hari</p>
          <motion.p
            key={est.dailyGrams}
            initial={{ scale: 0.85, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-extrabold text-emerald-700"
          >
            {est.dailyGrams} g
          </motion.p>
        </div>
        <div className="rounded-xl bg-white/90 p-2.5 text-center shadow-sm">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Tahan ±</p>
          <motion.p
            key={est.packDays ?? "x"}
            initial={{ scale: 0.85, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-extrabold text-emerald-700"
          >
            {hasGrams && est.packDays && est.packDays > 0 ? formatDays(est.packDays) : "—"}
          </motion.p>
        </div>
        <div className="rounded-xl bg-white/90 p-2.5 text-center shadow-sm ring-2 ring-amber-300">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">Per hari</p>
          <motion.p
            key={est.costPerDay ?? "x"}
            initial={{ scale: 0.85, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-extrabold text-amber-600"
          >
            {est.costPerDay ? formatRupiah(est.costPerDay) : "—"}
          </motion.p>
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-snug text-emerald-800/80">
        {meta.note} Paket ini cukup untuk {hasGrams && est.packDays ? `${formatDays(est.packDays)} penuh` : "durasi tak terhitung"}.
      </p>

      {/* Catat ke pantry */}
      <Button
        onClick={() => setFormOpen(true)}
        disabled={!hasGrams}
        className="mt-2.5 h-10 w-full rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700"
      >
        <CalendarClock className="size-4" />
        Catat ke Pantry Anabul
      </Button>

      {/* Mini dialog nama hewan */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <PiggyBank className="size-5 text-emerald-600" />
              Siapa nama anabulmu?
            </DialogTitle>
            <DialogDescription className="sr-only">
              Beri nama hewan untuk catatan pantry
            </DialogDescription>
          </DialogHeader>
          <Input
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="Mis.: Belang, Mochi, Ciko…"
            maxLength={20}
            aria-label="Nama hewan peliharaan"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") saveToPantry();
            }}
          />
          <p className="text-xs leading-snug text-muted-foreground">
            {product.emoji} <b>{product.name}</b> · {est.dailyGrams} g/hari · cukup{" "}
            {hasGrams && est.packDays ? formatDays(est.packDays) : "—"}
          </p>
          <Button
            onClick={saveToPantry}
            className="h-11 rounded-xl bg-emerald-600 font-bold hover:bg-emerald-700"
          >
            Simpan di Pantry 🗂️
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
