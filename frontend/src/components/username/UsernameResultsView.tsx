import React from "react";
import { AlertCircle, RefreshCw, CheckCircle2, Lightbulb, ArrowRight, Tag } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { ScoreRing } from "../ui/ScoreRing";
import { RiskIndicator } from "../ui/RiskIndicator";
import { UsernameAnalysisResult } from "../../types";

export interface UsernameResultsViewProps {
  result: UsernameAnalysisResult;
  onReset: () => void;
  onNext?: () => void;
}

export const UsernameResultsView: React.FC<UsernameResultsViewProps> = ({
  result,
  onReset,
  onNext,
}) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Overview Score Card */}
      <Card variant="cyber" className="relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Score Ring Gauge */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
            <ScoreRing
              score={result.score}
              size={190}
              strokeWidth={15}
              label="SCORE"
              sublabel="USERNAME SECURITY"
            />
          </div>

          {/* Result Highlights */}
          <div className="md:col-span-7 space-y-4 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <RiskIndicator level={result.risk_level} size="md" />
              <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                Handle: <strong className="text-cyan-300">@{result.username}</strong>
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-100 font-sans">
              Username Exposure Assessment
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {result.summary}
            </p>

            {/* Pattern Badges */}
            {result.detected_patterns.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" />
                  Identified Threat Patterns:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.detected_patterns.map((pattern, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300"
                    >
                      {pattern.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap gap-3 items-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={onReset}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Scan Another Handle
              </Button>
              {onNext && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNext}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Privacy Analysis
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Findings List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-cyan-400" />
            Security Findings ({result.findings.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">
            DETERMINISTIC EVALUATION
          </span>
        </div>

        {result.findings.length === 0 ? (
          <Card variant="subtle" className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-emerald-300 font-sans">
              Zero Exposure Detected
            </h4>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              This username handle does not leak your real name, birth year, sequential digits, or identifiable personal patterns.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {result.findings.map((finding, idx) => (
              <Card
                key={idx}
                variant="cyber"
                className="hover:border-slate-700 transition-all border-l-4 border-l-cyan-500"
              >
                <div className="space-y-3">
                  {/* Finding Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Badge severity={finding.severity}>
                        {finding.severity}
                      </Badge>
                      <h4 className="text-base font-semibold text-slate-100 font-sans">
                        {finding.title}
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      -{finding.score_impact} pts
                    </span>
                  </div>

                  {/* Finding Explanation */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {finding.description}
                  </p>

                  {/* Recommendation Box */}
                  <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 space-y-1">
                    <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-bold">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Recommended Action:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {finding.recommendation}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
