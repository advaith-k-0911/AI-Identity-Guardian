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
    default: "bg-white dark:bg-slate-900/80 border border-emerald-200 dark:border-slate-800 rounded-xl shadow-sm",
    cyber: "cyber-glass rounded-xl",
    glow: {
      cyan: "cyber-glass rounded-xl border-cyan-500/40 shadow-glow-cyan",
      emerald: "cyber-glass rounded-xl border-emerald-500/40 shadow-glow-emerald",
      danger: "cyber-glass rounded-xl border-rose-500/40 shadow-glow-danger",
      amber: "cyber-glass rounded-xl border-amber-500/40 shadow-[0_0_20px_-3px_rgba(245,158,11,0.3)]",
    }[glowColor],
    subtle: "bg-emerald-50/60 dark:bg-slate-900/40 border border-emerald-200/70 dark:border-slate-800/60 rounded-lg",
  };

  return (
    <div
      className={cn("p-6 transition-all duration-300", variantStyles[variant], className)}
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
  <div className={cn("flex flex-col space-y-1.5 pb-4 border-b border-emerald-500/15 dark:border-slate-800/80", className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3 className={cn("text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight", className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <p className={cn("text-sm text-slate-600 dark:text-slate-400 leading-relaxed", className)} {...props}>
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
