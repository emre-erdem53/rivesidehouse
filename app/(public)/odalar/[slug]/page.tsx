import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/motion";
import { getRoomBySlug, getRoomTypes } from "@/lib/rooms";
import { formatCurrency } from "@/lib/site";

export async function generateStaticParams() {
  const rooms = await getRoomTypes();
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const room = await getRoomBySlug(params.slug);
  if (!room) return { title: "Oda bulunamadı" };
  return { title: room.name, description: room.shortDesc };
}

export default async function RoomDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const room = await getRoomBySlug(params.slug);
  if (!room) notFound();

  return (
    <>
      {/* Hero görsel */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={room.heroImage}
          alt={room.name}
          className="w-full h-full object-cover animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-gutter pb-xl">
          <Reveal className="max-w-container-max mx-auto" direction="up">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">
              {room.badge}
            </span>
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mt-sm">
              {room.name}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="max-w-container-max mx-auto px-gutter py-xl grid grid-cols-1 lg:grid-cols-3 gap-xl">
        <Reveal className="lg:col-span-2" direction="up">
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-lg">
            {room.description}
          </p>

          <h3 className="font-headline-sm text-headline-sm text-primary mb-md">
            Özellikler
          </h3>
          <RevealStagger className="grid grid-cols-2 sm:grid-cols-4 gap-md" stagger={0.08}>
            {room.amenities.map((a) => (
              <RevealItem
                key={a.label}
                className="flex flex-col items-center text-center gap-xs bg-surface-container-low rounded-xl p-md border border-outline-variant/10"
              >
                <Icon name={a.icon} className="text-3xl text-secondary" />
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {a.label}
                </span>
              </RevealItem>
            ))}
          </RevealStagger>
        </Reveal>

        {/* Rezervasyon kartı */}
        <Reveal className="lg:col-span-1" direction="right">
          <div className="glass-card border border-outline-variant/20 rounded-xl p-lg sticky top-header">
            <p className="font-label-sm text-label-sm text-outline mb-xs">
              Başlangıç fiyatı
            </p>
            <p className="font-headline-md text-headline-md text-primary mb-md">
              {formatCurrency(room.basePrice)}
              <span className="font-body-md text-body-md text-on-surface-variant font-normal">
                {" "}
                /gece
              </span>
            </p>
            <ul className="space-y-sm mb-lg font-body-md text-body-md text-on-surface-variant">
              <li className="flex items-center gap-sm">
                <Icon name="group" className="text-secondary text-[20px]" />
                {room.capacity} misafire kadar
              </li>
              <li className="flex items-center gap-sm">
                <Icon name="bed" className="text-secondary text-[20px]" />
                {room.bedType}
              </li>
              <li className="flex items-center gap-sm">
                <Icon name="square_foot" className="text-secondary text-[20px]" />
                {room.sizeSqm} m²
              </li>
            </ul>
            <ButtonLink
              href={`/rezervasyon?room=${room.slug}`}
              size="lg"
              className="w-full"
            >
              <Icon name="calendar_month" className="text-[20px]" />
              Rezervasyon Yap
            </ButtonLink>
            <Link
              href="/odalar"
              className="block text-center mt-md font-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              ← Tüm odalara dön
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
