"use client";

import { useState } from "react";
import {
  Banknote,
  Building2,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Package,
  Wallet,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { formatRupiah, waLink } from "@/lib/format";
import { FREE_SHIPPING_MIN, SHIPPING_COST, PAYMENT_LABELS } from "@/lib/petku-types";
import type { OrderData } from "@/lib/petku-types";
import { cn } from "@/lib/utils";

const PAYMENT_OPTIONS = [
  { key: "COD", icon: Banknote, desc: "Bayar saat paket tiba" },
  { key: "TRANSFER", icon: Building2, desc: "BCA/BRI/Mandiri" },
  { key: "EWALLET", icon: Wallet, desc: "DANA/OVO/GoPay" },
];

export function CheckoutDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: () => void;
}) {
  const { items, clear, close } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState<OrderData | null>(null);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          address,
          notes,
          paymentMethod: payment,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Gagal membuat pesanan");
        return;
      }
      setSuccessOrder(data.order);
      clear();
      toast.success("🎉 Pesanan berhasil dibuat!");
    } catch {
      toast.error("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setSuccessOrder(null);
    setName("");
    setPhone("");
    setAddress("");
    setNotes("");
    setPayment("COD");
  }

  function done() {
    reset();
    onOpenChange(false);
    close();
    onSuccess();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v && successOrder) {
          done();
        } else {
          onOpenChange(v);
        }
      }}
    >
      <DialogContent className="max-h-[92vh] overflow-y-auto p-4 sm:max-w-lg sm:p-6">
        {successOrder ? (
          // ===== SUKSES =====
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <div className="animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="size-16 text-emerald-500" />
          </div>
            <div>
              <h3 className="text-xl font-extrabold">Pesanan Berhasil! 🎉</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Terima kasih, <strong>{successOrder.customerName}</strong>! Kami
                sudah menerima pesananmu.
              </p>
            </div>
            <div className="w-full rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 p-4">
              <p className="text-xs font-semibold text-orange-700 uppercase">Kode Pesanan</p>
              <p className="text-2xl font-extrabold tracking-wider text-orange-600">
                {successOrder.code}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Simpan kode ini untuk melacak pesanan
              </p>
            </div>
            <div className="w-full space-y-1 rounded-2xl bg-muted/60 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Bayar</span>
                <span className="font-extrabold text-orange-600">
                  {formatRupiah(successOrder.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pembayaran</span>
                <span className="font-semibold">{PAYMENT_LABELS[payment]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Item</span>
                <span className="font-semibold">
                  {successOrder.items.reduce((s, i) => s + i.quantity, 0)} pcs
                </span>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <a
                href={waLink(
                  "6281234567890",
                  `Halo PetKu! Saya mau konfirmasi pesanan ${successOrder.code} a.n. ${successOrder.customerName}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="h-11 w-full rounded-xl bg-emerald-500 font-bold hover:bg-emerald-600">
                  <MessageCircle className="size-4" />
                  Konfirmasi via WhatsApp
                </Button>
              </a>
              <Button
                onClick={done}
                variant="outline"
                className="h-11 flex-1 rounded-xl border-orange-300 font-bold text-orange-600 hover:bg-orange-50"
              >
                <Package className="size-4" />
                Lacak Pesanan
              </Button>
            </div>
          </div>
        ) : (
          // ===== FORM =====
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-extrabold">
                Checkout Pesanan
              </DialogTitle>
              <DialogDescription>
                Isi data pengiriman — pesanan langsung diproses CS kami
              </DialogDescription>
            </DialogHeader>

            {items.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Keranjang kosong. Tambahkan produk dulu ya! 🐾
              </p>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="ck-name">Nama Penerima *</Label>
                    <Input
                      id="ck-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="cth: Budi Santoso"
                      required
                      minLength={3}
                      className="border-orange-200 focus-visible:ring-orange-400"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="ck-phone">No. WhatsApp *</Label>
                    <Input
                      id="ck-phone"
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="cth: 081234567890"
                      required
                      className="border-orange-200 focus-visible:ring-orange-400"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="ck-address">Alamat Lengkap *</Label>
                  <Textarea
                    id="ck-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota"
                    required
                    minLength={10}
                    rows={3}
                    className="resize-none border-orange-200 focus-visible:ring-orange-400"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="ck-notes">Catatan (opsional)</Label>
                  <Input
                    id="ck-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="cth: titip di pos keamanan"
                    className="border-orange-200 focus-visible:ring-orange-400"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label>Metode Pembayaran *</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {PAYMENT_OPTIONS.map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setPayment(opt.key)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-xl border-2 p-2.5 text-center transition-all",
                          payment === opt.key
                            ? "border-orange-500 bg-orange-50"
                            : "border-border hover:border-orange-300"
                        )}
                        aria-pressed={payment === opt.key}
                      >
                        <opt.icon
                          className={cn(
                            "size-5",
                            payment === opt.key ? "text-orange-600" : "text-muted-foreground"
                          )}
                        />
                        <span className="text-[11px] leading-tight font-bold">{opt.key}</span>
                        <span className="text-[10px] leading-tight text-muted-foreground">
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-1 rounded-2xl bg-muted/60 p-3.5 text-sm">
                  {items.map((i) => (
                    <div key={i.productId} className="flex justify-between gap-2">
                      <span className="min-w-0 truncate text-muted-foreground">
                        {i.emoji} {i.quantity}× {i.name}
                      </span>
                      <span className="shrink-0 font-medium">
                        {formatRupiah(i.price * i.quantity)}
                      </span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ongkir</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Gratis 🎉" : formatRupiah(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold">
                    <span>Total</span>
                    <span className="text-orange-600">{formatRupiah(total)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 rounded-xl bg-orange-500 text-base font-bold hover:bg-orange-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Memproses…
                    </>
                  ) : (
                    <>✅ Buat Pesanan — {formatRupiah(total)}</>
                  )}
                </Button>
                <p className="text-center text-[11px] text-muted-foreground">
                  Dengan membuat pesanan, kamu setuju dengan syarat & ketentuan PetKu
                </p>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
