"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { EASE } from "@/components/ui/motion";
import { formatCurrency } from "@/lib/site";
import type { AvailabilityResult } from "@/lib/booking";

type Step = "search" | "select" | "guest" | "done";

function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

const inputClass =
  "bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md w-full";

export function BookingFlow({
  initialCheckIn,
  initialCheckOut,
  initialGuests,
  preselectRoom,
}: {
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  preselectRoom?: string;
}) {
  const [step, setStep] = useState<Step>("search");
  const [checkIn, setCheckIn] = useState(initialCheckIn || todayISO(1));
  const [checkOut, setCheckOut] = useState(initialCheckOut || todayISO(3));
  const [guests, setGuests] = useState(initialGuests || 2);

  const [rooms, setRooms] = useState<AvailabilityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AvailabilityResult | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    code: string;
    roomName: string;
    totalAmount: number;
    nights: number;
  } | null>(null);

  const search = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        checkIn,
        checkOut,
        guests: String(guests),
      });
      const res = await fetch(`/api/availability?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Hata");
      setRooms(data.rooms);
      setStep("select");
      if (preselectRoom) {
        const pre = data.rooms.find(
          (r: AvailabilityResult) => r.slug === preselectRoom
        );
        if (pre && pre.available) {
          setSelected(pre);
          setStep("guest");
        }
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [checkIn, checkOut, guests, preselectRoom]);

  // Tarih/oda parametresiyle gelindiyse otomatik ara
  useEffect(() => {
    if (initialCheckIn || preselectRoom) {
      search();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitReservation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomSlug: selected.slug,
          checkIn,
          checkOut,
          adults: guests,
          children: 0,
          guest: {
            firstName: fd.get("firstName"),
            lastName: fd.get("lastName"),
            email: fd.get("email"),
            phone: fd.get("phone"),
            country: fd.get("country"),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Rezervasyon başarısız");
      setConfirmation(data.reservation);
      setStep("done");
    } catch (e) {
      setError(String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Stepper step={step} />

      {error && (
        <div className="flex items-center gap-xs text-error font-label-md bg-error-container/40 rounded-lg p-md mb-md">
          <Icon name="error" />
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
      {/* Adım 1: Arama */}
      {step === "search" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
          className="bg-surface-container-low rounded-xl p-lg border border-outline-variant/10 grid grid-cols-1 md:grid-cols-3 gap-md items-end"
        >
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Giriş Tarihi
            </span>
            <input
              type="date"
              value={checkIn}
              min={todayISO()}
              onChange={(e) => setCheckIn(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Çıkış Tarihi
            </span>
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Misafir
            </span>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className={inputClass}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} Misafir
                </option>
              ))}
            </select>
          </label>
          <div className="md:col-span-3">
            <Button type="submit" size="lg" disabled={loading} className="w-full">
              <Icon name="search" className="text-[20px]" />
              {loading ? "Sorgulanıyor..." : "Uygunluk Sorgula"}
            </Button>
          </div>
        </form>
      )}

      {/* Adım 2: Oda seçimi */}
      {step === "select" && (
        <div className="flex flex-col gap-md">
          <button
            onClick={() => setStep("search")}
            className="self-start text-on-surface-variant hover:text-primary font-label-md flex items-center gap-1"
          >
            <Icon name="arrow_back" className="text-[20px]" /> Tarihleri değiştir
          </button>
          {rooms.map((room) => (
            <div
              key={room.slug}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col sm:flex-row"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={room.heroImage}
                alt={room.name}
                className="w-full sm:w-48 h-40 object-cover"
              />
              <div className="p-md flex-1 flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="font-headline-sm text-headline-sm text-primary">
                    {room.name}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {room.capacity} kişiye kadar · {room.nights} gece
                  </p>
                  {room.available ? (
                    <p className="font-label-sm text-label-sm text-primary mt-xs">
                      {room.remaining < 90 ? `${room.remaining} oda kaldı` : "Müsait"}
                    </p>
                  ) : (
                    <p className="font-label-sm text-label-sm text-error mt-xs">
                      Bu tarihlerde müsait değil
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:items-end gap-sm w-full sm:w-auto shrink-0">
                  <div className="text-left sm:text-right">
                    <p className="font-headline-sm text-headline-sm text-primary">
                      {formatCurrency(room.totalPrice)}
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {formatCurrency(room.pricePerNight)}/gece
                    </p>
                  </div>
                  <Button
                    size="md"
                    disabled={!room.available}
                    className="w-full sm:!w-auto"
                    onClick={() => {
                      setSelected(room);
                      setStep("guest");
                    }}
                  >
                    Seç
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Adım 3: Misafir bilgileri */}
      {step === "guest" && selected && (
        <form
          onSubmit={submitReservation}
          className="bg-surface-container-low rounded-xl p-lg border border-outline-variant/10"
        >
          <button
            type="button"
            onClick={() => setStep("select")}
            className="text-on-surface-variant hover:text-primary font-label-md flex items-center gap-1 mb-md"
          >
            <Icon name="arrow_back" className="text-[20px]" /> Oda seçimine dön
          </button>

          {/* Özet */}
          <div className="glass-card rounded-lg p-md mb-lg border border-outline-variant/10">
            <div className="flex flex-col gap-sm sm:flex-row sm:justify-between sm:items-center">
              <div className="min-w-0">
                <p className="font-headline-sm text-headline-sm text-primary">
                  {selected.name}
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant break-words">
                  {checkIn} → {checkOut} · {selected.nights} gece · {guests} misafir
                </p>
              </div>
              <p className="font-headline-sm text-headline-sm text-primary shrink-0">
                {formatCurrency(selected.totalPrice)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <label className="flex flex-col gap-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Ad</span>
              <input name="firstName" required className={inputClass} />
            </label>
            <label className="flex flex-col gap-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Soyad</span>
              <input name="lastName" required className={inputClass} />
            </label>
            <label className="flex flex-col gap-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant">E-posta</span>
              <input name="email" type="email" required className={inputClass} />
            </label>
            <label className="flex flex-col gap-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Telefon</span>
              <input name="phone" className={inputClass} />
            </label>
            <label className="flex flex-col gap-xs md:col-span-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Ülke</span>
              <input name="country" defaultValue="Türkiye" className={inputClass} />
            </label>
          </div>

          <div className="mt-lg flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-md">
            <p className="font-label-sm text-label-sm text-on-surface-variant text-center sm:text-left">
              Ödeme güvenli şekilde alınır.
            </p>
            <Button type="submit" size="lg" disabled={submitting} className="w-full sm:!w-auto shrink-0">
              <Icon name="lock" className="text-[20px] shrink-0" />
              <span className="truncate">
                {submitting ? "İşleniyor..." : `Öde ve Onayla · ${formatCurrency(selected.totalPrice)}`}
              </span>
            </Button>
          </div>
        </form>
      )}

      {/* Adım 4: Onay */}
      {step === "done" && confirmation && (
        <div className="bg-surface-container-low rounded-xl p-xl border border-outline-variant/10 text-center">
          <div className="w-16 h-16 rounded-full bg-primary-fixed-dim/30 text-primary flex items-center justify-center mx-auto mb-md">
            <Icon name="check_circle" fill className="text-[40px]" />
          </div>
          <h2 className="font-headline-md text-headline-md text-primary mb-sm">
            Rezervasyonunuz Onaylandı
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
            {confirmation.roomName} · {confirmation.nights} gece
          </p>
          <div className="inline-block bg-surface-container-lowest rounded-lg px-lg py-md mb-lg">
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Rezervasyon Kodu
            </p>
            <p className="font-headline-sm text-headline-sm text-primary">
              {confirmation.code}
            </p>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Toplam: {formatCurrency(confirmation.totalAmount)} · Onay e-postası
            gönderildi.
          </p>
        </div>
      )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "search", label: "Tarih" },
    { key: "select", label: "Oda" },
    { key: "guest", label: "Bilgiler" },
    { key: "done", label: "Onay" },
  ];
  const order: Step[] = ["search", "select", "guest", "done"];
  const currentIdx = order.indexOf(step);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-xs mb-lg px-1">
      {steps.map((s, i) => {
        const active = i <= currentIdx;
        return (
          <div key={s.key} className="flex items-center gap-1 sm:gap-xs">
            <div
              className={`flex items-center gap-1 sm:gap-xs px-2 sm:px-sm py-1 sm:py-xs rounded-full font-label-sm text-label-sm whitespace-nowrap ${
                active
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs shrink-0">
                {i + 1}
              </span>
              <span>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <span className="hidden sm:block w-4 lg:w-6 h-px bg-outline-variant shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
