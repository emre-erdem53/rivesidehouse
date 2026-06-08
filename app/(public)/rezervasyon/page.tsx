import type { Metadata } from "next";
import { BookingFlow } from "@/components/public/BookingFlow";

export const metadata: Metadata = {
  title: "Rezervasyon",
  description: "Riverside Tiny House'ta kaçışınızı planlayın ve rezervasyon yapın.",
};

export default function ReservationPage({
  searchParams,
}: {
  searchParams: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    room?: string;
  };
}) {
  return (
    <section className="pt-header pb-xl px-4 sm:px-gutter max-w-container-max mx-auto">
      <header className="text-center mb-xl">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-sm">
          Rezervasyon
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Tarihlerinizi seçin, size en uygun tiny house&apos;u bulun ve birkaç
          adımda kaçışınızı güvence altına alın.
        </p>
      </header>

      <BookingFlow
        initialCheckIn={searchParams.checkIn}
        initialCheckOut={searchParams.checkOut}
        initialGuests={
          searchParams.guests ? Number(searchParams.guests) : undefined
        }
        preselectRoom={searchParams.room}
      />
    </section>
  );
}
