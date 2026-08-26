import React from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, Flame } from "lucide-react";
import { RiskLevel, Severity } from "../../types";
import { cn, getSeverityStyle } from "../../utils";

export interface RiskIndicatorProps {
  level: RiskLevel | Severity;
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  level,
  showIcon = true,
  showText = true,
  className,
  size = "md",
}) => {
  const styles = getSeverityStyle(level);

  const getIcon = () => {
    switch (level) {
      case "CRITICAL":
        return <Flame className="w-4 h-4 text-red-400" />;
      case "HIGH":
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case "MEDIUM":
        return <AlertTriangle className="w-4 h-4 text-green-400" />;
      case "LOW":
      default:
        return <ShieldCheck className="w-4 h-4 text-green-400" />;
    }
  };

  const sizeClasses = {
    sm: "text-xs py-0.5 px-2 gap-1",
    md: "text-xs py-1 px-2.5 gap-1.5",
    lg: "text-sm py-1.5 px-3.5 gap-2",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-mono font-semibold uppercase tracking-wider border",
        styles.badge,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && getIcon()}
      {showText && <span>{level} RISK</span>}
    </div>
  );
};
