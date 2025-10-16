"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Plus, Search, Loader2 } from "lucide-react";
import ProductList from "@/component/produk/list";
import ProductForm from "@/component/produk/form";

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [mode, setMode] = useState("list"); // 'list' | 'create' | 'edit'
  const [editing, setEditing] = useState(null);

  // === LOAD DATA ===
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
        (p.category || "").toLowerCase().includes(s)
    );
  }, [items, q]);

  // === EVENT ===
  const handleCreate = () => {
    setEditing(null);
    setMode("create");
  };

  const handleEdit = (p) => {
    setEditing(p);
    setMode("edit");
  };

  const handleBack = async () => {
    await load();
    setMode("list");
    setEditing(null);
  };

  // === RENDER ===
  if (loading)
    return (
      <main className="max-w-6xl mx-auto p-6 pt-24 flex items-center justify-center gap-2 text-slate-600">
        <Loader2 className="w-4 h-4 animate-spin" /> Memuat…
      </main>
    );

  if (mode === "list")
    return (
      <ProductList
        items={filtered}
        query={q}
        setQuery={setQ}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onReload={load}
        err={err}
      />
    );

  return (
    <ProductForm
      editing={editing}
      onSuccess={handleBack}
      onCancel={handleBack}
    />
  );
}
