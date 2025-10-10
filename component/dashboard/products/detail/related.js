"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import Card from "@/component/reusable/card";
import { useRouter } from "next/navigation";

export default function RelatedProducts({ products, wishlist, toggleWishlist }) {
  const router = useRouter();
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

  const truncate = (text, limit) =>
    text?.length > limit ? text.slice(0, limit) + "..." : text;

  if (!products || products.length === 0) return null;

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Produk Terkait</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map((product) => {
          const isLoved = wishlist.some((item) => item.id === product.id);

          return (
            <Card
              key={product.id}
              className="relative overflow-hidden transition-all duration-200 hover:-translate-y-1 flex flex-col cursor-pointer"
            >
              {/* Tombol Love */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className="absolute right-3.5 top-3.5 md:right-5 md:top-5 z-10 p-1.5 rounded-full bg-background/20 backdrop-blur hover:bg-white shadow-md transition-all"
              >
                <Heart
                  size={18}
                  className={`${isLoved ? "fill-red-500 text-red-500" : "text-red-500"} transition-all`}
                />
              </button>

              {/* Gambar */}
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
                <Image
                  src={
                    Array.isArray(product.image)
                      ? product.image[0]?.trimStart() || "/no-image.png"
                      : product.image?.split(",")[0]?.trimStart() || "/no-image.png"
                  }
                  width={400}
                  height={300}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between flex-1 space-y-2 mt-2">
                <div>
                  <h4 className="font-semibold text-sm line-clamp-2">
                    {truncate(product.name, isDesktop ? 35 : 20)}
                  </h4>
                  <p className="text-xs text-slate-500">{product.category}</p>
                </div>

                <div className="flex flex-col mt-auto w-full">
                  <span className="block mt-2 font-bold text-slate-800 text-sm">
                    Rp {truncate(Number(product.price).toLocaleString("id-ID"), isDesktop ? 25 : 15)}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/produk/${product.id}`);
                    }}
                    className="self-end text-xs text-background bg-primary py-1.5 px-3 rounded-lg hover:bg-background hover:text-primary border border-primary transition-all mt-2"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
