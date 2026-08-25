import React from "react";
import { cn, getScoreColor } from "../../utils";

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  sublabel?: string;
  showValue?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  showValue = true,
  className,
  size = "md",
}) => {
  const percentage = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  const colorInfo = getScoreColor(percentage);

  const heightStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs font-medium">
          <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-sans">
            {label}
            {sublabel && <span className="text-slate-500 dark:text-slate-400 text-[11px]">({sublabel})</span>}
          </span>
          {showValue && (
            <span className={cn("font-mono font-semibold", colorInfo.text)}>
              {value} / {max}
            </span>
          )}
        </div>
      )}
      <div className={cn("w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700/50", heightStyles[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", colorInfo.text.replace("text-", "bg-"))}
          style={{
            width: `${percentage}%`,
            boxShadow: `0 0 10px ${colorInfo.stroke}66`,
          }}
        />
      </div>
    </div>
  );
};
