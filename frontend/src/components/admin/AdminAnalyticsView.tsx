import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Shield,
  Users,
  FileText,
  TrendingUp,
  Activity,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { ScoreRing } from "../ui/ScoreRing";
import { ProgressBar } from "../ui/ProgressBar";
import { LoadingState } from "../ui/LoadingState";
import { ErrorState } from "../ui/ErrorState";
import { AdminAnalyticsResponse } from "../../types";
import { api } from "../../services/api";

export const AdminAnalyticsView: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getAdminAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      console.error("Failed to load admin analytics:", err);
      setError(err.message || "Failed to load aggregated administrative telemetry.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingState
        title="Aggregating Systemwide Telemetry..."
        message="Computing zero-PII fleet posture metrics, threat category distributions, and improvement trajectories."
      />
    );
  }

  if (error || !analytics) {
    return (
      <ErrorState
        title="Telemetry Aggregation Error"
        message={error || "Could not retrieve administrative analytics."}
        onRetry={loadAnalytics}
      />
    );
  }

  const { risk_distribution, improvement_trends } = analytics;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl cyber-glass border border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 font-sans flex items-center gap-2">
              Privacy-Preserving Telemetry
              <Badge severity="LOW">ZERO-PII</Badge>
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Aggregated cryptographic statistics across all system audits. No personal identifiers exposed.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={loadAnalytics}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Refresh Telemetry
        </Button>
      </div>

      {/* Fleet High-Level Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="cyber" className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Total Audits</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            {analytics.total_scans}
          </div>
          <span className="text-[11px] font-mono text-slate-500 block">
            Across all 5 threat vectors
          </span>
        </Card>

        <Card variant="cyber" className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Registered Agents</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            {analytics.total_users}
          </div>
          <span className="text-[11px] font-mono text-slate-500 block">
            Protected digital identities
          </span>
        </Card>

        <Card variant="cyber" className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Persisted Audits</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            {analytics.total_reports}
          </div>
          <span className="text-[11px] font-mono text-slate-500 block">
            Official immutable records
          </span>
        </Card>

        <Card variant="cyber" className="p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Avg Improvement</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            +{improvement_trends.average_improvement_delta} pts
          </div>
          <span className="text-[11px] font-mono text-slate-500 block">
            Progress on repeated scans
          </span>
        </Card>
      </div>

      {/* Global Average DIESS & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <Card variant="glow" glowColor="cyan" className="lg:col-span-5 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <ScoreRing
            score={analytics.average_diess}
            size={200}
            strokeWidth={16}
            label="AVERAGE"
            sublabel="FLEET DIESS INDEX"
          />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-200 font-sans">
              Global Fleet Security Posture
            </h4>
            <p className="text-xs font-mono text-slate-400">
              Aggregated mean score across all completed identity audits
            </p>
          </div>
        </Card>

        <Card variant="cyber" className="lg:col-span-7 p-6 space-y-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-sans flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              Global Risk Level Distribution
            </CardTitle>
            <CardDescription>
              Proportion of evaluated accounts classified across standard risk severity tiers.
            </CardDescription>
          </CardHeader>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-1">
              <span className="text-[11px] text-emerald-300 uppercase block">Low Risk</span>
              <span className="text-xl font-bold text-emerald-400">{risk_distribution.low_risk}</span>
            </div>
            <div className="p-3.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 space-y-1">
              <span className="text-[11px] text-cyan-300 uppercase block">Medium Risk</span>
              <span className="text-xl font-bold text-cyan-400">{risk_distribution.medium_risk}</span>
            </div>
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-1">
              <span className="text-[11px] text-amber-300 uppercase block">High Risk</span>
              <span className="text-xl font-bold text-amber-400">{risk_distribution.high_risk}</span>
            </div>
            <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 space-y-1">
              <span className="text-[11px] text-rose-300 uppercase block">Critical</span>
              <span className="text-xl font-bold text-rose-400">{risk_distribution.critical_risk}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Improved Scans: <strong className="text-emerald-400">{improvement_trends.improved_scans_count}</strong></span>
            <span>Degraded: <strong className="text-rose-400">{improvement_trends.degraded_scans_count}</strong></span>
            <span>Stable: <strong className="text-slate-300">{improvement_trends.stable_scans_count}</strong></span>
          </div>
        </Card>
      </div>

      {/* Top Threat Categories & Remediation Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Threat Categories */}
        <Card variant="cyber" className="lg:col-span-6 p-6 space-y-4">
          <h4 className="text-base font-bold text-slate-100 font-sans flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Top Vulnerability Categories
          </h4>

          {analytics.top_vulnerability_categories.length === 0 ? (
            <p className="text-xs font-mono text-slate-500">No vulnerability categories recorded yet.</p>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              {analytics.top_vulnerability_categories.map((cat, idx) => (
                <ProgressBar
                  key={idx}
                  value={cat.percentage}
                  max={100}
                  label={`${cat.category}`}
                  sublabel={`${cat.count} findings (${cat.percentage}%)`}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Top Recommendations */}
        <Card variant="cyber" className="lg:col-span-6 p-6 space-y-4">
          <h4 className="text-base font-bold text-slate-100 font-sans flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Most Frequent Defensive Recommendations
          </h4>

          {analytics.top_remediation_actions.length === 0 ? (
            <p className="text-xs font-mono text-slate-500">No remediation actions recorded yet.</p>
          ) : (
            <div className="space-y-2.5 font-mono text-xs">
              {analytics.top_remediation_actions.map((rec, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3"
                >
                  <span className="text-slate-300 leading-relaxed font-sans line-clamp-2">
                    {rec.recommendation}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 whitespace-nowrap flex-shrink-0">
                    {rec.frequency}x
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
