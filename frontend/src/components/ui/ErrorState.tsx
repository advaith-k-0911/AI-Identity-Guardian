import React from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Analysis Error",
  message = "Failed to process the request. Please check your network or server status.",
  onRetry,
}) => {
  return (
    <Card variant="glow" glowColor="danger" className="flex flex-col items-center justify-center p-8 text-center my-6">
      <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400">
        <AlertOctagon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-rose-300 mb-2 font-mono">
        {title}
      </h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Try Again
        </Button>
      )}
    </Card>
  );
};
