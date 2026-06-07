import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/booking";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = Number(searchParams.get("guests") ?? "2");

  if (!checkIn || !checkOut) {
    return NextResponse.json(
      { error: "checkIn ve checkOut gerekli" },
      { status: 400 }
    );
  }

  try {
    const rooms = await getAvailability(checkIn, checkOut, guests);
    return NextResponse.json({ rooms });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
