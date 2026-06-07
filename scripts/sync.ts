/**
 * CLI senkronizasyon script'i. Cron ile periyodik çalıştırılabilir:
 *   npm run hr:sync
 *
 * HotelRunner'dan oda ve rezervasyon verisini çeker.
 */
import { syncRoomsFromHR, syncReservationsFromHR } from "../lib/hotelrunner";
import { getHotelRunner } from "../lib/hotelrunner/client";

async function main() {
  const hr = getHotelRunner();
  console.log(
    `HotelRunner senkronizasyonu başlıyor (mod: ${hr.isMock ? "MOCK" : "CANLI"})...`
  );

  const rooms = await syncRoomsFromHR();
  console.log(`Odalar: ${rooms.count} kayıt işlendi.`);

  const reservations = await syncReservationsFromHR();
  console.log(`Rezervasyonlar: ${reservations.count} kayıt işlendi.`);

  console.log("Senkronizasyon tamamlandı.");
}

main()
  .catch((e) => {
    console.error("Senkronizasyon hatası:", e);
    process.exit(1);
  })
  .then(() => process.exit(0));
