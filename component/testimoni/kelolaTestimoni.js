"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Trash2, Star } from "lucide-react";
import ConfirmModal from "@/component/reusable/modal";
import Card from "@/component/reusable/card";
import NoData from "@/component/reusable/noData";
import Cookies from "js-cookie";

/* 🔹 Fungsi pembuat warna dari nama */
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
}

export default function KelolaTestimoniPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [confirmData, setConfirmData] = useState(null);
  const [err, setErr] = useState(null);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState(null); // ✅ Tambahan: state untuk modal alert

  /* 🔸 Cek user admin */
  useEffect(() => {
    const session = Cookies.get("session");
    if (session === "logged-in") {
      setUser({ name: "Admin", email: "admin@etalase.com" });
    } else {
      setUser(null);
    }
  }, []);

  /* 🔸 Ambil semua testimoni */
  async function fetchTestimonials() {
    try {
      const res = await axios.get("/api/testimoni", { withCredentials: true });
      setItems(res.data);
      setErr(null);
    } catch (e) {
      setErr("Gagal memuat data testimoni.");
    }
  }

  useEffect(() => {
    fetchTestimonials();
  }, []);

  /* 🔸 Hapus testimoni */
  async function handleDelete(t) {
    try {
      await axios.delete(`/api/testimoni/${t.id}`, { withCredentials: true });
      await fetchTestimonials();
      setConfirmData(null);
      setAlert({
        title: "Berhasil",
        message: `Testimoni dari "${t.name}" telah dihapus.`,
      }); // ✅ Ganti alert biasa dengan modal alert
    } catch (e) {
      setAlert({
        title: "Gagal",
        message:
          e?.response?.data?.message ||
          e.message ||
          "Gagal menghapus testimoni.",
      }); // ✅ Modal alert saat gagal
    }
  }

  /* 🔸 Filter hasil pencarian */
  const filteredItems = items.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  /* 🔒 Jika bukan admin */
  if (!user)
    return (
      <main className="max-w-5xl mx-auto p-6 text-center pt-24 text-slate-600">
        <p>Anda tidak memiliki akses ke halaman ini.</p>
      </main>
    );

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-6 pt-24">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kelola Testimoni</h1>
          <p className="text-sm text-slate-500">
            Total: {filteredItems.length}
          </p>
        </div>

        <div className="flex items-center gap-2 justify-center w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama pelanggan..."
              className="w-full md:w-72 rounded-full border border-slate-300 pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>
      </header>

      {/* Error alert */}
      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
          {err}
        </div>
      )}

      {/* Grid testimoni */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((t) => (
            <Card
              key={t.id}
              className="relative md:min-h-72 min-h-60 transition-all p-4 flex flex-col justify-between hover:-translate-y-1 duration-200"
            >
              {/* Tombol Hapus */}
              <button
                onClick={() => setConfirmData(t)}
                className="absolute bottom-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-all"
                title="Hapus Testimoni"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Isi testimoni */}
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-slate-700 text-sm mb-4 text-center">
                  “{t.message}”
                </p>
              </div>

              <div>
                {/* Rating */}
                <div className="flex justify-center mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < t.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Info user */}
                <div className="flex gap-2 items-center mt-2 border-t border-slate-200 pt-3">
                  <div
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm"
                    style={{ backgroundColor: stringToColor(t.name || "A") }}
                  >
                    {(t.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-xs md:text-sm font-semibold text-slate-800 leading-tight">
                      {t.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {new Date(t.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="flex items-center justify-center col-span-full">
            <NoData message="Belum ada testimoni." />
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Hapus */}
      {confirmData && (
        <ConfirmModal
          mode="delete"
          title="Hapus Testimoni"
          message={`Apakah Anda yakin ingin menghapus testimoni dari "${confirmData.name}"?`}
          confirmText="Hapus"
          cancelText="Batal"
          onConfirm={() => handleDelete(confirmData)}
          onCancel={() => setConfirmData(null)}
        />
      )}

      {/* ✅ Modal Alert Tambahan */}
      {alert && (
        <ConfirmModal
          mode="alert"
          title={alert.title}
          message={alert.message}
          onConfirm={() => setAlert(null)}
        />
      )}
    </main>
  );
}
