import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const VALID_STATUSES = ["PENDING", "DIPROSES", "DIKIRIM", "SELESAI", "DIBATALKAN"];

// PATCH /api/orders/[id] — ubah status pesanan (admin) / batalkan (pembeli)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, restock } = body;

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Status tidak valid" },
        { status: 400 }
      );
    }

    const existing = await db.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }
    if (existing.status === "SELESAI" || existing.status === "DIBATALKAN") {
      return NextResponse.json(
        { error: "Pesanan yang sudah selesai/dibatalkan tidak bisa diubah" },
        { status: 409 }
      );
    }

    const order = await db.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id },
        data: { status },
        include: { items: true },
      });

      // Jika dibatalkan, kembalikan stok
      if (status === "DIBATALKAN" && restock !== false) {
        for (const item of existing.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { increment: item.quantity },
                sold: { decrement: item.quantity },
              },
            });
          }
        }
      }

      return updated;
    });

    return NextResponse.json({ order });
  } catch (err) {
    console.error("PATCH /api/orders/[id] error:", err);
    return NextResponse.json(
      { error: "Gagal memperbarui pesanan" },
      { status: 500 }
    );
  }
}
