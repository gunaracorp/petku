export type CategoryData = {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  description: string | null;
  productCount: number;
};

export type ProductData = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  weight: string;
  emoji: string;
  color: string;
  rating: number;
  sold: number;
  featured: boolean;
  description: string;
  categoryId: string;
  category: { slug: string; name: string; emoji: string };
};

export type OrderItemData = {
  id: string;
  productId: string | null;
  productName: string;
  productEmoji: string;
  productBrand: string;
  price: number;
  quantity: number;
};

export type OrderData = {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  notes: string | null;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: "PENDING" | "DIPROSES" | "DIKIRIM" | "SELESAI" | "DIBATALKAN";
  createdAt: string;
  items: OrderItemData[];
};

export type AdminStats = {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  shippingOrders: number;
  totalProducts: number;
  lowStockProducts: ProductData[];
  recentOrders: OrderData[];
};

export const FREE_SHIPPING_MIN = 200_000;
export const SHIPPING_COST = 15_000;
export const ADMIN_PIN = "petku2026";

export const PAYMENT_LABELS: Record<string, string> = {
  COD: "Bayar di Tempat (COD)",
  TRANSFER: "Transfer Bank",
  EWALLET: "E-Wallet (DANA/OVO/GoPay)",
};

export const STATUS_META: Record<
  string,
  { label: string; short: string; color: string; step: number }
> = {
  PENDING: { label: "Menunggu Konfirmasi", short: "Diterima", color: "bg-amber-100 text-amber-800 border-amber-200", step: 0 },
  DIPROSES: { label: "Sedang Diproses", short: "Diproses", color: "bg-orange-100 text-orange-800 border-orange-200", step: 1 },
  DIKIRIM: { label: "Sedang Dikirim", short: "Dikirim", color: "bg-cyan-100 text-cyan-800 border-cyan-200", step: 2 },
  SELESAI: { label: "Selesai", short: "Selesai", color: "bg-emerald-100 text-emerald-800 border-emerald-200", step: 3 },
  DIBATALKAN: { label: "Dibatalkan", short: "Dibatalkan", color: "bg-red-100 text-red-700 border-red-200", step: -1 },
};
