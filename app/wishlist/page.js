"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { ChevronLeft, X } from "lucide-react";
import Image from "next/image";
import Card from "@/component/reusable/card";
import Link from "next/link";

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const toUrl = (url) => {
    if (!url) return "#";
    return url.startsWith("http") ? url : `https://${url}`;
  };
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ambil wishlist dari cookie
  useEffect(() => {
    const cookie = Cookies.get("wishlist");
    if (cookie) {
      try {
        const ids = JSON.parse(cookie);
        setWishlistIds(ids);
      } catch {
        setWishlistIds([]);
      }
    }
  }, []);

  // Ambil data produk berdasarkan ID wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (wishlistIds.length === 0) {
        setWishlist([]);
        setFiltered([]);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/products");
        const all = res.data;
        const filteredProducts = all.filter((p) => wishlistIds.includes(p.id));
        setWishlist(filteredProducts);
        setFiltered(filteredProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [wishlistIds]);

  // Hapus item dari wishlist
  const handleRemove = (id) => {
    const updated = wishlistIds.filter((pid) => pid !== id);
    Cookies.set("wishlist", JSON.stringify(updated), { expires: 7 });
    setWishlistIds(updated);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Memuat wishlist...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md md:max-w-screen mx-auto md:mx-12">
      <div
        className={`sticky top-5 z-40 mx-auto transition-all duration-500 ease-in-out ${
          scrolled
            ? "max-w-5xl bg-background/80 backdrop-blur-md rounded-4xl shadow-md px-2 py-4"
            : "max-w-6xl bg-none border-none rounded-none mt-0 shadow-none px-0 py-6"
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          <ChevronLeft className="w-6 h-6 text-primary" />
          <span className="text-lg font-semibold">Keranjang Saya</span>
        </Link>
      </div>

      {/* Jika kosong */}
      {filtered.length === 0 && (
        <p className="text-gray-500 text-center">
          Tidak ada produk di wishlist
        </p>
      )}

      {/* Daftar wishlist */}
      <div className="flex flex-col gap-4 z-1">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className="relative overflow-hidden transition-all duration-200 cursor-pointer flex flex-row gap-3 p-3"
          >
            {/* Gambar di kiri */}
            <div className="flex-shrink-0 w-28 h-28 overflow-hidden rounded-lg">
              <Image
                src={
                  item.image && item.image.length > 0
                    ? String(item.image[0]).trim()
                    : "/no-image.png"
                }
                width={112}
                height={112}
                alt={item.category}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Info di kanan */}
            <div className="flex flex-col justify-between flex-1">
              <div>
                {/* Nama produk */}
                <h4 className="font-semibold text-sm">
                  {(() => {
                    const maxLength =
                      typeof window !== "undefined" && window.innerWidth >= 768
                        ? 100
                        : 30;
                    return item.name.length > maxLength
                      ? item.name.slice(0, maxLength) + "..."
                      : item.name;
                  })()}
                </h4>

                {/* Kategori */}
                <p className="text-xs text-slate-500">{item.category}</p>
                <p className="text-sm">{item.description}</p>

                {/* Harga */}
                <span className="block mt-2 font-bold text-slate-800 text-sm">
                  Rp{" "}
                  {String(Number(item.price).toLocaleString("id-ID")).length >
                  25
                    ? String(Number(item.price).toLocaleString("id-ID")).slice(
                        0,
                        25
                      ) + "..."
                    : Number(item.price).toLocaleString("id-ID")}
                </span>
              </div>

              {/* Tombol di bawah */}
              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-xs text-primary bg-background py-1.5 px-3 rounded-xl hover:bg-primary hover:text-background border border-primary transition-all"
                >
                  Hapus
                </button>

                <Link
                  href={`/produk/${item.id}`}
                  className="text-xs text-background bg-primary py-1.5 px-3 rounded-xl hover:bg-background hover:text-primary border border-primary transition-all"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal detail */}
      {modalProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
          onClick={() => setModalProduct(null)}
        >
          <div
            className="bg-white p-6 rounded-2xl w-full max-w-sm relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalProduct(null)}
              className="absolute top-3 right-3 p-1 rounded-md hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <p className="text-center mt-4 mb-4 text-sm text-slate-700">
              Lanjutkan pembelian{" "}
              <span className="font-semibold text-slate-900">
                {modalProduct.name}
              </span>
            </p>

            <div className="flex flex-col gap-2">
              {modalProduct.whatsapp && (
                <a
                  href={toUrl(modalProduct.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-slate-300 rounded-lg px-4 py-2 text-sm font-semibold text-black hover:border-[#25D366] transition-colors"
                >
                  <Image
                    src="/whatsapp.png"
                    alt="WhatsApp"
                    width={20}
                    height={20}
                  />
                  WhatsApp
                </a>
              )}
              {modalProduct.tiktok && (
                <a
                  href={toUrl(modalProduct.tiktok)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-slate-300 rounded-lg px-4 py-2 text-sm font-semibold text-black hover:border-[#69C9D0] transition-colors"
                >
                  <Image
                    src="/tiktok.png"
                    alt="TikTok"
                    width={20}
                    height={20}
                  />
                  TikTok
                </a>
              )}
              {modalProduct.shopee && (
                <a
                  href={toUrl(modalProduct.shopee)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-slate-300 rounded-lg px-4 py-2 text-sm font-semibold text-[#EE4D2D] hover:border-[#d84424] transition-colors"
                >
                  <Image
                    src="/shopee.png"
                    alt="Shopee"
                    width={20}
                    height={20}
                  />
                  Shopee
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
