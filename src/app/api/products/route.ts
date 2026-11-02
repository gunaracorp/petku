import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/products?q=&category=&sort=sold|price-asc|price-desc|rating|newest&featured=true
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const category = searchParams.get("category") ?? "";
    const sort = searchParams.get("sort") ?? "sold";
    const featured = searchParams.get("featured");

    const where: Record<string, unknown> = {};

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { brand: { contains: q } },
        { category: { is: { name: { contains: q } } } },
      ];
    }

    if (category && category !== "semua") {
      where.category = { is: { slug: category } };
    }

    if (featured === "true") {
      where.featured = true;
    }

    let orderBy: Record<string, string>[] = [{ sold: "desc" }];
    if (sort === "price-asc") orderBy = [{ price: "asc" }];
    else if (sort === "price-desc") orderBy = [{ price: "desc" }];
    else if (sort === "rating") orderBy = [{ rating: "desc" }];
    else if (sort === "newest") orderBy = [{ createdAt: "desc" }];

    const products = await db.product.findMany({
      where,
      include: { category: true },
      orderBy,
      take: 100,
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ error: "Gagal memuat produk" }, { status: 500 });
  }
}
