"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { clsx } from "@/lib/clsx";

function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const fieldClass =
  "flex flex-col gap-xs py-sm sm:py-0 border-b border-outline-variant/20 sm:border-b-0 sm:border-r sm:border-outline-variant/30 sm:pr-sm last:border-0 sm:last:border-r-0";

export function BookingWidget({ className }: { className?: string }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(todayISO(1));
  const [checkOut, setCheckOut] = useState(todayISO(3));
  const [guests, setGuests] = useState(2);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: String(guests),
    });
    router.push(`/rezervasyon?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className={clsx(
        "glass-card w-full p-sm sm:p-md rounded-xl shadow-lg border border-white/20 flex flex-col gap-sm sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-md text-left",
        className
      )}
    >
      <label className={fieldClass}>
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
          Giriş Tarihi
        </span>
        <div className="flex items-center gap-xs text-primary min-w-0">
          <Icon name="calendar_today" className="text-[20px] shrink-0" />
          <input
            type="date"
            value={checkIn}
            min={todayISO()}
            onChange={(e) => setCheckIn(e.target.value)}
            className="font-body-md bg-transparent focus:outline-none w-full min-w-0"
          />
        </div>
      </label>

      <label className={fieldClass}>
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
          Çıkış Tarihi
        </span>
        <div className="flex items-center gap-xs text-primary min-w-0">
          <Icon name="calendar_today" className="text-[20px] shrink-0" />
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="font-body-md bg-transparent focus:outline-none w-full min-w-0"
          />
        </div>
      </label>

      <label className={fieldClass}>
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
          Misafirler
        </span>
        <div className="flex items-center gap-xs text-primary min-w-0">
          <Icon name="person" className="text-[20px] shrink-0" />
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="font-body-md bg-transparent focus:outline-none w-full min-w-0"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} Misafir
              </option>
            ))}
          </select>
        </div>
      </label>

      <button
        type="submit"
        className="w-full min-h-12 bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 transition-all flex items-center justify-center gap-2 px-md sm:col-span-2 lg:col-span-1 lg:min-h-full touch-manipulation"
      >
        <Icon name="search" className="text-[20px] shrink-0" />
        <span className="text-sm sm:text-base">Uygunluk Sorgula</span>
      </button>
    </form>
  );
}
