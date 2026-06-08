import { getWhatsAppUrl } from "@/lib/site";

/** Sağ alt köşede sabit WhatsApp iletişim butonu. */
export function WhatsAppButton() {
  return (
    <a
      href={getWhatsAppUrl("Merhaba, Riverside Tiny House hakkında bilgi almak istiyorum.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geçin"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white shadow-lg shadow-on-surface/15 ring-1 ring-outline-variant/20 transition-transform duration-300 hover:scale-105 active:scale-95 touch-manipulation"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/whatsapp.svg"
        alt=""
        width={40}
        height={40}
        className="h-10 w-10"
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}
