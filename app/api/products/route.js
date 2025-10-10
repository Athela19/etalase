export const runtime = "nodejs";
export const revalidate = 0;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Fungsi bantu agar URL otomatis diawali https:// bila belum
const toUrl = (u = "") => (u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : "");

// ✅ GET: list semua produk
export async function GET() {
  try {
    const rows = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    const products = rows.map((r) => ({
      id: r.id,
      name: r.name ?? "",
      whatsapp: r.whatsapp ?? "",
      tiktok: toUrl(r.tiktok ?? ""),
      shopee: toUrl(r.shopee ?? ""),
      category: r.category ?? "",
      price: Number(r.price ?? 0),
      image: r.image ?? "",
      description: r.description ?? "",
      active: r.active ?? true,
      createdAt: r.createdAt,
    }));

    return NextResponse.json(products, { status: 200 });
  } catch (e) {
    console.error("[GET /api/products]", e);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}

// ✅ POST: tambah produk baru
export async function POST(req) {
  try {
    const { name, whatsapp, tiktok, shopee, category, price, image, description } = await req.json();

    // Validasi field wajib
    if (![name, category, price, image, description].every(Boolean)) {
      return NextResponse.json(
        { error: "VALIDATION", message: "Field name, category, price, image, dan description wajib diisi." },
        { status: 400 }
      );
    }

    const created = await prisma.product.create({
      data: {
        name,
        whatsapp: whatsapp || "",
        tiktok: toUrl(tiktok || ""),
        shopee: toUrl(shopee || ""),
        category,
        price: parseFloat(price),
        image,
        description,
        active: true,
      },
    });

    const out = {
      id: created.id,
      name: created.name ?? "",
      whatsapp: created.whatsapp ?? "",
      tiktok: created.tiktok ?? "",
      shopee: created.shopee ?? "",
      category: created.category ?? "",
      price: Number(created.price ?? 0),
      image: created.image ?? "",
      description: created.description ?? "",
      active: created.active ?? true,
      createdAt: created.createdAt,
    };

    return NextResponse.json(out, { status: 201 });
  } catch (e) {
    console.error("[POST /api/products]", e);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}
