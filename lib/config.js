"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/config")
      .then(res => setConfig(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Loading overlay saat fetch data
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

  return (
    <ConfigContext.Provider value={{ config, loading }}>
      {children}
    </ConfigContext.Provider>
  );
}

// Hook untuk digunakan di komponen anak
export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within ConfigProvider");
  }
  return context;
}
