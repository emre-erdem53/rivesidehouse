# Riverside Tiny House

Nehrin kıyısında, doğanın kalbinde lüks bir tiny house konaklama deneyimi için
geliştirilmiş web sitesi ve yönetim paneli. **Next.js (App Router)** full-stack,
**PostgreSQL + Prisma** ve **HotelRunner** ile çift yönlü (white-label) API
entegrasyonu.

## Teknoloji

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS v3** — "Rize Mist & Timber" tasarım sistemi (orman yeşili + ahşap)
- **PostgreSQL + Prisma ORM**
- **Auth.js (NextAuth v5)** — rol bazlı yönetici girişi
- **HotelRunner Custom Apps REST API** — oda/fiyat/müsaitlik + rezervasyon senkronizasyonu
- Fontlar: EB Garamond (başlık) + Hanken Grotesk (gövde) + Material Symbols

## Kurulum

```bash
# 1. Bağımlılıkları kur
npm install

# 2. Ortam değişkenlerini ayarla
cp .env.example .env
# .env içindeki DATABASE_URL, AUTH_SECRET ve (varsa) HotelRunner bilgilerini düzenle

# 3. Veritabanını hazırla (PostgreSQL çalışır olmalı)
npm run db:push      # şemayı veritabanına uygula
npm run db:seed      # örnek veri + yönetici kullanıcı

# 4. Geliştirme sunucusu
npm run dev
```

Site: http://localhost:3000 · Yönetim paneli: http://localhost:3000/yonetim

**Demo yönetici girişi:** `admin@riversidetinyhouse.com` / `riverside123`

## Ortam Değişkenleri

| Değişken | Açıklama |
| --- | --- |
| `DATABASE_URL` | PostgreSQL bağlantı adresi |
| `AUTH_SECRET` | Auth.js gizli anahtarı (`openssl rand -base64 32`) — **production zorunlu** |
| `AUTH_URL` | Site kök URL (Vercel: `https://SITENIZ.vercel.app`) |
| `ADMIN_DEMO_MODE` | `true` ise panel + giriş PostgreSQL olmadan demo verilerle çalışır |
| `HOTELRUNNER_HR_ID` / `HOTELRUNNER_TOKEN` | HotelRunner API kimlik bilgileri |
| `HOTELRUNNER_FORCE_MOCK` | `true` ise gerçek API yerine örnek veri kullanılır |
| `HOTELRUNNER_WEBHOOK_SECRET` | Webhook doğrulama anahtarı |
| `PAYMENT_PROVIDER` | Ödeme sağlayıcı (`mock` varsayılan) |

> **Not:** HotelRunner kimlik bilgileri girilmezse sistem otomatik olarak **mock
> moduna** geçer; tüm akışlar örnek veriyle çalışır. Veritabanı erişilemezse
> sayfalar statik içeriğe güvenli şekilde düşer.

## Vercel'e Deploy

Vercel proje ayarları → **Settings → Environment Variables** bölümüne şunları ekleyin:

| Değişken | Değer |
| --- | --- |
| `AUTH_SECRET` | `openssl rand -base64 32` ile üretilmiş rastgele anahtar |
| `AUTH_URL` | `https://rivesidehouse.vercel.app` (kendi domain'iniz) |
| `ADMIN_DEMO_MODE` | `true` (PostgreSQL olmadan sunum için) |
| `HOTELRUNNER_FORCE_MOCK` | `true` |

`AUTH_SECRET` olmadan admin girişi **500** hatası verir. Değişkenleri ekledikten sonra **Redeploy** yapın.

**Sunum girişi:** `admin@riversidetinyhouse.com` / `riverside123`

---

- **Çekme (HR → bizim sistem):** oda/fiyat listesi, rezervasyonlar, gerçek
  zamanlı webhook (`/api/webhooks/hotelrunner`)
- **Gönderme (bizim sistem → HR):** müsaitlik/fiyat/kısıt güncellemesi (Envanter
  sayfası), doğrudan rezervasyon push
- **Senkronizasyon:** Yönetim panelindeki "Senkronize Et" butonu veya
  `npm run hr:sync` (cron ile periyodik çalıştırılabilir)
- **Limitler:** 5 istek/dk, 250 istek/gün (property başına) — istemci içinde hız
  sınırlayıcı mevcut

## Proje Yapısı

```
app/
  (public)/        Genel site (Ana Sayfa, Odalar, Deneyim, İletişim, Rezervasyon)
  (admin)/yonetim/ Yönetim paneli (Dashboard, Rezervasyonlar, Envanter, Personel, Ayarlar)
  api/             API route'ları (availability, reservations, hotelrunner, webhooks, contact)
  giris/           Yönetici giriş sayfası
components/        ui / public / admin / auth bileşenleri
lib/
  hotelrunner/     API client + mock + senkron
  payment/         Pluggable ödeme sağlayıcı arayüzü
  admin/           Panel veri sorguları
  actions/         Server action'lar
prisma/            schema.prisma + migration + seed
```

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi |
| `npm run db:push` | Şemayı veritabanına uygula |
| `npm run db:seed` | Örnek veriyi yükle |
| `npm run hr:sync` | HotelRunner senkronizasyonunu çalıştır |
