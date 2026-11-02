import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const FREE_SHIPPING_MIN = 200_000;
const SHIPPING_COST = 15_000;

function generateOrderCode() {
  const now = new Date();
  const ymd = [
    String(now.getFullYear()).slice(2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PK-${ymd}-${rand}`;
}

// POST /api/orders — buat pesanan baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phone, address, notes, paymentMethod, items } = body;

    if (!customerName?.trim() || customerName.trim().length < 3) {
      return NextResponse.json(
        { error: "Nama penerima wajib diisi (min. 3 huruf)" },
        { status: 400 }
      );
    }
    const digits = String(phone ?? "").replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 15) {
      return NextResponse.json(
        { error: "Nomor WhatsApp tidak valid (9-15 digit)" },
        { status: 400 }
      );
    }
    if (!address?.trim() || address.trim().length < 10) {
      return NextResponse.json(
        { error: "Alamat lengkap wajib diisi (min. 10 karakter)" },
        { status: 400 }
      );
    }
    if (!["COD", "TRANSFER", "EWALLET"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Metode pembayaran tidak valid" },
        { status: 400 }
      );
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Keranjang belanja kosong" },
        { status: 400 }
      );
    }

    // Validasi stok & hitung total di server (jangan percaya harga dari client)
    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
    });

    const lines: {
      productId: string;
      productName: string;
      productEmoji: string;
      productBrand: string;
      price: number;
      quantity: number;
    }[] = [];

    for (const item of items) {
      const product = products.find(
        (p) => p.id === item.productId
      );
      if (!product) {
        return NextResponse.json(
          { error: "Produk tidak ditemukan" },
          { status: 400 }
        );
      }
      const qty = Math.max(1, Math.min(99, Number(item.quantity) || 0));
      if (product.stock < qty) {
        return NextResponse.json(
          {
            error: `Stok "${product.name}" tersisa ${product.stock}`,
          },
          { status: 409 }
        );
      }
      lines.push({
        productId: product.id,
        productName: product.name,
        productEmoji: product.emoji,
        productBrand: product.brand,
        price: product.price,
        quantity: qty,
      });
    }

    const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const shippingCost = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_COST;
    const total = subtotal + shippingCost;

    const order = await db.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          code: generateOrderCode(),
          customerName: customerName.trim(),
          phone: digits,
          address: address.trim(),
          notes: notes?.trim() || null,
          paymentMethod,
          subtotal,
          shippingCost,
          total,
          status: "PENDING",
          items: { create: lines },
        },
        include: { items: true },
      });

      for (const line of lines) {
        await tx.product.update({
          where: { id: line.productId },
          data: {
            stock: { decrement: line.quantity },
            sold: { increment: line.quantity },
          },
        });
      }

      return created;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json(
      { error: "Gagal membuat pesanan. Coba lagi." },
      { status: 500 }
    );
  }
}

// GET /api/orders?phone=08xx | ?code=PK-xxx | (admin, tanpa param)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone")?.replace(/\D/g, "") ?? "";
    const code = searchParams.get("code")?.trim() ?? "";

    const where: Record<string, unknown> = {};
    if (phone) {
      where.phone = { contains: phone };
    } else if (code) {
      where.code = { equals: code, };
      // Pencarian kode boleh tanpa memperhatikan besar/kecil huruf
      delete (where as Record<string, unknown>).code;
      where.code = { contains: code };
    }

    const orders = await db.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json(
      { error: "Gagal memuat pesanan" },
      { status: 500 }
    );
  }
}
