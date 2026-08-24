import React, { useState } from "react";
import { ShieldAlert, CheckCircle2, Lightbulb, RefreshCw, Copy, Check, AlertOctagon, ArrowRight } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { ScoreRing } from "../ui/ScoreRing";
import { RiskIndicator } from "../ui/RiskIndicator";
import { ImpersonationAnalysisResult } from "../../types";

export interface ImpersonationResultsViewProps {
  result: ImpersonationAnalysisResult;
  onReset: () => void;
  onNext?: () => void;
}

export const ImpersonationResultsView: React.FC<ImpersonationResultsViewProps> = ({
  result,
  onReset,
  onNext,
}) => {
  const [copiedVariant, setCopiedVariant] = useState<string | null>(null);

  const handleCopy = (variant: string) => {
    navigator.clipboard.writeText(variant);
    setCopiedVariant(variant);
    setTimeout(() => setCopiedVariant(null), 2000);
  };

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
              sublabel="IMPERSONATION RESILIENCE"
            />
          </div>

          {/* Result Highlights */}
          <div className="md:col-span-7 space-y-4 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <RiskIndicator level={result.risk_level} size="md" />
              <span className="font-mono text-xs text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30">
                Susceptibility: <strong>{result.susceptibility_tier}</strong>
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-100 font-sans">
              Impersonation & Clone Risk Assessment
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {result.summary}
            </p>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={onReset}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Scan Another Profile
              </Button>
              {onNext && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNext}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Privacy Scanner
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Lookalike Variants Showcase Grid */}
      {result.lookalike_variants.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-amber-400" />
              High-Risk Lookalike & Spoofing Vectors ({result.lookalike_variants.length})
            </h3>
            <span className="text-xs font-mono text-slate-400">DEFENSIVE MONITORING</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono text-xs">
            {result.lookalike_variants.map((variant, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between group hover:border-amber-500/40 transition-colors"
              >
                <span className="text-slate-300 truncate max-w-[140px]">
                  @{variant}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(variant)}
                  title="Copy Variant Handle"
                  className="p-1 rounded bg-slate-900 text-slate-500 hover:text-amber-300 transition-colors"
                >
                  {copiedVariant === variant ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Findings List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Attack Surface Findings ({result.findings.length})
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
              High Impersonation Resilience
            </h4>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              This handle does not match canonical name structures or high-value authority roles, presenting high resistance to spoofing.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {result.findings.map((finding, idx) => (
              <Card
                key={idx}
                variant="cyber"
                className="hover:border-slate-700 transition-all border-l-4 border-l-amber-500"
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
                    {finding.score_impact > 0 && (
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        -{finding.score_impact} pts
                      </span>
                    )}
                  </div>

                  {/* Finding Explanation */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {finding.description}
                  </p>

                  {/* Recommendation Box */}
                  <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-1">
                    <div className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-bold">
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
