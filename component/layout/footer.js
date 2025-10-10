"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { usePathname } from "next/navigation";

export default function Footer() {
  const [user, setUser] = useState(null);
  const [config, setConfig] = useState(null);
  const pathname = usePathname();

  // 🔹 Tentukan di halaman mana Footer muncul
  const showNavbarOn = ["/"];
  const showNavbar = showNavbarOn.includes(pathname);

  // 🔹 Cek apakah user login dari cookie
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

  // 🔹 Ambil data config dari API
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get("/api/config");
        if (res.data) {
          setConfig(res.data);
        }
      } catch (err) {
        console.error("Gagal mengambil config:", err);
      }
    };
    fetchConfig();
  }, []);

  // 🔹 Navigasi (berbeda untuk user login & non-login)
  const navigations = [
    { label: "Beranda", href: "/", role: "all" },
    { label: "Wishlist", href: "/wishlist", role: "all" },
    { label: "Kelola Produk", href: "/admin/kelola-products", role: "user" },
    { label: "Settings", href: "/admin/settings", role: "user" },
  ];

  // 🔹 Media Sosial (ambil dari config)
  const socials = [
    {
      label: "Shopee",
      href: config?.shopeeUrl || "https://shopee.co.id/",
      icon: "/shopee.png",
      color: "hover:opacity-80",
    },
    {
      label: "TikTok",
      href: config?.tiktokUrl || "https://www.tiktok.com/",
      icon: "/tiktok.png",
      color: "hover:opacity-80",
    },
    {
      label: "WhatsApp",
      href: config?.whatsappNumber
        ? `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
            config.whatsappMessage || "Halo, saya tertarik!"
          )}`
        : "https://wa.me/628123456789",
      icon: "/whatsapp.png",
      color: "hover:opacity-80",
    },
  ];

  // 🔹 Filter navigasi sesuai status login
  const filteredNav = navigations.filter(
    (nav) => nav.role === "all" || (nav.role === "user" && user)
  );

  // 🔹 Jika halaman tidak termasuk daftar, jangan tampilkan Footer
  if (!showNavbar) return null;

  return (
    <footer className="bg-background/80 backdrop-blur-md border-t border-slate-200 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
        {/* 🔹 Brand */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-extrabold text-primary mb-3 tracking-tight">
            Etalase
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Platform etalase digital untuk menampilkan, menjelajahi, dan
            mengelola produk Anda dengan mudah.
          </p>
        </div>

        {/* 🔹 Navigasi */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Navigasi
          </h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {filteredNav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 🔹 Sosial Media */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Ikuti Kami
          </h3>
          <div className="flex justify-center gap-4 items-center">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`${social.color} transition-all`}
              >
                <Image
                  src={social.icon}
                  alt={social.label}
                  width={28}
                  height={28}
                  className="rounded-md"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 Copyright */}
      <div className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-slate-500 text-center">
          <p>© {new Date().getFullYear()} Etalase. Semua Hak Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
