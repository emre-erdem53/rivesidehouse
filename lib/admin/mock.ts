import { rooms } from "@/lib/content";

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

const today = startOfDay();

/** Sunum / demo modu için dashboard istatistikleri. */
export const mockDashboardStats = {
  todayCheckIns: 4,
  occupancy: 78,
  monthlyRevenue: 186_400,
  pending: 3,
  roomCount: rooms.length,
  occupiedToday: 2,
  available: false,
  demoMode: true,
};

type MockReservationDef = {
  id: string;
  code: string;
  guestName: string;
  roomName: string;
  checkInOffset: number;
  nights: number;
  status: string;
  channel: string;
  totalAmount: number;
};

const reservationDefs: MockReservationDef[] = [
  { id: "demo-1", code: "RES-1042", guestName: "Selin Arslan", roomName: "Riverside Deluxe", checkInOffset: 0, nights: 3, status: "CHECKED_IN", channel: "direct", totalAmount: 12_600 },
  { id: "demo-2", code: "RES-1041", guestName: "Burak Öztürk", roomName: "Panorama Suite", checkInOffset: 0, nights: 2, status: "CONFIRMED", channel: "booking.com", totalAmount: 13_000 },
  { id: "demo-3", code: "RES-1040", guestName: "Elif Yılmaz", roomName: "Forest Cabin", checkInOffset: 1, nights: 4, status: "CONFIRMED", channel: "direct", totalAmount: 15_200 },
  { id: "demo-4", code: "RES-1039", guestName: "Mert Kılıç", roomName: "Riverside Deluxe", checkInOffset: 2, nights: 2, status: "PENDING", channel: "airbnb", totalAmount: 8_400 },
  { id: "demo-5", code: "RES-1038", guestName: "Deniz Acar", roomName: "Panorama Suite", checkInOffset: 3, nights: 5, status: "CONFIRMED", channel: "expedia", totalAmount: 32_500 },
  { id: "demo-6", code: "RES-1037", guestName: "Gizem Şahin", roomName: "Forest Cabin", checkInOffset: -2, nights: 3, status: "CHECKED_IN", channel: "direct", totalAmount: 11_400 },
  { id: "demo-7", code: "RES-1036", guestName: "Kerem Polat", roomName: "Riverside Deluxe", checkInOffset: 5, nights: 2, status: "PENDING", channel: "booking.com", totalAmount: 8_400 },
  { id: "demo-8", code: "RES-1035", guestName: "Aylin Demir", roomName: "Panorama Suite", checkInOffset: 7, nights: 3, status: "CONFIRMED", channel: "direct", totalAmount: 19_500 },
  { id: "demo-9", code: "RES-1034", guestName: "Onur Tekin", roomName: "Forest Cabin", checkInOffset: -5, nights: 2, status: "CHECKED_OUT", channel: "direct", totalAmount: 7_600 },
  { id: "demo-10", code: "RES-1033", guestName: "Pınar Koç", roomName: "Riverside Deluxe", checkInOffset: 10, nights: 4, status: "CONFIRMED", channel: "instagram", totalAmount: 16_800 },
  { id: "demo-11", code: "RES-1032", guestName: "Cem Güler", roomName: "Panorama Suite", checkInOffset: -8, nights: 1, status: "CHECKED_OUT", channel: "direct", totalAmount: 6_500 },
  { id: "demo-12", code: "RES-1031", guestName: "Seda Aktaş", roomName: "Forest Cabin", checkInOffset: 4, nights: 2, status: "PENDING", channel: "booking.com", totalAmount: 7_600 },
  { id: "demo-13", code: "RES-1030", guestName: "Tolga Erdoğan", roomName: "Riverside Deluxe", checkInOffset: -12, nights: 3, status: "CHECKED_OUT", channel: "direct", totalAmount: 12_600 },
  { id: "demo-14", code: "RES-1029", guestName: "Melis Uçar", roomName: "Panorama Suite", checkInOffset: 14, nights: 2, status: "CONFIRMED", channel: "direct", totalAmount: 13_000 },
  { id: "demo-15", code: "RES-1028", guestName: "Hakan Yıldırım", roomName: "Forest Cabin", checkInOffset: -3, nights: 2, status: "CANCELLED", channel: "expedia", totalAmount: 7_600 },
];

export const mockReservations = reservationDefs.map((r) => {
  const checkIn = addDays(today, r.checkInOffset);
  const checkOut = addDays(checkIn, r.nights);
  return {
    id: r.id,
    code: r.code,
    guestName: r.guestName,
    roomName: r.roomName,
    checkIn,
    checkOut,
    status: r.status,
    channel: r.channel,
    totalAmount: r.totalAmount,
  };
});

export const mockInventory = rooms.map((r, i) => ({
  id: r.invCode,
  invCode: r.invCode,
  name: r.name,
  basePrice: r.basePrice,
  capacity: r.capacity,
  todayAvailability: [2, 1, 3][i] ?? 2,
  isActive: true,
}));

export const mockStaff = [
  { id: "staff-1", fullName: "Ayşe Demir", role: "Resepsiyon Şefi", department: "Ön Büro", shift: "Sabah", email: "ayse.d@riversidetinyhouse.com", phone: "+90 532 100 11 01", avatarUrl: null, isActive: true, createdAt: addDays(today, -120), updatedAt: addDays(today, -1) },
  { id: "staff-2", fullName: "Mehmet Yıldız", role: "Kat Hizmetleri Sorumlusu", department: "Housekeeping", shift: "Sabah", email: "mehmet.y@riversidetinyhouse.com", phone: "+90 532 100 11 02", avatarUrl: null, isActive: true, createdAt: addDays(today, -90), updatedAt: addDays(today, -2) },
  { id: "staff-3", fullName: "Zeynep Kaya", role: "Şef", department: "Mutfak", shift: "Akşam", email: "zeynep.k@riversidetinyhouse.com", phone: "+90 532 100 11 03", avatarUrl: null, isActive: true, createdAt: addDays(today, -200), updatedAt: addDays(today, -5) },
  { id: "staff-4", fullName: "Can Aydın", role: "Wellness Uzmanı", department: "Spa", shift: "Gündüz", email: "can.a@riversidetinyhouse.com", phone: "+90 532 100 11 04", avatarUrl: null, isActive: true, createdAt: addDays(today, -60), updatedAt: addDays(today, -3) },
  { id: "staff-5", fullName: "Ebru Çelik", role: "Misafir İlişkileri", department: "Ön Büro", shift: "Akşam", email: "ebru.c@riversidetinyhouse.com", phone: "+90 532 100 11 05", avatarUrl: null, isActive: true, createdAt: addDays(today, -45), updatedAt: addDays(today, -1) },
  { id: "staff-6", fullName: "Serkan Koç", role: "Teknik Servis", department: "Operasyon", shift: "Gündüz", email: "serkan.k@riversidetinyhouse.com", phone: "+90 532 100 11 06", avatarUrl: null, isActive: true, createdAt: addDays(today, -150), updatedAt: addDays(today, -10) },
  { id: "staff-7", fullName: "Derya Aksoy", role: "Barista", department: "Mutfak", shift: "Sabah", email: "derya.a@riversidetinyhouse.com", phone: "+90 532 100 11 07", avatarUrl: null, isActive: false, createdAt: addDays(today, -30), updatedAt: addDays(today, -7) },
  { id: "staff-8", fullName: "Volkan Ergin", role: "Güvenlik", department: "Operasyon", shift: "Gece", email: "volkan.e@riversidetinyhouse.com", phone: "+90 532 100 11 08", avatarUrl: null, isActive: true, createdAt: addDays(today, -80), updatedAt: addDays(today, -4) },
];

export const mockSyncLogs = [
  { id: "sync-1", direction: "PULL" as const, entity: "reservations", status: "SUCCESS" as const, message: "HotelRunner rezervasyonları çekildi", itemCount: 12, createdAt: addDays(today, 0) },
  { id: "sync-2", direction: "PUSH" as const, entity: "availability", status: "SUCCESS" as const, message: "Müsaitlik ve fiyat güncellendi", itemCount: 180, createdAt: addDays(today, -1) },
  { id: "sync-3", direction: "PULL" as const, entity: "rooms", status: "SUCCESS" as const, message: "Oda tipleri senkronize edildi", itemCount: 3, createdAt: addDays(today, -2) },
  { id: "sync-4", direction: "PUSH" as const, entity: "availability", status: "PARTIAL" as const, message: "2 gün için rate limit uyarısı", itemCount: 58, createdAt: addDays(today, -3) },
  { id: "sync-5", direction: "PULL" as const, entity: "reservations", status: "SUCCESS" as const, message: "Yeni rezervasyonlar alındı", itemCount: 5, createdAt: addDays(today, -4) },
  { id: "sync-6", direction: "PUSH" as const, entity: "reservations", status: "SUCCESS" as const, message: "Doğrudan rezervasyon HR'a iletildi", itemCount: 1, createdAt: addDays(today, -5) },
  { id: "sync-7", direction: "PULL" as const, entity: "availability", status: "SUCCESS" as const, message: "60 günlük takvim güncellendi", itemCount: 180, createdAt: addDays(today, -6) },
  { id: "sync-8", direction: "PULL" as const, entity: "reservations", status: "FAILED" as const, message: "Geçici API zaman aşımı — yeniden denendi", itemCount: 0, createdAt: addDays(today, -7) },
];

export function isAdminDemoMode() {
  return process.env.ADMIN_DEMO_MODE === "true";
}
