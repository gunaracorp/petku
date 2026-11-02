"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BadgeDollarSign,
  ChevronDown,
  KeyRound,
  Loader2,
  Package,
  PackageMinus,
  RefreshCcw,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { formatDate, formatRupiah } from "@/lib/format";
import {
  ADMIN_PIN,
  PAYMENT_LABELS,
  STATUS_META,
  type AdminStats,
  type OrderData,
} from "@/lib/petku-types";
import { cn } from "@/lib/utils";

const STATUSES = ["PENDING", "DIPROSES", "DIKIRIM", "SELESAI", "DIBATALKAN"];

export function AdminPanel() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");

  if (!unlocked) {
    return (
      <section className="mx-auto max-w-md px-4 py-14">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-orange-100 bg-white p-8 shadow-lg shadow-orange-100/60">
          <span className="bg-primary flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg shadow-orange-200">
            <KeyRound className="size-7 text-white" />
          </span>
          <div className="text-center">
            <h1 className="text-xl font-extrabold">Admin PetKu</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Masukkan PIN untuk mengelola pesanan & stok
            </p>
          </div>
          <form
            className="flex w-full gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (pin === ADMIN_PIN) {
                setUnlocked(true);
                toast.success("Selamat datang, Admin! 🐾");
              } else {
                toast.error("PIN salah. Coba lagi.");
              }
            }}
          >
            <Input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN Admin"
              className="h-11 rounded-xl border-orange-200 text-center tracking-widest focus-visible:ring-orange-400"
              aria-label="PIN Admin"
              inputMode="numeric"
            />
            <Button type="submit" className="h-11 rounded-xl bg-orange-500 font-bold hover:bg-orange-600">
              Masuk
            </Button>
          </form>
        </div>
      </section>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/orders"),
      ]);
      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();
      setStats(statsData);
      setOrders(ordersData.orders ?? []);
    } catch {
      toast.error("Gagal memuat data admin");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(order: OrderData, status: string) {
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Gagal memperbarui status");
        return;
      }
      setOrders((prev) => prev.map((o) => (o.id === order.id ? data.order : o)));
      toast.success(`Pesanan ${order.code} → ${STATUS_META[status].label}`);
      load();
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    }
  }

  async function restock(productId: string, name: string) {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: 50 }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Gagal restock");
        return;
      }
      toast.success(`Stok "${name}" ditambah ke 50 pcs`);
      load();
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    }
  }

  if (loading && !stats) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const statCards = stats
    ? [
        { label: "Total Pesanan", value: String(stats.totalOrders), icon: ShoppingBag, tint: "bg-orange-100 text-orange-600" },
        { label: "Pendapatan", value: formatRupiah(stats.totalRevenue), icon: BadgeDollarSign, tint: "bg-emerald-100 text-emerald-600" },
        { label: "Menunggu Konfirmasi", value: String(stats.pendingOrders), icon: Package, tint: "bg-amber-100 text-amber-600" },
        { label: "Sedang Dikirim", value: String(stats.shippingOrders), icon: Truck, tint: "bg-cyan-100 text-cyan-600" },
      ]
    : [];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">🛠️ Dasbor Admin PetKu</h1>
          <p className="text-sm text-muted-foreground">
            Kelola pesanan masuk & pantau stok makanan hewan
          </p>
        </div>
        <Button
          variant="outline"
          onClick={load}
          disabled={loading}
          className="rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50"
        >
          <RefreshCcw className={cn("size-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
            <span className={cn("mb-2 flex h-9 w-9 items-center justify-center rounded-xl", s.tint)}>
              <s.icon className="size-5" />
            </span>
            <p className="text-xl font-extrabold sm:text-2xl">{s.value}</p>
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Stok menipis */}
      <div className="mt-6 rounded-2xl border border-red-100 bg-red-50/50 p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-red-700">
          <PackageMinus className="size-4" /> Stok Menipis (≤ 20 pcs)
        </h2>
        {stats?.lowStockProducts.length ? (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {stats.lowStockProducts.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-red-100 bg-white px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    {p.emoji} {p.name}
                  </p>
                  <p className="text-xs text-red-600 font-semibold">Sisa {p.stock} pcs</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 rounded-lg border-emerald-300 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                  onClick={() => restock(p.id, p.name)}
                >
                  + Restock
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Semua stok aman ✅</p>
        )}
      </div>

      {/* Daftar pesanan */}
      <h2 className="mt-8 mb-3 text-lg font-bold">📋 Kelola Pesanan ({orders.length})</h2>
      {orders.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/50 py-10 text-center text-sm text-muted-foreground">
          Belum ada pesanan masuk. Promosikan PetKu dulu! 🐾
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Collapsible
              key={order.id}
              className="rounded-2xl border border-orange-100 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-40 flex-1">
                  <p className="font-extrabold tracking-wide text-orange-600">{order.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.customerName} · {order.phone} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <Badge className={cn("rounded-full border", STATUS_META[order.status]?.color)}>
                  {STATUS_META[order.status]?.label}
                </Badge>
                <p className="font-extrabold">{formatRupiah(order.total)}</p>
                <Select
                  value={order.status}
                  onValueChange={(v) => updateStatus(order, v)}
                  disabled={order.status === "SELESAI" || order.status === "DIBATALKAN"}
                >
                  <SelectTrigger
                    className="w-40 rounded-lg border-orange-200"
                    aria-label={`Ubah status pesanan ${order.code}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_META[s].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <CollapsibleTrigger className="group">
                  <ChevronDown className="size-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                  <span className="sr-only">Detail pesanan</span>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="border-t border-orange-100 bg-orange-50/40 p-4 text-sm">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase">Alamat</p>
                      <p>{order.address}</p>
                      {order.notes && (
                        <p className="mt-1 text-xs text-muted-foreground">📝 {order.notes}</p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        💳 {PAYMENT_LABELS[order.paymentMethod]}
                      </p>
                    </div>
                    <ul className="flex flex-col gap-1">
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
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </section>
  );
}
