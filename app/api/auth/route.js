import { NextResponse } from "next/server";

const ADMIN = {
  email: "admin@etalase.com",
  password: "9or3n9p1s*4an9",
};

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const ok = email === ADMIN.email && password === ADMIN.password;
    if (!ok) {
      return NextResponse.json(
        { ok: false, message: "Email atau password salah." },
        { status: 401 }
      );
    }

    // Set sesi login (sederhana, tanpa DB)
    const res = NextResponse.json({ ok: true, message: "Login sukses." });
    res.cookies.set({
      name: "session",
      value: "logged-in",          // untuk demo, cukup flag
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,    // 7 hari
    });
    
    return res;
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: "Bad request." },
      { status: 400 }
    );
  }
}
