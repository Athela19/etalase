"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Save, Loader2, UploadCloud, ChevronDown } from "lucide-react";
import { UploadButton } from "@uploadthing/react";
import Image from "next/image";

export default function ProductForm({ editing, onSuccess, onCancel }) {
  const empty = {
    name: "",
    whatsapp: "",
    tiktok: "",
    shopee: "",
    category: "",
    price: "",
    image: [],
    description: "",
  };
  const [form, setForm] = useState(editing || empty);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // === Ambil kategori unik dari produk ===
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await axios.get("/api/products");
        if (Array.isArray(res.data)) {
          const unique = [
            ...new Set(res.data.map((p) => p.category).filter(Boolean)),
          ];
          setCategories(unique);
        }
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
      }
    }
    loadCategories();
  }, []);

  // === Submit form ===
  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price || 0) };
      if (editing) await axios.put(`/api/products/${editing.id}`, payload);
      else await axios.post("/api/products", payload);
      onSuccess();
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  function removeImage(url) {
    setForm((s) => ({ ...s, image: s.image.filter((i) => i !== url) }));
  }

  // === Tambah kategori baru ===
  function addNewCategory() {
    if (newCategory.trim() === "") return;
    if (!categories.includes(newCategory.trim())) {
      setCategories((prev) => [newCategory.trim(), ...prev]);
    }
    setForm((s) => ({ ...s, category: newCategory.trim() }));
    setNewCategory("");
    setShowDropdown(false);
  }

  return (
    <main className="p-6 pt-24">
      <div className="flex items-center mb-4">
        <h3 className="font-semibold text-lg">
          {editing ? "Edit Produk" : "Tambah Produk"}
        </h3>
      </div>

      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-8">
        {/* === Kolom Kiri === */}
        <div className="space-y-4">
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
            label="Link TikTok"
            value={form.tiktok}
            onChange={(e) => setForm((s) => ({ ...s, tiktok: e.target.value }))}
          />
          <Input
            label="Link Shopee"
            type="url"
            value={form.shopee}
            onChange={(e) => setForm((s) => ({ ...s, shopee: e.target.value }))}
          />

          {/* === Kategori dan Harga dalam satu baris === */}
          <div className="flex gap-4">
            {/* Kategori */}
            <div className="w-1/2 relative">
              <label className="block text-sm text-slate-600 mb-1">
                Kategori
              </label>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full border rounded-md px-3 py-2 text-sm flex justify-between items-center focus:ring-2 focus:ring-primary outline-none"
              >
                {form.category || "Pilih kategori..."}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showDropdown && (
                <div className="pr-1 absolute z-20 bg-white border rounded-md shadow-md w-full mt-1 ">
                  <div className="max-h-42 overflow-auto">
                    {/* Input tambah kategori baru */}
                    <div className="px-3 py-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Tambah kategori baru..."
                        className="w-full text-sm rounded outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newCategory.trim() !== "") {
                              const val = newCategory.trim();
                              if (!categories.includes(val)) {
                                setCategories((prev) => [val, ...prev]);
                              }
                              setForm((s) => ({ ...s, category: val }));
                              setNewCategory("");
                              setShowDropdown(false);
                            }
                          }
                        }}
                      />
                    </div>

                    {/* Daftar kategori */}
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <div
                          key={c}
                          onClick={() => {
                            setForm((s) => ({ ...s, category: c }));
                            setShowDropdown(false);
                          }}
                          className={`px-3 py-2 text-sm cursor-pointer hover:bg-primary hover:text-white ${
                            form.category === c ? "bg-primary text-white" : ""
                          }`}
                        >
                          {c}
                        </div>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-sm text-slate-500">
                        Tidak ada kategori
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Harga */}
            <Input
              label="Harga"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={form.price}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setForm((s) => ({ ...s, price: val }));
              }}
              required
              className="w-1/2"
            />
          </div>
        </div>

        {/* === Kolom Kanan === */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Deskripsi Produk
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((s) => ({ ...s, description: e.target.value }))
              }
              className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none h-28 resize-none"
              placeholder="Tulis deskripsi produk..."
            />
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block text-sm mb-1 text-slate-600">
              Upload Gambar
            </label>

            <div className="flex items-center gap-2">
              <UploadButton
                endpoint="productImage"
                onClientUploadComplete={(res) => {
                  const urls = res.map((f) => f.url);
                  setForm((s) => ({
                    ...s,
                    image: [...s.image, ...urls].slice(0, 5),
                  }));
                }}
                onUploadError={(err) => alert(`Upload gagal: ${err.message}`)}
                appearance={{
                  container: "relative inline-flex items-center",
                  button:
                    "bg-primary text-white px-3 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 text-sm",
                  input: "hidden",
                }}
                content={{
                  button({ ready }) {
                    return (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        {ready ? "Upload Gambar" : "Menyiapkan..."}
                      </>
                    );
                  },
                }}
              />
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {form.image.map((url) => (
                <div key={url} className="relative group">
                  <Image
                    src={url}
                    alt="Gambar produk"
                    width={96} // sama dengan w-24
                    height={96} // sama dengan h-24
                    className="object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="col-span-full flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
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
    </main>
  );
}

// Reusable Input
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
