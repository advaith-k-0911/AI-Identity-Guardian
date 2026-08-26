import React from "react";
import { ShieldAlert, CheckCircle2, Lightbulb, RefreshCw, ArrowRight, ShieldCheck } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { ScoreRing } from "../ui/ScoreRing";
import { RiskIndicator } from "../ui/RiskIndicator";
import { CredentialAnalysisResult } from "../../types";

export interface CredentialResultsViewProps {
  result: CredentialAnalysisResult;
  onReset: () => void;
  onNext?: () => void;
}

export const CredentialResultsView: React.FC<CredentialResultsViewProps> = ({ result, onReset, onNext }) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card variant="cyber">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
            <ScoreRing score={result.score} size={190} strokeWidth={15} label="SCORE" sublabel="CREDENTIAL HYGIENE" />
          </div>

          <div className="md:col-span-7 space-y-4 text-left">
            <div className="flex flex-wrap items-center gap-3">
              <RiskIndicator level={result.risk_level} size="md" />
              <span className="font-mono text-xs text-zinc-500 bg-zinc-50 dark:bg-black px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800">
                MFA: <strong className="text-green-600 dark:text-green-400">{result.mfa_posture.split("(")[0]}</strong>
              </span>
            </div>

            <h2 className="text-2xl font-bold text-black dark:text-white font-sans">Credential Posture</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{result.summary}</p>

            <div className="pt-1 flex flex-wrap gap-2 text-xs font-mono text-zinc-500">
              <span>Reuse Risk: <strong className="text-zinc-700 dark:text-zinc-300">{result.reuse_risk_tier}</strong></span>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Button variant="secondary" size="sm" onClick={onReset} leftIcon={<RefreshCw className="w-4 h-4" />}>Re-evaluate</Button>
              {onNext && <Button variant="outline" size="sm" onClick={onNext} rightIcon={<ArrowRight className="w-4 h-4" />}>Next: Recovery</Button>}
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-black dark:text-white font-sans flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-green-500" /> Findings ({result.findings.length})
          </h3>
          <span className="text-xs font-mono text-zinc-500">ZERO-KNOWLEDGE AUDIT</span>
        </div>

        {result.findings.length === 0 ? (
          <Card variant="subtle" className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-green-600 dark:text-green-400 font-sans">Zero-Trust Posture</h4>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">No credential vulnerabilities detected.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {result.findings.map((finding, idx) => (
              <Card key={idx} variant="cyber" className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-all border-l-4 border-l-green-500">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Badge severity={finding.severity}>{finding.severity}</Badge>
                      <h4 className="text-base font-semibold text-black dark:text-white font-sans">{finding.title}</h4>
                    </div>
                    {finding.score_impact > 0 && (
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        -{finding.score_impact} pts
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{finding.description}</p>
                  <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 space-y-1">
                    <div className="text-xs font-mono uppercase tracking-wider text-green-600 dark:text-green-400 flex items-center gap-1.5 font-bold">
                      <Lightbulb className="w-3.5 h-3.5" /> Remediation:
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{finding.recommendation}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {result.recommendations.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-lg font-bold text-black dark:text-white font-sans flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" /> Action Plan
          </h3>
          <div className="space-y-2 font-mono text-xs">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
