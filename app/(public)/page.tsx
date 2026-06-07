import Link from "next/link";
import { RoomCard } from "@/components/public/RoomCard";
import { HomeHero } from "@/components/public/HomeHero";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/motion";
import { getRoomTypes } from "@/lib/rooms";
import { experiences } from "@/lib/content";
import { heroImage } from "@/lib/content";
import { site } from "@/lib/site";

export default async function HomePage() {
  const rooms = await getRoomTypes();

  return (
    <>
      <HomeHero heroImage={heroImage} />

      {/* Deneyimler */}
      <section className="py-xl px-gutter max-w-container-max mx-auto">
        <Reveal className="text-center mb-xl">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
            Ritüellerimiz
          </span>
          <h2 className="font-headline-md text-headline-md text-primary mt-sm">
            Riverside Deneyimi
          </h2>
        </Reveal>
        <RevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {experiences.map((exp) => (
            <RevealItem key={exp.title} className="group cursor-pointer">
              <div className="relative h-80 rounded-xl overflow-hidden mb-md shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                {exp.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
                {exp.desc}
              </p>
            </RevealItem>
          ))}
        </RevealStagger>
      </section>

      {/* Odalar */}
      <section className="py-xl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter">
          <Reveal className="flex flex-col md:flex-row justify-between items-end mb-xl gap-md">
            <div className="max-w-xl">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
                Konaklama
              </span>
              <h2 className="font-headline-md text-headline-md text-primary mt-sm">
                Sizin İçin Tasarlanmış Yaşam Alanları
              </h2>
            </div>
            <Link
              href="/odalar"
              className="text-primary font-label-md border-b border-primary hover:opacity-70 transition-all"
            >
              Tüm Odaları Görüntüle
            </Link>
          </Reveal>
          <RevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {rooms.map((room) => (
              <RevealItem key={room.slug}>
                <RoomCard room={room} />
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Fog Overlay banner */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden wood-texture">
        <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" />
        <div className="absolute inset-0 opacity-30 fog-animation">
          <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <Reveal className="relative z-10 text-center px-gutter text-on-primary">
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-sm">
            Zamanı Unutun
          </h2>
          <p className="font-body-lg text-body-lg max-w-xl mx-auto opacity-90">
            {site.name}&apos;ta her an, nehrin kıyısında yazılan yeni bir hikaye.
          </p>
          <div className="mt-lg">
            <ButtonLink href="/rezervasyon" variant="secondary" size="lg">
              <Icon name="calendar_month" className="text-[20px]" />
              Rezervasyon Yap
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
