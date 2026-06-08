import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/motion";
import { getRoomTypes } from "@/lib/rooms";
import { formatCurrency } from "@/lib/site";
import { clsx } from "@/lib/clsx";

export const metadata: Metadata = {
  title: "Odalar & Tiny House'lar",
  description:
    "Riverside Tiny House konaklama seçenekleri: nehir kıyısında lüks tiny house'lar ve suitler.",
};

export default async function RoomsPage() {
  const rooms = await getRoomTypes();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-header pb-xl px-4 sm:px-gutter text-center">
        <Reveal className="max-w-3xl mx-auto">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-md">
            Odalar &amp; Tiny House&apos;lar
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Nehrin kıyısında huzuru keşfedin. Modern lüksü doğanın ham güzelliğiyle
            kusursuzca harmanlayan yaşam alanlarında dinlenin.
          </p>
        </Reveal>
      </section>

      {/* Liste — asimetrik düzen */}
      <section className="max-w-container-max mx-auto px-4 sm:px-gutter pb-xl flex flex-col gap-xl md:gap-[120px]">
        {rooms.map((room, idx) => {
          const reverse = idx % 2 === 1;
          return (
            <Reveal
              key={room.slug}
              direction={reverse ? "right" : "left"}
              amount={0.15}
              className={clsx(
                "flex flex-col gap-lg md:gap-xl items-center group",
                reverse ? "md:flex-row-reverse" : "md:flex-row"
              )}
            >
              <div className="w-full md:w-7/12 relative overflow-hidden rounded-xl ultra-soft-shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={room.heroImage}
                  alt={room.name}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="w-full md:w-5/12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 mb-sm">
                  <span className="w-8 h-px bg-secondary" />
                  <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">
                    {room.badge}
                  </span>
                </div>
                <h2 className="font-headline-md text-headline-md text-primary mb-md">
                  {room.name}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-lg leading-relaxed">
                  {room.description}
                </p>
                <div className="grid grid-cols-2 gap-md mb-xl">
                  {room.amenities.map((a) => (
                    <div
                      key={a.label}
                      className="flex items-center gap-xs text-on-surface-variant"
                    >
                      <Icon name={a.icon} className="text-outline" />
                      <span className="font-label-sm text-label-sm">
                        {a.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-sm sm:items-end sm:justify-between border-t border-outline-variant/30 pt-md">
                  <div className="mb-sm sm:mb-0">
                    <p className="font-label-sm text-label-sm text-outline mb-xs">
                      Başlangıç fiyatı
                    </p>
                    <p className="font-headline-sm text-headline-sm text-primary">
                      {formatCurrency(room.basePrice)}
                      <span className="font-body-md text-body-md text-on-surface-variant font-normal">
                        {" "}
                        /gece
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-sm w-full sm:w-auto">
                    <Link
                      href={`/odalar/${room.slug}`}
                      className="inline-flex min-h-11 w-full sm:w-auto items-center justify-center px-md py-sm rounded-full border border-primary text-primary font-label-md hover:bg-primary hover:text-on-primary transition-all touch-manipulation"
                    >
                      İncele
                    </Link>
                    <ButtonLink
                      href={`/rezervasyon?room=${room.slug}`}
                      size="md"
                      className="!w-full sm:!w-auto"
                    >
                      Rezervasyon
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </section>

      {/* Bilgi bandı */}
      <Reveal className="max-w-4xl mx-auto px-4 sm:px-gutter py-xl text-center">
        <Icon name="spa" className="text-4xl text-secondary mb-sm" />
        <h3 className="font-headline-sm text-headline-sm text-primary mb-sm">
          Konaklamanızı Zenginleştirin
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Tüm konaklama ücretlerimize imza niteliğindeki yerel kahvaltımız ve
          nehir kenarı wellness alanına erişim dahildir.
        </p>
      </Reveal>
    </>
  );
}
