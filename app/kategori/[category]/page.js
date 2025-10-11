"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/component/dashboard/products/card";

export default function CategoryDetailPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        // Filter berdasarkan kategori (case-insensitive)
        const filtered = data.filter(
          (p) =>
            p.active &&
            p.category?.toLowerCase() === decodeURIComponent(category).toLowerCase()
        );

        setProducts(filtered);
      } catch (err) {
        console.error("Gagal memuat produk:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Memuat produk kategori...
      </div>
    );

  if (products.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500 text-center">
        <h2 className="text-2xl font-semibold mb-2">Tidak ada produk</h2>
        <p>Kategori “{decodeURIComponent(category)}” belum memiliki produk aktif.</p>
      </div>
    );

  return (
    <div className="min-h-screen px-6 py-24">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
