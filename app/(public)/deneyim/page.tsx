import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Deneyim",
  description:
    "Riverside Tiny House'ta wellness, yöresel mutfak ve doğa deneyimleri.",
};

const spaImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCF007pPxI2L-DGE_ndP1izbL3f5eaDSrNdp_W5ThXNum7SirkwL6Mm95O_u9-T1bi3K6vKq4I9nvmsCOXC2qt0X4UMxAPn3VjqZvFLax09XlNErspN5_AoTaH1aLqgvshXnnZsHeKaGF57JDJ4sVFCWtcqfO0UjR2900r8I_znw7Jb5SvEm6aTvcBjwk4vuN0oLunU9Fz8Egmn_JBAyEH_MnU6bH8i5s6nmJm6inaFRUxHjU-yA7Ga228xlz2Pc0fhjUaXUqHqc8Q";
const diningImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCYT-wmAFusFZ0vkDEIRE_TtdYt2lIwk0dbnpLpJZ84UQHZpEHwnWxdPMSOgHcNQ4l1vpq5bFm2n1k3TYD6KqI4g8RdM9OL9aZmSdZ9Ad7BE7VavNLtG_fDaitYfL21LK5nslvRHkzarLfpjExg6C0kIh1MJXKuk4La3hMzEaEA3_bBvnuJG6RByuvTUBEfv7uNakCgp7XOuHv5Ka9lCnWlsidLmYciBIBq-_cBz0Blsn2DV5pyf0127P713bmKjSP7BQhqYiair-w";

export default function ExperiencePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-header pb-xl px-gutter text-center">
        <Reveal className="max-w-2xl mx-auto">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-sm">
            Beslen &amp; Yenilen
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Nehrin şifalı atmosferine kapılın. Doğaya kök salmış mutfak
            geleneklerini ve suyun sesinden ilham alan wellness ritüellerini
            deneyimleyin.
          </p>
        </Reveal>
      </section>

      {/* Wellness bento */}
      <section className="py-md px-gutter max-w-container-max mx-auto">
        <Reveal className="mb-lg">
          <h2 className="font-headline-md text-headline-md text-primary mb-xs">
            Nehir Kenarı Wellness
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
            Bölgenin ham, organik güzelliğinden beslenen tedavilerimiz, bedeni ve
            zihni yenilemek için tasarlandı.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-sm auto-rows-[300px]">
          <div className="md:col-span-8 md:row-span-2 relative rounded-xl overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={spaImage}
              alt="Cloud Bath"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-lg w-full mist-glass">
              <h3 className="font-headline-sm text-headline-sm text-primary mb-xs">
                Nehir Banyosu Deneyimi
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                Nehir manzarasıyla çevrili termal havuzlarımızda süzülün. Gerçek
                anlamda ağırlıksız bir kaçış.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 rounded-xl overflow-hidden relative wood-texture border border-outline-variant/20 ultra-soft-shadow">
            <div className="absolute inset-0 p-md flex flex-col justify-center items-center text-center mist-glass m-sm rounded-lg">
              <Icon
                name="self_improvement"
                fill
                className="text-[48px] text-surface-tint mb-sm"
              />
              <h3 className="font-headline-sm text-headline-sm text-primary mb-xs">
                Bilinçli Hareket
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Nehre bakan rehberli yoga ve meditasyon.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 rounded-xl overflow-hidden relative bg-surface-container-low border border-outline-variant/10 flex flex-col justify-center p-lg">
            <Icon name="local_cafe" className="text-3xl text-secondary mb-sm" />
            <h3 className="font-headline-sm text-headline-sm text-primary mb-xs">
              Çay Ritüelleri
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Yöresel olarak hasat edilen Karadeniz çayı infüzyonları.
            </p>
          </div>
        </div>
      </section>

      {/* Dining */}
      <section className="py-xl px-gutter max-w-container-max mx-auto">
        <Reveal className="bg-surface-container-low rounded-[40px] p-lg md:p-xl ultra-soft-shadow flex flex-col md:flex-row items-center gap-xl">
          <div className="md:w-5/12">
            <div className="inline-block px-3 py-1 bg-secondary-container/40 text-on-secondary-container rounded-full font-label-sm text-label-sm mb-md">
              Yöresel Lezzetler
            </div>
            <h2 className="font-display-lg text-display-lg-mobile md:text-headline-md text-primary mb-md leading-tight">
              Doğanın Tadı
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
              Mutfak felsefemiz engebeli araziye saygı duyar. Toplar, yerel
              zanaatkarlardan temin eder ve Karadeniz&apos;in zengin toprağının
              hikayesini anlatan tabaklar hazırlarız.
            </p>
            <ul className="space-y-sm mb-lg">
              {[
                { icon: "restaurant_menu", label: "Mevsimsel Toplama Menüsü" },
                { icon: "local_cafe", label: "Zanaatkar Çay Eşleşmeleri" },
                { icon: "outdoor_grill", label: "Açık Ateşte Pişirme" },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-sm border-b border-outline-variant/20 pb-sm"
                >
                  <Icon name={item.icon} className="text-surface-tint" />
                  <span className="font-body-md text-body-md text-on-surface">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
            <ButtonLink href="/iletisim" size="lg">
              Masa Ayırt
            </ButtonLink>
          </div>
          <div className="md:w-7/12 relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl shadow-primary/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={diningImage}
              alt="Yöresel mutfak"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-md left-md mist-glass p-md rounded-lg max-w-[220px] border border-surface/50">
              <p className="font-label-sm text-label-sm text-primary mb-xs">
                Öne Çıkan Lezzet
              </p>
              <p className="font-body-md text-body-md text-on-surface font-medium">
                Toplama Otlar ve Tütsülenmiş Tereyağıyla Nehir Alabalığı
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
