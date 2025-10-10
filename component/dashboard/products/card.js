"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import Card from "@/component/reusable/card";

export default function ProductCard({
  product,
  isLoved,
  toggleWishlist,
  openModal,
}) {
  return (
    <Card
      key={product.id}
      className="relative overflow-hidden transition-all duration-200 hover:-translate-y-1 flex flex-col"
    >
      {/* Tombol Love */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className="absolute right-3 md:right-4 z-10 p-1.5 rounded-full bg-background/20 backdrop-blur hover:bg-white shadow-md transition-all"
      >
        <Heart
          size={18}
          className={`${
            isLoved ? "fill-red-500 text-red-500" : "text-red-500"
          } transition-all`}
        />
      </button>

      {/* Gambar */}
      <div className="aspect-[4/3] w-full overflow-hidden">
        <Image
          src={product.image?.trimStart() || "/no-image.png"}
          width={400}
          height={300}
          alt={product.name}
          className="w-full h-full object-cover rounded-r-[16px] rounded-sm rounded-b-sm"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between flex-1 space-y-2 mt-2">
        <div>
          <h4 className="font-semibold text-sm line-clamp-2">
            {String(product.name).length >
            (typeof window !== "undefined" && window.innerWidth >= 768
              ? 25
              : 15)
              ? String(product.name).slice(
                  0,
                  typeof window !== "undefined" && window.innerWidth >= 768
                    ? 35
                    : 20
                ) + "..."
              : product.name}
          </h4>
          <p className="text-xs text-slate-500">{product.category}</p>
        </div>

        <div className="flex flex-col mt-auto w-full">
          <span className="block mt-2 font-bold text-slate-800 text-sm">
            Rp{" "}
            {Number(product.price).toLocaleString("id-ID").length >
            (typeof window !== "undefined" && window.innerWidth >= 768
              ? 25
              : 15)
              ? Number(product.price)
                  .toLocaleString("id-ID")
                  .slice(
                    0,
                    typeof window !== "undefined" && window.innerWidth >= 768
                      ? 25
                      : 15
                  ) + "..."
              : Number(product.price).toLocaleString("id-ID")}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal();
            }}
            className="pointer-cursor self-end text-xs text-background bg-primary py-1.5 px-3 rounded-lg hover:bg-background hover:text-primary border border-primary transition-all mt-2"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </Card>
  );
}
