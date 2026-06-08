import Link from "next/link";
import { site, publicNav } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";
import { LogoLink } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-highest border-t border-outline-variant/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg px-4 sm:px-gutter py-xl max-w-container-max mx-auto">
        <div className="md:col-span-1">
          <LogoLink size="footer" className="mb-md" />
          <p className="font-body-md text-body-md text-on-surface-variant">
            {site.description}
          </p>
        </div>

        <div>
          <h5 className="font-label-md text-label-md text-on-background mb-md uppercase">
            Keşfet
          </h5>
          <ul className="space-y-sm">
            {publicNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="font-label-md text-label-md text-on-background mb-md uppercase">
            İletişim
          </h5>
          <ul className="space-y-sm font-body-md text-body-md text-on-surface-variant">
            <li className="flex items-start gap-xs">
              <Icon name="call" className="text-[18px] mt-[2px] text-secondary" />
              {site.contact.phone}
            </li>
            <li className="flex items-start gap-xs">
              <Icon name="mail" className="text-[18px] mt-[2px] text-secondary" />
              {site.contact.email}
            </li>
            <li className="flex items-start gap-xs">
              <Icon name="location_on" className="text-[18px] mt-[2px] text-secondary" />
              <span className="whitespace-pre-line">{site.contact.address}</span>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-label-md text-label-md text-on-background mb-md uppercase">
            Bülten
          </h5>
          <p className="font-body-md text-body-md text-on-surface-variant mb-sm">
            Doğanın sesinden haberdar olun.
          </p>
          <form className="flex flex-col sm:flex-row gap-xs">
            <input
              className="bg-surface-container-low border border-outline-variant/20 rounded-lg px-sm py-sm w-full min-h-11 text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="E-posta adresiniz"
              type="email"
            />
            <button
              type="submit"
              className="bg-primary text-on-primary min-h-11 px-md rounded-lg shrink-0 flex items-center justify-center touch-manipulation"
              aria-label="Abone ol"
            >
              <Icon name="arrow_forward" />
            </button>
          </form>
        </div>
      </div>

      <div className="px-4 sm:px-gutter py-md border-t border-outline-variant/10 text-center max-w-container-max mx-auto">
        <p className="font-body-md text-body-md text-on-surface-variant/70">
          © {new Date().getFullYear()} {site.name}. Doğanın kalbinden ilhamla.
        </p>
      </div>
    </footer>
  );
}
