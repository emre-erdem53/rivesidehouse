"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

export function SyncButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function sync() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/hotelrunner/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Hata");
      setMsg(
        `Senkronize edildi: ${data.rooms} oda, ${data.reservations} rezervasyon`
      );
      router.refresh();
    } catch (e) {
      setMsg(`Senkronizasyon hatası: ${String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-sm">
      {msg && (
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {msg}
        </span>
      )}
      <button
        onClick={sync}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-primary text-on-primary px-md py-sm rounded-full font-label-md hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Icon
          name="sync"
          className={loading ? "animate-spin text-[20px]" : "text-[20px]"}
        />
        {loading ? "Senkronize ediliyor..." : "HotelRunner Senkronize Et"}
      </button>
    </div>
  );
}
