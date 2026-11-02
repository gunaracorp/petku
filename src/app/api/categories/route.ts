import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/categories — daftar kategori + jumlah produk
export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
      include: {
        products: { select: { id: true } },
      },
    });

    const result = categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      emoji: c.emoji,
      description: c.description,
      productCount: c.products.length,
    }));

    return NextResponse.json({ categories: result });
  } catch (err) {
    console.error("GET /api/categories error:", err);
    return NextResponse.json(
      { error: "Gagal memuat kategori" },
      { status: 500 }
    );
  }
}
