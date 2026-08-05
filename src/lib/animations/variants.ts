import type { Variants, Transition } from "framer-motion";

export const easeOutSoft: Transition = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1],
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: easeOutSoft },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: easeOutSoft },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.12 } },
};

export const slideInLeft: Variants = {
  initial: { x: -16, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: easeOutSoft },
  exit: { x: -12, opacity: 0, transition: { duration: 0.15 } },
};

export const accordionContent: Variants = {
  collapsed: { height: 0, opacity: 0 },
  open: {
    height: "auto",
    opacity: 1,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
};

export const sidebarCollapse: Variants = {
  expanded: { width: 252 },
  collapsed: { width: 72 },
};

export const cardHover = {
  rest: { y: 0, boxShadow: "0 1px 2px rgba(27,29,27,0.06)" },
  hover: {
    y: -2,
    boxShadow: "0 8px 24px rgba(27,29,27,0.08)",
    transition: { duration: 0.15 },
  },
};
