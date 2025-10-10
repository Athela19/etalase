"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Cookies from "js-cookie";
import ProductCard from "./card";
import ProductModal from "./modal";

export default function ProductList() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["Semua"]);
  const [loading, setLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const itemsPerPage = 8;

  // 🔹 Ambil data produk dan wishlist dari cookie
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setProducts(data);
        const uniqueCategories = [
          "Semua",
          ...Array.from(new Set(data.map((p) => p.category))).filter(Boolean),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Gagal memuat produk:", err);
        setProducts([]);
        setCategories(["Semua"]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

    // Ambil wishlist dari cookie
    try {
      const saved = Cookies.get("wishlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setWishlist(parsed);
      }
    } catch (err) {
      console.error("Gagal parse wishlist:", err);
      setWishlist([]);
    }
  }, []);

  // 🔹 Simpan wishlist ke cookie
  useEffect(() => {
    if (wishlist.length > 0) {
      Cookies.set("wishlist", JSON.stringify(wishlist), {
        expires: 7,
        path: "/",
        sameSite: "Lax",
      });
    } else {
      Cookies.remove("wishlist");
    }
  }, [wishlist]);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // 🔹 Filter dan pagination
  const filteredProducts = useMemo(
    () =>
      products.filter((p) => {
        const matchCategory =
          activeCategory === "Semua" || p.category === activeCategory;
        const matchSearch =
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
      }),
    [products, activeCategory, searchTerm]
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  return (
    <section id="rekomendasi" className="space-y-8">
      {/* 🔍 Filter dan pencarian */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="min-w-full rounded-full text-sm border border-slate-400 pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-primary transition-all"
            placeholder="Cari produk..."
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-1 md:px-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setCurrentPage(1);
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                activeCategory === category
                  ? "bg-primary text-background border-primary"
                  : "bg-background text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 🛍️ Daftar Produk */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: itemsPerPage }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-background shadow-sm overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-slate-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-1/3 bg-slate-200 rounded"></div>
                  <div className="h-4 w-2/3 bg-slate-300 rounded"></div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
                    <div className="h-6 w-14 bg-slate-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          : currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isLoved={wishlist.includes(product.id)}
                toggleWishlist={toggleWishlist}
                openModal={() => setModalProduct(product)}
              />
            ))}

        {!loading && currentProducts.length === 0 && (
          <div className="col-span-full text-center text-slate-500 py-10">
            Tidak ada produk ditemukan.
          </div>
        )}
      </div>

      {/* 📄 Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-slate-300 text-sm hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronLeft />
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-8 h-8 rounded-md text-sm font-medium ${
                currentPage === page
                  ? "bg-primary text-background"
                  : "border border-slate-300 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-slate-300 text-sm hover:bg-slate-50 disabled:opacity-40"
          >
            <ChevronRight />
          </button>
        </div>
      )}

      {/* 🪟 Modal Produk */}
      {modalProduct && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
        />
      )}
    </section>
  );
}
