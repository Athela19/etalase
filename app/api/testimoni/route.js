import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// 🟢 GET semua testimoni
export async function GET() {
  try {
    const data = await prisma.testimoni.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}

// 🟢 POST testimoni baru
export async function POST(req) {
  try {
    const { name, message, rating } = await req.json();

    // Buat token unik untuk user
    const token = crypto.randomUUID();

    // Simpan ke database
    const newTestimoni = await prisma.testimoni.create({
      data: { name, message, rating, token },
    });

    // Buat response dan kirim cookie ke browser
    const res = NextResponse.json({
      success: true,
      testimoni: newTestimoni,
    });

    res.cookies.set("tokenTestimoni", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365 * 10, // 10 tahun
    });

    return res;
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan testimoni" },
      { status: 500 }
    );
  }
}
