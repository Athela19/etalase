"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const toUrl = (u = "") =>
  u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : "#";

export default function ProductModal({ product, onClose }) {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [wishlist, setWishlist] = useState([]);

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

  if (!product) return null;

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const toggleWishlist = () => {
    if (isInWishlist) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  return (
    <>
      {/* === MODAL DETAIL PRODUK === */}
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

          {/* Gambar (atas di HP, kiri di desktop) */}
          <div className="flex flex-col items-center w-full sm:w-1/2 p-4">
            <div className="relative w-full h-[250px] sm:h-[360px] rounded-lg overflow-hidden">
              <Image
                src={product.image || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnail (optional) */}
            <div className="flex gap-3 mt-3 overflow-x-auto">
              {[product.image, product.image2, product.image3]
                .filter(Boolean)
                .map((img, i) => (
                  <div
                    key={i}
                    className="min-w-16 h-16 relative rounded-lg overflow-hidden border border-none cursor-pointer transition"
                  >
                    <Image src={img} alt="thumb" fill className="object-cover" />
                  </div>
                ))}
            </div>
          </div>

          {/* Informasi Produk (kanan di desktop) */}
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

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowBuyModal(true)}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:bg-background hover:text-primary border border-primary transition"
                >
                  Beli Sekarang
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`flex-1 py-3 rounded-xl font-medium border transition ${
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
      </div>

      {/* === MODAL PEMBELIAN === */}
      {showBuyModal && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowBuyModal(false)}
        >
          <div
            className="bg-white p-6 rounded-2xl w-full max-w-sm relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowBuyModal(false)}
              className="absolute top-3 right-3 p-1 rounded-md hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <p className="text-center mt-4 mb-4 text-sm text-slate-700">
              Lanjutkan pembelian{" "}
              <span className="font-semibold text-slate-900">
                {product.name}
              </span>
            </p>

            {/* Ikon saja untuk link */}
            <div className="flex justify-center gap-6 mt-2">
              {product.whatsapp && (
                <a
                  href={toUrl(product.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/whatsapp.png"
                    alt="WhatsApp"
                    width={32}
                    height={32}
                    className="hover:scale-110 transition"
                  />
                </a>
              )}
              {product.tiktok && (
                <a
                  href={toUrl(product.tiktok)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/tiktok.png"
                    alt="TikTok"
                    width={32}
                    height={32}
                    className="hover:scale-110 transition"
                  />
                </a>
              )}
              {product.shopee && (
                <a
                  href={toUrl(product.shopee)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/shopee.png"
                    alt="Shopee"
                    width={32}
                    height={32}
                    className="hover:scale-110 transition"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
