"use client";

import { motion } from "framer-motion";
import { EASE } from "@/components/ui/motion";

/**
 * Genel site sayfa geçiş animasyonu. Her rota değişiminde yeniden monte edilir,
 * içeriği yumuşak bir şekilde belirir.
 */
export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
