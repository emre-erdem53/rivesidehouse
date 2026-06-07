import { NextResponse } from "next/server";
import { upsertReservationFromHR } from "@/lib/hotelrunner";
import type { HRReservation } from "@/lib/hotelrunner";

/**
 * HotelRunner gerçek zamanlı rezervasyon webhook'u.
 * HotelRunner panelinde webhook URL'i olarak bu endpoint tanımlanır.
 * Doğrulama: ?secret=... veya x-hr-signature başlığı.
 */
export async function POST(req: Request) {
  const secret = process.env.HOTELRUNNER_WEBHOOK_SECRET;
  if (secret) {
    const url = new URL(req.url);
    const provided =
      url.searchParams.get("secret") ?? req.headers.get("x-hr-signature");
    if (provided !== secret) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    }
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Geçersiz gövde" }, { status: 400 });
  }

  // HotelRunner tek rezervasyon ya da dizi gönderebilir.
  const reservations: HRReservation[] = Array.isArray(body.reservations)
    ? body.reservations
    : Array.isArray(body)
      ? body
      : [body];

  let processed = 0;
  for (const r of reservations) {
    if (r?.hr_code && r?.room_inv_code) {
      try {
        await upsertReservationFromHR(r);
        processed++;
      } catch (err) {
        console.error("[webhook] rezervasyon işlenemedi", err);
      }
    }
  }

  return NextResponse.json({ ok: true, processed });
}
