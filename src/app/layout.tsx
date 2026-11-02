import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetKu — Toko Makanan Hewan Online Terlengkap",
  description:
    "PetKu: jual makanan hewan lengkap — anjing, kucing, burung, ikan, hamster, kelinci & reptil. 100% original, gratis ongkir min. Rp200rb, COD tersedia.",
  keywords: [
    "makanan hewan",
    "pet shop online",
    "makanan kucing",
    "makanan anjing",
    "voer burung",
    "pellet ikan",
    "PetKu",
  ],
  authors: [{ name: "PetKu" }],
  appleWebApp: {
    capable: true,
    title: "PetKu",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
