"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { publicNav } from "@/lib/site";
import { LogoLink } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { clsx } from "@/lib/clsx";
import { EASE } from "@/components/ui/motion";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      id="site-header"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={clsx(
        "fixed top-0 w-full z-50 overflow-visible bg-surface/70 backdrop-blur-xl transition-shadow duration-300",
        scrolled ? "shadow-md shadow-on-surface-variant/10" : "shadow-sm shadow-on-surface-variant/5"
      )}
    >
      <nav className="flex justify-between items-center gap-sm px-gutter py-sm md:py-md max-w-container-max mx-auto">
        <LogoLink size="header" />

        <div className="hidden md:flex gap-lg lg:gap-xl items-center">
          {publicNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "relative py-1 text-[18px] lg:text-[20px] leading-snug font-medium transition-colors duration-300 group",
                  active ? "text-primary" : "text-on-surface-variant hover:text-primary"
                )}
              >
                {item.label}
                <span
                  className={clsx(
                    "absolute -bottom-1.5 left-0 h-0.5 bg-primary transition-all duration-300",
                    active ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-md">
          <ButtonLink
            href="/rezervasyon"
            size="md"
            className="hidden sm:inline-flex min-h-11 px-lg py-sm text-[15px] md:min-h-12 md:px-xl md:py-base md:text-base"
          >
            Rezervasyon Yap
          </ButtonLink>
          <button
            className="md:hidden text-primary p-2 -mr-1"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menü"
          >
            <Icon name={open ? "close" : "menu"} className="text-4xl" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="md:hidden overflow-hidden border-t border-outline-variant/10 bg-surface/95 backdrop-blur-xl"
          >
            <div className="px-gutter py-lg flex flex-col gap-md">
              {publicNav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.05, duration: 0.3, ease: EASE }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-1 text-[18px] font-medium text-on-surface-variant hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <ButtonLink
                href="/rezervasyon"
                size="lg"
                className="mt-sm self-start min-h-12 px-xl text-base"
              >
                Rezervasyon Yap
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
