"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";

const toUrl = (u = "") =>
  u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : "";
const toWa = (raw = "") => {
  const d = (raw || "").replace(/\D/g, "");
  if (!d) return "";
  const norm = d.startsWith("62")
    ? d
    : d.startsWith("0")
    ? "62" + d.slice(1)
    : d;
  return `https://wa.me/${norm}`;
};

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Modal state
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);

  const empty = {
    name: "",
    whatsapp: "",
    tiktok: "",
    shopee: "",
    category: "",
    price: "",
    image: "", // koma dipisah
    description: "",
  };
  const [form, setForm] = useState(empty);

  // === LOAD ===
  async function load() {
    try {
      setErr("");
      setLoading(true);
      const { data } = await axios.get("/api/products");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Gagal memuat data");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // === FILTER ===
  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return items.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(s) ||
        (p.whatsapp || "").toLowerCase().includes(s) ||
        (p.tiktok || "").toLowerCase().includes(s) ||
        (p.shopee || "").toLowerCase().includes(s) ||
        (p.category || "").toLowerCase().includes(s)
    );
  }, [items, q]);

  // === MODAL ===
  function openNew() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }

  function openEdit(p) {
    setEditing(p);
    setForm({
      name: p.name || "",
      whatsapp: p.whatsapp || "",
      tiktok: p.tiktok || "",
      shopee: p.shopee || "",
      category: p.category || "",
      price: p.price ?? "",
      description: p.description || "",
      image: Array.isArray(p.image) ? p.image.join(", ") : p.image || "",
    });
    setOpen(true);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price || 0),
        image: form.image
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (editing) {
        await axios.put(`/api/products/${editing.id}`, payload);
      } else {
        await axios.post("/api/products", payload);
      }

      setOpen(false);
      setEditing(null);
      setForm(empty);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(p) {
    if (!confirm(`Hapus produk: ${p.name || p.tiktok || "(tanpa nama)"} ?`))
      return;
    try {
      await axios.delete(`/api/products/${p.id}`);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Gagal menghapus");
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
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
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari produk..."
              className="w-72 rounded-full border border-slate-300 pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white text-sm font-semibold hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>
      </header>

      {/* Error / Loading */}
      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
          {err}
        </div>
      )}
      {loading && (
        <div className="text-slate-600 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Memuat…
        </div>
      )}

      {/* Table */}
      {!loading && (
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
              {filtered.map((p) => (
                <tr key={p.id} className="border-t hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <img
                      src={
                        Array.isArray(p.image) && p.image.length
                          ? p.image[0]
                          : "https://placehold.co/80x60"
                      }
                      alt={p.name || "img"}
                      className="w-16 h-12 rounded-md border object-cover"
                    />
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
                        onClick={() => openEdit(p)}
                        className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-slate-50"
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
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
      )}

      {/* Modal Form */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h3 className="font-semibold">
                {editing ? "Edit Produk" : "Tambah Produk"}
              </h3>
              <button
                className="p-1 rounded-md hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="grid gap-4 p-5">
              <Input
                label="Nama Produk"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                required
              />
              <Input
                label="WhatsApp"
                value={form.whatsapp}
                onChange={(e) =>
                  setForm((s) => ({ ...s, whatsapp: e.target.value }))
                }
              />
              <Input
                label="Judul / Deskripsi TikTok"
                value={form.tiktok}
                onChange={(e) =>
                  setForm((s) => ({ ...s, tiktok: e.target.value }))
                }
              />
              <Input
                label="Link Shopee"
                type="url"
                value={form.shopee}
                onChange={(e) =>
                  setForm((s) => ({ ...s, shopee: e.target.value }))
                }
                placeholder="https://shopee.co.id/..."
              />
              <Input
                label="Kategori"
                value={form.category}
                onChange={(e) =>
                  setForm((s) => ({ ...s, category: e.target.value }))
                }
                required
              />
              <Input
                label="Harga"
                type="number"
                min="0"
                value={form.price}
                onChange={(e) =>
                  setForm((s) => ({ ...s, price: e.target.value }))
                }
                required
              />
              <Input
                label="Deskripsi Produk"
                value={form.description}
                onChange={(e) =>
                  setForm((s) => ({ ...s, description: e.target.value }))
                }
              />
              <Input
                label="URL Gambar (pisahkan dengan koma)"
                value={form.image}
                onChange={(e) =>
                  setForm((s) => ({ ...s, image: e.target.value }))
                }
                placeholder="https://... , https://..."
                required
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border px-4 py-2 text-sm hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white text-sm font-semibold disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

// === Komponen Input Reusable ===
function Input({ label, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      <input
        {...props}
        className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
      />
    </div>
  );
}
