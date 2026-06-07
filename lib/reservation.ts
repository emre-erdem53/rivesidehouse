import { prisma } from "@/lib/db";
import { getAvailability, nightsBetween } from "@/lib/booking";
import { getHotelRunner } from "@/lib/hotelrunner";
import { getPaymentProvider } from "@/lib/payment";

export type CreateReservationInput = {
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    country?: string;
  };
};

export type CreateReservationResult = {
  code: string;
  hrCode?: string;
  roomName: string;
  totalAmount: number;
  currency: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  persisted: boolean;
};

function generateCode(): string {
  return `RES-${Date.now().toString(36).toUpperCase()}`;
}

/**
 * Doğrudan rezervasyon oluşturur (white-label akış):
 * 1. Fiyatı hesaplar
 * 2. Ödemeyi alır (pluggable sağlayıcı)
 * 3. Veritabanına kaydeder (mümkünse)
 * 4. HotelRunner'a gönderir (push)
 */
export async function createReservation(
  input: CreateReservationInput
): Promise<CreateReservationResult> {
  const guests = input.adults + (input.children ?? 0);
  const availability = await getAvailability(
    input.checkIn,
    input.checkOut,
    guests
  );
  const room = availability.find((r) => r.slug === input.roomSlug);
  if (!room) throw new Error("Seçilen oda bulunamadı.");
  if (!room.available) throw new Error("Seçilen oda bu tarihlerde müsait değil.");

  const nights = nightsBetween(input.checkIn, input.checkOut);
  const totalAmount = room.totalPrice;
  const code = generateCode();

  // 1) Ödeme
  const payment = getPaymentProvider();
  const paymentResult = await payment.createPayment({
    amount: totalAmount,
    currency: "TRY",
    reference: code,
    customer: {
      name: `${input.guest.firstName} ${input.guest.lastName}`,
      email: input.guest.email,
      phone: input.guest.phone,
    },
  });
  if (!paymentResult.success) {
    throw new Error(paymentResult.error ?? "Ödeme başarısız.");
  }

  // 2) HotelRunner'a gönder
  let hrCode: string | undefined;
  try {
    const hr = getHotelRunner();
    const pushed = await hr.pushReservation({
      invCode: room.invCode,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      totalPrice: totalAmount,
      currency: "TRY",
      adults: input.adults,
      children: input.children ?? 0,
      guest: input.guest,
    });
    hrCode = pushed.hr_code;
  } catch (err) {
    console.error("[reservation] HotelRunner push hatası:", err);
  }

  // 3) Veritabanına kaydet (mümkünse)
  let persisted = false;
  try {
    const roomType = await prisma.roomType.findUnique({
      where: { invCode: room.invCode },
    });
    if (roomType) {
      const guest = await prisma.guest.create({
        data: {
          firstName: input.guest.firstName,
          lastName: input.guest.lastName,
          email: input.guest.email,
          phone: input.guest.phone,
          country: input.guest.country,
        },
      });
      await prisma.reservation.create({
        data: {
          code,
          hrCode,
          roomTypeId: roomType.id,
          guestId: guest.id,
          checkIn: new Date(input.checkIn),
          checkOut: new Date(input.checkOut),
          nights,
          adults: input.adults,
          children: input.children ?? 0,
          status: "CONFIRMED",
          channel: "direct",
          totalAmount,
          currency: "TRY",
          pushedToHr: Boolean(hrCode),
          syncedAt: hrCode ? new Date() : null,
        },
      });
      persisted = true;
    }
  } catch (err) {
    console.error("[reservation] DB kayıt hatası (demo modunda yoksayıldı):", err);
  }

  return {
    code,
    hrCode,
    roomName: room.name,
    totalAmount,
    currency: "TRY",
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    nights,
    persisted,
  };
}
