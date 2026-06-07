import { prisma } from "@/lib/db";
import { rooms } from "@/lib/content";
import { isAdminDemoMode } from "./mock";

export type AccountingSummary = {
  weeklyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  weeklyRoomNights: number;
  monthlyRoomNights: number;
  weeklyReservations: number;
  monthlyReservations: number;
  avgDailyRate: number;
  revPar: number;
  grossRevenue: number;
  channelCommission: number;
  netRevenue: number;
  pendingCollection: number;
  cancelledAmount: number;
  demoMode: boolean;
};

export type RoomSalesRow = {
  roomName: string;
  invCode: string;
  weeklyUnits: number;
  monthlyUnits: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  avgNightlyRate: number;
  revenueShare: number;
};

export type PeriodRow = {
  label: string;
  revenue: number;
  roomNights: number;
  reservations: number;
  occupancy: number;
};

export type ChannelRow = {
  channel: string;
  label: string;
  revenue: number;
  reservations: number;
  roomNights: number;
  commissionRate: number;
  commission: number;
  netRevenue: number;
  sharePercent: number;
};

export type AccountingReport = {
  summary: AccountingSummary;
  roomSales: RoomSalesRow[];
  weeklyPeriods: PeriodRow[];
  monthlyPeriods: PeriodRow[];
  channels: ChannelRow[];
  generatedAt: Date;
};

const CHANNEL_LABELS: Record<string, string> = {
  direct: "Doğrudan",
  "booking.com": "Booking.com",
  airbnb: "Airbnb",
  expedia: "Expedia",
  instagram: "Instagram",
};

const CHANNEL_COMMISSION: Record<string, number> = {
  direct: 0,
  "booking.com": 0.15,
  airbnb: 0.14,
  expedia: 0.18,
  instagram: 0,
};

function mockAccountingReport(): AccountingReport {
  const roomSales: RoomSalesRow[] = [
    {
      roomName: "Riverside Deluxe",
      invCode: "RTH-RIVERSIDE",
      weeklyUnits: 9,
      monthlyUnits: 38,
      weeklyRevenue: 37_800,
      monthlyRevenue: 159_600,
      avgNightlyRate: 4_200,
      revenueShare: 36,
    },
    {
      roomName: "Panorama Suite",
      invCode: "RTH-PANORAMA",
      weeklyUnits: 7,
      monthlyUnits: 31,
      weeklyRevenue: 45_500,
      monthlyRevenue: 201_500,
      avgNightlyRate: 6_500,
      revenueShare: 45,
    },
    {
      roomName: "Forest Cabin",
      invCode: "RTH-FOREST",
      weeklyUnits: 8,
      monthlyUnits: 34,
      weeklyRevenue: 30_400,
      monthlyRevenue: 129_200,
      avgNightlyRate: 3_800,
      revenueShare: 19,
    },
  ];

  const weeklyPeriods: PeriodRow[] = [
    { label: "3–9 Şub", revenue: 98_200, roomNights: 18, reservations: 9, occupancy: 86 },
    { label: "27 Oca–2 Şub", revenue: 112_400, roomNights: 21, reservations: 11, occupancy: 100 },
    { label: "20–26 Oca", revenue: 89_600, roomNights: 17, reservations: 8, occupancy: 81 },
    { label: "13–19 Oca", revenue: 76_300, roomNights: 15, reservations: 7, occupancy: 71 },
    { label: "6–12 Oca", revenue: 94_800, roomNights: 19, reservations: 10, occupancy: 90 },
    { label: "30 Ara–5 Oca", revenue: 118_500, roomNights: 22, reservations: 12, occupancy: 100 },
    { label: "23–29 Ara", revenue: 105_200, roomNights: 20, reservations: 10, occupancy: 95 },
    { label: "16–22 Ara", revenue: 87_400, roomNights: 16, reservations: 8, occupancy: 76 },
  ];

  const monthlyPeriods: PeriodRow[] = [
    { label: "Şubat 2026", revenue: 186_400, roomNights: 72, reservations: 34, occupancy: 78 },
    { label: "Ocak 2026", revenue: 412_800, roomNights: 168, reservations: 79, occupancy: 82 },
    { label: "Aralık 2025", revenue: 398_600, roomNights: 162, reservations: 74, occupancy: 79 },
    { label: "Kasım 2025", revenue: 356_200, roomNights: 148, reservations: 68, occupancy: 74 },
    { label: "Ekim 2025", revenue: 289_400, roomNights: 121, reservations: 55, occupancy: 68 },
    { label: "Eylül 2025", revenue: 245_800, roomNights: 102, reservations: 47, occupancy: 62 },
  ];

  const channels: ChannelRow[] = [
    { channel: "direct", label: "Doğrudan", revenue: 248_600, reservations: 42, roomNights: 96, commissionRate: 0, commission: 0, netRevenue: 248_600, sharePercent: 58 },
    { channel: "booking.com", label: "Booking.com", revenue: 89_400, reservations: 18, roomNights: 38, commissionRate: 15, commission: 13_410, netRevenue: 75_990, sharePercent: 21 },
    { channel: "expedia", label: "Expedia", revenue: 32_500, reservations: 6, roomNights: 14, commissionRate: 18, commission: 5_850, netRevenue: 26_650, sharePercent: 8 },
    { channel: "airbnb", label: "Airbnb", revenue: 24_800, reservations: 5, roomNights: 12, commissionRate: 14, commission: 3_472, netRevenue: 21_328, sharePercent: 6 },
    { channel: "instagram", label: "Instagram", revenue: 16_800, reservations: 3, roomNights: 8, commissionRate: 0, commission: 0, netRevenue: 16_800, sharePercent: 7 },
  ];

  const grossRevenue = 186_400;
  const channelCommission = 22_732;
  const netRevenue = grossRevenue - channelCommission;

  return {
    summary: {
      weeklyRevenue: 113_700,
      monthlyRevenue: grossRevenue,
      yearlyRevenue: 2_847_600,
      weeklyRoomNights: 24,
      monthlyRoomNights: 72,
      weeklyReservations: 12,
      monthlyReservations: 34,
      avgDailyRate: 4_850,
      revPar: 3_783,
      grossRevenue,
      channelCommission,
      netRevenue,
      pendingCollection: 24_400,
      cancelledAmount: 7_600,
      demoMode: true,
    },
    roomSales,
    weeklyPeriods,
    monthlyPeriods,
    channels,
    generatedAt: new Date(),
  };
}

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isRevenueStatus(status: string) {
  return !["CANCELLED", "PENDING"].includes(status);
}

async function buildFromDatabase(): Promise<AccountingReport | null> {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const reservations = await prisma.reservation.findMany({
    where: { status: { not: "CANCELLED" } },
    include: { roomType: true },
  });

  if (reservations.length === 0) return null;

  const pending = await prisma.reservation.findMany({
    where: { status: "PENDING" },
    select: { totalAmount: true },
  });
  const cancelled = await prisma.reservation.findMany({
    where: { status: "CANCELLED" },
    select: { totalAmount: true },
  });

  const inRange = (d: Date, start: Date) => d >= start;

  const weekly = reservations.filter((r) =>
    inRange(new Date(r.checkIn), weekStart)
  );
  const monthly = reservations.filter((r) =>
    inRange(new Date(r.checkIn), monthStart)
  );
  const yearly = reservations.filter((r) =>
    inRange(new Date(r.checkIn), yearStart)
  );

  const sum = (rows: typeof reservations) =>
    rows.reduce((a, r) => a + Number(r.totalAmount), 0);
  const nights = (rows: typeof reservations) =>
    rows.reduce((a, r) => a + r.nights, 0);

  const monthlyRoomNights = nights(monthly);
  const monthlyRevenue = sum(monthly);
  const avgDailyRate =
    monthlyRoomNights > 0 ? Math.round(monthlyRevenue / monthlyRoomNights) : 0;
  const roomCount = rooms.length || 1;
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();
  const revPar = Math.round(
    monthlyRevenue / (roomCount * daysInMonth)
  );

  const roomSales: RoomSalesRow[] = rooms.map((room) => {
    const weeklyRows = weekly.filter((r) => r.roomType.invCode === room.invCode);
    const monthlyRows = monthly.filter(
      (r) => r.roomType.invCode === room.invCode
    );
    const weeklyUnits = nights(weeklyRows);
    const monthlyUnits = nights(monthlyRows);
    const weeklyRevenue = sum(weeklyRows);
    const monthlyRevenueRoom = sum(monthlyRows);
    return {
      roomName: room.name,
      invCode: room.invCode,
      weeklyUnits,
      monthlyUnits,
      weeklyRevenue,
      monthlyRevenue: monthlyRevenueRoom,
      avgNightlyRate:
        monthlyUnits > 0
          ? Math.round(monthlyRevenueRoom / monthlyUnits)
          : room.basePrice,
      revenueShare:
        monthlyRevenue > 0
          ? Math.round((monthlyRevenueRoom / monthlyRevenue) * 100)
          : 0,
    };
  });

  const channelMap = new Map<
    string,
    { revenue: number; reservations: number; roomNights: number }
  >();
  for (const r of monthly) {
    const key = r.channel;
    const cur = channelMap.get(key) ?? {
      revenue: 0,
      reservations: 0,
      roomNights: 0,
    };
    cur.revenue += Number(r.totalAmount);
    cur.reservations += 1;
    cur.roomNights += r.nights;
    channelMap.set(key, cur);
  }

  const channels: ChannelRow[] = Array.from(channelMap.entries()).map(
    ([channel, data]) => {
      const rate = (CHANNEL_COMMISSION[channel] ?? 0.1) * 100;
      const commission = Math.round(data.revenue * (rate / 100));
      return {
        channel,
        label: CHANNEL_LABELS[channel] ?? channel,
        revenue: data.revenue,
        reservations: data.reservations,
        roomNights: data.roomNights,
        commissionRate: rate,
        commission,
        netRevenue: data.revenue - commission,
        sharePercent:
          monthlyRevenue > 0
            ? Math.round((data.revenue / monthlyRevenue) * 100)
            : 0,
      };
    }
  );

  const channelCommission = channels.reduce((a, c) => a + c.commission, 0);

  return {
    summary: {
      weeklyRevenue: sum(weekly),
      monthlyRevenue,
      yearlyRevenue: sum(yearly),
      weeklyRoomNights: nights(weekly),
      monthlyRoomNights,
      weeklyReservations: weekly.length,
      monthlyReservations: monthly.length,
      avgDailyRate,
      revPar,
      grossRevenue: monthlyRevenue,
      channelCommission,
      netRevenue: monthlyRevenue - channelCommission,
      pendingCollection: pending.reduce(
        (a, r) => a + Number(r.totalAmount),
        0
      ),
      cancelledAmount: cancelled.reduce(
        (a, r) => a + Number(r.totalAmount),
        0
      ),
      demoMode: false,
    },
    roomSales,
    weeklyPeriods: [],
    monthlyPeriods: [],
    channels,
    generatedAt: now,
  };
}

export async function getAccountingReport(): Promise<AccountingReport> {
  if (isAdminDemoMode()) return mockAccountingReport();

  try {
    const report = await buildFromDatabase();
    if (report) return report;
  } catch {
    /* demo fallback */
  }

  return mockAccountingReport();
}
