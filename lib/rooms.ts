import { prisma } from "@/lib/db";
import { rooms as staticRooms, type RoomContent } from "@/lib/content";

export type RoomView = RoomContent & {
  id?: string;
  currency: string;
};

function fromStatic(r: RoomContent): RoomView {
  return { ...r, currency: "TRY" };
}

/**
 * Oda tiplerini getirir. Veritabanı erişilemiyorsa (örn. henüz migrate
 * edilmemişse) statik içeriğe güvenli şekilde düşer.
 */
export async function getRoomTypes(): Promise<RoomView[]> {
  try {
    const dbRooms = await prisma.roomType.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (dbRooms.length === 0) return staticRooms.map(fromStatic);

    return dbRooms.map((r) => {
      const fallback = staticRooms.find((s) => s.invCode === r.invCode);
      return {
        id: r.id,
        invCode: r.invCode,
        slug: r.slug,
        name: r.name,
        badge: r.badge ?? fallback?.badge ?? "",
        shortDesc: r.shortDesc ?? fallback?.shortDesc ?? "",
        description: r.description ?? fallback?.description ?? "",
        basePrice: Number(r.basePrice),
        capacity: r.capacity,
        sizeSqm: r.sizeSqm ?? fallback?.sizeSqm ?? 0,
        bedType: r.bedType ?? fallback?.bedType ?? "",
        heroImage: r.heroImage ?? fallback?.heroImage ?? "",
        amenities: fallback?.amenities ?? [],
        currency: r.currency,
      };
    });
  } catch {
    return staticRooms.map(fromStatic);
  }
}

export async function getRoomBySlug(slug: string): Promise<RoomView | null> {
  const all = await getRoomTypes();
  return all.find((r) => r.slug === slug) ?? null;
}
