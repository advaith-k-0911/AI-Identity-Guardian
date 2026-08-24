import React from "react";
import { Loader2 } from "lucide-react";
import { Card } from "./Card";

export interface LoadingStateProps {
  title?: string;
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = "Analyzing Identity Posture...",
  message = "Executing deterministic risk evaluation across identity vectors.",
}) => {
  return (
    <Card variant="cyber" className="flex flex-col items-center justify-center p-12 text-center my-8">
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 animate-ping absolute" />
        <div className="w-16 h-16 rounded-full border-2 border-cyan-500/40 border-t-cyan-400 animate-spin" />
        <Loader2 className="w-8 h-8 text-cyan-400 absolute" />
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2 font-mono">
        {title}
      </h3>
      <p className="text-sm text-slate-400 max-w-md">
        {message}
      </p>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-mono">
        <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        PRIVACY-FIRST ZERO RETENTION ENGINE
      </div>
    </Card>
  );
};
