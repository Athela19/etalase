"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Card from "@/component/reusable/card";
import ConfirmModal from "@/component/reusable/modal";
import { useWishlistStore } from "@/store/wishlistStore";
import RelatedProducts from "@/component/dashboard/products/detail/related";

export default function Wishlist() {
  const { wishlist, loadWishlist, toggleWishlist } = useWishlistStore();
  const [products, setProducts] = useState([]);
  const [related, setRelated] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  /** 🔹 Deteksi ukuran layar (mobile / desktop) */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /** 🔹 Muat wishlist dari cookie (via Zustand) */
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  /** 🔹 Ambil produk wishlist */
  const fetchWishlistProducts = useCallback(async () => {
    if (!wishlist.length) {
      setProducts([]);
      setRelated([]);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get("/api/products");

      // Filter produk yang masuk wishlist
      const filtered = data.filter((p) => wishlist.some((w) => w.id === p.id));
      setProducts(filtered);

      // Ambil kategori dari produk wishlist
      const wishlistCategories = filtered.map((p) => p.category);

      // Produk lain dari kategori yang sama
      const relatedProducts = data.filter(
        (p) =>
          wishlistCategories.includes(p.category) &&
          !wishlist.some((w) => w.id === p.id)
      );

      setRelated(relatedProducts.slice(0, 8)); // batasi 8 produk
    } catch (err) {
      console.error("Gagal memuat produk:", err);
    } finally {
      setLoading(false);
    }
  }, [wishlist]);

  useEffect(() => {
    fetchWishlistProducts();
  }, [fetchWishlistProducts]);

  /** 🔹 Fungsi bantu potong teks */
  const truncate = (text, maxLength) =>
    text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  /** 🔹 State loading */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Memuat wishlist...</p>
      </div>
    );
  }

  return (
    <div className="p-4 mt-24 max-w-md md:max-w-screen mx-auto md:mx-12">
      {/* 🔸 Jika wishlist kosong */}
      {products.length === 0 ? (
        <p className="text-gray-500 text-center mt-8">
          Tidak ada produk di wishlist
        </p>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {products.map((item) => {
            const name = isMobile ? truncate(item.name, 100) : item.name;
            const priceStr = Number(item.price).toLocaleString("id-ID");
            const price = isMobile ? truncate(priceStr, 25) : priceStr;

            const imageSrc = Array.isArray(item.image)
              ? item.image[0]?.trimStart()
              : item.image?.split(",")[0]?.trimStart();

            return (
              <Card
                key={item.id}
                className="relative flex flex-row gap-3 p-3 overflow-hidden transition-all duration-200"
              >
                {/* 🔹 Gambar produk */}
                <div className="flex-shrink-0 w-28 h-28 overflow-hidden rounded-lg">
                  <Image
                    src={imageSrc || "/no-image.png"}
                    width={112}
                    height={112}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* 🔹 Informasi produk */}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-semibold text-sm line-clamp-2">
                      {name}
                    </h4>
                    <p className="text-xs text-slate-500">{item.category}</p>
                    <p className="text-sm line-clamp-2">{item.description}</p>
                    <span className="block mt-2 font-bold text-slate-800 text-sm">
                      Rp {price}
                    </span>
                  </div>

                  {/* 🔹 Tombol aksi */}
                  <div
                    className={`${
                      isMobile
                        ? "flex  gap-2 mt-4"
                        : "flex items-center justify-end gap-2 mt-3"
                    }`}
                  >
                    <button
                      onClick={() => setConfirmDelete(item)}
                      className={`text-xs py-1.5 px-3 rounded-lg border transition-all ${
                        isMobile
                          ? "w-full text-primary bg-background hover:bg-primary hover:text-background border-primary"
                          : "text-primary bg-background hover:bg-primary hover:text-background border-primary"
                      }`}
                    >
                      Hapus
                    </button>

                    <Link
                      href={`/produk/${item.id}`}
                      className={`text-xs py-1.5 px-3 rounded-lg border transition-all text-center ${
                        isMobile
                          ? "w-full text-background bg-primary hover:bg-background hover:text-primary border-primary"
                          : "text-background bg-primary hover:bg-background hover:text-primary border-primary"
                      }`}
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 🔹 Modal konfirmasi hapus */}
      {confirmDelete && (
        <ConfirmModal
          mode="delete"
          title="Hapus dari Wishlist?"
          message={`Apakah Anda yakin ingin menghapus "${confirmDelete.name}" dari wishlist?`}
          confirmText="Hapus"
          cancelText="Batal"
          onConfirm={() => {
            toggleWishlist(confirmDelete.id);
            setConfirmDelete(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
      <div className="pt-4">
        <RelatedProducts
          products={related}
          wishlist={wishlist || []}
          toggleWishlist={toggleWishlist}
        />
      </div>
    </div>
  );
}
