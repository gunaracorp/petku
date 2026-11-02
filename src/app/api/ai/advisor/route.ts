import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formatRupiah } from "@/lib/format";
import { PET_META, type PetType } from "@/lib/petku-smart";

export const dynamic = "force-dynamic";

type ChatMsg = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `Kamu adalah "Dr. Pipo", ahli gizi hewan di PetKu — toko makanan hewan online Indonesia. Kamu ANJING corgi ceria yang bicara hangat, santai, dan lucu (pakai "guk!" sesekali). Bahasa: Indonesia santai, maksimal 130 kata, boleh pakai emoji hewan.

ATURAN WAJIB:
1. Hanya rekomendasikan produk dari katalog yang diberikan. JANGAN pernah mengarang produk/brand baru.
2. Sebut nama produk + harga saat merekomendasikan.
3. Tanyakan info penting yang belum diketahui: jenis hewan, umur (anak/dewasa), bobot, kondisi khusus (alergi/kurang gizi), atau budget. Tapi tetap beri rekomendasi awal, jangan cuma balik bertanya.
4. Saran porsi wajar: anjing dewasa ±20 g/kg bobot/hari, kucing dewasa ±15 g/kg, anak hewan ×1,6.
5. Jangan beri nasihat medis; untuk sakit, sarankan ke dokter hewan.
6. Akhiri jawaban PERSIS dengan satu baris khusus berformat:
REKOMENDASI: <id1> | <id2> | <id3>
(ganti dengan maksimal 3 id produk paling relevan dari katalog, tanpa teks lain di baris itu).`;

type CatalogRow = {
  id: string;
  name: string;
  brand: string;
  price: number;
  weight: string;
  rating: number;
  sold: number;
  category: { slug: string; name: string };
};

function buildFallbackReply(
  message: string,
  products: CatalogRow[]
): { reply: string; ids: string[] } {
  const lower = message.toLowerCase();
  const typeMap: [PetType, string[]][] = [
    ["kucing", ["kucing", "cat", "meong", "whiskas"]],
    ["anjing", ["anjing", "dog", "guk", "corgi", "puppy", "anak anjing"]],
    ["burung", ["burung", "lovebird", "parkit", "kutilang", "perkutut"]],
    ["ikan", ["ikan", "voer", "koi", "guppy", "aqua"]],
    ["hamster", ["hamster"]],
    ["kelinci", ["kelinci", "rabbit"]],
    ["reptil", ["reptil", "kura", "iguana", "turtle"]],
  ];
  let petType: PetType | null = null;
  for (const [t, words] of typeMap) {
    if (words.some((w) => lower.includes(w))) {
      petType = t;
      break;
    }
  }

  // budget → angka "200rb" / "200000" / "200 ribu"
  const budgetMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(rb|ribu|k\b)?/);
  let budget: number | null = null;
  if (budgetMatch) {
    const num = Number.parseFloat(budgetMatch[1].replace(",", "."));
    if (Number.isFinite(num)) {
      budget = budgetMatch[2] ? num * 1000 : num;
      if (budget < 10000) budget *= 1000; // "200" → 200rb
    }
  }

  let pool = products;
  if (petType) {
    const catSlug = `makanan-${petType}`;
    pool = products.filter((p) =>
      petType === "hamster" || petType === "kelinci"
        ? p.category.slug === "hamster-kelinci"
        : p.category.slug === catSlug
    );
    if (pool.length === 0) pool = products;
  }
  if (budget) {
    const affordable = pool.filter((p) => p.price <= budget);
    if (affordable.length > 0) pool = affordable;
  }

  const pick = (arr: CatalogRow[], n: number) =>
    [...arr].sort((a, b) => b.rating - a.rating).slice(0, n);
  const top = pick(pool, 3);
  const ids = top.map((p) => p.id);
  const names = top.slice(0, 2).map((p) => `${p.name} (${formatRupiah(p.price)})`);

  const petLabel = petType ? `${PET_META[petType].emoji} ${PET_META[petType].label}` : "anabul";
  const budgetLine =
    budget !== null
      ? ` Sesuai budget ${formatRupiah(budget)}, ini pilihan terbaiknya:`
      : " Ini rekomendasi favorit pelanggan kita:";
  const reply = `Guk! Untuk ${petLabel},${budgetLine} ${names.join(" dan ")}. Kalau boleh tahu, umurnya anak atau dewasa ya? Biar aku hitung porsi pas 🦴\n\nREKOMENDASI: ${ids.join(" | ")}`;
  return { reply, ids };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { message?: string; history?: ChatMsg[] };
    const message = (body.message ?? "").slice(0, 600).trim();
    if (!message) {
      return NextResponse.json({ error: "Pertanyaan kosong" }, { status: 400 });
    }

    // Katalog live dari database
    const rows = await db.product.findMany({
      where: { stock: { gt: 0 } },
      include: { category: true },
      orderBy: { sold: "desc" },
      take: 60,
    });
    const catalogText = rows
      .map(
        (p) =>
          `- [${p.id}] ${p.name} | ${p.brand} | ${p.category.name} | kemasan ${p.weight} | ${formatRupiah(p.price)} | rating ${p.rating.toFixed(1)} | terjual ${p.sold}`
      )
      .join("\n");

    const history: ChatMsg[] = (body.history ?? [])
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 500) }));

    let reply = "";
    try {
      const { default: ZAI } = await import("z-ai-web-dev-sdk");
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: "assistant", content: SYSTEM_PROMPT },
          {
            role: "assistant",
            content: `KATALOG PETKU (id | nama | brand | kategori | kemasan | harga | rating | terjual):\n${catalogText}`,
          },
          ...history,
          { role: "user", content: message },
        ],
      });
      reply = completion.choices[0]?.message?.content?.trim() ?? "";
    } catch (aiError) {
      console.error("AI advisor fallback:", aiError);
    }

    if (!reply) {
      const fb = buildFallbackReply(message, rows);
      return NextResponse.json({ reply: fb.reply, productIds: fb.ids });
    }

    // Parse baris REKOMENDASI → id valid di katalog
    let productIds: string[] = [];
    const match = reply.match(/REKOMENDASI:\s*([^\n]+)/i);
    if (match) {
      productIds = match[1]
        .split(/[|,]/)
        .map((s) => s.trim())
        .filter((id) => rows.some((r) => r.id === id))
        .slice(0, 3);
      reply = reply.replace(match[0], "").trim();
    }
    if (productIds.length === 0) {
      productIds = buildFallbackReply(message, rows).ids.slice(0, 2);
    }

    return NextResponse.json({ reply, productIds });
  } catch (err) {
    console.error("AI advisor error:", err);
    return NextResponse.json(
      { error: "Dr. Pipo sedang tidur siang, coba lagi sebentar ya 🐾" },
      { status: 500 }
    );
  }
}
