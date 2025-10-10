import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🟢 GET config
export async function GET() {
  const config = await prisma.config.findFirst();
  return NextResponse.json(config || {});
}

// 🟡 PUT update config
export async function PUT(req) {
  const data = await req.json();
  const existing = await prisma.config.findFirst();

  if (existing) {
    const updated = await prisma.config.update({
      where: { id: existing.id },
      data,
    });
    return NextResponse.json(updated);
  } else {
    const created = await prisma.config.create({ data });
    return NextResponse.json(created);
  }
}
