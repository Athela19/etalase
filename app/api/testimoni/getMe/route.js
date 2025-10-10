import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // pastikan prisma sudah di-setup

export async function GET(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const tokenCookie = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("tokenTestimoni="));

    if (!tokenCookie) {
      return NextResponse.json(null); // user belum punya token/testimoni
    }

    const token = tokenCookie.split("=")[1];

    // Cari testimoni berdasarkan token
    const myTestimoni = await prisma.testimoni.findFirst({
      where: { token },
    });

    return NextResponse.json(myTestimoni || null);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal mengambil testimoni" }, { status: 500 });
  }
}
