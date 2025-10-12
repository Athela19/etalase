import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET
export async function GET() {
  const config = await prisma.config.findFirst();
  return NextResponse.json(config || {});
}

// PUT
export async function PUT(req) {
  const data = await req.json();

  const existing = await prisma.config.findFirst();

  // Pastikan panjang address dan urlAddress sama
  const maxLen = Math.max(data.address?.length || 0, data.urlAddress?.length || 0);

  const addresses = Array.from({ length: maxLen }, (_, i) => ({
    address: data.address?.[i] || "",
    url: data.urlAddress?.[i] || "",
  }));

  const payload = {
    tiktokUrl: data.tiktokUrl || "",
    shopeeUrl: data.shopeeUrl || "",
    whatsappNumber: data.whatsappNumber || "",
    whatsappMessage: data.whatsappMessage || "",
    primaryColor: data.primaryColor || "#3b82f6",
    storeName: data.storeName || "",
    description: data.description || "",
    address: addresses.map((a) => a.address),
    urlAddress: addresses.map((a) => a.url),
  };

  const config = existing
    ? await prisma.config.update({
        where: { id: existing.id },
        data: payload,
      })
    : await prisma.config.create({ data: payload });

  return NextResponse.json(config);
}
