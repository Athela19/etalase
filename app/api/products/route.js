import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const toUrl = (u = "") => (u && /^https?:\/\//i.test(u) ? u : u ? `https://${u}` : "");

// ✅ GET
export async function GET() {
  try {
    const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(rows, { status: 200 });
  } catch (e) {
    console.error("[GET /api/products]", e);
    return NextResponse.json({ message: String(e.message) }, { status: 500 });
  }
}

// ✅ POST
export async function POST(req) {
  try {
    const { name, whatsapp, tiktok, shopee, category, price, image, description } = await req.json();

    if (!Array.isArray(image))
      return NextResponse.json({ message: "Field 'image' harus berupa array." }, { status: 400 });

    if (image.length < 1)
      return NextResponse.json({ message: "Minimal 1 gambar diperlukan." }, { status: 400 });

    const created = await prisma.product.create({
      data: {
        name,
        whatsapp: whatsapp || "",
        tiktok: tiktok || "",
        shopee: shopee || "",
        category,
        price: parseFloat(price),
        image,
        description,
        active: true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("[POST /api/products]", e);
    return NextResponse.json({ message: String(e.message) }, { status: 500 });
  }
}
