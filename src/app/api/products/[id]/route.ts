import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PATCH /api/products/[id] — update stok (restock admin)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { stock } = body;

    const stockNum = Number(stock);
    if (!Number.isInteger(stockNum) || stockNum < 0 || stockNum > 9999) {
      return NextResponse.json(
        { error: "Jumlah stok tidak valid (0-9999)" },
        { status: 400 }
      );
    }

    const product = await db.product.update({
      where: { id },
      data: { stock: stockNum },
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.error("PATCH /api/products/[id] error:", err);
    return NextResponse.json(
      { error: "Gagal memperbarui stok" },
      { status: 500 }
    );
  }
}
