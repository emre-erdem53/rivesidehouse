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
        "glass-card p-md rounded-xl shadow-lg border border-white/20 grid grid-cols-2 md:grid-cols-4 gap-sm text-left",
        className
      )}
    >
      <label className="flex flex-col border-r border-outline-variant/30 pr-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
          Giriş Tarihi
        </span>
        <div className="flex items-center gap-xs mt-xs text-primary">
          <Icon name="calendar_today" className="text-[20px]" />
          <input
            type="date"
            value={checkIn}
            min={todayISO()}
            onChange={(e) => setCheckIn(e.target.value)}
            className="font-body-md bg-transparent focus:outline-none w-full"
          />
        </div>
      </label>

      <label className="flex flex-col md:border-r border-outline-variant/30 pr-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
          Çıkış Tarihi
        </span>
        <div className="flex items-center gap-xs mt-xs text-primary">
          <Icon name="calendar_today" className="text-[20px]" />
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="font-body-md bg-transparent focus:outline-none w-full"
          />
        </div>
      </label>

      <label className="flex flex-col border-r border-outline-variant/30 pr-sm">
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
          Misafirler
        </span>
        <div className="flex items-center gap-xs mt-xs text-primary">
          <Icon name="person" className="text-[20px]" />
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="font-body-md bg-transparent focus:outline-none w-full"
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
        className="bg-primary text-on-primary rounded-lg font-label-md py-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
      >
        <Icon name="search" className="text-[20px]" />
        Uygunluk Sorgula
      </button>
    </form>
  );
}
