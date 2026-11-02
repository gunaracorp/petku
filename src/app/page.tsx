"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "@/components/petku/header";
import { Hero } from "@/components/petku/hero";
import { CategoryNav } from "@/components/petku/category-nav";
import { FeaturedSection } from "@/components/petku/featured-section";
import { Catalog } from "@/components/petku/catalog";
import { ProductDetailDialog } from "@/components/petku/product-detail";
import { CartSheet } from "@/components/petku/cart-sheet";
import { CheckoutDialog } from "@/components/petku/checkout-dialog";
import { OrderTracking } from "@/components/petku/order-tracking";
import { AdminPanel } from "@/components/petku/admin-panel";
import { Footer } from "@/components/petku/footer";
import { MobileNav } from "@/components/petku/mobile-nav";
import { SmartZone } from "@/components/petku/smart-hub";
import { Pantry } from "@/components/petku/pantry";
import { SmartBudget } from "@/components/petku/smart-budget";
import { PipoMascot } from "@/components/petku/mascot";
import { AiAdvisor } from "@/components/petku/ai-advisor";
import { useCart } from "@/lib/cart-store";
import type { CategoryData, ProductData } from "@/lib/petku-types";
import type { View } from "@/components/petku/view-types";

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [featured, setFeatured] = useState<ProductData[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("semua");
  const [sort, setSort] = useState("sold");
  const filterKey = `${category}|${sort}|${searchQuery}`;
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [advisorOpen, setAdvisorOpen] = useState(false);

  // loading = true selama filter aktif belum selesai dimuat
  const loadingProducts = loadedKey !== filterKey;

  const openCart = useCart((s) => s.open);
  const catalogRef = useRef<HTMLDivElement>(null);

  // Debounce pencarian
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset pencarian dari tombol di katalog
  useEffect(() => {
    const handler = () => setSearchInput("");
    window.addEventListener("petku:reset-search", handler);
    return () => window.removeEventListener("petku:reset-search", handler);
  }, []);

  // Muat kategori sekali
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => setCategories([]));
  }, []);

  // Muat produk sesuai filter (loading diturunkan dari filterKey vs loadedKey)
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ category, sort });
    if (searchQuery) params.set("q", searchQuery);
    fetch(`/api/products?${params}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products ?? []);
        setLoadedKey(filterKey);
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoadedKey(filterKey);
      });
    return () => controller.abort();
  }, [category, sort, searchQuery, filterKey]);

  // Muat produk terlaris (featured)
  useEffect(() => {
    fetch("/api/products?featured=true&sort=sold")
      .then((r) => r.json())
      .then((d) => setFeatured(d.products ?? []))
      .catch(() => setFeatured([]))
      .finally(() => setLoadingFeatured(false));
  }, []);

  const scrollToCatalog = useCallback(() => {
    if (view !== "home") setView("home");
    requestAnimationFrame(() => {
      setTimeout(() => {
        catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    });
  }, [view]);

  const openProduct = useCallback((p: ProductData) => {
    setSelectedProduct(p);
    setDetailOpen(true);
  }, []);

  const buyNow = useCallback((p: ProductData, qty: number) => {
    setSelectedProduct(p);
    setDetailOpen(false);
    setCheckoutOpen(true);
  }, []);

  const goView = useCallback((v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openAdvisor = useCallback(() => setAdvisorOpen(true), []);

  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf3]">
      <Header
        view={view}
        onViewChange={goView}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />

      <main className="flex-1 pb-20 md:pb-0">
        {view === "home" && (
          <>
            <Hero onShop={scrollToCatalog} />
            <CategoryNav
              categories={categories}
              selected={category}
              onSelect={(slug) => {
                setCategory(slug);
                scrollToCatalog();
              }}
            />
            <SmartZone onAsk={openAdvisor} onPantry={() => goView("pantry")} onBudget={() => goView("budget")} />
            <FeaturedSection
              products={featured}
              loading={loadingFeatured}
              onOpenProduct={openProduct}
            />
            <div ref={catalogRef} className="scroll-mt-24">
              <Catalog
                products={products}
                categories={categories}
                loading={loadingProducts}
                category={category}
                onCategoryChange={setCategory}
                sort={sort}
                onSortChange={setSort}
                searchValue={searchQuery}
                onOpenProduct={openProduct}
              />
            </div>
          </>
        )}

        {view === "orders" && <OrderTracking />}
        {view === "admin" && <AdminPanel />}
        {view === "pantry" && <Pantry />}
        {view === "budget" && (
          <SmartBudget products={products} categories={categories} loading={loadingProducts} />
        )}
      </main>

      <Footer />
      <MobileNav
        view={view}
        onViewChange={goView}
        onShop={scrollToCatalog}
      />

      <PipoMascot onAsk={openAdvisor} chatOpen={advisorOpen} />
      <AiAdvisor
        open={advisorOpen}
        onOpenChange={setAdvisorOpen}
        onOpenProduct={openProduct}
      />

      <ProductDetailDialog
        product={selectedProduct}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onBuyNow={buyNow}
      />
      <CartSheet onCheckout={() => setCheckoutOpen(true)} />
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        onSuccess={() => {
          goView("orders");
        }}
      />
    </div>
  );
}
