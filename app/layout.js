// app/layout.js atau app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutClient from "@/component/layout/layout";
import ConfigProvider from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fungsi async untuk mengambil metadata secara dinamis
export async function generateMetadata() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/config`, {
      cache: 'no-store', // untuk SSR (bisa juga pakai 'force-cache' tergantung kebutuhan)
    });

    if (!res.ok) {
      throw new Error("Failed to fetch metadata");
    }

    const config = await res.json();

    return {
      title: config.storeName || "Default Title",
      description: config.description || "Default description",
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: "Fallback Title",
      description: "Fallback Description",
    };
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LayoutClient>
          <ConfigProvider>{children}</ConfigProvider>
        </LayoutClient>
      </body>
    </html>
  );
}
