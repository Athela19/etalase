"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ListKategori() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        // Ambil kategori unik dari semua produk aktif
        const uniqueCategories = [
          ...new Set(data.filter((p) => p.active).map((p) => p.category || "Lainnya")),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
      }
    };

    fetchCategories();
  }, []);

  const bgColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-red-500",
  ];
 
  if (categories.length === 0)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Tidak ada kategori ditemukan.
      </div>
    );

  return (
    <div className="min-h-screen px-6 py-24">
      <h1 className="text-2xl font-bold text-slate-900 mb-5">
        Kategori Produk
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {categories.map((category, idx) => {
          const bgColor = bgColors[idx % bgColors.length];
          const textSize =
            category.length > 15 ? "text-sm md:text-lg" : "text-lg md:text-xl";

          return (
            <div
              key={idx}
              onClick={() => router.push(`/kategori/${encodeURIComponent(category)}`)}
              className={`cursor-pointer ${bgColor} hover:opacity-90 hover:-translate-y-1 transition-all 
                          p-4 flex items-center justify-start rounded-lg shadow-lg h-30`}
            >
              <p
                className={`${textSize} font-semibold text-background leading-snug line-clamp-2`}
              >
                {category}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
