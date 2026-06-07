"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md text-body-md";

  return (
    <form className="flex flex-col gap-md" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="flex flex-col gap-xs">
          <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="firstName">
            Ad
          </label>
          <input id="firstName" name="firstName" required className={inputClass} placeholder="Adınız" />
        </div>
        <div className="flex flex-col gap-xs">
          <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="lastName">
            Soyad
          </label>
          <input id="lastName" name="lastName" required className={inputClass} placeholder="Soyadınız" />
        </div>
      </div>
      <div className="flex flex-col gap-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="email">
          E-posta
        </label>
        <input id="email" name="email" type="email" required className={inputClass} placeholder="ornek@email.com" />
      </div>
      <div className="flex flex-col gap-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="subject">
          İlgi Alanı
        </label>
        <select id="subject" name="subject" className={`${inputClass} appearance-none`}>
          <option>Genel Bilgi</option>
          <option>Oda Rezervasyonu</option>
          <option>Yemek Deneyimleri</option>
          <option>Wellness &amp; Spa</option>
        </select>
      </div>
      <div className="flex flex-col gap-xs">
        <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="message">
          Mesajınız
        </label>
        <textarea id="message" name="message" rows={5} required className={`${inputClass} resize-none`} placeholder="Konaklamanızı planlamanıza nasıl yardımcı olabiliriz?" />
      </div>

      <Button type="submit" size="lg" disabled={status === "sending"} className="self-start">
        {status === "sending" ? "Gönderiliyor..." : "Talebi Gönder"}
      </Button>

      {status === "sent" && (
        <p className="font-body-md text-body-md text-primary">
          Teşekkürler! Talebiniz alındı, en kısa sürede dönüş yapacağız.
        </p>
      )}
      {status === "error" && (
        <p className="font-body-md text-body-md text-error">
          Bir hata oluştu. Lütfen tekrar deneyin.
        </p>
      )}
    </form>
  );
}
