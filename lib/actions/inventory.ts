"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { pushAvailabilityToHR } from "@/lib/hotelrunner";

const schema = z.object({
  roomTypeId: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  availability: z.coerce.number().int().min(0).optional(),
  price: z.coerce.number().min(0).optional(),
  minStay: z.coerce.number().int().min(1).optional(),
  stopSale: z.coerce.boolean().optional(),
});

export type InventoryActionState = {
  ok?: boolean;
  message?: string;
  error?: string;
};

export async function updateInventory(
  _prev: InventoryActionState,
  formData: FormData
): Promise<InventoryActionState> {
  const session = await auth();
  if (!session?.user) return { error: "Yetkisiz erişim." };

  const parsed = schema.safeParse({
    roomTypeId: formData.get("roomTypeId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    availability: formData.get("availability") || undefined,
    price: formData.get("price") || undefined,
    minStay: formData.get("minStay") || undefined,
    stopSale: formData.get("stopSale") === "on",
  });

  if (!parsed.success) {
    return { error: "Geçersiz form verisi." };
  }

  try {
    await pushAvailabilityToHR(parsed.data.roomTypeId, {
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
      availability: parsed.data.availability,
      price: parsed.data.price,
      minStay: parsed.data.minStay,
      stopSale: parsed.data.stopSale,
    });
    revalidatePath("/yonetim/envanter");
    return {
      ok: true,
      message: "Güncellendi ve HotelRunner'a gönderildi.",
    };
  } catch (err) {
    return { error: `Güncelleme başarısız: ${String(err)}` };
  }
}
