import { prisma } from "@/lib/db";
import { getRoomTypes } from "@/lib/rooms";

export type AvailabilityResult = {
  slug: string;
  invCode: string;
  name: string;
  heroImage: string;
  capacity: number;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  available: boolean;
  remaining: number;
};

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn).getTime();
  const b = new Date(checkOut).getTime();
  return Math.max(1, Math.round((b - a) / 86_400_000));
}

/**
 * Verilen tarih aralığı ve misafir sayısı için oda müsaitliği + fiyat hesaplar.
 * AvailabilityCache varsa kullanır, yoksa basePrice'a düşer.
 */
export async function getAvailability(
  checkIn: string,
  checkOut: string,
  guests: number
): Promise<AvailabilityResult[]> {
  const nights = nightsBetween(checkIn, checkOut);
  const rooms = await getRoomTypes();

  const results: AvailabilityResult[] = [];
  for (const room of rooms) {
    let pricePerNight = room.basePrice;
    let remaining = 99; // DB yoksa varsayılan olarak müsait kabul et

    try {
      if (room.id) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const cache = await prisma.availabilityCache.findMany({
          where: {
            roomTypeId: room.id,
            date: { gte: start, lt: end },
          },
        });
        if (cache.length > 0) {
          const total = cache.reduce((sum, c) => sum + Number(c.price), 0);
          pricePerNight = Math.round(total / cache.length);
          remaining = Math.min(...cache.map((c) => c.availability));
          if (cache.some((c) => c.stopSale)) remaining = 0;
        }
      }
    } catch {
      // DB yok — varsayılanlarla devam
    }

    results.push({
      slug: room.slug,
      invCode: room.invCode,
      name: room.name,
      heroImage: room.heroImage,
      capacity: room.capacity,
      nights,
      pricePerNight,
      totalPrice: pricePerNight * nights,
      available: remaining > 0 && room.capacity >= guests,
      remaining,
    });
  }
  return results;
}
