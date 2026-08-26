import React from "react";
import { cn, getSeverityStyle } from "../../utils";
import { Severity, RiskLevel } from "../../types";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  severity?: Severity | RiskLevel;
  variant?: "default" | "outline" | "solid";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  severity,
  variant = "default",
  size = "md",
  ...props
}) => {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold tracking-wide",
  };

  let styleClasses = "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700";

  if (severity) {
    const s = getSeverityStyle(severity);
    styleClasses = s.badge;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border transition-colors select-none uppercase font-mono",
        sizeStyles[size],
        styleClasses,
        className
      )}
      {...props}
    >
      {children || severity}
    </span>
  );
};
