import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/stats — statistik dasbor admin
export async function GET() {
  try {
    const [
      totalOrders,
      totalRevenue,
      pendingOrders,
      shippingOrders,
      totalProducts,
      lowStockProducts,
    ] = await Promise.all([
      db.order.count(),
      db.order.aggregate({
        where: { status: { not: "DIBATALKAN" } },
        _sum: { total: true },
      }),
      db.order.count({ where: { status: "PENDING" } }),
      db.order.count({ where: { status: "DIKIRIM" } }),
      db.product.count(),
      db.product.findMany({
        where: { stock: { lte: 20 } },
        orderBy: { stock: "asc" },
        take: 10,
        include: { category: true },
      }),
    ]);

    const recentOrders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    });

    return NextResponse.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.total ?? 0,
      pendingOrders,
      shippingOrders,
      totalProducts,
      lowStockProducts,
      recentOrders,
    });
  } catch (err) {
    console.error("GET /api/admin/stats error:", err);
    return NextResponse.json(
      { error: "Gagal memuat statistik" },
      { status: 500 }
    );
  }
}
