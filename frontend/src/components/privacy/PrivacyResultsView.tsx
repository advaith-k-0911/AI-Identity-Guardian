import React from "react";
import { CheckCircle2, Lightbulb, RefreshCw, ShieldAlert, Fingerprint } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { ScoreRing } from "../ui/ScoreRing";
import { RiskIndicator } from "../ui/RiskIndicator";
import { PrivacyAnalysisResult } from "../../types";

export interface PrivacyResultsViewProps {
  result: PrivacyAnalysisResult;
  onReset: () => void;
  onSwitchToUsername?: () => void;
}

export const PrivacyResultsView: React.FC<PrivacyResultsViewProps> = ({
  result,
  onReset,
  onSwitchToUsername,
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
              sublabel="PRIVACY SECURITY"
            />
          </div>

          {/* Result Highlights & Metrics */}
          <div className="md:col-span-7 space-y-4 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <RiskIndicator level={result.risk_level} size="md" />
              <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                Total Findings: <strong className="text-emerald-400">{result.findings.length}</strong>
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-100 font-sans">
              Privacy Exposure Breakdown
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {result.summary}
            </p>

            {/* Exposure Counters */}
            <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-slate-400">Exposed Sensitive Items:</span>
                <div className="text-lg font-bold text-rose-400">
                  {result.exposed_sensitive_count}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-slate-400">Unnecessary Public Data:</span>
                <div className="text-lg font-bold text-amber-400">
                  {result.unnecessary_exposed_count}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={onReset}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Reconfigure Profile Settings
              </Button>
              {onSwitchToUsername && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSwitchToUsername}
                  leftIcon={<Fingerprint className="w-4 h-4" />}
                >
                  Scan Username Handle
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
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            Exposure & Minimization Findings ({result.findings.length})
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
              Optimal Privacy Posture
            </h4>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              No sensitive attributes are publicly exposed, and optional profile data is strictly minimized.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {result.findings.map((finding, idx) => (
              <Card
                key={idx}
                variant="cyber"
                className="hover:border-slate-700 transition-all border-l-4 border-l-emerald-500"
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
                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                    <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-bold">
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
