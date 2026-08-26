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
      setError(err.message || "Failed to load analytics.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingState title="Loading Telemetry..." message="Computing fleet metrics." />;
  if (error || !analytics) return <ErrorState title="Telemetry Error" message={error || "Could not retrieve analytics."} onRetry={loadAnalytics} />;

  const { risk_distribution, improvement_trends } = analytics;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-black dark:text-white font-sans flex items-center gap-2">
              Privacy-Preserving Telemetry
              <Badge severity="LOW">ZERO-PII</Badge>
            </h3>
            <p className="text-xs font-mono text-zinc-500">Aggregated statistics across all audits.</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={loadAnalytics} leftIcon={<RefreshCw className="w-4 h-4" />}>
          Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Audits", value: analytics.total_scans, icon: Activity },
          { label: "Registered Users", value: analytics.total_users, icon: Users },
          { label: "Saved Reports", value: analytics.total_reports, icon: FileText },
          { label: "Avg Improvement", value: `+${improvement_trends.average_improvement_delta}`, icon: TrendingUp, valueColor: "text-green-500" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} variant="cyber" className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500 uppercase">{stat.label}</span>
                <Icon className="w-4 h-4 text-green-500 dark:text-green-400" />
              </div>
              <div className={`text-2xl font-bold font-mono ${stat.valueColor || "text-black dark:text-white"}`}>
                {stat.value}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Global DIESS & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <Card variant="glow" glowColor="emerald" className="lg:col-span-5 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <ScoreRing score={analytics.average_diess} size={200} strokeWidth={16} label="AVERAGE" sublabel="FLEET DIESS" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 font-sans">Global Fleet Posture</h4>
            <p className="text-xs font-mono text-zinc-500">Mean score across all audits</p>
          </div>
        </Card>

        <Card variant="cyber" className="lg:col-span-7 p-6 space-y-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-sans flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500 dark:text-green-400" />
              Risk Distribution
            </CardTitle>
            <CardDescription>Accounts by risk severity tier.</CardDescription>
          </CardHeader>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className="p-3.5 rounded-lg bg-green-500/10 border border-green-500/30 space-y-1">
              <span className="text-[11px] text-green-600 dark:text-green-300 uppercase block">Low</span>
              <span className="text-xl font-bold text-green-500">{risk_distribution.low_risk}</span>
            </div>
            <div className="p-3.5 rounded-lg bg-green-500/5 border border-green-500/20 space-y-1">
              <span className="text-[11px] text-green-600 dark:text-green-300 uppercase block">Medium</span>
              <span className="text-xl font-bold text-green-400">{risk_distribution.medium_risk}</span>
            </div>
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-1">
              <span className="text-[11px] text-amber-500 uppercase block">High</span>
              <span className="text-xl font-bold text-amber-500">{risk_distribution.high_risk}</span>
            </div>
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 space-y-1">
              <span className="text-[11px] text-red-500 uppercase block">Critical</span>
              <span className="text-xl font-bold text-red-500">{risk_distribution.critical_risk}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>Improved: <strong className="text-green-500">{improvement_trends.improved_scans_count}</strong></span>
            <span>Degraded: <strong className="text-red-500">{improvement_trends.degraded_scans_count}</strong></span>
            <span>Stable: <strong className="text-zinc-600 dark:text-zinc-300">{improvement_trends.stable_scans_count}</strong></span>
          </div>
        </Card>
      </div>

      {/* Top Categories & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card variant="cyber" className="lg:col-span-6 p-6 space-y-4">
          <h4 className="text-base font-bold text-black dark:text-white font-sans flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" /> Top Vulnerability Categories
          </h4>
          {analytics.top_vulnerability_categories.length === 0 ? (
            <p className="text-xs font-mono text-zinc-500">No categories recorded yet.</p>
          ) : (
            <div className="space-y-3 font-mono text-xs">
              {analytics.top_vulnerability_categories.map((cat, idx) => (
                <ProgressBar key={idx} value={cat.percentage} max={100} label={cat.category} sublabel={`${cat.count} findings`} />
              ))}
            </div>
          )}
        </Card>

        <Card variant="cyber" className="lg:col-span-6 p-6 space-y-4">
          <h4 className="text-base font-bold text-black dark:text-white font-sans flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" /> Top Recommendations
          </h4>
          {analytics.top_remediation_actions.length === 0 ? (
            <p className="text-xs font-mono text-zinc-500">No recommendations recorded yet.</p>
          ) : (
            <div className="space-y-2.5 font-mono text-xs">
              {analytics.top_remediation_actions.map((rec, i) => (
                <div key={i} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-3">
                  <span className="text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans line-clamp-2">{rec.recommendation}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20 whitespace-nowrap flex-shrink-0">
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
