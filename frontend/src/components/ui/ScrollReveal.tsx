import React from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "left" | "right" | "scale";
  className?: string;
  delay?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = "up",
  className = "",
  delay = 0,
}) => {
  const { ref, isVisible } = useScrollReveal();

  const dirClass =
    direction === "left"
      ? "scroll-reveal-left"
      : direction === "right"
      ? "scroll-reveal-right"
      : direction === "scale"
      ? "scroll-reveal-scale"
      : "scroll-reveal";

  return (
    <div
      ref={ref}
      className={`${dirClass} ${isVisible ? "revealed" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};
