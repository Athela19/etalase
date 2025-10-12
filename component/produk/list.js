"use client";
import Image from "next/image";
import { useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import axios from "axios";
import ConfirmModal from "@/component/reusable/modal";

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
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Gagal menghapus");
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6 pt-24">
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

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
          {err}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Gambar</th>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">Kategori</th>
              <th className="px-4 py-3 text-left">Harga</th>
              <th className="px-4 py-3 text-left">Tanggal</th>
              <th className="px-4 py-3 text-right w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <div className="relative w-16 h-12">
                    <Image
                      src={p.image?.[0] || "https://placehold.co/80x60"}
                      alt={p.name || "Gambar produk"}
                      fill
                      className="object-cover rounded-md border"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">{p.name || "-"}</td>
                <td className="px-4 py-3">{p.category || "-"}</td>
                <td className="px-4 py-3">
                  Rp {Number(p.price ?? 0).toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3">
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString("id-ID")
                    : "-"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(p)}
                      className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-slate-50"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => setConfirmData(p)}
                      className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
