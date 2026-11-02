"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Package, PackageSearch, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { formatDate, formatRupiah } from "@/lib/format";
import {
  PAYMENT_LABELS,
  STATUS_META,
  type OrderData,
} from "@/lib/petku-types";
import { cn } from "@/lib/utils";

const STEPS = ["PENDING", "DIPROSES", "DIKIRIM", "SELESAI"];

function StatusTimeline({ status }: { status: OrderData["status"] }) {
  const meta = STATUS_META[status];
  if (status === "DIBATALKAN") {
    return (
      <div className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
        ❌ Pesanan dibatalkan
      </div>
    );
  }
  const step = meta.step;
  return (
    <ol className="flex items-center gap-1" aria-label="Status pesanan">
      {STEPS.map((s, i) => (
        <li key={s} className="flex flex-1 items-center gap-1">
          <div className="flex flex-col items-center gap-1">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full border-2 text-[10px] font-bold",
                i < step
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : i === step
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-muted-foreground/30 bg-white text-muted-foreground"
              )}
            >
              {i < step ? <CheckCircle2 className="size-4" /> : i + 1}
            </span>
            <span
              className={cn(
                "text-[10px] leading-tight font-semibold",
                i <= step ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {STATUS_META[s].short}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <span
              className={cn(
                "mb-4 h-1 flex-1 rounded-full",
                i < step ? "bg-emerald-500" : "bg-muted-foreground/20"
              )}
            />
          )}
        </li>
      ))}
    </ol>
  );
}

export function OrderTracking() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderData[] | null>(null);

  async function track(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      toast.error("Masukkan nomor WhatsApp atau kode pesanan");
      return;
    }
    setLoading(true);
    try {
      const isPhone = /^\d+$/.test(q.replace(/^0/, "0"));
      const url = isPhone
        ? `/api/orders?phone=${encodeURIComponent(q.replace(/\D/g, ""))}`
        : `/api/orders?code=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Gagal melacak pesanan");
        return;
      }
      if (data.orders.length === 0) {
        toast.info("Pesanan tidak ditemukan. Periksa nomor/kode kamu.");
      }
      setOrders(data.orders);
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8">
      <div className="mb-5 text-center">
        <span className="bg-primary mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg shadow-orange-200">
          <Package className="size-8 text-white" />
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Lacak Pesanan Saya
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Masukkan nomor WhatsApp saat order atau kode pesanan (cth: PK-260101-XXXX)
        </p>
      </div>

      <form onSubmit={track} className="mx-auto flex max-w-xl gap-2">
        <div className="relative flex-1">
          <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="081234567890 / PK-…"
            className="h-12 rounded-xl border-orange-200 pl-9 focus-visible:ring-orange-400"
            aria-label="Nomor WhatsApp atau kode pesanan"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-12 rounded-xl bg-orange-500 px-5 font-bold hover:bg-orange-600"
        >
          {loading ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />}
          <span className="hidden sm:inline">Lacak</span>
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-4">
        {orders?.map((order) => (
          <article
            key={order.id}
            className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-lg font-extrabold tracking-wide text-orange-600">
                  {order.code}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(order.createdAt)} · {order.customerName}
                </p>
              </div>
              <Badge className={cn("rounded-full border", STATUS_META[order.status]?.color)}>
                {STATUS_META[order.status]?.label}
              </Badge>
            </div>

            <div className="my-4">
              <StatusTimeline status={order.status} />
            </div>

            <Separator className="mb-3" />

            <ul className="flex flex-col gap-1.5 text-sm">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-2">
                  <span className="min-w-0 truncate">
                    {item.productEmoji} {item.quantity}× {item.productName}
                  </span>
                  <span className="shrink-0 font-semibold">
                    {formatRupiah(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <Separator className="my-3" />

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase">Alamat Kirim</p>
                <p className="mt-0.5 leading-snug">{order.address}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  📱 {order.phone} · {PAYMENT_LABELS[order.paymentMethod]}
                </p>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatRupiah(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ongkir</span>
                  <span>{order.shippingCost === 0 ? "Gratis" : formatRupiah(order.shippingCost)}</span>
                </div>
                <div className="mt-1 flex justify-between border-t pt-1 text-base font-extrabold">
                  <span>Total</span>
                  <span className="text-orange-600">{formatRupiah(order.total)}</span>
                </div>
              </div>
            </div>
          </article>
        ))}

        {orders !== null && orders.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50/50 py-12 text-center">
            <PackageSearch className="size-12 text-orange-300" />
            <p className="font-bold">Belum ada pesanan</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Yuk belanja kebutuhan sahabat kecilmu di PetKu! 🐾
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
