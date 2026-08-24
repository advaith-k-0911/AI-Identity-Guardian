import React from "react";
import { ShieldAlert, CheckCircle2, Lightbulb, RefreshCw, ArrowRight, ShieldCheck } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { ScoreRing } from "../ui/ScoreRing";
import { RiskIndicator } from "../ui/RiskIndicator";
import { RecoveryAnalysisResult } from "../../types";

export interface RecoveryResultsViewProps {
  result: RecoveryAnalysisResult;
  onReset: () => void;
  onNext?: () => void;
}

export const RecoveryResultsView: React.FC<RecoveryResultsViewProps> = ({
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
              sublabel="RECOVERY RESILIENCE"
            />
          </div>

          {/* Result Highlights */}
          <div className="md:col-span-7 space-y-4 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <RiskIndicator level={result.risk_level} size="md" />
              <span className="font-mono text-xs text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/30">
                Resilience: <strong>{result.recovery_resilience_tier.split("(")[0]}</strong>
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-100 font-sans">
              Account Recovery & Fallback Posture
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {result.summary}
            </p>

            <div className="pt-1 flex flex-wrap gap-2 text-xs font-mono text-slate-400">
              <span>Emergency Codes: <strong className="text-slate-200">{result.backup_codes_status_summary}</strong></span>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={onReset}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Re-evaluate Recovery
              </Button>
              {onNext && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNext}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Return to Dashboard
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
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            Account Recovery Findings ({result.findings.length})
          </h3>
          <span className="text-xs font-mono text-slate-400">
            ZERO-KNOWLEDGE AUDIT
          </span>
        </div>

        {result.findings.length === 0 ? (
          <Card variant="subtle" className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-emerald-300 font-sans">
              Hardened Recovery Architecture
            </h4>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              No critical recovery vulnerabilities detected. Knowledge-based questions are disabled, emergency codes are securely preserved, and recovery channels are insulated from public OSINT.
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
                  <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 space-y-1">
                    <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-bold">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Remediation Action:
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

      {/* Prioritized Recommendations Checklist */}
      {result.recommendations.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Account Recovery Hardening Plan
          </h3>
          <div className="space-y-2 font-mono text-xs">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-slate-300 leading-relaxed font-sans">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
