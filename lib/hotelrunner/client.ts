import type {
  HRRoom,
  HRReservation,
  HRRoomsResponse,
  HRReservationsResponse,
  UpdateRoomParams,
  PushReservationParams,
} from "./types";
import { mockRooms, mockReservations, mockPushReservation } from "./mock";

/**
 * Basit dakikalık hız sınırlayıcı.
 * HotelRunner limiti: 5 istek/dk/property, 250 istek/gün/property.
 */
class RateLimiter {
  private timestamps: number[] = [];
  constructor(
    private readonly maxPerMinute = 5,
    private readonly maxPerDay = 250
  ) {}

  async take(): Promise<void> {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < 24 * 60 * 60_000);

    const lastMinute = this.timestamps.filter((t) => now - t < 60_000);
    if (this.timestamps.length >= this.maxPerDay) {
      throw new Error("HotelRunner günlük istek limiti aşıldı (250/gün).");
    }
    if (lastMinute.length >= this.maxPerMinute) {
      const wait = 60_000 - (now - lastMinute[0]);
      await new Promise((r) => setTimeout(r, wait));
    }
    this.timestamps.push(Date.now());
  }
}

export class HotelRunnerClient {
  private hrId: string;
  private token: string;
  private base: string;
  private limiter = new RateLimiter();
  readonly isMock: boolean;

  constructor() {
    this.hrId = process.env.HOTELRUNNER_HR_ID ?? "";
    this.token = process.env.HOTELRUNNER_TOKEN ?? "";
    this.base = process.env.HOTELRUNNER_API_BASE ?? "https://app.hotelrunner.com";
    const forceMock = process.env.HOTELRUNNER_FORCE_MOCK === "true";
    this.isMock = forceMock || !this.hrId || !this.token;
  }

  private authParams(): URLSearchParams {
    return new URLSearchParams({ token: this.token, hr_id: this.hrId });
  }

  private async request<T>(
    method: "GET" | "PUT" | "POST",
    path: string,
    options: { query?: URLSearchParams; body?: URLSearchParams } = {}
  ): Promise<T> {
    await this.limiter.take();
    const url = new URL(`${this.base}${path}`);
    const query = options.query ?? this.authParams();
    url.search = query.toString();

    const headers: Record<string, string> = { "cache-control": "no-cache" };
    if (options.body) {
      headers["content-type"] = "application/x-www-form-urlencoded";
    }

    const res = await fetch(url.toString(), {
      method,
      headers,
      body: options.body ? options.body.toString() : undefined,
    });

    if (!res.ok) {
      throw new Error(
        `HotelRunner ${method} ${path} başarısız: ${res.status} ${res.statusText}`
      );
    }
    return (await res.json()) as T;
  }

  /** Oda / fiyat listesini getirir. GET /api/v2/apps/rooms */
  async getRooms(): Promise<HRRoom[]> {
    if (this.isMock) return mockRooms();
    const data = await this.request<HRRoomsResponse>("GET", "/api/v2/apps/rooms");
    return data.rooms ?? [];
  }

  /** Oda müsaitlik/fiyat/kısıtlarını günceller. PUT /api/v2/apps/rooms/~ */
  async updateRoom(params: UpdateRoomParams): Promise<{ ok: boolean }> {
    if (this.isMock) {
      console.info("[HotelRunner mock] updateRoom", params);
      return { ok: true };
    }
    const body = this.authParams();
    body.set("inv_code", params.invCode);
    body.set("start_date", params.startDate);
    body.set("end_date", params.endDate);
    if (params.availability !== undefined)
      body.set("availability", String(params.availability));
    if (params.price !== undefined) body.set("price", String(params.price));
    if (params.stopSale !== undefined)
      body.set("stop_sale", params.stopSale ? "1" : "0");
    if (params.minStay !== undefined)
      body.set("min_stay", String(params.minStay));
    (params.channelCodes ?? []).forEach((c) =>
      body.append("channel_codes[]", c)
    );

    await this.request<unknown>("PUT", "/api/v2/apps/rooms/~", { body });
    return { ok: true };
  }

  /** Rezervasyonları getirir (HR -> bizim sistem). */
  async getReservations(params?: {
    modifiedFrom?: string;
  }): Promise<HRReservation[]> {
    if (this.isMock) return mockReservations();
    const query = this.authParams();
    if (params?.modifiedFrom) query.set("modified_from", params.modifiedFrom);
    const data = await this.request<HRReservationsResponse>(
      "GET",
      "/api/v2/apps/reservations",
      { query }
    );
    return data.reservations ?? [];
  }

  /** Yeni doğrudan rezervasyonu HotelRunner'a gönderir (white-label). */
  async pushReservation(
    params: PushReservationParams
  ): Promise<{ hr_code: string }> {
    if (this.isMock) return mockPushReservation(params);
    const body = this.authParams();
    body.set("inv_code", params.invCode);
    body.set("checkin_date", params.checkIn);
    body.set("checkout_date", params.checkOut);
    body.set("total_price", String(params.totalPrice));
    body.set("currency", params.currency);
    body.set("adults", String(params.adults));
    body.set("children", String(params.children));
    body.set("guest_first_name", params.guest.firstName);
    body.set("guest_last_name", params.guest.lastName);
    if (params.guest.email) body.set("guest_email", params.guest.email);
    if (params.guest.phone) body.set("guest_phone", params.guest.phone);

    const data = await this.request<{ hr_code: string }>(
      "POST",
      "/api/v2/apps/reservations",
      { body }
    );
    return data;
  }
}

let _client: HotelRunnerClient | null = null;
export function getHotelRunner(): HotelRunnerClient {
  if (!_client) _client = new HotelRunnerClient();
  return _client;
}
