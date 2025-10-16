# Etalase

Etalase adalah aplikasi storefront sederhana dibuat dengan Next.js (App Router) dan Prisma untuk manajemen data. Aplikasi ini cocok sebagai etalase produk digital yang menyajikan produk, kategori, wishlist, dan testimoni pelanggan.

---

## Ringkasan teknis
- Framework: Next.js (v15, App Router)
- Bahasa: JavaScript (React 19)
- ORM: Prisma (PostgreSQL datasource via DATABASE_URL)
- State client: Zustand
- Uploads: @uploadthing/react (core route di `app/api/uploadthing`)
- Styling: Tailwind CSS

## Struktur penting
- `app/` - folder App Router, berisi page dan api routes
  - `app/api/` - API routes (auth, products, testimoni, uploadthing, dll.)
  - `app/etalase-admin/` - halaman admin (produk, testimoni)
- `component/` - komponen UI (dashboard, produk, kategori, layout, reusable)
- `lib/` - helper & utilities (`prisma.js`, `userCheck.js`, `config.js`)
- `prisma/schema.prisma` - model data
- `store/` - Zustand stores (contoh: `wishlistStore.js`)
- `public/` - aset statis (ikon sosial, gambar)

## Requirements (lokal)
- Node.js 20+ direkomendasikan (cocok dengan Next.js 15)
- npm / yarn / pnpm
- PostgreSQL jika ingin menjalankan Prisma penuh

## Environment variables
Buat file `.env` (jangan commit ke repo). Contoh variabel yang digunakan di proyek ini:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/etalase
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Optional admin credentials for demo (see SECURITY NOTES below)
ADMIN_EMAIL=admin@etalase.com
ADMIN_PASSWORD_HASH=\n# or use more secure auth (NextAuth, Clerk, etc.)
JWT_SECRET=your_jwt_secret_here
```

Tambahkan file `.env.example` ke repo agar developer lain tahu variabel apa yang diperlukan.

## Setup & menjalankan lokal
1. Install dependencies

```powershell
npm install
```

2. Siapkan `.env` (salin dari `.env.example` lalu isi nilai)

3. Generate Prisma client dan jalankan migrasi (jika ada)

```powershell
npx prisma generate
npx prisma migrate deploy # atau prisma migrate dev saat pengembangan
```

4. Jalankan dev server

```powershell
npm run dev
```

Akses app di http://localhost:3000

## Skrip yang tersedia (package.json)
- `npm run dev` — jalankan Next.js dev server
- `npm run build` — jalankan `prisma generate` lalu build Next (turbopack)
- `npm start` — jalankan Next production server
- `npm run lint` — jalankan ESLint

## Security notes (harus dibaca)
Selama audit cepat terhadap kode, ditemukan beberapa masalah keamanan yang perlu segera diperbaiki:

1. Hard-coded admin credential
   - `app/api/auth/route.js` berisi email/password admin dalam plaintext. Ini berbahaya—pindahkan credential ke environment variables dan gunakan password hash (bcrypt/argon2) atau gunakan provider otentikasi seperti NextAuth.

2. Sesi (cookie) sederhana dan client-side auth
   - Saat ini session di-set sebagai cookie dengan value `logged-in` dan `lib/userCheck.js` hanya memeriksa cookie tersebut. Hal ini mudah dipalsukan. Ganti dengan HttpOnly signed cookie (JWT atau session id) dan verifikasi di server (`/api/auth/me`).

3. Banyak `console.log`/`console.error`
   - Bersihkan logging debug sebelum produksi atau gunakan logger yang mem-filter pesan berdasarkan NODE_ENV.

4. Input validation
   - Endpoint API belum menggunakan schema validation yang kuat. Tambahkan `zod` / `joi` untuk memvalidasi payload API dan menghindari input berbahaya.

5. Secrets management
   - Tambahkan `.env.example`, jangan menyimpan secrets di repo, dan pertimbangkan secret scanning di CI.

## Quick recommended improvements
- Immediate: Pindahkan admin creds ke `.env` dan gunakan hashed password + HttpOnly signed cookie. Implementasi minimal bisa saya bantu.
- Short term: Tambah endpoint `/api/auth/me` untuk verifikasi sesi, dan ubah `lib/userCheck.js` agar memanggil endpoint itu.
- Mid term: Tambah test (jest/vitest), GitHub Actions workflow (lint/test/build), dan secret scanning.
- Long term: Pertimbangkan migrasi ke TypeScript.

## Notes on Prisma
- `prisma/schema.prisma` menggunakan provider `postgresql` dan `env("DATABASE_URL")` — pastikan `DATABASE_URL` di `.env` benar.
- `lib/prisma.js` sudah mengadopsi pola singleton untuk development — ini bagus untuk Next dev hot-reloading.

## Contributing
- Buat branch baru, lakukan perubahan, jalankan lint & test (jika ada). Gunakan PR untuk review.

## Jika mau saya bantu
Saya dapat membuat perubahan cepat, mis. memindahkan admin credentials ke env + perbaiki cookie session (menggunakan bcrypt + JWT) dan menambahkan `.env.example`. Pilih salah satu:

- A — Implementasi minimal secure auth (bcrypt + signed HttpOnly cookie)
- B — Integrasi NextAuth (lebih lengkap)
- C — Hanya buat `.env.example` dan catatan (non-invasive)

Balas pilihan Anda, saya akan mulai mengerjakan patch langsung.
