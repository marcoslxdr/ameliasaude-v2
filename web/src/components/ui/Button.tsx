"use client";

import { motion, type TargetAndTransition } from "framer-motion";
import type { ReactNode } from "react";
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
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
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
  onClick,
  className = "",
  "aria-label": ariaLabel,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const classes = [
    getButtonClassName(variant, size, className),
    disabled ? "pointer-events-none opacity-50" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const motionProps = disabled
    ? {}
    : {
        ...(motionByVariant[variant] ?? {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.97 },
        }),
        transition: buttonMotionTransition,
      };

  if (href) {
    return (
      <motion.a
        href={disabled ? undefined : href}
        onClick={disabled ? undefined : onClick}
        className={classes}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={disabled ? undefined : onClick}
      className={classes}
      aria-label={ariaLabel}
      disabled={disabled}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
