"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/component/layout/navbar";
import Footer from "@/component/layout/footer";
import GlobalColorProvider from "@/component/layout/colorPrimary";

export default function LayoutClient({ children }) {
  const pathname = usePathname();

  let mode = "hidden";
  const defaultMode = ["/"];
  const logoutPaths = ["/wishlist", "/settings"];

  if (defaultMode.includes(pathname)) mode = "default";
  else if (logoutPaths.includes(pathname)) mode = "logout";

  return (
    <>
      <Navbar mode={mode} />
      <GlobalColorProvider />
      {children}
      <Footer />
    </>
  );
}
