import React from "react";
import { getScoreColor } from "../../utils";

export interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  showAnimation?: boolean;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 180,
  strokeWidth = 14,
  label = "SCORE",
  sublabel,
  showAnimation = true,
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;
  const colorInfo = getScoreColor(clampedScore);

  return (
    <div className="relative inline-flex items-center justify-center flex-col select-none">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ filter: `drop-shadow(0 0 12px ${colorInfo.stroke}33)` }}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Score Bar */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorInfo.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className={showAnimation ? "transition-all duration-1000 ease-out" : ""}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-slate-100">
          {clampedScore}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
          {sublabel || label}
        </span>
        <span className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full ${colorInfo.badge}`}>
          {colorInfo.label}
        </span>
      </div>
    </div>
  );
};
