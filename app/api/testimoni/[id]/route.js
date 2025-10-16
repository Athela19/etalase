import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🟡 PUT (edit testimoni berdasarkan token dari cookie)
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const cookieHeader = req.headers.get("cookie") || "";
    const tokenCookie = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("tokenTestimoni="));

    if (!tokenCookie) {
      return NextResponse.json(
        { error: "Tidak ada token testimoni di cookie" },
        { status: 401 }
      );
    }

    const token = tokenCookie.split("=")[1];
    const { name, message, rating } = await req.json();

    // Pastikan testimoni milik token yang benar
    const existing = await prisma.testimoni.findFirst({
      where: { id: Number(id), token },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Testimoni tidak ditemukan atau bukan milik Anda" },
        { status: 404 }
      );
    }

    const updated = await prisma.testimoni.update({
      where: { id: Number(id) },
      data: { name, message, rating },
    });

    return NextResponse.json({ success: true, testimoni: updated });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui testimoni" },
      { status: 500 }
    );
  }
}

// 🔴 DELETE (hapus testimoni berdasarkan token dari cookie)
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    // Langsung hapus berdasarkan ID tanpa verifikasi token
    const existing = await prisma.testimoni.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Testimoni tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.testimoni.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus testimoni" },
      { status: 500 }
    );
  }
}
