"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Search, Heart } from "lucide-react";
import axios from "axios";
import ConfirmModal from "@/component/reusable/modal";
import Card from "@/component/reusable/card";


export default function ProductList({
  items,
  query,
  setQuery,
  onCreate,
  onEdit,
  onReload,
  err,
}) {
  const [confirmData, setConfirmData] = useState(null);

  async function handleDelete(p) {
    try {
      await axios.delete(`/api/products/${p.id}`);
      await onReload();
      setConfirmData(null);
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Gagal menghapus");
    }
  }

  const isDesktop =
    typeof window !== "undefined" && window.innerWidth >= 768;

  const truncate = (text, limit) =>
    text?.length > limit ? text.slice(0, limit) + "..." : text;

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-6 pt-24">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kelola Produk</h1>
          <p className="text-sm text-slate-500">Total: {items.length}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk..."
              className="w-72 rounded-full border border-slate-300 pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white text-sm font-semibold hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>
      </header>

      {/* Error alert */}
      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
          {err}
        </div>
      )}

      {/* Grid produk */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.length > 0 ? (
          items.map((p) => {
            const isInactive = !p.active;

            return (
              <Card
                key={p.id}
                className={`relative overflow-hidden transition-all duration-200 hover:-translate-y-1 flex flex-col ${
                  isInactive ? "grayscale opacity-75" : ""
                }`}
              >

                {/* Label tidak aktif */}
                {isInactive && (
                  <div className="absolute left-0 top-0 bg-gray-700/80 text-white text-xs font-medium px-2 py-1 rounded-br-md z-10">
                    Tidak Aktif
                  </div>
                )}

                {/* Gambar */}
                <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <Image
                    src={
                      Array.isArray(p.image)
                        ? p.image[0]?.trimStart() || "/no-image.png"
                        : p.image?.split(",")[0]?.trimStart() ||
                          "/no-image.png"
                    }
                    width={400}
                    height={300}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between flex-1 space-y-2 mt-2">
                  <div>
                    <h4 className="font-semibold text-sm line-clamp-2">
                      {truncate(p.name, isDesktop ? 35 : 20)}
                    </h4>
                    <p className="text-xs text-slate-500">{p.category}</p>
                  </div>

                  <div className="flex flex-col mt-auto w-full">
                    <span className="block mt-2 font-bold text-slate-800 text-sm">
                      Rp{" "}
                      {truncate(
                        Number(p.price).toLocaleString("id-ID"),
                        isDesktop ? 25 : 15
                      )}
                    </span>

                    {/* Tombol Edit & Delete di posisi bawah */}
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => onEdit(p)}
                        className="text-xs text-background bg-primary py-1.5 px-3 rounded-lg hover:bg-background hover:text-primary border border-primary transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmData(p)}
                        className="text-xs text-red-600 bg-red-50 py-1.5 px-3 rounded-lg border border-red-200 hover:bg-red-100 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-10 text-slate-500 border border-dashed rounded-xl">
            Tidak ada data produk.
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Hapus */}
      {confirmData && (
        <ConfirmModal
          mode="delete"
          title="Hapus Produk"
          message={`Apakah Anda yakin ingin menghapus produk "${confirmData.name}"?`}
          confirmText="Hapus"
          cancelText="Batal"
          onConfirm={() => handleDelete(confirmData)}
          onCancel={() => setConfirmData(null)}
        />
      )}
    </main>
  );
}
