import { prisma } from "@/lib/db";
import { getHotelRunner } from "./client";
import type { HRReservation, UpdateRoomParams } from "./types";
import { rooms as staticRooms } from "@/lib/content";
import { ReservationStatus, SyncDirection, SyncStatus } from "@prisma/client";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/[ğ]/g, "g")
    .replace(/[ü]/g, "u")
    .replace(/[ş]/g, "s")
    .replace(/[ö]/g, "o")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function mapHRStatus(status: string): ReservationStatus {
  switch (status.toLowerCase()) {
    case "confirmed":
      return ReservationStatus.CONFIRMED;
    case "cancelled":
    case "canceled":
      return ReservationStatus.CANCELLED;
    case "checked_in":
    case "checkedin":
      return ReservationStatus.CHECKED_IN;
    case "checked_out":
    case "checkedout":
      return ReservationStatus.CHECKED_OUT;
    default:
      return ReservationStatus.PENDING;
  }
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn).getTime();
  const b = new Date(checkOut).getTime();
  return Math.max(1, Math.round((b - a) / 86_400_000));
}

/** HotelRunner -> bizim sistem: oda tiplerini çeker ve veritabanına işler. */
export async function syncRoomsFromHR(): Promise<{ count: number }> {
  const hr = getHotelRunner();
  try {
    const hrRooms = await hr.getRooms();
    for (const room of hrRooms) {
      const fallback = staticRooms.find((s) => s.invCode === room.inv_code);
      await prisma.roomType.upsert({
        where: { invCode: room.inv_code },
        update: {
          name: room.name,
          capacity: room.capacity ?? undefined,
          basePrice: room.price ?? undefined,
          currency: room.currency ?? "TRY",
        },
        create: {
          invCode: room.inv_code,
          name: room.name,
          slug: fallback?.slug ?? slugify(room.name),
          shortDesc: room.description ?? fallback?.shortDesc,
          description: fallback?.description,
          capacity: room.capacity ?? 2,
          basePrice: room.price ?? fallback?.basePrice ?? 0,
          currency: room.currency ?? "TRY",
          heroImage: fallback?.heroImage,
          badge: fallback?.badge,
          amenities: fallback?.amenities.map((a) => a.label) ?? [],
        },
      });

      // Rate planlarını işle
      for (const rate of room.rates ?? []) {
        const rt = await prisma.roomType.findUnique({
          where: { invCode: room.inv_code },
        });
        if (!rt) continue;
        await prisma.ratePlan.upsert({
          where: { rateCode: rate.rate_code },
          update: { name: rate.name },
          create: {
            rateCode: rate.rate_code,
            name: rate.name,
            roomTypeId: rt.id,
            isMaster: rate.rate_code.endsWith("MASTER"),
          },
        });
      }
    }

    await logSync(SyncDirection.PULL, "rooms", SyncStatus.SUCCESS, hrRooms.length);
    return { count: hrRooms.length };
  } catch (err) {
    await logSync(
      SyncDirection.PULL,
      "rooms",
      SyncStatus.FAILED,
      0,
      String(err)
    );
    throw err;
  }
}

/** HotelRunner -> bizim sistem: rezervasyonları çeker ve veritabanına işler. */
export async function syncReservationsFromHR(): Promise<{ count: number }> {
  const hr = getHotelRunner();
  try {
    const hrReservations = await hr.getReservations();
    let count = 0;
    for (const r of hrReservations) {
      await upsertReservationFromHR(r);
      count++;
    }
    await logSync(SyncDirection.PULL, "reservations", SyncStatus.SUCCESS, count);
    return { count };
  } catch (err) {
    await logSync(
      SyncDirection.PULL,
      "reservations",
      SyncStatus.FAILED,
      0,
      String(err)
    );
    throw err;
  }
}

/** Tek bir HR rezervasyonunu veritabanına işler (webhook + toplu senkron ortak yolu). */
export async function upsertReservationFromHR(r: HRReservation): Promise<void> {
  const roomType = await prisma.roomType.findUnique({
    where: { invCode: r.room_inv_code },
  });
  if (!roomType) return; // bilinmeyen oda tipi atlanır

  const guest = await prisma.guest.create({
    data: {
      firstName: r.guest.first_name,
      lastName: r.guest.last_name,
      email: r.guest.email,
      phone: r.guest.phone,
      country: r.guest.country,
    },
  });

  const nights = nightsBetween(r.checkin_date, r.checkout_date);

  await prisma.reservation.upsert({
    where: { hrCode: r.hr_code },
    update: {
      status: mapHRStatus(r.status),
      totalAmount: r.total_price,
      syncedAt: new Date(),
    },
    create: {
      hrCode: r.hr_code,
      code: `RES-${r.hr_code}`,
      roomTypeId: roomType.id,
      guestId: guest.id,
      checkIn: new Date(r.checkin_date),
      checkOut: new Date(r.checkout_date),
      nights,
      adults: r.adults ?? 2,
      children: r.children ?? 0,
      status: mapHRStatus(r.status),
      channel: r.channel,
      totalAmount: r.total_price,
      currency: r.currency,
      pushedToHr: true,
      syncedAt: new Date(),
    },
  });
}

/** Bizim sistem -> HotelRunner: müsaitlik/fiyat günceller ve önbelleği tazeler. */
export async function pushAvailabilityToHR(
  roomTypeId: string,
  params: Omit<UpdateRoomParams, "invCode">
): Promise<{ ok: boolean }> {
  const hr = getHotelRunner();
  const roomType = await prisma.roomType.findUnique({
    where: { id: roomTypeId },
  });
  if (!roomType) throw new Error("Oda tipi bulunamadı.");

  try {
    await hr.updateRoom({ invCode: roomType.invCode, ...params });

    // Yerel önbelleği güncelle
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      await prisma.availabilityCache.upsert({
        where: { roomTypeId_date: { roomTypeId, date } },
        update: {
          ...(params.availability !== undefined
            ? { availability: params.availability }
            : {}),
          ...(params.price !== undefined ? { price: params.price } : {}),
          ...(params.stopSale !== undefined
            ? { stopSale: params.stopSale }
            : {}),
          ...(params.minStay !== undefined ? { minStay: params.minStay } : {}),
          syncedAt: new Date(),
        },
        create: {
          roomTypeId,
          date,
          availability: params.availability ?? 0,
          price: params.price ?? Number(roomType.basePrice),
          stopSale: params.stopSale ?? false,
          minStay: params.minStay ?? 1,
        },
      });
    }

    await logSync(SyncDirection.PUSH, "availability", SyncStatus.SUCCESS, 1);
    return { ok: true };
  } catch (err) {
    await logSync(
      SyncDirection.PUSH,
      "availability",
      SyncStatus.FAILED,
      0,
      String(err)
    );
    throw err;
  }
}

async function logSync(
  direction: SyncDirection,
  entity: string,
  status: SyncStatus,
  itemCount: number,
  message?: string
): Promise<void> {
  try {
    await prisma.syncLog.create({
      data: { direction, entity, status, itemCount, message },
    });
  } catch {
    // log yazılamazsa sessizce geç
  }
}
