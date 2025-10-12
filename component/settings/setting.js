"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash, Loader2 } from "lucide-react";
import ConfirmModal from "@/component/reusable/modal"; // sesuaikan path

// Komponen Input
function Input({ label, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      <input
        {...props}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none
                   focus:border-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

export default function SettingsConfig() {
  const presetColors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

  const [config, setConfig] = useState({
    storeName: "",
    description: "",
    tiktokUrl: "",
    shopeeUrl: "",
    whatsappNumber: "",
    whatsappMessage: "",
    primaryColor: "#3b82f6",
    address: [""],
    urlAddress: [""],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [modal, setModal] = useState({
    open: false,
    mode: "alert",
    title: "",
    message: "",
    confirmText: "",
    cancelText: "",
    onConfirm: null,
    onCancel: null,
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get("/api/config");
        if (res.data) {
          const data = res.data;
          setConfig({
            storeName: data.storeName || "",
            description: data.description || "",
            tiktokUrl: data.tiktokUrl || "",
            shopeeUrl: data.shopeeUrl || "",
            whatsappNumber: data.whatsappNumber || "",
            whatsappMessage: data.whatsappMessage || "",
            primaryColor: data.primaryColor || "#3b82f6",
            address: data.address?.length ? data.address : [""],
            urlAddress: data.urlAddress?.length ? data.urlAddress : [""],
          });
        }
      } catch (err) {
        console.error(err);
        openAlert("Error", "Gagal memuat konfigurasi.");
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleAddressChange = (i, key, value) => {
    setConfig((prev) => {
      const updated = [...prev[key]];
      updated[i] = value;
      return { ...prev, [key]: updated };
    });
  };

  const addAddress = () => {
    setConfig((prev) => ({
      ...prev,
      address: [...prev.address, ""],
      urlAddress: [...prev.urlAddress, ""],
    }));
  };

  const removeAddress = (i) => {
    setConfig((prev) => ({
      ...prev,
      address: prev.address.filter((_, idx) => idx !== i),
      urlAddress: prev.urlAddress.filter((_, idx) => idx !== i),
    }));
  };

  // Modal helper
  const openAlert = (title, message) => {
    setModal({
      open: true,
      mode: "alert",
      title,
      message,
      onConfirm: () => setModal((prev) => ({ ...prev, open: false })),
      onCancel: null,
    });
  };

  const handleSave = () => {
    setModal({
      open: true,
      mode: "confirm",
      title: "Simpan Konfigurasi",
      message: "Apakah Anda yakin ingin menyimpan konfigurasi ini?",
      onConfirm: async () => {
        try {
          setSaving(true);
          await axios.put("/api/config", config);
          openAlert("Berhasil", "Konfigurasi berhasil disimpan!");
        } catch (err) {
          console.error(err);
          openAlert("Gagal", "Gagal menyimpan konfigurasi.");
        } finally {
          setSaving(false);
          setModal((prev) => ({ ...prev, open: false }));
        }
      },
      onCancel: () => setModal((prev) => ({ ...prev, open: false })),
    });
  };

  const handleCancel = () => {
    setModal({
      open: true,
      mode: "confirm",
      title: "Batal",
      message: "Apakah Anda yakin ingin membatalkan perubahan?",
      onConfirm: () => window.location.reload(),
      onCancel: () => setModal((prev) => ({ ...prev, open: false })),
    });
  };

  if (loading)
    return (
      <div className="p-10 text-center text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
        Memuat konfigurasi...
      </div>
    );

  return (
    <div className="p-6 md:p-10 space-y-6 pt-20 md:pt-24">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
        Pengaturan Toko
      </h1>

      {/* Row 1: Nama, WA, Color */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <Input
          label="Nama Toko"
          value={config.storeName}
          onChange={(e) =>
            setConfig({ ...config, storeName: e.target.value })
          }
        />
        <Input
          label="WhatsApp Number"
          value={config.whatsappNumber}
          onChange={(e) =>
            setConfig({ ...config, whatsappNumber: e.target.value })
          }
        />
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-600">
            Primary Color
          </label>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            {presetColors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-lg border ${
                  config.primaryColor === color
                    ? "border-black"
                    : "border-slate-300"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setConfig({ ...config, primaryColor: color })}
              />
            ))}
            <input
              type="color"
              className="w-9 h-9 cursor-pointer"
              value={config.primaryColor}
              onChange={(e) =>
                setConfig({ ...config, primaryColor: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Row 2: Deskripsi & WA Message (textarea) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-600">
            Deskripsi
          </label>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none
                       focus:border-none focus:ring-2 focus:ring-primary resize-none"
            value={config.description}
            onChange={(e) =>
              setConfig({ ...config, description: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-600">
            WhatsApp Message
          </label>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none
                       focus:border-none focus:ring-2 focus:ring-primary resize-none"
            value={config.whatsappMessage}
            onChange={(e) =>
              setConfig({ ...config, whatsappMessage: e.target.value })
            }
          />
        </div>
      </div>

      {/* Row 3: TikTok & Shopee URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Input
          label="TikTok URL"
          value={config.tiktokUrl}
          onChange={(e) =>
            setConfig({ ...config, tiktokUrl: e.target.value })
          }
        />
        <Input
          label="Shopee URL"
          value={config.shopeeUrl}
          onChange={(e) =>
            setConfig({ ...config, shopeeUrl: e.target.value })
          }
        />
      </div>

      {/* Row 4: Alamat Toko */}
      <div>
        <h2 className="text-xl font-semibold mb-3 text-slate-700">
          Alamat Toko
        </h2>
        {config.address.map((addr, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row gap-2 mb-2 items-start sm:items-center"
          >
            <input
              placeholder="Alamat"
              value={addr}
              onChange={(e) =>
                handleAddressChange(i, "address", e.target.value)
              }
              className="flex-1 border border-slate-300 rounded-lg p-2 outline-none
                         focus:border-none focus:ring-2 focus:ring-primary w-full"
            />
            <input
              placeholder="URL Google Maps"
              value={config.urlAddress[i] || ""}
              onChange={(e) =>
                handleAddressChange(i, "urlAddress", e.target.value)
              }
              className="flex-1 border border-slate-300 rounded-lg p-2 outline-none
                         focus:border-none focus:ring-2 focus:ring-primary w-full"
            />
            <button
              onClick={() => removeAddress(i)}
              className="text-red-500 hover:text-red-700 mt-1 sm:mt-0"
            >
              <Trash size={18} />
            </button>
          </div>
        ))}
        <button
          onClick={addAddress}
          className="flex items-center text-primary mt-2 gap-1 font-medium hover:underline"
        >
          <Plus size={16} /> Tambah Alamat
        </button>
      </div>

      {/* Tombol Batal & Simpan */}
      <div className="flex justify-end gap-2 mt-4 flex-col sm:flex-row">
        <button
          onClick={handleCancel}
          className="border border-slate-300 px-6 py-2 rounded-lg hover:bg-slate-100 transition-all w-full sm:w-auto"
        >
          Batal
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 flex justify-center items-center gap-2 transition-all w-full sm:w-auto"
        >
          {saving && <Loader2 className="animate-spin w-4 h-4" />}
          Simpan
        </button>
      </div>

      {/* Modal */}
      {modal.open && (
        <ConfirmModal
          mode={modal.mode}
          title={modal.title}
          message={modal.message}
          confirmText={modal.confirmText}
          cancelText={modal.cancelText}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
        />
      )}
    </div>
  );
}
