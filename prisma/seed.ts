import { PrismaClient, UserRole, ReservationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { rooms } from "../lib/content";

const prisma = new PrismaClient();

async function main() {
  console.log("Seed başlıyor...");

  // Yönetici kullanıcı
  const adminEmail = "admin@riversidetinyhouse.com";
  const passwordHash = await bcrypt.hash("riverside123", 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Riverside Yönetici",
      passwordHash,
      role: UserRole.ADMIN,
      title: "Genel Müdür",
    },
  });
  console.log(`Yönetici: ${adminEmail} / riverside123`);

  // Oda tipleri
  for (let i = 0; i < rooms.length; i++) {
    const r = rooms[i];
    const room = await prisma.roomType.upsert({
      where: { invCode: r.invCode },
      update: {
        name: r.name,
        slug: r.slug,
        description: r.description,
        shortDesc: r.shortDesc,
        basePrice: r.basePrice,
        capacity: r.capacity,
        sizeSqm: r.sizeSqm,
        bedType: r.bedType,
        heroImage: r.heroImage,
        badge: r.badge,
        amenities: r.amenities.map((a) => a.label),
        sortOrder: i,
      },
      create: {
        invCode: r.invCode,
        name: r.name,
        slug: r.slug,
        description: r.description,
        shortDesc: r.shortDesc,
        basePrice: r.basePrice,
        capacity: r.capacity,
        sizeSqm: r.sizeSqm,
        bedType: r.bedType,
        heroImage: r.heroImage,
        badge: r.badge,
        amenities: r.amenities.map((a) => a.label),
        sortOrder: i,
        ratePlans: {
          create: {
            rateCode: `${r.invCode}-MASTER`,
            name: "Standart Fiyat",
            isMaster: true,
          },
        },
      },
    });

    // 60 günlük müsaitlik önbelleği
    const today = new Date();
    for (let d = 0; d < 60; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      date.setHours(0, 0, 0, 0);
      await prisma.availabilityCache.upsert({
        where: { roomTypeId_date: { roomTypeId: room.id, date } },
        update: {},
        create: {
          roomTypeId: room.id,
          date,
          availability: 3,
          price: r.basePrice,
          minStay: 1,
        },
      });
    }
  }
  console.log(`${rooms.length} oda tipi ve müsaitlik verisi eklendi.`);

  // Örnek personel
  const staff = [
    { fullName: "Ayşe Demir", role: "Resepsiyon Şefi", department: "Ön Büro", shift: "Sabah" },
    { fullName: "Mehmet Yıldız", role: "Kat Hizmetleri", department: "Housekeeping", shift: "Sabah" },
    { fullName: "Zeynep Kaya", role: "Şef", department: "Mutfak", shift: "Akşam" },
    { fullName: "Can Aydın", role: "Wellness Uzmanı", department: "Spa", shift: "Gündüz" },
  ];
  for (const s of staff) {
    const existing = await prisma.staffMember.findFirst({
      where: { fullName: s.fullName },
    });
    if (!existing) {
      await prisma.staffMember.create({ data: s });
    }
  }
  console.log("Örnek personel eklendi.");

  // Örnek misafir + rezervasyon
  const guest = await prisma.guest.create({
    data: {
      firstName: "Emre",
      lastName: "Kaya",
      email: "emre@example.com",
      phone: "+90 555 111 22 33",
      country: "Türkiye",
    },
  });
  const firstRoom = await prisma.roomType.findFirst();
  if (firstRoom) {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 5);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + 3);
    await prisma.reservation.upsert({
      where: { code: "RES-0001" },
      update: {},
      create: {
        code: "RES-0001",
        roomTypeId: firstRoom.id,
        guestId: guest.id,
        checkIn,
        checkOut,
        nights: 3,
        adults: 2,
        status: ReservationStatus.CONFIRMED,
        channel: "direct",
        totalAmount: Number(firstRoom.basePrice) * 3,
      },
    });
  }
  console.log("Örnek rezervasyon eklendi.");

  console.log("Seed tamamlandı.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
