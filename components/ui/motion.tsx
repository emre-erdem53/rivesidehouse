"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";

// "Modern Nature" estetiğine uygun yumuşak, premium easing eğrisi.
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

type Direction = "up" | "down" | "left" | "right" | "none";

const offsets: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 28 },
  right: { x: -28 },
  none: {},
};

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: Direction;
  amount?: number;
  once?: boolean;
} & Omit<HTMLMotionProps<"div">, "children">;

/** Görünür alana girince yumuşak şekilde beliren bölüm sarmalayıcısı. */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  direction = "up",
  amount = 0.2,
  once = true,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  const off = reduce ? {} : offsets[direction];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...off }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
  once?: boolean;
};

/** Çocuklarını sırayla (kademeli) beliren konteyner. RevealItem ile kullanılır. */
export function RevealStagger({
  children,
  className,
  stagger = 0.12,
  delay = 0,
  amount = 0.2,
  once = true,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

type ItemProps = {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  duration?: number;
};

export function RevealItem({
  children,
  className,
  direction = "up",
  duration = 0.6,
}: ItemProps) {
  const reduce = useReducedMotion();
  const off = reduce ? {} : offsets[direction];

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...off },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export { motion };
