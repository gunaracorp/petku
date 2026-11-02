/**
 * Seed data PetKu — Toko Makanan Hewan
 * Jalankan: bun scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";

process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? "file:/home/z/my-project/db/custom.db";

const db = new PrismaClient();

const categories = [
  {
    slug: "makanan-anjing",
    name: "Makanan Anjing",
    emoji: "🐕",
    description: "Dry food, wet food & snack untuk anjing segala umur",
  },
  {
    slug: "makanan-kucing",
    name: "Makanan Kucing",
    emoji: "🐈",
    description: "Pakan kucing lengkap: kitten, dewasa, sampai persia",
  },
  {
    slug: "makanan-burung",
    name: "Makanan Burung",
    emoji: "🐦",
    description: "Voer, biji-bijian & treat untuk burung kicau & lovebird",
  },
  {
    slug: "makanan-ikan",
    name: "Makanan Ikan",
    emoji: "🐟",
    description: "Pellet ikan hias, koi, arwana & akuarium",
  },
  {
    slug: "hamster-kelinci",
    name: "Hamster & Kelinci",
    emoji: "🐹",
    description: "Muesli, pellet & jerami untuk hewan mungil",
  },
  {
    slug: "reptil",
    name: "Reptil",
    emoji: "🦎",
    description: "Pakan kura-kura, bunglon, ular & suplemen kalsium",
  },
];

type SeedProduct = {
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  weight: string;
  emoji: string;
  color: string;
  rating: number;
  sold: number;
  featured?: boolean;
  description: string;
};

const products: SeedProduct[] = [
  // ===== ANJING =====
  {
    name: "Royal Canin Maxi Adult 15 kg",
    brand: "Royal Canin",
    category: "makanan-anjing",
    price: 985000,
    originalPrice: 1150000,
    stock: 24,
    weight: "15 kg",
    emoji: "🦴",
    color: "orange",
    rating: 4.9,
    sold: 1240,
    featured: true,
    description:
      "Pakan lengkap untuk anjing ras besar dewasa. Mendukung kesehatan tulang & sendi dengan glukosamin, serta menjaga berat badan ideal.",
  },
  {
    name: "Royal Canin Mini Adult 3 kg",
    brand: "Royal Canin",
    category: "makanan-anjing",
    price: 265000,
    originalPrice: 295000,
    stock: 40,
    weight: "3 kg",
    emoji: "🦴",
    color: "orange",
    rating: 4.9,
    sold: 980,
    description:
      "Kibble kecil khusus anjing ras mini dewasa. Nutrisi seimbang dengan antioksidan untuk kesehatan kulit & bulu berkilau.",
  },
  {
    name: "Pedigree Adult Beef 10 kg",
    brand: "Pedigree",
    category: "makanan-anjing",
    price: 315000,
    originalPrice: 355000,
    stock: 55,
    weight: "10 kg",
    emoji: "🍖",
    color: "orange",
    rating: 4.7,
    sold: 2100,
    featured: true,
    description:
      "Dry food rasa daging sapi dengan 20 vitamin & mineral. Formulasi lengkap untuk anjing dewasa aktif, mudah dicerna.",
  },
  {
    name: "Pedigree Puppy Milk 1,2 kg",
    brand: "Pedigree",
    category: "makanan-anjing",
    price: 78000,
    stock: 80,
    weight: "1,2 kg",
    emoji: "🥛",
    color: "orange",
    rating: 4.8,
    sold: 1750,
    description:
      "Pakan anjing puppy dengan susu & DHA untuk perkembangan otak. Tekstur lembut mudah dikunyah gigi kecil yang sedang tumbuh.",
  },
  {
    name: "Dogz Barbeque Grilled 10 kg",
    brand: "Dogz",
    category: "makanan-anjing",
    price: 265000,
    stock: 35,
    weight: "10 kg",
    emoji: "🍖",
    color: "orange",
    rating: 4.8,
    sold: 1830,
    description:
      "Pakan anjing rasa barbeque dengan nutrisi lengkap, tinggi protein hewani untuk energi bermain sepanjang hari.",
  },
  {
    name: "Champoo Chicken & Egg 10 kg",
    brand: "Champoo",
    category: "makanan-anjing",
    price: 275000,
    stock: 30,
    weight: "10 kg",
    emoji: "🍗",
    color: "orange",
    rating: 4.7,
    sold: 860,
    description:
      "Kombinasi ayam & telur yang kaya protein dan kalsium. Cocok untuk anjing segala umur, membantu pembentukan otot.",
  },
  {
    name: "Excel Dry Dog Food Beef 5 kg",
    brand: "Excel",
    category: "makanan-anjing",
    price: 189000,
    originalPrice: 210000,
    stock: 45,
    weight: "5 kg",
    emoji: "🥩",
    color: "orange",
    rating: 4.6,
    sold: 720,
    description:
      "Pakan ekonomis berkualitas dengan rasa daging sapi favorit anjing. Diperkaya omega 3 & 6 untuk bulu sehat.",
  },
  {
    name: "Pro Plan Puppy Chicken 3 kg",
    brand: "Purina Pro Plan",
    category: "makanan-anjing",
    price: 395000,
    stock: 18,
    weight: "3 kg",
    emoji: "🐕‍🦺",
    color: "orange",
    rating: 5.0,
    sold: 430,
    featured: true,
    description:
      "Premium puppy food dengan real chicken sebagai bahan utama. DHA dari ikan salmon mendukung kognisi & latihan kepatuhan.",
  },
  {
    name: "Smart Heart Adult 10 kg",
    brand: "Smart Heart",
    category: "makanan-anjing",
    price: 245000,
    stock: 42,
    weight: "10 kg",
    emoji: "🧠",
    color: "orange",
    rating: 4.6,
    sold: 1120,
    description:
      "Diperkaya DHA & Choline untuk fungsi otak optimal. Pakan harian lengkap anjing dewasa dengan harga bersahabat.",
  },

  // ===== KUCING =====
  {
    name: "Royal Canin Persian Adult 2 kg",
    brand: "Royal Canin",
    category: "makanan-kucing",
    price: 315000,
    originalPrice: 340000,
    stock: 26,
    weight: "2 kg",
    emoji: "🐱",
    color: "rose",
    rating: 4.9,
    sold: 1650,
    featured: true,
    description:
      "Khusus kucing Persian dewasa. Kibble almond mudah dijangkau mulut berkaki datar, membantu mengurangi hairball.",
  },
  {
    name: "Royal Canin Kitten 2 kg",
    brand: "Royal Canin",
    category: "makanan-kucing",
    price: 320000,
    stock: 32,
    weight: "2 kg",
    emoji: "🐈",
    color: "rose",
    rating: 4.9,
    sold: 1380,
    featured: true,
    description:
      "Nutrisi intensif untuk anak kucing 1-12 bulan. Mendukung fase pertumbuhan pesat dengan protein tinggi & prebiotik.",
  },
  {
    name: "Whiskas Adult Tuna 7 kg",
    brand: "Whiskas",
    category: "makanan-kucing",
    price: 315000,
    originalPrice: 365000,
    stock: 60,
    weight: "7 kg",
    emoji: "🐟",
    color: "rose",
    rating: 4.8,
    sold: 3200,
    featured: true,
    description:
      "Pakan kucing dewasa rasa tuna laut dengan 40 nutrisi esensial. Produk terlaris, cocok untuk kucing segala ras.",
  },
  {
    name: "Whiskas Junior Mackerel 1,2 kg",
    brand: "Whiskas",
    category: "makanan-kucing",
    price: 68000,
    stock: 90,
    weight: "1,2 kg",
    emoji: "🐠",
    color: "rose",
    rating: 4.8,
    sold: 2450,
    description:
      "Pakan anak kucing rasa makarel dengan susu untuk pencernaan yang sehat. Diperkaya vitamin E & taurin.",
  },
  {
    name: "Friskies Classic Ocean Fish 7 kg",
    brand: "Friskies",
    category: "makanan-kucing",
    price: 285000,
    stock: 48,
    weight: "7 kg",
    emoji: "🐟",
    color: "rose",
    rating: 4.7,
    sold: 1560,
    description:
      "Campuran ikan laut lezat dengan tekstur renyah. Nutrisi lengkap untuk kucing dewasa yang aktif dan sehat.",
  },
  {
    name: "Cat's Choice Tuna 10 kg",
    brand: "Cat's Choice",
    category: "makanan-kucing",
    price: 245000,
    stock: 38,
    weight: "10 kg",
    emoji: "🍽️",
    color: "rose",
    rating: 4.6,
    sold: 890,
    description:
      "Pilihan ekonomis untuk rumah dengan banyak kucing. Rasa tuna yang disukai kucing, kemasan besar lebih hemat.",
  },
  {
    name: "Equilibrio Adult Cat Chicken 7,5 kg",
    brand: "Equilibrio",
    category: "makanan-kucing",
    price: 585000,
    stock: 12,
    weight: "7,5 kg",
    emoji: "⚖️",
    color: "rose",
    rating: 4.9,
    sold: 340,
    description:
      "Super premium dengan 72% protein hewani. Formulasi grain-free untuk kucing dewasa dengan pencernaan sensitif.",
  },
  {
    name: "Excel Cat Tuna & Salmon 3 kg",
    brand: "Excel",
    category: "makanan-kucing",
    price: 129000,
    originalPrice: 145000,
    stock: 52,
    weight: "3 kg",
    emoji: "🍣",
    color: "rose",
    rating: 4.6,
    sold: 670,
    description:
      "Duo rasa tuna & salmon yang menggoda. Mengandung taurin untuk kesehatan jantung & penglihatan kucing.",
  },

  // ===== BURUNG =====
  {
    name: "CP 511 Voer Burung Kicau 5 kg",
    brand: "Charoen Pokphand",
    category: "makanan-burung",
    price: 85000,
    stock: 70,
    weight: "5 kg",
    emoji: "🌾",
    color: "amber",
    rating: 4.7,
    sold: 2610,
    featured: true,
    description:
      "Voer pellet andalan untuk burung kicau mania. Membantu konsistensi bunyi, keringatan cepat, dan bulu mengkilap.",
  },
  {
    name: "Takari Kuning Voer 1 kg",
    brand: "Takari",
    category: "makanan-burung",
    price: 22000,
    stock: 120,
    weight: "1 kg",
    emoji: "🟡",
    color: "amber",
    rating: 4.8,
    sold: 3100,
    description:
      "Voer kuning klasik pilihan kicau mania. Membantu suara lebih panjang, gacor, dan meningkatkan birahi burung.",
  },
  {
    name: "Stick Lovebird Fruity 500 g",
    brand: "Yumsnack",
    category: "makanan-burung",
    price: 35000,
    stock: 85,
    weight: "500 g",
    emoji: "🥖",
    color: "amber",
    rating: 4.7,
    sold: 760,
    description:
      "Snack stick buah untuk lovebird & parkit. Kaya vitamin, melatih aktivitas mengunyah alami burung peliharaan.",
  },
  {
    name: "Millet Putih 1 kg",
    brand: "Tropifarm",
    category: "makanan-burung",
    price: 30000,
    stock: 95,
    weight: "1 kg",
    emoji: "🍚",
    color: "amber",
    rating: 4.6,
    sold: 1140,
    description:
      "Jewawut putih segar untuk lovebird, finch & parkit. Sumber karbohidrat berkualitas dengan biji pilihan bersih.",
  },
  {
    name: "Voer Kalep Kuning 500 g",
    brand: "Tropifarm",
    category: "makanan-burung",
    price: 18000,
    stock: 110,
    weight: "500 g",
    emoji: "🥮",
    color: "amber",
    rating: 4.5,
    sold: 980,
    description:
      "Kalep kuning pilihan untuk murai batu, kacer & anis. Tekstur halus mudah bercampur dengan voer utama.",
  },

  // ===== IKAN =====
  {
    name: "Takaron Pellet Koi 5 kg",
    brand: "Takaron",
    category: "makanan-ikan",
    price: 145000,
    originalPrice: 165000,
    stock: 33,
    weight: "5 kg",
    emoji: "🐠",
    color: "emerald",
    rating: 4.8,
    sold: 900,
    featured: true,
    description:
      "Pellet koi floating kualitas ekspor dengan spirulina. Mempercerahkan warna koi dan tidak mencemari air kolam.",
  },
  {
    name: "Tetra Bits Complete 300 ml",
    brand: "Tetra",
    category: "makanan-ikan",
    price: 95000,
    stock: 28,
    weight: "300 ml",
    emoji: "🟠",
    color: "emerald",
    rating: 4.9,
    sold: 610,
    featured: true,
    description:
      "Granulat premium untuk ikan hias tropis. BioActive formula menjaga air jernih & sistem kekebalan ikan optimal.",
  },
  {
    name: "Hikari Cichlid Staple 500 g",
    brand: "Hikari",
    category: "makanan-ikan",
    price: 135000,
    stock: 20,
    weight: "500 g",
    emoji: "🇯🇵",
    color: "emerald",
    rating: 4.8,
    sold: 450,
    description:
      "Pakan ikan cichlid dari Jepang. Pellet floating berkualitas tinggi untuk pertumbuhan & warna maksimal.",
  },
  {
    name: "Bloodworm Freeze Dried 20 g",
    brand: "Ocean Nutrition",
    category: "makanan-ikan",
    price: 42000,
    stock: 65,
    weight: "20 g",
    emoji: "🪱",
    color: "emerald",
    rating: 4.7,
    sold: 830,
    description:
      "Cacing darah kering untuk ikan arwana, betta & guppy. Meningkatkan nafsu makan dan warna alami ikan.",
  },
  {
    name: "Pellet Ikan Hias S2 1 kg",
    brand: "Tropifarm",
    category: "makanan-ikan",
    price: 45000,
    stock: 74,
    weight: "1 kg",
    emoji: "🐡",
    color: "emerald",
    rating: 4.6,
    sold: 1290,
    description:
      "Pellet harian untuk ikan hias air tawar. Formulasi seimbang, floating type mudah dipantau saat pemberian.",
  },

  // ===== HAMSTER & KELINCI =====
  {
    name: "Vitakraft Menü Vital Hamster 1 kg",
    brand: "Vitakraft",
    category: "hamster-kelinci",
    price: 88000,
    stock: 30,
    weight: "1 kg",
    emoji: "🐹",
    color: "lime",
    rating: 4.9,
    sold: 520,
    description:
      "Muesli lengkap Jerman untuk hamster. Campuran biji-bijian, sayuran & vitamin dengan dandelion berkualitas premium.",
  },
  {
    name: "Hamster Seed Mix Premium 800 g",
    brand: "Bunny Nature",
    category: "hamster-kelinci",
    price: 46000,
    originalPrice: 52000,
    stock: 48,
    weight: "800 g",
    emoji: "🌰",
    color: "lime",
    rating: 4.6,
    sold: 640,
    description:
      "Campuran biji bunga matahari, jagung & kacang hijau pilihan. Camilan sehat harian untuk segala jenis hamster.",
  },
  {
    name: "Pellet Kelinci Super 5 kg",
    brand: "Tropifarm",
    category: "hamster-kelinci",
    price: 95000,
    stock: 40,
    weight: "5 kg",
    emoji: "🐰",
    color: "lime",
    rating: 4.7,
    sold: 1400,
    featured: true,
    description:
      "Pellet kaya serat untuk kelinci dewasa. Membantu kesehatan gigi & pencernaan, tanpa bahan pengawet berbahaya.",
  },
  {
    name: "Alfalfa Hay Premium 1 kg",
    brand: "Oxbow",
    category: "hamster-kelinci",
    price: 55000,
    stock: 36,
    weight: "1 kg",
    emoji: "🌾",
    color: "lime",
    rating: 4.8,
    sold: 470,
    description:
      "Jerami alfalfa hijau segar kaya kalsium & serat. Ideal untuk kelinci muda, chinchilla & guinea pig.",
  },

  // ===== REPTIL =====
  {
    name: "Turtle Pellet Astro 1 kg",
    brand: "Astro",
    category: "reptil",
    price: 78000,
    stock: 44,
    weight: "1 kg",
    emoji: "🐢",
    color: "teal",
    rating: 4.7,
    sold: 620,
    featured: true,
    description:
      "Pakan kura-kura air dengan protein & kalsium tinggi. Pellet floating membantu kura aktif dan cangkang kokoh.",
  },
  {
    name: "Cricket Kaleng Zilla 35 g",
    brand: "Zilla",
    category: "reptil",
    price: 58000,
    stock: 25,
    weight: "35 g",
    emoji: "🦗",
    color: "teal",
    rating: 4.8,
    sold: 310,
    description:
      "Jangkrik kaleng untuk bunglon, cicak & ular. Sumber protein hidup tanpa perlu memelihara jangkrik sendiri.",
  },
  {
    name: "Calcium Powder Reptile 200 g",
    brand: "Rep-Cal",
    category: "reptil",
    price: 65000,
    stock: 22,
    weight: "200 g",
    emoji: "🦴",
    color: "teal",
    rating: 4.9,
    sold: 280,
    description:
      "Suplemen kalsium + vitamin D3 untuk reptil kandang. Mencegah MBD (metabolic bone disease) pada bunglon & iguana.",
  },
  {
    name: "Freeze Dried Shrimp Turtle 100 g",
    brand: "Zoo Med",
    category: "reptil",
    price: 48000,
    stock: 50,
    weight: "100 g",
    emoji: "🦐",
    color: "teal",
    rating: 4.6,
    sold: 390,
    description:
      "Udang kering sebagai treat kura-kura & axolotl. Kaya protein, praktis disimpan tanpa perlu kulkas.",
  },
];

async function main() {
  console.log("🌱 Seeding PetKu database...");

  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();

  for (const c of categories) {
    await db.category.create({ data: c });
  }
  console.log(`✅ ${categories.length} kategori dibuat`);

  for (const p of products) {
    const { category, ...data } = p;
    const cat = await db.category.findUnique({ where: { slug: category } });
    if (!cat) throw new Error(`Kategori tidak ditemukan: ${category}`);
    await db.product.create({ data: { ...data, categoryId: cat.id } });
  }
  console.log(`✅ ${products.length} produk dibuat`);
}

main()
  .then(() => {
    console.log("🎉 Seeding selesai!");
  })
  .catch((e) => {
    console.error("❌ Seed gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
