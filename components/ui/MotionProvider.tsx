"use client";

import { MotionConfig } from "framer-motion";

/** Genel site geneli hareket yapılandırması; kullanıcının "reduce motion" tercihine uyar. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
