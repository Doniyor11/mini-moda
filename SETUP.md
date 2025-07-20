# MiniModa E-commerce Setup Guide

Bu loyihani ishga tushirish uchun quyidagi qadamlarni bajaring.

## 📋 Talablar

- Node.js 18+ 
- npm yoki yarn
- Supabase account
- (Ixtiyoriy) Telegram Bot

## 🚀 Tezkor boshlash

### 1. Loyihani klonlash

\`\`\`bash
git clone <repository-url>
cd minimoda-ecommerce
npm install
\`\`\`

### 2. Environment Variables sozlash

`.env.local` faylini yarating va quyidagi ma'lumotlarni kiriting:

\`\`\`env
# Supabase Configuration (MAJBURIY)
NEXT_PUBLIC_SUPABASE_URL=https://drfbjbnwpoqnnqdmtptl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZmJqYm53cG9xbm5xZG10cHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MzA2NjksImV4cCI6MjA2ODQwNjY2OX0.QJCAB922OcccyhPF1Mirr-5DAuUKjQ9BLCDWm_zd8kE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZmJqYm53cG9xbm5xZG10cHRsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjgzMDY2OSwiZXhwIjoyMDY4NDA2NjY5fQ.mVJ0v4_hn4EW4-ChtkjZC1rVf68IgrCyB_xCf6YF43Y

# Telegram Configuration (IXTIYORIY)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. Ma'lumotlar bazasini sozlash

Supabase SQL Editor'da quyidagi skriptlarni ketma-ket ishga tushiring:

\`\`\`bash
# 1. Jadvallarni yaratish
scripts/01-create-tables.sql

# 2. Namuna ma'lumotlar
scripts/02-seed-data.sql

# 3. Storage sozlash
scripts/03-create-storage.sql

# 4. Qo'shimcha ustunlar
scripts/04-add-notes-column.sql

# 5. RLS sozlash
scripts/05-fix-orders-rls.sql

# 6. Storage policies
scripts/06-fix-storage-policies.sql

# 7. Address ustuni
scripts/07-fix-address-column.sql
\`\`\`

### 4. Development serverni ishga tushirish

\`\`\`bash
npm run dev
\`\`\`

Brauzerda `http://localhost:3000` ga o'ting.

## 🔧 Konfiguratsiya

### Supabase sozlash

1. [supabase.com](https://supabase.com) ga kiring
2. Yangi loyiha yarating
3. Settings > API ga o'ting
4. URL va API kalitlarini nusxalang
5. `.env.local` faylga qo'ying

### Telegram Bot sozlash (ixtiyoriy)

1. [@BotFather](https://t.me/botfather) ga yozing
2. `/newbot` buyrug'ini yuboring
3. Bot nomini kiriting
4. Token oling va `.env.local` ga qo'ying
5. Chat ID ni olish uchun botga xabar yuboring va webhook orqali oling

## 📁 Loyiha tuzilishi

\`\`\`
minimoda-ecommerce/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   ├── cart/              # Savatcha sahifasi
│   ├── checkout/          # Checkout sahifasi
│   ├── contact/           # Aloqa sahifasi
│   ├── product/           # Mahsulot sahifasi
│   └── products/          # Mahsulotlar ro'yxati
├── components/            # React komponentlar
│   ├── admin/            # Admin komponentlar
│   └── ui/               # UI komponentlar
├── context/              # React Context
├── lib/                  # Utility funksiyalar
├── scripts/              # SQL skriptlar
└── public/               # Statik fayllar
\`\`\`

## 🧪 Testlash

### Health Check

Tizim holatini tekshirish:
\`\`\`
GET /api/health
\`\`\`

### Telegram Test

Telegram integratsiyasini tekshirish:
\`\`\`
GET /api/test-telegram
\`\`\`

## 🚀 Production'ga deploy qilish

### Vercel (tavsiya etiladi)

1. GitHub'ga push qiling
2. [vercel.com](https://vercel.com) ga kiring
3. Loyihani import qiling
4. Environment variables qo'shing
5. Deploy qiling

### Environment Variables (Production)

Production uchun quyidagi o'zgaruvchilarni sozlang:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

## 🔍 Muammolarni hal qilish

### Umumiy muammolar

1. **Supabase connection error**
   - Environment variables to'g'ri sozlanganini tekshiring
   - `/api/health` endpoint orqali holatni tekshiring

2. **Image upload ishlamaydi**
   - Supabase Storage policies tekshiring
   - `scripts/06-fix-storage-policies.sql` ni ishga tushiring

3. **Telegram xabarlari kelmaydi**
   - Bot token va chat ID to'g'riligini tekshiring
   - `/api/test-telegram` orqali test qiling

### Debug qilish

Development mode'da batafsil xatolik ma'lumotlari console'da ko'rsatiladi:

\`\`\`bash
# Browser console
F12 > Console

# Server logs
npm run dev
\`\`\`

## 📞 Yordam

Muammolar yuz berganda:

1. `SETUP.md` faylini qaytadan o'qing
2. `/api/health` endpoint orqali tizim holatini tekshiring
3. Browser console'da xatoliklarni ko'ring
4. GitHub Issues'da savol bering

## 🔄 Yangilanishlar

Loyihani yangilash uchun:

\`\`\`bash
git pull origin main
npm install
npm run dev
\`\`\`

Ma'lumotlar bazasi o'zgarishlari bo'lsa, yangi SQL skriptlarni ishga tushiring.
\`\`\`

Supabase konfiguratsiyasini ham yangilaymiz:
