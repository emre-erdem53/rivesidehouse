import {
  PrismaClient,
  UserRole,
  ReservationStatus,
  SyncDirection,
  SyncStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { rooms } from "../lib/content";

const prisma = new PrismaClient();

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function main() {
  console.log("Seed başlıyor...");

  const passwordHash = await bcrypt.hash("riverside123", 10);

  const adminEmail = "admin@riversidetinyhouse.com";
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

  const staffEmail = "resepsiyon@riversidetinyhouse.com";
  await prisma.user.upsert({
    where: { email: staffEmail },
    update: {},
    create: {
      email: staffEmail,
      name: "Ayşe Demir",
      passwordHash,
      role: UserRole.STAFF,
      title: "Resepsiyon Şefi",
    },
  });

  console.log("Yönetici: admin@riversidetinyhouse.com / riverside123");
  console.log("Resepsiyon: resepsiyon@riversidetinyhouse.com / riverside123");

  const roomRecords = [];

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
    roomRecords.push(room);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let d = 0; d < 60; d++) {
      const date = addDays(today, d);
      await prisma.availabilityCache.upsert({
        where: { roomTypeId_date: { roomTypeId: room.id, date } },
        update: { availability: [2, 1, 3][i] ?? 2, price: r.basePrice },
        create: {
          roomTypeId: room.id,
          date,
          availability: [2, 1, 3][i] ?? 2,
          price: r.basePrice,
          minStay: 1,
        },
      });
    }
  }
  console.log(`${rooms.length} oda tipi ve müsaitlik verisi eklendi.`);

  const staff = [
    { fullName: "Ayşe Demir", role: "Resepsiyon Şefi", department: "Ön Büro", shift: "Sabah", email: "ayse.d@riversidetinyhouse.com" },
    { fullName: "Mehmet Yıldız", role: "Kat Hizmetleri Sorumlusu", department: "Housekeeping", shift: "Sabah", email: "mehmet.y@riversidetinyhouse.com" },
    { fullName: "Zeynep Kaya", role: "Şef", department: "Mutfak", shift: "Akşam", email: "zeynep.k@riversidetinyhouse.com" },
    { fullName: "Can Aydın", role: "Wellness Uzmanı", department: "Spa", shift: "Gündüz", email: "can.a@riversidetinyhouse.com" },
    { fullName: "Ebru Çelik", role: "Misafir İlişkileri", department: "Ön Büro", shift: "Akşam", email: "ebru.c@riversidetinyhouse.com" },
    { fullName: "Serkan Koç", role: "Teknik Servis", department: "Operasyon", shift: "Gündüz", email: "serkan.k@riversidetinyhouse.com" },
    { fullName: "Derya Aksoy", role: "Barista", department: "Mutfak", shift: "Sabah", email: "derya.a@riversidetinyhouse.com", isActive: false },
    { fullName: "Volkan Ergin", role: "Güvenlik", department: "Operasyon", shift: "Gece", email: "volkan.e@riversidetinyhouse.com" },
  ];

  for (const s of staff) {
    const existing = await prisma.staffMember.findFirst({
      where: { fullName: s.fullName },
    });
    if (!existing) {
      await prisma.staffMember.create({
        data: {
          fullName: s.fullName,
          role: s.role,
          department: s.department,
          shift: s.shift,
          email: s.email,
          isActive: s.isActive ?? true,
        },
      });
    }
  }
  console.log("Örnek personel eklendi.");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reservationSeed = [
    { code: "RES-1042", firstName: "Selin", lastName: "Arslan", email: "selin@example.com", roomIdx: 0, offset: 0, nights: 3, status: ReservationStatus.CHECKED_IN, channel: "direct" },
    { code: "RES-1041", firstName: "Burak", lastName: "Öztürk", email: "burak@example.com", roomIdx: 1, offset: 0, nights: 2, status: ReservationStatus.CONFIRMED, channel: "booking.com" },
    { code: "RES-1040", firstName: "Elif", lastName: "Yılmaz", email: "elif@example.com", roomIdx: 2, offset: 1, nights: 4, status: ReservationStatus.CONFIRMED, channel: "direct" },
    { code: "RES-1039", firstName: "Mert", lastName: "Kılıç", email: "mert@example.com", roomIdx: 0, offset: 2, nights: 2, status: ReservationStatus.PENDING, channel: "airbnb" },
    { code: "RES-1038", firstName: "Deniz", lastName: "Acar", email: "deniz@example.com", roomIdx: 1, offset: 3, nights: 5, status: ReservationStatus.CONFIRMED, channel: "expedia" },
    { code: "RES-1037", firstName: "Gizem", lastName: "Şahin", email: "gizem@example.com", roomIdx: 2, offset: -2, nights: 3, status: ReservationStatus.CHECKED_IN, channel: "direct" },
    { code: "RES-1036", firstName: "Kerem", lastName: "Polat", email: "kerem@example.com", roomIdx: 0, offset: 5, nights: 2, status: ReservationStatus.PENDING, channel: "booking.com" },
    { code: "RES-1035", firstName: "Aylin", lastName: "Demir", email: "aylin@example.com", roomIdx: 1, offset: 7, nights: 3, status: ReservationStatus.CONFIRMED, channel: "direct" },
    { code: "RES-1034", firstName: "Onur", lastName: "Tekin", email: "onur@example.com", roomIdx: 2, offset: -5, nights: 2, status: ReservationStatus.CHECKED_OUT, channel: "direct" },
    { code: "RES-1033", firstName: "Pınar", lastName: "Koç", email: "pinar@example.com", roomIdx: 0, offset: 10, nights: 4, status: ReservationStatus.CONFIRMED, channel: "instagram" },
    { code: "RES-1032", firstName: "Cem", lastName: "Güler", email: "cem@example.com", roomIdx: 1, offset: -8, nights: 1, status: ReservationStatus.CHECKED_OUT, channel: "direct" },
    { code: "RES-1031", firstName: "Seda", lastName: "Aktaş", email: "seda@example.com", roomIdx: 2, offset: 4, nights: 2, status: ReservationStatus.PENDING, channel: "booking.com" },
    { code: "RES-1030", firstName: "Tolga", lastName: "Erdoğan", email: "tolga@example.com", roomIdx: 0, offset: -12, nights: 3, status: ReservationStatus.CHECKED_OUT, channel: "direct" },
    { code: "RES-1029", firstName: "Melis", lastName: "Uçar", email: "melis@example.com", roomIdx: 1, offset: 14, nights: 2, status: ReservationStatus.CONFIRMED, channel: "direct" },
    { code: "RES-1028", firstName: "Hakan", lastName: "Yıldırım", email: "hakan@example.com", roomIdx: 2, offset: -3, nights: 2, status: ReservationStatus.CANCELLED, channel: "expedia" },
  ];

  for (const r of reservationSeed) {
    const room = roomRecords[r.roomIdx];
    if (!room) continue;

    const guest = await prisma.guest.upsert({
      where: { id: `seed-guest-${r.email}` },
      update: {},
      create: {
        id: `seed-guest-${r.email}`,
        firstName: r.firstName,
        lastName: r.lastName,
        email: r.email,
        phone: "+90 555 000 00 00",
        country: "Türkiye",
      },
    });

    const checkIn = addDays(today, r.offset);
    const checkOut = addDays(checkIn, r.nights);
    const totalAmount = Number(room.basePrice) * r.nights;

    await prisma.reservation.upsert({
      where: { code: r.code },
      update: {
        status: r.status,
        checkIn,
        checkOut,
        nights: r.nights,
        totalAmount,
      },
      create: {
        code: r.code,
        roomTypeId: room.id,
        guestId: guest.id,
        checkIn,
        checkOut,
        nights: r.nights,
        adults: 2,
        status: r.status,
        channel: r.channel,
        totalAmount,
        pushedToHr: r.status !== ReservationStatus.PENDING,
      },
    });
  }
  console.log(`${reservationSeed.length} örnek rezervasyon eklendi.`);

  await prisma.syncLog.deleteMany({});
  const syncLogs = [
    { direction: SyncDirection.PULL, entity: "reservations", status: SyncStatus.SUCCESS, message: "HotelRunner rezervasyonları çekildi", itemCount: 12, daysAgo: 0 },
    { direction: SyncDirection.PUSH, entity: "availability", status: SyncStatus.SUCCESS, message: "Müsaitlik ve fiyat güncellendi", itemCount: 180, daysAgo: 1 },
    { direction: SyncDirection.PULL, entity: "rooms", status: SyncStatus.SUCCESS, message: "Oda tipleri senkronize edildi", itemCount: 3, daysAgo: 2 },
    { direction: SyncDirection.PUSH, entity: "availability", status: SyncStatus.PARTIAL, message: "2 gün için rate limit uyarısı", itemCount: 58, daysAgo: 3 },
    { direction: SyncDirection.PULL, entity: "reservations", status: SyncStatus.SUCCESS, message: "Yeni rezervasyonlar alındı", itemCount: 5, daysAgo: 4 },
    { direction: SyncDirection.PUSH, entity: "reservations", status: SyncStatus.SUCCESS, message: "Doğrudan rezervasyon HR'a iletildi", itemCount: 1, daysAgo: 5 },
    { direction: SyncDirection.PULL, entity: "availability", status: SyncStatus.SUCCESS, message: "60 günlük takvim güncellendi", itemCount: 180, daysAgo: 6 },
    { direction: SyncDirection.PULL, entity: "reservations", status: SyncStatus.FAILED, message: "Geçici API zaman aşımı — yeniden denendi", itemCount: 0, daysAgo: 7 },
  ];

  for (const log of syncLogs) {
    await prisma.syncLog.create({
      data: {
        direction: log.direction,
        entity: log.entity,
        status: log.status,
        message: log.message,
        itemCount: log.itemCount,
        createdAt: addDays(today, -log.daysAgo),
      },
    });
  }
  console.log("Senkronizasyon logları eklendi.");
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
