"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get("/api/config");
        setConfig(res.data);
      } catch (err) {
        console.error("Gagal mengambil config:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // 🔹 Saat loading: tampilkan overlay yang menutupi seluruh web
  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3 text-primary">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // 🔹 Setelah config berhasil dimuat, render seluruh web
  return <>{children}</>;
}
