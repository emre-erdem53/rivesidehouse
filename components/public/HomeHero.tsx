"use client";

import { motion } from "framer-motion";
import { BookingWidget } from "@/components/public/BookingWidget";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { EASE } from "@/components/ui/motion";
import { site } from "@/lib/site";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function HomeHero({ heroImage }: { heroImage: string }) {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.img
          src={heroImage}
          alt="Riverside Tiny House"
          className="w-full h-full object-cover animate-kenburns"
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 mist-overlay" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-4 sm:px-gutter max-w-4xl mx-auto pt-header pb-24 sm:pb-20 w-full"
      >
        <motion.h1
          variants={item}
          className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-sm"
        >
          Doğanın Kalbinde,
          <br />
          Nehrin Kıyısında
        </motion.h1>
        <motion.p
          variants={item}
          className="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-2xl mx-auto"
        >
          {site.name}, nehrin sesinde lüks ve huzurun buluştuğu eşsiz bir kaçış
          noktası. Ruhunuzu dinlendirin, doğanın nefesini hissedin.
        </motion.p>
        <motion.div variants={item} className="flex justify-center mb-lg sm:mb-xl">
          <ButtonLink href="/odalar" size="lg" className="!w-full max-w-xs sm:!w-auto sm:max-w-none">
            Keşfet
          </ButtonLink>
        </motion.div>

        <motion.div variants={item}>
          <BookingWidget className="max-w-5xl mx-auto" />
        </motion.div>
      </motion.div>

      {/* Aşağı kaydırma ipucu */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-primary"
      >
        <Icon name="keyboard_arrow_down" className="text-3xl animate-scroll-hint" />
      </motion.div>
    </section>
  );
}
