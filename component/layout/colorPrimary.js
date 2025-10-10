"use client";

import { useEffect } from "react";
import axios from "axios";

export default function GlobalColorProvider() {
  useEffect(() => {
    axios.get("/api/config").then(res => {
      const color = res.data?.primaryColor || "#3b82f6";
      document.documentElement.style.setProperty("--primary", color);
    });
  }, []);

  return null; // tidak render apa pun
}
