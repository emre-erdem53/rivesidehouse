// Riverside Tiny House marka ve site yapılandırması

export const site = {
  name: "Riverside Tiny House",
  shortName: "Riverside",
  tagline: "Doğanın Kalbinde, Nehrin Kıyısında",
  description:
    "Nehrin kıyısında, doğanın kalbinde lüks ve dinginliğin buluştuğu eşsiz bir tiny house konaklama deneyimi.",
  currency: "TRY",
  currencySymbol: "₺",
  contact: {
    address: "Çamlıhemşin Yolu Üzeri, Km 8\nÇamlıhemşin, Rize 53780\nTürkiye",
    phone: "+90 464 123 45 67",
    email: "rezervasyon@riversidetinyhouse.com",
    coordinates: "40°57'14.0\"N 41°05'56.0\"E",
  },
  social: {
    instagram: "https://instagram.com",
    journal: "#",
    press: "#",
  },
};

export const publicNav: { label: string; href: string }[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Odalar", href: "/odalar" },
  { label: "Deneyim", href: "/deneyim" },
  { label: "İletişim", href: "/iletisim" },
];

export const adminNav: {
  label: string;
  href: string;
  icon: string;
}[] = [
  { label: "Panel", href: "/yonetim/dashboard", icon: "dashboard" },
  { label: "Rezervasyonlar", href: "/yonetim/rezervasyonlar", icon: "calendar_month" },
  { label: "Muhasebe", href: "/yonetim/muhasebe", icon: "payments" },
  { label: "Envanter", href: "/yonetim/envanter", icon: "bed" },
  { label: "Personel", href: "/yonetim/personel", icon: "group" },
  { label: "Ayarlar", href: "/yonetim/ayarlar", icon: "settings" },
];

export function formatCurrency(amount: number, currency = site.currency): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** WhatsApp sohbet bağlantısı (wa.me). */
export function getWhatsAppUrl(message?: string): string {
  const phone = site.contact.phone.replace(/\D/g, "");
  const base = `https://wa.me/${phone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
