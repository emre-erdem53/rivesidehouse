"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { updateInventory, type InventoryActionState } from "@/lib/actions/inventory";
import type { InventoryRow } from "@/lib/admin/queries";
import { formatCurrency } from "@/lib/site";

function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 bg-primary text-on-primary px-md py-sm rounded-lg font-label-md hover:opacity-90 disabled:opacity-50"
    >
      <Icon name="cloud_upload" className="text-[18px]" />
      {pending ? "Gönderiliyor..." : "HotelRunner'a Gönder"}
    </button>
  );
}

export function InventoryEditor({ room }: { room: InventoryRow }) {
  const [open, setOpen] = useState(false);
  const initial: InventoryActionState = {};
  const [state, formAction] = useFormState(updateInventory, initial);

  const inputClass =
    "bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-sm py-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md w-full";

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-md">
        <div className="flex items-center gap-md">
          <div className="h-10 w-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
            <Icon name="bed" fill />
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface">
              {room.name}
            </p>
            <p className="text-sm text-on-surface-variant">
              {room.invCode} · {room.capacity} kişi ·{" "}
              {formatCurrency(room.basePrice)}/gece
            </p>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Bugün: {room.todayAvailability} müsait
          </span>
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-1 text-primary font-label-md hover:underline"
          >
            <Icon name={open ? "expand_less" : "edit_calendar"} className="text-[20px]" />
            {open ? "Kapat" : "Düzenle"}
          </button>
        </div>
      </div>

      {open && (
        <form
          action={formAction}
          className="border-t border-outline-variant/10 p-md bg-surface-container-low/50 grid grid-cols-2 md:grid-cols-6 gap-md items-end"
        >
          <input type="hidden" name="roomTypeId" value={room.id} />
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Başlangıç
            </span>
            <input
              type="date"
              name="startDate"
              defaultValue={todayISO()}
              className={inputClass}
              required
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Bitiş
            </span>
            <input
              type="date"
              name="endDate"
              defaultValue={todayISO(7)}
              className={inputClass}
              required
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Müsaitlik
            </span>
            <input
              type="number"
              name="availability"
              min={0}
              placeholder="örn. 3"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Fiyat (₺)
            </span>
            <input
              type="number"
              name="price"
              min={0}
              step="0.01"
              defaultValue={room.basePrice}
              className={inputClass}
            />
          </label>
          <label className="flex items-center gap-xs pb-xs">
            <input type="checkbox" name="stopSale" className="rounded" />
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Satış durdur
            </span>
          </label>
          <SaveButton />

          {(state.message || state.error) && (
            <p
              className={`col-span-2 md:col-span-6 font-label-sm text-label-sm ${
                state.error ? "text-error" : "text-primary"
              }`}
            >
              {state.error ?? state.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
