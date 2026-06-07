import { NextResponse } from "next/server";
import { z } from "zod";
import { createReservation } from "@/lib/reservation";

const schema = z.object({
  roomSlug: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  adults: z.coerce.number().int().min(1),
  children: z.coerce.number().int().min(0).optional(),
  guest: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    country: z.string().optional(),
  }),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Geçersiz rezervasyon verisi", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await createReservation(parsed.data);
    return NextResponse.json({ ok: true, reservation: result });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 400 }
    );
  }
}
