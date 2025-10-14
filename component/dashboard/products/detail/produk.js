"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ShoppingCart } from "lucide-react";
import RelatedProducts from "./related";

const toUrl = (u = "") =>
  u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : "#";

export default function ProdukPage({ productId }) {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load wishlist dari cookie
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

  // Simpan wishlist ke cookie
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

  // Fetch produk & produk terkait
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        setProduct(data);

        const imgs = Array.isArray(data.image)
          ? data.image
          : data.image?.split(",") || [];
        setSelectedImage(imgs[0] || "/placeholder.png");

        // Fetch produk lain untuk related
        const allRes = await fetch(`/api/products`);
        const allProducts = await allRes.json();

        // Produk dengan kategori sama tapi bukan produk ini
        const relatedData = allProducts.filter(
          (p) => p.category === data.category && p.id !== data.id && p.active
        );

        setRelated(relatedData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Memuat detail produk...
      </div>
    );

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <p>Produk tidak ditemukan.</p>
      </div>
    );

  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const toggleWishlist = (item) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      return exists ? prev.filter((p) => p.id !== item.id) : [...prev, item];
    });
  };

  const images = Array.isArray(product.image)
    ? product.image
    : product.image?.split(",") || [];

  return (
    <div className="w-full flex flex-col gap-10 pt-18">
      {/* GAMBAR & INFO PRODUK */}
      <div className="flex flex-col sm:flex-row w-full gap-6">
        {/* GAMBAR */}
        <div className="flex flex-col md:flex-row w-full sm:w-1/2 gap-2 p-4">
          <div className="relative w-full h-[250px] sm:h-[360px] rounded-lg overflow-hidden">
            <Image
              key={selectedImage}
              src={selectedImage || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-300"
            />
          </div>

          <div className="flex sm:flex-col gap-2 mt-2 sm:mt-0">
            {images.slice(0, 5).map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedImage === img
                    ? "border-primary scale-105"
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

        {/* INFORMASI PRODUK */}
        <div className="flex flex-col justify-between w-full sm:w-1/2 p-4">
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

            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <div className="flex gap-2">
                {product.whatsapp && (
                  <a
                    href={`https://wa.me/${
                      product.whatsapp
                    }?text=${encodeURIComponent(
                      `Halo, saya ingin membeli produk ${product.name}. Apakah masih tersedia?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform border border-primary hover:bg-primary/20 rounded-lg p-2"
                  >
                    <Image
                      src="/whatsapp.png"
                      alt="WhatsApp"
                      width={40}
                      height={40}
                    />
                  </a>
                )}
                {product.tiktok && (
                  <a
                    href={toUrl(product.tiktok)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform border border-primary hover:bg-primary/20 rounded-lg p-2"
                  >
                    <Image
                      src="/tiktok.png"
                      alt="TikTok"
                      width={40}
                      height={40}
                    />
                  </a>
                )}
                {product.shopee && (
                  <a
                    href={toUrl(product.shopee)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform border border-primary hover:bg-primary/20 rounded-lg p-2"
                  >
                    <Image
                      src="/shopee.png"
                      alt="Shopee"
                      width={40}
                      height={40}
                    />
                  </a>
                )}
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                className={`w-full py-3 md:py-2 rounded-lg font-medium border flex items-center justify-center gap-2 transition ${
                  isInWishlist
                    ? "bg-red-100 text-red-600 border-red-400 hover:bg-red-200"
                    : "bg-background text-primary border-primary hover:bg-primary hover:text-background"
                }`}
              >
                <ShoppingCart size={20} />
                {isInWishlist
                  ? "Hapus dari Wishlist"
                  : "Tambahkan ke Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUK TERKAIT */}
      <div className="p-4">
        {" "}
        <RelatedProducts
          products={related}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
        />
      </div>
    </div>
  );
}
