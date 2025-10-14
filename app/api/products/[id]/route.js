import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Fungsi bantu agar URL otomatis diawali https:// bila belum
const toUrl = (u = "") => (u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : "");

// ========================
// GET /api/products/:id
// ========================
export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    const productId = Number(id);
    if (!Number.isInteger(productId)) throw new Error("ID tidak valid");

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      id: product.id,
      name: product.name ?? "",
      whatsapp: product.whatsapp ?? "",
      tiktok: toUrl(product.tiktok ?? ""),
      shopee: toUrl(product.shopee ?? ""),
      category: product.category ?? "",
      price: Number(product.price ?? 0),
      image: Array.isArray(product.image) ? product.image : [],
      description: product.description ?? "",
      active: product.active ?? true,
      createdAt: product.createdAt,
    });
  } catch (error) {
    console.error("[GET /api/products/:id] error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(error?.message || error) },
      { status: 500 }
    );
  }
}

// ========================
// PUT /api/products/:id
// ========================
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const productId = Number(id);
    if (!Number.isInteger(productId)) throw new Error("ID tidak valid");

    const body = await req.json();
    const data = {};

    // 🔹 Field umum
    if ("name" in body) data.name = body.name;
    if ("whatsapp" in body) data.whatsapp = body.whatsapp;
    if ("tiktok" in body) data.tiktok = toUrl(body.tiktok);
    if ("shopee" in body) data.shopee = toUrl(body.shopee);
    if ("category" in body) data.category = body.category;
    if ("price" in body) data.price = parseFloat(body.price);

    // 🔹 Validasi gambar (UploadThing URL)
    if ("image" in body) {
      if (!Array.isArray(body.image)) {
        return NextResponse.json(
          { error: "VALIDATION", message: "Field 'image' harus berupa array URL gambar." },
          { status: 400 }
        );
      }

      if (body.image.length < 1 || body.image.length > 5) {
        return NextResponse.json(
          { error: "VALIDATION", message: "Jumlah gambar harus antara 1–5." },
          { status: 400 }
        );
      }

      const safeImages = body.image.map((url) => toUrl(url));
      data.image = safeImages;
    }

    if ("description" in body) data.description = body.description;
    if ("active" in body) data.active = Boolean(body.active);

    const updated = await prisma.product.update({
      where: { id: productId },
      data,
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name ?? "",
      whatsapp: updated.whatsapp ?? "",
      tiktok: toUrl(updated.tiktok ?? ""),
      shopee: toUrl(updated.shopee ?? ""),
      category: updated.category ?? "",
      price: Number(updated.price ?? 0),
      image: Array.isArray(updated.image) ? updated.image : [],
      description: updated.description ?? "",
      active: updated.active ?? true,
      createdAt: updated.createdAt,
    });
  } catch (error) {
    console.error("[PUT /api/products/:id] error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(error?.message || error) },
      { status: 500 }
    );
  }
}

// ========================
// DELETE /api/products/:id
// ========================
export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;
    const productId = Number(id);
    if (!Number.isInteger(productId)) throw new Error("ID tidak valid");

    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/products/:id] error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: String(error?.message || error) },
      { status: 500 }
    );
  }
}
