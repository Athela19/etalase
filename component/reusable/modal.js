"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Trash2, Info } from "lucide-react";

export default function ConfirmModal({
  mode = "confirm", // 'alert' | 'confirm' | 'delete'
  title,
  message = "Apakah Anda yakin ingin melanjutkan?",
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) {
  const [open, setOpen] = useState(false);

  // 🔹 Buka modal otomatis saat pertama kali render
  useEffect(() => {
    setOpen(true);
  }, []);

  // ====== Mode Settings ======
  const config = {
    alert: {
      icon: <Info className="w-10 h-10 text-primary mb-3" />,
      title: title || "Informasi",
      confirmText: confirmText || "OK",
      showCancel: false,
      confirmColor: "bg-primary hover:bg-primary/80",
    },
    confirm: {
      icon: <AlertTriangle className="w-10 h-10 text-yellow-500 mb-3" />,
      title: title || "Konfirmasi",
      confirmText: confirmText || "Ya",
      cancelText: cancelText || "Batal",
      showCancel: true,
      confirmColor: "bg-primary hover:bg-primary/80",
    },
    delete: {
      icon: <Trash2 className="w-10 h-10 text-red-500 mb-3" />,
      title: title || "Hapus Data",
      confirmText: confirmText || "Hapus",
      cancelText: cancelText || "Batal",
      showCancel: true,
      confirmColor: "bg-red-600 hover:bg-red-700",
    },
  }[mode];

  // ====== Handler ======
  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 relative"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Tombol close */}
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon dan teks */}
            <div className="flex flex-col items-center text-center">
              {config.icon}
              <h2 className="text-lg font-semibold text-gray-800">
                {config.title}
              </h2>
              <p className="text-gray-600 mt-2">{message}</p>
            </div>

            {/* Tombol */}
            <div
              className={`mt-6 flex ${
                config.showCancel ? "justify-end space-x-3" : "justify-center"
              }`}
            >
              {config.showCancel && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  {config.cancelText}
                </button>
              )}
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-lg text-white ${config.confirmColor} transition`}
              >
                {config.confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
