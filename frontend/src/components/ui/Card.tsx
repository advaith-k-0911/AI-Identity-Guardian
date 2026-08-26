import React from "react";
import { cn } from "../../utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "cyber" | "glow" | "subtle";
  glowColor?: "cyan" | "emerald" | "danger" | "amber";
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "cyber",
  glowColor = "emerald",
  ...props
}) => {
  const variantStyles = {
    default: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl",
    cyber: "bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl",
    glow: {
      cyan: "bg-white dark:bg-zinc-900/60 border border-green-500/30 rounded-xl",
      emerald: "bg-white dark:bg-zinc-900/60 border border-green-500/30 rounded-xl",
      danger: "bg-white dark:bg-zinc-900/60 border border-red-500/30 rounded-xl",
      amber: "bg-white dark:bg-zinc-900/60 border border-amber-500/30 rounded-xl",
    }[glowColor],
    subtle: "bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/70 dark:border-zinc-800/60 rounded-lg",
  };

  return (
    <div
      className={cn("p-6 transition-colors", variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn("flex flex-col space-y-1.5 pb-4 border-b border-zinc-200 dark:border-zinc-800", className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3 className={cn("text-lg font-semibold text-black dark:text-white tracking-tight", className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <p className={cn("text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed", className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn("pt-4", className)} {...props}>
    {children}
  </div>
);
