"use client";

import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import axios from "axios";
import Card from "../reusable/card";
import ConfirmModal from "../reusable/modal";
import NoData from "../reusable/noData";
import Link from "next/link";
import Cookies from "js-cookie";

/* ===================== 🔸 MODAL TESTIMONI 🔸 ===================== */
function ModalTestimoni({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  rating,
  setRating,
  isEdit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-fadeIn">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6 transform transition-all duration-300 scale-100 animate-scaleUp">
        {/* Tombol close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-semibold text-center mb-5 text-gray-800">
          {isEdit ? "Edit Testimoni" : "Tambah Testimoni"}
        </h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nama Anda"
              value={form.name}
              maxLength={15}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">
              {form.name?.length}/15
            </p>
          </div>

          <div>
            <textarea
              placeholder="Tulis pengalaman Anda..."
              value={form.message}
              maxLength={150}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">
              {form.message.length}/150
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                onClick={() => setRating(i + 1)}
                className={`w-8 h-8 cursor-pointer transition-transform duration-200 ${
                  i < rating
                    ? "text-yellow-400 fill-yellow-400 scale-110 drop-shadow-md"
                    : "text-slate-300 hover:text-yellow-300"
                }`}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg font-semibold shadow-lg transition-transform duration-200 hover:scale-[1.02]"
          >
            {isEdit ? "Simpan Perubahan" : "Kirim Testimoni"}
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleUp {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-scaleUp {
          animation: scaleUp 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default function TestimoniPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [myTestimoni, setMyTestimoni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", message: "" });
  const [rating, setRating] = useState(0);
  const [alert, setAlert] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const session = Cookies.get("session");
      if (session === "logged-in")
        setUser({ name: "Admin", email: "admin@etalase.com" });
      else setUser(null);
    };
    checkUser();
    window.addEventListener("user-login", checkUser);
    return () => window.removeEventListener("user-login", checkUser);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("/api/testimoni", {
          withCredentials: true,
        });
        setTestimonials(res.data);
        try {
          const me = await axios.get("/api/testimoni/getMe", {
            withCredentials: true,
          });
          setMyTestimoni(me.data || null);
        } catch {
          console.log("User belum punya testimoni");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Avatar Color
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++)
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 55%)`;
  };

  // Auto-scroll horizontal
  useEffect(() => {
    const container = document.getElementById("testimonial-scroll");
    if (!container) return;

    let scrollAmount = 0;
    const scrollSpeed = 1;
    const scroll = setInterval(() => {
      if (container.scrollWidth - container.clientWidth <= scrollAmount) {
        scrollAmount = 0;
      } else {
        scrollAmount += scrollSpeed;
      }
      container.scrollLeft = scrollAmount;
    }, 30);

    return () => clearInterval(scroll);
  }, [testimonials]);

  // Tambah/Edit testimoni
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedData;

      if (myTestimoni) {
        const res = await axios.put(`/api/testimoni/${myTestimoni.id}`, {
          ...form,
          rating,
        });
        updatedData = res.data.testimoni; // ✅ ambil dari res.data.testimoni

        setTestimonials((prev) =>
          prev.map((t) => (t.id === updatedData.id ? updatedData : t))
        );
        setMyTestimoni(updatedData); // ✅ sekarang ID tetap ada

        setAlert({
          title: "Berhasil",
          message: "Testimoni berhasil diperbarui.",
        });
      } else {
        const res = await axios.post("/api/testimoni", { ...form, rating });
        updatedData = res.data.testimoni;

        setTestimonials((prev) => [updatedData, ...prev]);
        setMyTestimoni(updatedData);

        setAlert({
          title: "Berhasil",
          message: "Testimoni berhasil ditambahkan.",
        });
      }

      setForm({ name: "", message: "" });
      setRating(0);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setAlert({
        title: "Gagal",
        message: "Terjadi kesalahan saat menyimpan testimoni.",
      });
    }
  };

  // Hapus testimoni
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/testimoni/${myTestimoni.id}`);
      setTestimonials((prev) => prev.filter((t) => t.id !== myTestimoni.id));
      setMyTestimoni(null);
      setAlert({ title: "Dihapus", message: "Testimoni berhasil dihapus." });
    } catch (err) {
      setAlert({
        title: "Gagal",
        message: "Tidak dapat menghapus testimoni. Coba lagi nanti.",
      });
    } finally {
      setConfirmDelete(false);
    }
  };

  // Buka modal tambah/edit
  const openModal = (isEditing = false) => {
    if (isEditing && myTestimoni) {
      setForm({ name: myTestimoni.name, message: myTestimoni.message });
      setRating(myTestimoni.rating);
    } else {
      setForm({ name: "", message: "" });
      setRating(0);
    }
    setIsModalOpen(true);
  };

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-slate-800 text-center mb-10">
        Testimoni Pelanggan
      </h2>

      <div
        className="flex gap-4 overflow-x-auto scrollbar-hide p-4"
        id="testimonial-scroll"
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-100 md:w-72 h-48 sm:w-60 rounded-2xl animate-pulse"
            />
          ))
        ) : testimonials.length > 0 ? (
          testimonials.map((t) => (
            <Card
              key={t.id}
              className="md:min-h-72 min-h-60 min-w-50 md:min-w-72 max-w-72 transition-all p-2 md:p-4 flex flex-col justify-between"
            >
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-slate-700 text-sm mb-4 text-center">
                  “{t.message}”
                </p>
              </div>

              <div>
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

                <div className="flex gap-2 items-center mt-2 border-t border-slate-200 pt-2 md:pt-4">
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
          <div className="w-full flex justify-center mt-10">
            <NoData message="Belum ada testimoni." />
          </div>
        )}
      </div>

      {!loading && (
        <div className="text-center mt-12 flex flex-col md:flex-row justify-center items-center gap-3">
          {myTestimoni ? (
            <div className="flex justify-center gap-3">
              <button
                onClick={() => openModal(true)}
                className="bg-background hover:bg-primary text-primary hover:text-white border border-primary font-semibold px-4 py-2 rounded-xl"
              >
                Edit Testimoni
              </button>

              <button
                onClick={() => setConfirmDelete(true)}
                className="bg-primary hover:bg-background border border-primary hover:text-primary text-white font-semibold px-4 py-2 rounded-xl"
              >
                Hapus
              </button>
            </div>
          ) : (
            <button
              onClick={() => openModal(false)}
              className="bg-primary border border-primary hover:text-primary hover:bg-background text-white font-semibold px-4 py-2 rounded-xl"
            >
              Tambahkan Testimoni
            </button>
          )}
          {/* Tambahan tombol "Kelola Testimoni" jika user adalah admin */}
          {user && (
            <div>
              <Link
                href="/etalase-admin/testimoni"
                className="inline-block bg-background hover:bg-primary text-primary hover:text-white border border-primary font-semibold px-4 py-2 rounded-xl"
              >
                Kelola Testimoni
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Modal Tambah/Edit Testimoni */}
      <ModalTestimoni
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        rating={rating}
        setRating={setRating}
        isEdit={!!myTestimoni}
      />

      {/* Modal Konfirmasi Hapus */}
      {confirmDelete && (
        <ConfirmModal
          mode="delete"
          title="Hapus Testimoni"
          message="Apakah Anda yakin ingin menghapus testimoni ini?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      {/* Modal Alert */}
      {alert && (
        <ConfirmModal
          mode="alert"
          title={alert.title}
          message={alert.message}
          onConfirm={() => setAlert(null)}
        />
      )}
    </section>
  );
}
