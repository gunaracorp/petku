"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send, Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/format";
import { pipoReact } from "./mascot";
import type { ProductData } from "@/lib/petku-types";

type Msg = { role: "user" | "assistant"; content: string; productIds?: string[] };

const QUICK_ASKS = [
  "Kucingku 4 kg, makan apa enak?",
  "Rekomendasi anjing dewasa budget 200rb",
  "Pakan burung lovebird yang bagus?",
  "Mau stok makanan 1 bulan, beli mana?",
];

export function AiAdvisor({
  open,
  onOpenChange,
  onOpenProduct,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onOpenProduct: (p: ProductData) => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Guk! Aku Dr. Pipo 🐶 ahli gizi di PetKu. Ceritakan tentang anabulmu — jenis, umur, bobot, atau budgetmu — nanti aku rekomendasikan makanan paling pas dari katalog kami!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState<ProductData[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ambil katalog lengkap sekali saat chat pertama dibuka (untuk chip rekomendasi)
  useEffect(() => {
    if (!open || catalog.length > 0) return;
    fetch("/api/products?category=semua&sort=sold")
      .then((r) => r.json())
      .then((d) => setCatalog(d.products ?? []))
      .catch(() => setCatalog([]));
  }, [open, catalog.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function ask(text: string) {
    const question = text.trim();
    if (!question || loading) return;
    const nextMsgs: Msg[] = [...messages, { role: "user", content: question }];
    setMessages(nextMsgs);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          history: nextMsgs
            .slice(0, -1)
            .filter((m) => !m.productIds)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal menjawab");
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply, productIds: data.productIds ?? [] },
      ]);
      pipoReact("think");
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            err instanceof Error ? err.message : "Waduh, koneksi guk-nya tersendat. Coba lagi ya!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const productsById = new Map(catalog.map((p) => [p.id, p]));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85dvh] flex-col gap-0 p-0 sm:h-[600px] sm:max-w-lg">
        <DialogHeader className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4 text-left">
          <DialogTitle className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-xl shadow-md shadow-orange-200">
              🐶
            </span>
            <span>
              <span className="block text-base font-extrabold text-orange-900">Dr. Pipo</span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Ahli gizi AI · online
              </span>
            </span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Chat dengan asisten gizi AI PetKu
          </DialogDescription>
        </DialogHeader>

        {/* Riwayat chat */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-[#fffaf3] p-4">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-sm bg-orange-500 px-3.5 py-2.5 text-sm leading-relaxed text-white shadow-sm"
                    : "max-w-[88%] rounded-2xl rounded-bl-sm border border-orange-100 bg-white px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-foreground shadow-sm"
                }
              >
                {m.content}
                {m.productIds && m.productIds.length > 0 && (
                  <div className="mt-2.5 space-y-1.5">
                    {m.productIds
                      .map((id) => productsById.get(id))
                      .filter((p): p is ProductData => Boolean(p))
                      .map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            onOpenProduct(p);
                            onOpenChange(false);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl border border-orange-200 bg-orange-50/70 p-2 text-left transition-all hover:-translate-y-0.5 hover:bg-orange-100 active:scale-[0.98]"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-lg shadow-sm">
                            {p.emoji}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-bold">{p.name}</span>
                            <span className="block text-[11px] font-semibold text-orange-600">
                              {formatRupiah(p.price)} · ⭐ {p.rating.toFixed(1)}
                            </span>
                          </span>
                          <Sparkles className="size-4 shrink-0 text-orange-400" />
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-orange-100 bg-white px-4 py-3 shadow-sm">
                <Loader2 className="size-4 animate-spin text-orange-500" />
                <span className="text-xs font-medium text-muted-foreground">
                  Dr. Pipo sedang mikir…
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Saran cepat */}
        {messages.length <= 2 && (
          <div className="flex gap-1.5 overflow-x-auto border-t border-orange-100 bg-white px-3 pt-2.5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {QUICK_ASKS.map((q) => (
              <button
                key={q}
                onClick={() => ask(q)}
                className="shrink-0 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap text-orange-700 transition-colors hover:bg-orange-100 active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex items-center gap-2 border-t border-orange-100 bg-white p-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya soal gizi anabulmu…"
            className="border-orange-200 focus-visible:ring-orange-400"
            aria-label="Tulis pertanyaan untuk Dr. Pipo"
            maxLength={600}
          />
          <Button
            type="submit"
            size="icon"
            disabled={loading || !input.trim()}
            className="size-10 shrink-0 rounded-xl bg-orange-500 hover:bg-orange-600"
            aria-label="Kirim pertanyaan"
          >
            <Send className="size-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdvisorCloseHint() {
  return <X className="size-4" />;
}
