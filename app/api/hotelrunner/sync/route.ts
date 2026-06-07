import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { syncRoomsFromHR, syncReservationsFromHR } from "@/lib/hotelrunner";

/** Tam senkronizasyonu tetikler (yalnızca giriş yapmış yöneticiler). */
export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const rooms = await syncRoomsFromHR();
    const reservations = await syncReservationsFromHR();
    return NextResponse.json({
      ok: true,
      rooms: rooms.count,
      reservations: reservations.count,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
