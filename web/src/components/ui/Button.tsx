"use client";

import { motion, type TargetAndTransition } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import {
  getButtonClassName,
  buttonMotionHover,
  buttonMotionTap,
  buttonMotionTransition,
  type ButtonSize,
  type ButtonVariant,
} from "@/lib/button-styles";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  className?: string;
  "aria-label"?: string;
  type?: "button" | "submit" | "reset";
}

const motionByVariant: Partial<
  Record<
    ButtonVariant,
    { whileHover?: TargetAndTransition; whileTap?: TargetAndTransition }
  >
> = {
  primary: {
    whileHover: buttonMotionHover,
    whileTap: buttonMotionTap,
  },
  purple: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.97 },
  },
  outline: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.97 },
  },
  "ghost-white": {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.97 },
  },
  "ghost-link": {
    whileHover: { x: 4 },
    whileTap: { scale: 0.98 },
  },
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  target,
  rel,
  onClick,
  className = "",
  "aria-label": ariaLabel,
  type = "button",
}: ButtonProps) {
  const classes = getButtonClassName(variant, size, className);
  const motionProps = {
    ...(motionByVariant[variant] ?? {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.97 },
    }),
    transition: buttonMotionTransition,
  };

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={classes}
        aria-label={ariaLabel}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
