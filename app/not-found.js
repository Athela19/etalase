"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-16 h-16 text-primary" />
        </div>

        <h1 className="text-5xl font-bold text-gray-800 mb-3">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white font-medium px-5 py-2.5 rounded-lg transition-all"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
