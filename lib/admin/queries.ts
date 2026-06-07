import { prisma } from "@/lib/db";
import { rooms as staticRooms } from "@/lib/content";
import {
  isAdminDemoMode,
  mockDashboardStats,
  mockInventory,
  mockReservations,
  mockStaff,
  mockSyncLogs,
} from "./mock";

export type ReservationRow = {
  id: string;
  code: string;
  guestName: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  status: string;
  channel: string;
  totalAmount: number;
};

export type InventoryRow = {
  id: string;
  invCode: string;
  name: string;
  basePrice: number;
  capacity: number;
  todayAvailability: number;
  isActive: boolean;
};

/**
 * Veritabanı erişilemiyorsa veya ADMIN_DEMO_MODE=true ise zengin demo veriler döner.
 */
export async function getDashboardStats() {
  if (isAdminDemoMode()) return mockDashboardStats;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayCheckIns, totalRooms, occupiedToday, monthReservations, pending] =
      await Promise.all([
        prisma.reservation.count({
          where: { checkIn: { gte: today, lt: tomorrow } },
        }),
        prisma.roomType.aggregate({ _sum: { capacity: true }, _count: true }),
        prisma.reservation.count({
          where: {
            checkIn: { lte: today },
            checkOut: { gt: today },
            status: { in: ["CONFIRMED", "CHECKED_IN"] },
          },
        }),
        prisma.reservation.findMany({
          where: { createdAt: { gte: monthStart } },
          select: { totalAmount: true },
        }),
        prisma.reservation.count({ where: { status: "PENDING" } }),
      ]);

    const roomCount = totalRooms._count || staticRooms.length;
    const monthlyRevenue = monthReservations.reduce(
      (sum, r) => sum + Number(r.totalAmount),
      0
    );
    const occupancy =
      roomCount > 0 ? Math.round((occupiedToday / roomCount) * 100) : 0;

    return {
      todayCheckIns,
      occupancy,
      monthlyRevenue,
      pending,
      roomCount,
      occupiedToday,
      available: true,
      demoMode: false,
    };
  } catch {
    return mockDashboardStats;
  }
}

export async function getReservations(): Promise<ReservationRow[]> {
  if (isAdminDemoMode()) return mockReservations;

  try {
    const rows = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      include: { guest: true, roomType: true },
      take: 100,
    });
    if (rows.length === 0) return mockReservations;
    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      guestName: `${r.guest.firstName} ${r.guest.lastName}`,
      roomName: r.roomType.name,
      checkIn: r.checkIn,
      checkOut: r.checkOut,
      status: r.status,
      channel: r.channel,
      totalAmount: Number(r.totalAmount),
    }));
  } catch {
    return mockReservations;
  }
}

export async function getInventory(): Promise<InventoryRow[]> {
  if (isAdminDemoMode()) return mockInventory;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const roomTypes = await prisma.roomType.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        availability: { where: { date: today }, take: 1 },
      },
    });
    if (roomTypes.length === 0) throw new Error("empty");
    return roomTypes.map((r) => ({
      id: r.id,
      invCode: r.invCode,
      name: r.name,
      basePrice: Number(r.basePrice),
      capacity: r.capacity,
      todayAvailability: r.availability[0]?.availability ?? 0,
      isActive: r.isActive,
    }));
  } catch {
    return mockInventory;
  }
}

export async function getStaff() {
  if (isAdminDemoMode()) return mockStaff;

  try {
    const rows = await prisma.staffMember.findMany({
      orderBy: { createdAt: "asc" },
    });
    if (rows.length === 0) return mockStaff;
    return rows;
  } catch {
    return mockStaff;
  }
}

export async function getSyncLogs() {
  if (isAdminDemoMode()) return mockSyncLogs;

  try {
    const rows = await prisma.syncLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    if (rows.length === 0) return mockSyncLogs;
    return rows;
  } catch {
    return mockSyncLogs;
  }
}
