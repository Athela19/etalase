"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const toUrl = (u = "") =>
  u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : "#";

export default function ProductModal({ product, onClose }) {
  const [wishlist, setWishlist] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Ambil wishlist dari cookie saat komponen dimount
  useEffect(() => {
    const savedWishlist = Cookies.get("wishlist");
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch {
        setWishlist([]);
      }
    }
  }, []);

  // Simpan wishlist ke cookie saat berubah
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

  // Reset gambar utama ketika product berubah
  useEffect(() => {
    if (product) {
      const imgs = Array.isArray(product.image)
        ? product.image
        : product.image?.split(",") || [];
      setSelectedImage(imgs[0] || "/placeholder.png");
    }
  }, [product]);

  if (!product) return null;

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const toggleWishlist = () => {
    setWishlist((prev) =>
      isInWishlist
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product]
    );
  };

  // Ambil list gambar (maksimal 5)
  const images = Array.isArray(product.image)
    ? product.image
    : product.image?.split(",") || [];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-5xl relative flex flex-col sm:flex-row gap-6 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-md hover:bg-slate-100"
        >
          <X size={22} />
        </button>

        {/* === BAGIAN GAMBAR === */}
        <div className="flex flex-col items-center w-full sm:w-1/2 p-4">
          {/* Gambar utama */}
          <div className="relative w-full h-[250px] sm:h-[360px] rounded-lg overflow-hidden">
            <Image
              key={selectedImage}
              src={selectedImage || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-300"
            />
          </div>

          {/* Thumbnail */}
          <div className="flex mt-3 overflow-hidden">
            {images.slice(0, 5).map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`relative min-w-16 min-h-16 m-1 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedImage === img
                    ? "border-primary scale-105 rounded-lg"
                    : "border-transparent hover:border-slate-300"
                }`}
              >
                <Image
                  src={img.trim()}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* === INFORMASI PRODUK === */}
        <div className="flex flex-col justify-between w-full sm:w-1/2 p-4 sm:p-6">
          <div>
            <p className="text-sm text-primary mb-3">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                {product.category || "Tanpa Kategori"}
              </span>
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">
              {product.name || "Produk Tanpa Nama"}
            </h2>

            <p className="text-slate-700 mb-4 text-sm sm:text-base leading-relaxed">
              {product.description || "Tidak ada deskripsi produk."}
            </p>
          </div>

          {/* Harga dan Tombol */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-lg sm:text-xl font-bold text-slate-900">
                Rp {Number(product.price || 0).toLocaleString("id-ID")}
              </p>
              {product.oldPrice && (
                <p className="text-slate-400 line-through">
                  Rp {Number(product.oldPrice).toLocaleString("id-ID")}
                </p>
              )}
            </div>

            {/* Deretan ikon link beli */}
            <div className="flex items-center gap-4 mb-5">
              {product.whatsapp && (
                <a
                  href={toUrl(product.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                >
                  <Image
                    src="/whatsapp.png"
                    alt="WhatsApp"
                    width={36}
                    height={36}
                  />
                </a>
              )}

              {product.tiktok && (
                <a
                  href={toUrl(product.tiktok)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                >
                  <Image
                    src="/tiktok.png"
                    alt="TikTok"
                    width={36}
                    height={36}
                  />
                </a>
              )}

              {product.shopee && (
                <a
                  href={toUrl(product.shopee)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                >
                  <Image
                    src="/shopee.png"
                    alt="Shopee"
                    width={36}
                    height={36}
                  />
                </a>
              )}
            </div>

            {/* Tombol keranjang */}
            <button
              onClick={toggleWishlist}
              className={`w-full py-3 rounded-xl font-medium border transition ${
                isInWishlist
                  ? "bg-red-100 text-red-600 border-red-400 hover:bg-red-200"
                  : "bg-background text-primary border-primary hover:bg-primary hover:text-background"
              }`}
            >
              {isInWishlist
                ? "Hapus dari keranjang"
                : "Tambahkan ke keranjang"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
