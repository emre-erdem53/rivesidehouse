import type { Metadata } from "next";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/public/ContactForm";
import { Reveal } from "@/components/ui/motion";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Riverside Tiny House ile iletişime geçin ve kaçışınızı planlayın.",
};

export default function ContactPage() {
  return (
    <main className="pt-header pb-xl px-4 sm:px-gutter max-w-container-max mx-auto w-full">
      <Reveal className="mb-xl text-center md:text-left md:w-2/3">
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-md">
          Bizimle İletişime Geçin
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Doğanın el değmemiş köşesindeki sığınağınızı ayarlamak için bize
          ulaşın. Konsiyerjimiz kaçışınızı planlamanız için hazır.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <Reveal direction="left" className="lg:col-span-7 bg-surface/60 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-lg shadow-sm relative overflow-hidden">
          <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] bg-white/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="font-headline-sm text-headline-sm text-primary mb-lg">
            Talep Gönderin
          </h2>
          <ContactForm />
        </Reveal>

        <Reveal direction="right" className="lg:col-span-5 flex flex-col gap-lg">
          <div className="bg-surface-container-low rounded-xl p-md border border-outline-variant/10 flex flex-col gap-md">
            <h3 className="font-headline-sm text-headline-sm text-primary border-b border-outline-variant/10 pb-sm">
              {site.name}
            </h3>
            <div className="flex items-start gap-sm">
              <Icon name="location_on" className="text-secondary" />
              <div>
                <p className="font-label-md text-label-md text-on-surface mb-xs">
                  Adres
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line">
                  {site.contact.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-sm">
              <Icon name="call" className="text-secondary" />
              <div>
                <p className="font-label-md text-label-md text-on-surface mb-xs">
                  Telefon
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {site.contact.phone}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-sm">
              <Icon name="mail" className="text-secondary" />
              <div>
                <p className="font-label-md text-label-md text-on-surface mb-xs">
                  E-posta
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {site.contact.email}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden relative h-[250px] w-full group wood-texture">
            <div className="absolute inset-0 bg-primary/30 backdrop-blur-[1px]" />
            <div className="absolute bottom-0 left-0 p-md">
              <p className="font-label-sm text-label-sm text-on-primary/80 mb-xs">
                Koordinatlar
              </p>
              <p className="font-body-md text-body-md text-on-primary">
                {site.contact.coordinates}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-lg pt-sm">
            <a href={site.social.instagram} className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              Instagram
            </a>
            <a href={site.social.journal} className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              Günlük
            </a>
            <a href={site.social.press} className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              Basın
            </a>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
