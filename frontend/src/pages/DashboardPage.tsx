import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  History,
  Shield,
  Fingerprint,
  EyeOff,
  UserCheck,
  KeyRound,
  LifeBuoy,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Activity,
  User,
} from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ScoreRing } from "../components/ui/ScoreRing";
import { RiskIndicator } from "../components/ui/RiskIndicator";
import { ProgressBar } from "../components/ui/ProgressBar";
import { AdminAnalyticsView } from "../components/admin/AdminAnalyticsView";
import { useAuth } from "../contexts/AuthContext";
import { ReportSummaryResponse, DiessGrade } from "../types";
import { api } from "../services/api";

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [reports, setReports] = useState<ReportSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardView, setDashboardView] = useState<"posture" | "fleet">("posture");

  useEffect(() => {
    loadUserReports();
  }, [isAuthenticated]);

  const loadUserReports = async () => {
    setIsLoading(true);
    try {
      const data = await api.listReports(10);
      setReports(data);
    } catch (e) {
      console.warn("Failed to fetch dashboard reports:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const latestReport = reports.length > 0 ? reports[0] : null;
  const currentDIESS = latestReport ? latestReport.diess_score : 84;
  const currentRisk = latestReport ? latestReport.risk_level : "LOW";

  const getDiessGrade = (score: number): { grade: DiessGrade; color: string } => {
    if (score >= 90) return { grade: "Excellent", color: "text-green-500 border-green-500/30 bg-green-500/10" };
    if (score >= 75) return { grade: "Good", color: "text-green-400 border-green-500/30 bg-green-500/10" };
    if (score >= 50) return { grade: "Medium Risk", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" };
    if (score >= 25) return { grade: "High Risk", color: "text-red-400 border-red-500/30 bg-red-500/10" };
    return { grade: "Critical Risk", color: "text-red-500 border-red-600/30 bg-red-600/10" };
  };

  const gradeInfo = getDiessGrade(currentDIESS);

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <PageHeader
        title="Security Posture Dashboard"
        subtitle={
          isAuthenticated
            ? `Welcome back, ${user?.full_name || user?.email}. All 5 security dimensions are active.`
            : "Review composite DIESS posture metrics and multi-vector threat indicators."
        }
        badge={
          isAuthenticated ? (
            <Badge severity="LOW">AUTHENTICATED</Badge>
          ) : (
            <Badge severity="MEDIUM">ANONYMOUS</Badge>
          )
        }
        actions={
          <div className="flex gap-3">
            <Link to="/scan">
              <Button size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Scan
              </Button>
            </Link>
          </div>
        }
      />

      {/* View Switcher */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 space-x-2">
        <button
          onClick={() => setDashboardView("posture")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
            dashboardView === "posture"
              ? "border-green-500 text-green-600 dark:text-green-400 bg-green-500/5"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Security Posture</span>
        </button>

        <button
          onClick={() => setDashboardView("fleet")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
            dashboardView === "fleet"
              ? "border-green-500 text-green-600 dark:text-green-400 bg-green-500/5"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Global Telemetry</span>
        </button>
      </div>

      {/* Mode 1: Personal Posture */}
      {dashboardView === "posture" && (
        <div className="space-y-10">
          {/* DIESS Composite Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <Card variant="glow" glowColor="emerald" className="lg:col-span-5 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <ScoreRing
                score={currentDIESS}
                size={220}
                strokeWidth={18}
                label="DIESS"
                sublabel="COMPOSITE SCORE"
              />
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <RiskIndicator level={currentRisk} size="md" />
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${gradeInfo.color}`}>
                    Grade: {gradeInfo.grade}
                  </span>
                </div>
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 pt-1">
                  {latestReport
                    ? `Based on: ${latestReport.report_title}`
                    : "Canonical Benchmark Posture"}
                </p>
              </div>
            </Card>

            <Card variant="cyber" className="lg:col-span-7 space-y-5 p-7">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-sans flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400" />
                    DIESS Weight Distribution
                  </CardTitle>
                  <span className="text-xs font-mono text-green-600 dark:text-green-400 font-bold">100%</span>
                </div>
                <CardDescription>
                  5 weighted threat dimensions into a unified 0-100 index.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3.5 font-mono text-xs">
                <ProgressBar
                  value={85}
                  max={100}
                  label="1. Username Threat Exposure"
                  sublabel="Weight: 20%"
                />
                <ProgressBar
                  value={80}
                  max={100}
                  label="2. Privacy Exposure"
                  sublabel="Weight: 25%"
                />
                <ProgressBar
                  value={85}
                  max={100}
                  label="3. Impersonation Resilience"
                  sublabel="Weight: 20%"
                />
                <ProgressBar
                  value={90}
                  max={100}
                  label="4. Credential Security"
                  sublabel="Weight: 20%"
                />
                <ProgressBar
                  value={80}
                  max={100}
                  label="5. Account Recovery"
                  sublabel="Weight: 15%"
                />
              </CardContent>
            </Card>
          </div>

          {/* 5-Vector Module Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-black dark:text-white font-sans flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500 dark:text-green-400" />
                Security Dimensions (5)
              </h3>
              <span className="text-xs font-mono text-green-600 dark:text-green-400">
                ALL ONLINE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Fingerprint, title: "Username Security", desc: "Identifies name leaks, birth years, sequential patterns, and multi-attribute exposures.", weight: "20%", phase: "5" },
                { icon: EyeOff, title: "Privacy Exposure", desc: "Evaluates sensitivity classification, public visibility, and data oversharing risks.", weight: "25%", phase: "6" },
                { icon: UserCheck, title: "Impersonation Detection", desc: "Detects lookalike handles, homoglyph substitutions, and authority role targeting.", weight: "20%", phase: "9" },
                { icon: KeyRound, title: "Credential Security", desc: "Evaluates MFA adoption, password manager isolation, and reuse vulnerabilities.", weight: "20%", phase: "10" },
                { icon: LifeBuoy, title: "Recovery Resiliency", desc: "Audits security questions, backup codes, and recovery channel isolation.", weight: "15%", phase: "11" },
              ].map((mod, idx) => {
                const Icon = mod.icon;
                return (
                  <Card key={idx} variant="cyber" className="hover:border-green-500/40 transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-300 border border-green-500/30">
                          {mod.weight}
                        </span>
                      </div>
                      <h4 className="text-base font-semibold text-black dark:text-white font-sans">{mod.title}</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {mod.desc}
                      </p>
                    </div>
                    <Link to="/scan">
                      <Button variant="outline" size="sm" className="w-full text-xs font-mono">
                        Run Scan
                      </Button>
                    </Link>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Historical Reports */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-black dark:text-white font-sans flex items-center gap-2">
                <History className="w-5 h-5 text-green-500 dark:text-green-400" />
                Recent Audits ({reports.length})
              </h3>
              <Link to="/report" className="text-xs font-mono text-green-600 dark:text-green-400 hover:text-green-500 flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {isLoading ? (
              <Card variant="subtle" className="p-8 text-center text-xs font-mono text-zinc-500">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
                Loading audits...
              </Card>
            ) : reports.length === 0 ? (
              <Card variant="subtle" className="p-8 text-center space-y-3">
                <ShieldCheck className="w-10 h-10 text-zinc-400 mx-auto" />
                <h4 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 font-mono">No Audits Yet</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Run your first identity scan to generate security reports.
                </p>
                <Link to="/scan">
                  <Button size="sm">Start Scan</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-green-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-black dark:text-white font-sans">{rep.report_title}</span>
                        <RiskIndicator level={rep.risk_level} size="sm" />
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{rep.summary}</p>
                      <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                        {new Date(rep.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 self-start sm:self-auto">
                      <span className="text-sm font-bold font-mono text-green-600 dark:text-green-400">
                        DIESS: {rep.diess_score}
                      </span>
                      <Link to={`/report?id=${rep.id}`}>
                        <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Fleet Telemetry */}
      {dashboardView === "fleet" && (
        <AdminAnalyticsView />
      )}
    </div>
  );
};
