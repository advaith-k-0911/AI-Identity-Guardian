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
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4 text-red-400">
        <AlertOctagon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-red-500 mb-2 font-sans">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-6 leading-relaxed">
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
