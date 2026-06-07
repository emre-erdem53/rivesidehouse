"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const schema = z.object({
  fullName: z.string().min(1, "Ad gerekli"),
  role: z.string().min(1, "Görev gerekli"),
  department: z.string().optional(),
  shift: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
});

export type StaffActionState = { ok?: boolean; error?: string };

export async function addStaff(
  _prev: StaffActionState,
  formData: FormData
): Promise<StaffActionState> {
  const session = await auth();
  if (!session?.user) return { error: "Yetkisiz erişim." };

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  }

  try {
    await prisma.staffMember.create({
      data: {
        fullName: parsed.data.fullName,
        role: parsed.data.role,
        department: parsed.data.department || null,
        shift: parsed.data.shift || null,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
      },
    });
    revalidatePath("/yonetim/personel");
    return { ok: true };
  } catch (err) {
    return { error: `Kayıt başarısız: ${String(err)}` };
  }
}

export async function toggleStaffActive(id: string, isActive: boolean) {
  const session = await auth();
  if (!session?.user) return;
  await prisma.staffMember.update({ where: { id }, data: { isActive } });
  revalidatePath("/yonetim/personel");
}
