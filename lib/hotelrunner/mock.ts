import { rooms } from "@/lib/content";
import type {
  HRRoom,
  HRReservation,
  PushReservationParams,
} from "./types";

// Kimlik bilgileri olmadığında kullanılan mock veri.
// Gerçek HotelRunner yanıtlarının şeklini taklit eder.

export function mockRooms(): HRRoom[] {
  return rooms.map((r) => ({
    inv_code: r.invCode,
    name: r.name,
    description: r.shortDesc,
    capacity: r.capacity,
    availability: 3,
    price: r.basePrice,
    currency: "TRY",
    rates: [
      {
        rate_code: `${r.invCode}-MASTER`,
        name: "Standart Fiyat",
        price: r.basePrice,
      },
    ],
  }));
}

export function mockReservations(): HRReservation[] {
  const today = new Date();
  const fmt = (offset: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  };

  return [
    {
      hr_code: "HR-MOCK-1001",
      channel: "bookingcom",
      status: "confirmed",
      room_inv_code: rooms[0].invCode,
      checkin_date: fmt(2),
      checkout_date: fmt(5),
      total_price: rooms[0].basePrice * 3,
      currency: "TRY",
      adults: 2,
      children: 0,
      guest: {
        first_name: "Selin",
        last_name: "Aksoy",
        email: "selin@example.com",
        phone: "+90 555 222 33 44",
        country: "Türkiye",
      },
    },
    {
      hr_code: "HR-MOCK-1002",
      channel: "online",
      status: "pending",
      room_inv_code: rooms[1].invCode,
      checkin_date: fmt(7),
      checkout_date: fmt(10),
      total_price: rooms[1].basePrice * 3,
      currency: "TRY",
      adults: 3,
      children: 1,
      guest: {
        first_name: "Mert",
        last_name: "Demir",
        email: "mert@example.com",
        country: "Türkiye",
      },
    },
  ];
}

export function mockPushReservation(params: PushReservationParams): {
  hr_code: string;
} {
  void params;
  return { hr_code: `HR-MOCK-${Date.now()}` };
}
