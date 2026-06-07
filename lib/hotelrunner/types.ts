// HotelRunner Custom Apps API tipleri (kullandığımız alt küme)

export type HRRate = {
  rate_code: string;
  name: string;
  price?: number;
  price_update?: boolean;
};

export type HRRoom = {
  inv_code: string;
  name: string;
  description?: string;
  capacity?: number;
  availability?: number;
  price?: number;
  currency?: string;
  rates?: HRRate[];
};

export type HRRoomsResponse = {
  rooms: HRRoom[];
};

export type HRReservation = {
  hr_code: string;
  channel: string;
  status: string; // confirmed, cancelled, pending ...
  room_inv_code: string;
  checkin_date: string; // YYYY-MM-DD
  checkout_date: string; // YYYY-MM-DD
  total_price: number;
  currency: string;
  guest: {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    country?: string;
  };
  adults?: number;
  children?: number;
};

export type HRReservationsResponse = {
  reservations: HRReservation[];
};

export type UpdateRoomParams = {
  invCode: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  availability?: number;
  price?: number;
  stopSale?: boolean;
  minStay?: number;
  channelCodes?: string[];
};

export type PushReservationParams = {
  invCode: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  currency: string;
  adults: number;
  children: number;
  guest: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    country?: string;
  };
};
