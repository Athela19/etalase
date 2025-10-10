export const runtime = "nodejs";
export const revalidate = 0;

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Fungsi bantu untuk format URL (menambah https:// bila perlu)
const toUrl = (u = "") => (u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : "");

// Fungsi bantu untuk parsing ID dan validasi
const parseId = (params) => {
  const id = Number(params?.id);
  if (!Number.isInteger(id)) throw new Error("ID tidak valid");
  return id;
};

// ✅ GET /api/products/:id — Ambil produk berdasarkan ID
export async function GET(_req, { params }) {
  try {
    const id = parseId(params);
    const r = await prisma.product.findUnique({ where: { id } });
    if (!r) return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

    return NextResponse.json({
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
    });
  } catch (e) {
    console.error("GET /products/:id error:", e);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}

// ✅ PUT /api/products/:id — Partial update (fleksibel)
export async function PUT(req, { params }) {
  try {
    const id = parseId(params);
    const body = await req.json();
    const data = {};

    if ("name" in body) data.name = body.name;
    if ("whatsapp" in body) data.whatsapp = body.whatsapp;
    if ("tiktok" in body) data.tiktok = toUrl(body.tiktok);
    if ("shopee" in body) data.shopee = toUrl(body.shopee);
    if ("category" in body) data.category = body.category;
    if ("price" in body) data.price = parseFloat(body.price);
    if ("image" in body) data.image = body.image;
    if ("description" in body) data.description = body.description;
    if ("active" in body) data.active = Boolean(body.active);

    const updated = await prisma.product.update({ where: { id }, data });

    return NextResponse.json({
      id: updated.id,
      name: updated.name ?? "",
      whatsapp: updated.whatsapp ?? "",
      tiktok: toUrl(updated.tiktok ?? ""),
      shopee: toUrl(updated.shopee ?? ""),
      category: updated.category ?? "",
      price: Number(updated.price ?? 0),
      image: updated.image ?? "",
      description: updated.description ?? "",
      active: updated.active ?? true,
      createdAt: updated.createdAt,
    });
  } catch (e) {
    console.error("PUT /products/:id error:", e);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}

// ✅ DELETE /api/products/:id — Hapus produk berdasarkan ID
export async function DELETE(_req, { params }) {
  try {
    const id = parseId(params);
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /products/:id error:", e);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(e?.message || e) },
      { status: 500 }
    );
  }
}
