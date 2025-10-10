"use client";

import { useParams } from "next/navigation";
import ProdukPage from "@/component/dashboard/products/detail/produk";

export default function Page() {
  // Ambil id dari params jika perlu
  const { id } = useParams();
  return (
    <div>
      <ProdukPage productId={id} />
    </div>
  );
}
