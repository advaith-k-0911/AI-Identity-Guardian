import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { RiskLevel, Severity } from "../types"

/**
 * Merge Tailwind class names safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get score color configuration based on 0-100 value
 */
export function getScoreColor(score: number): {
  stroke: string;
  text: string;
  bg: string;
  badge: string;
  label: string;
} {
  if (score >= 85) {
    return {
      stroke: "#10b981", // emerald-500
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      badge: "border-emerald-500/30 text-emerald-300 bg-emerald-500/10",
      label: "LOW RISK",
    }
  } else if (score >= 60) {
    return {
      stroke: "#06b6d4", // cyan-500
      text: "text-cyan-400",
      bg: "bg-cyan-500/10",
      badge: "border-cyan-500/30 text-cyan-300 bg-cyan-500/10",
      label: "MODERATE",
    }
  } else if (score >= 35) {
    return {
      stroke: "#f59e0b", // amber-500
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      badge: "border-amber-500/30 text-amber-300 bg-amber-500/10",
      label: "HIGH RISK",
    }
  } else {
    return {
      stroke: "#ef4444", // red-500
      text: "text-rose-400",
      bg: "bg-rose-500/10",
      badge: "border-rose-500/30 text-rose-300 bg-rose-500/10",
      label: "CRITICAL RISK",
    }
  }
}

/**
 * Get visual styling classes for a severity level
 */
export function getSeverityStyle(severity: Severity | RiskLevel): {
  badge: string;
  border: string;
  glow: string;
} {
  switch (severity) {
    case "CRITICAL":
      return {
        badge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        border: "border-rose-500/40",
        glow: "shadow-[0_0_15px_rgba(244,63,94,0.2)]",
      }
    case "HIGH":
      return {
        badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        border: "border-amber-500/40",
        glow: "shadow-[0_0_15px_rgba(245,158,11,0.2)]",
      }
    case "MEDIUM":
      return {
        badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
        border: "border-cyan-500/40",
        glow: "shadow-[0_0_15px_rgba(6,182,212,0.2)]",
      }
    case "LOW":
    default:
      return {
        badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        border: "border-emerald-500/40",
        glow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]",
      }
  }
}
