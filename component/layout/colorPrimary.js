"use client";

import { useEffect } from "react";
import  {useConfig}  from "@/lib/config"; // pastikan named import

export default function GlobalColorProvider() {
  const { config, loading } = useConfig();

  useEffect(() => {
    if (!loading) {
      const color = config?.primaryColor || "#3b82f6";
      document.documentElement.style.setProperty("--primary", color);
    }
  }, [config, loading]);

  return null; // tidak render apa pun
}
