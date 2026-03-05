# Marketplace Customer Panel (Next.js)

Next.js 14 + TailwindCSS + React Query + Zustand

## Ishga tushirish

```bash
npm install
npm run dev
# http://localhost:3003
```

## Sahifalar
- `/products` — Asosiy sahifa: katalog, kategoriya filtri, qidiruv
- `/products/[id]` — Mahsulot detali + miqdor tanlash + savatga qoshish
- `/cart` — Savat: miqdor o'zgartirish, narx xulosa, checkout
- `/checkout` — Buyurtma berish: manzil, to'lov usuli
- `/orders` — Buyurtmalar tarixi + bekor qilish
- `/profile` — Profil sozlamalari
- `/profile/cards` — Karta boshqarish (qoshish/o'chirish)
- `/login` — Kirish
- `/register` — Ro'yxatdan o'tish

## Backend
Backend `http://localhost:3000` da ishlashi kerak.
Next.js rewrites orqali `/api` → `http://localhost:3000/api` yo'naltiriladi.
