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
      stroke: "#22c55e",
      text: "text-green-500",
      bg: "bg-green-500/10",
      badge: "border-green-500/30 text-green-400 bg-green-500/10",
      label: "LOW RISK",
    }
  } else if (score >= 60) {
    return {
      stroke: "#22c55e",
      text: "text-green-400",
      bg: "bg-green-500/10",
      badge: "border-green-500/30 text-green-300 bg-green-500/10",
      label: "MODERATE",
    }
  } else if (score >= 35) {
    return {
      stroke: "#f59e0b",
      text: "text-amber-400",
      bg: "bg-amber-500/10",
      badge: "border-amber-500/30 text-amber-300 bg-amber-500/10",
      label: "HIGH RISK",
    }
  } else {
    return {
      stroke: "#ef4444",
      text: "text-red-400",
      bg: "bg-red-500/10",
      badge: "border-red-500/30 text-red-300 bg-red-500/10",
      label: "CRITICAL",
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
        badge: "bg-red-500/15 text-red-400 border-red-500/30",
        border: "border-red-500/40",
        glow: "",
      }
    case "HIGH":
      return {
        badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        border: "border-amber-500/40",
        glow: "",
      }
    case "MEDIUM":
      return {
        badge: "bg-green-500/15 text-green-400 border-green-500/30",
        border: "border-green-500/40",
        glow: "",
      }
    case "LOW":
    default:
      return {
        badge: "bg-green-500/15 text-green-400 border-green-500/30",
        border: "border-green-500/40",
        glow: "",
      }
  }
}
