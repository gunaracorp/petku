"use client";

import { motion } from "framer-motion";
import { Bot, Calculator, PiggyBank } from "lucide-react";
import { pantryDaysLeft, usePantry } from "@/lib/pantry-store";
import { cn } from "@/lib/utils";

export function SmartZone({
  onAsk,
  onPantry,
  onBudget,
}: {
  onAsk: () => void;
  onPantry: () => void;
  onBudget: () => void;
}) {
  const items = usePantry((s) => s.items);
  const soonest = items.length
    ? [...items].sort((a, b) => pantryDaysLeft(a) - pantryDaysLeft(b))[0]
    : null;
  const soonestDays = soonest ? pantryDaysLeft(soonest) : null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8" aria-label="Fitur pintar PetKu">
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight sm:text-xl">
            🧠 PetKu Pintar
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Fitur yang cuma ada di sini — bukan sekadar toko biasa.
          </p>
        </div>
      </div>

      {/* Alarm pantry proaktif */}
      {soonest && soonestDays !== null && soonestDays <= 7 && (
        <motion.button
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onPantry}
          className={cn(
            "mb-3 flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-transform hover:-translate-y-0.5 active:scale-[0.99]",
            soonestDays <= 0
              ? "animate-pulse border-red-200 bg-red-50"
              : "border-amber-200 bg-amber-50"
          )}
        >
          <span className="text-2xl">{soonestDays <= 0 ? "🚨" : "⏰"}</span>
          <span className="min-w-0 flex-1 text-sm">
            <b className="text-amber-900">
              {soonestDays <= 0
                ? `Makanan ${soonest.petName} sudah habis!`
                : `Makanan ${soonest.petName} tinggal ${soonestDays} hari lagi`}
            </b>
            <span className="block truncate text-xs text-amber-800">
              {soonest.productEmoji} {soonest.productName} — isi ulang sekarang, sekali klik.
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-white">
            Cek Pantry
          </span>
        </motion.button>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {/* AI Advisor */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0 }}
          onClick={onAsk}
          className="group rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/70 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md active:scale-[0.99]"
        >
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-xl shadow-md shadow-orange-200">
            🐶
          </div>
          <p className="flex items-center gap-1.5 text-sm font-extrabold">
            Tanya Dr. Pipo
            <Bot className="size-4 text-orange-400" />
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Asisten gizi AI yang baca seluruh katalog: ceritakan anabulmu, dapat rekomendasi
            pas + hitungan porsi.
          </p>
          <span className="mt-2 inline-block text-xs font-bold text-orange-600 transition-transform group-hover:translate-x-0.5">
            Mulai ngobrol →
          </span>
        </motion.button>

        {/* Mode Hemat */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.06 }}
          onClick={onBudget}
          className="group rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-emerald-50/70 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md active:scale-[0.99]"
        >
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-xl shadow-md shadow-emerald-200">
            <PiggyBank className="size-6 text-white" />
          </div>
          <p className="flex items-center gap-1.5 text-sm font-extrabold">
            Mode Hemat
            <Calculator className="size-4 text-emerald-500" />
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Tulis anggaran → mesin optimasi susun kombinasi belanja dengan{" "}
            <b>hari makan paling banyak</b>.
          </p>
          <span className="mt-2 inline-block text-xs font-bold text-emerald-600 transition-transform group-hover:translate-x-0.5">
            Coba hitung →
          </span>
        </motion.button>

        {/* Pantry */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          onClick={onPantry}
          className="group rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-amber-50/70 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md active:scale-[0.99]"
        >
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-xl shadow-md shadow-amber-200">
            🗂️
          </div>
          <p className="text-sm font-extrabold">Pantry Anabul</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Catat kemasan yang dibuka → hitungan mundur otomatis +{" "}
            <b>pengingat sebelum habis</b>.
          </p>
          <span className="mt-2 inline-block text-xs font-bold text-amber-600 transition-transform group-hover:translate-x-0.5">
            {items.length > 0 ? `${items.length} anabul tercatat →` : "Mulai catat →"}
          </span>
        </motion.button>
      </div>
    </section>
  );
}
