"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type PipoMood = "idle" | "happy" | "celebrate" | "love" | "think";

export type PipoEventDetail = { mood: PipoMood; text?: string };

/** Kirim perintah reaksi ke Pipo dari komponen mana pun. */
export function pipoReact(mood: PipoMood, text?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<PipoEventDetail>("petku:pipo", { detail: { mood, text } }));
}

const IDLE_LINES = [
  "Lapar? Aku bantu pilih makanan terbaik 🦴",
  "Tekan aku kalau bingung pilih makanan!",
  "Tanya Dr. Pipo apa aja soal gizi anabul 🐶",
  "Gratis ongkir mulai Rp200rb lho!",
];

export function PipoMascot({
  onAsk,
  chatOpen,
}: {
  onAsk: () => void;
  chatOpen: boolean;
}) {
  const [mood, setMood] = useState<PipoMood>("idle");
  const [bubble, setBubble] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const show = (m: PipoMood, text?: string, ms = 3200) => {
    setMood(m);
    if (text) setBubble(text);
    const t = setTimeout(() => {
      setMood("idle");
      setBubble(null);
    }, ms);
    timers.current.push(t);
  };

  // Dengarkan event lintas komponen
  useEffect(() => {
    const handler = (e: Event) => {
      const { mood: m, text } = (e as CustomEvent<PipoEventDetail>).detail;
      show(m, text);
    };
    window.addEventListener("petku:pipo", handler);
    return () => {
      window.removeEventListener("petku:pipo", handler);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  // Perilaku idle: sesekali ngomong sendiri
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (chatOpen) return;
      i = (i + 1) % IDLE_LINES.length;
      const t = setTimeout(() => {
        setMood("think");
        setBubble(IDLE_LINES[i]);
        const clear = setTimeout(() => {
          setMood("idle");
          setBubble(null);
        }, 3500);
        timers.current.push(clear);
      }, 800);
      timers.current.push(t);
    }, 26_000);
    return () => clearInterval(interval);
  }, [chatOpen]);

  if (chatOpen) return null;

  const bounce =
    mood === "celebrate" ? 1 : mood === "happy" ? 0.85 : mood === "love" ? 0.7 : 0.4;
  const emoji = mood === "love" ? "😍" : mood === "celebrate" ? "🤩" : "🐶";

  return (
    <div className="fixed right-4 bottom-20 z-40 flex flex-col items-end gap-2 md:right-6 md:bottom-6">
      <AnimatePresence>
        {bubble && (
          <motion.button
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            onClick={onAsk}
            className="max-w-52 rounded-2xl rounded-br-sm border border-orange-200 bg-white px-3.5 py-2.5 text-left text-xs leading-snug font-semibold text-orange-900 shadow-lg shadow-orange-100"
            aria-label={bubble}
          >
            {bubble}
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        onClick={onAsk}
        whileTap={{ scale: 0.88 }}
        animate={
          mood === "idle"
            ? { y: [0, -4, 0] }
            : bounce > 0.5
              ? { y: [0, -14, 0], rotate: mood === "celebrate" ? [0, -8, 8, 0] : 0 }
              : { scale: [1, 1.06, 1] }
        }
        transition={
          mood === "idle"
            ? { repeat: Infinity, duration: 2.4, ease: "easeInOut" }
            : { duration: bounce, ease: "easeOut" }
        }
        className={cn(
          "flex size-14 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-orange-400 to-amber-500 text-2xl shadow-xl shadow-orange-300/60 transition-transform active:scale-95",
          mood === "think" && "grayscale-0"
        )}
        aria-label="Tanya Dr. Pipo — asisten gizi AI"
      >
        <span className="drop-shadow-sm">{emoji}</span>
        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-400 opacity-60" />
          <span className="relative inline-flex size-3 rounded-full border-2 border-white bg-orange-500" />
        </span>
      </motion.button>
    </div>
  );
}
