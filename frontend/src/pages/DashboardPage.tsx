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

  // Compute latest score if reports exist, else display default benchmark
  const latestReport = reports.length > 0 ? reports[0] : null;
  const currentDIESS = latestReport ? latestReport.diess_score : 84;
  const currentRisk = latestReport ? latestReport.risk_level : "LOW";

  const getDiessGrade = (score: number): { grade: DiessGrade; color: string } => {
    if (score >= 90) return { grade: "Excellent", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" };
    if (score >= 75) return { grade: "Good", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" };
    if (score >= 50) return { grade: "Medium Risk", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" };
    if (score >= 25) return { grade: "High Risk", color: "text-rose-400 border-rose-500/30 bg-rose-500/10" };
    return { grade: "Critical Risk", color: "text-rose-500 border-rose-600/30 bg-rose-600/10" };
  };

  const gradeInfo = getDiessGrade(currentDIESS);

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <PageHeader
        title="Security Posture & Telemetry Dashboard"
        subtitle={
          isAuthenticated
            ? `Welcome back, ${user?.full_name || user?.email}. All 5 defensive identity dimensions and fleet telemetry are active.`
            : "Review composite DIESS posture metrics, multi-vector threat indicators, and privacy-preserving fleet telemetry."
        }
        badge={
          isAuthenticated ? (
            <Badge severity="LOW">AUTHENTICATED AGENT</Badge>
          ) : (
            <Badge severity="MEDIUM">ANONYMOUS SESSION</Badge>
          )
        }
        actions={
          <div className="flex gap-3">
            <Link to="/scan">
              <Button size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Launch Multi-Vector Scan
              </Button>
            </Link>
          </div>
        }
      />

      {/* View Switcher: Personal Posture vs Fleet Telemetry */}
      <div className="flex border-b border-slate-800 space-x-2">
        <button
          onClick={() => setDashboardView("posture")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
            dashboardView === "posture"
              ? "border-cyan-400 text-cyan-300 bg-cyan-500/5 shadow-glow-cyan"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Security Posture</span>
        </button>

        <button
          onClick={() => setDashboardView("fleet")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
            dashboardView === "fleet"
              ? "border-emerald-400 text-emerald-300 bg-emerald-500/5 shadow-glow-cyan"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Global Fleet Telemetry</span>
          <Badge severity="LOW" size="sm">Phase 15</Badge>
        </button>
      </div>

      {/* Mode 1: Personal Posture Dashboard */}
      {dashboardView === "posture" && (
        <div className="space-y-10 animate-fadeIn">
          {/* Main DIESS Composite Posture Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <Card variant="glow" glowColor="cyan" className="lg:col-span-5 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <ScoreRing
                score={currentDIESS}
                size={220}
                strokeWidth={18}
                label="DIESS"
                sublabel="COMPOSITE SECURITY SCORE"
              />
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <RiskIndicator level={currentRisk} size="md" />
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${gradeInfo.color}`}>
                    Grade: {gradeInfo.grade}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 pt-1">
                  {latestReport
                    ? `Based on latest audit: ${latestReport.report_title}`
                    : "Canonical Multi-Vector Benchmark Posture"}
                </p>
              </div>
            </Card>

            <Card variant="cyber" className="lg:col-span-7 space-y-5 p-7">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-sans flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    DIESS Canonical Weight Distribution
                  </CardTitle>
                  <span className="text-xs font-mono text-cyan-400 font-bold">100% SYNTHESIS</span>
                </div>
                <CardDescription>
                  Digital Identity Exposure & Security Score aggregates 5 weighted threat dimensions into a single unified 0–100 index.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3.5 font-mono text-xs">
                <ProgressBar
                  value={85}
                  max={100}
                  label="1. Username Threat Exposure"
                  sublabel="Weight: 20% • Contribution: 17.0 pts"
                />
                <ProgressBar
                  value={80}
                  max={100}
                  label="2. Privacy Exposure & Minimization"
                  sublabel="Weight: 25% • Contribution: 20.0 pts"
                />
                <ProgressBar
                  value={85}
                  max={100}
                  label="3. Impersonation & Clone Resilience"
                  sublabel="Weight: 20% • Contribution: 17.0 pts"
                />
                <ProgressBar
                  value={90}
                  max={100}
                  label="4. Credential Security & Hygiene"
                  sublabel="Weight: 20% • Contribution: 18.0 pts"
                />
                <ProgressBar
                  value={80}
                  max={100}
                  label="5. Account Recovery & Fallback"
                  sublabel="Weight: 15% • Contribution: 12.0 pts"
                />
              </CardContent>
            </Card>
          </div>

          {/* 5-Vector Threat Matrix (All 5 Active Modules) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                Active Security Dimensions ({5})
              </h3>
              <span className="text-xs font-mono text-emerald-400">
                ALL MODULES ONLINE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 1. Username Analysis */}
              <Card variant="cyber" className="hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      WEIGHT 20% • PHASE 5
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-slate-100 font-sans">Username Security</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Identifies real name leaks, exact birth years, sequential patterns, and compounding multi-attribute exposures.
                  </p>
                </div>
                <Link to="/scan">
                  <Button variant="outline" size="sm" className="w-full text-xs font-mono">
                    Run Username Scan →
                  </Button>
                </Link>
              </Card>

              {/* 2. Privacy Exposure */}
              <Card variant="cyber" className="hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <EyeOff className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      WEIGHT 25% • PHASE 6
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-slate-100 font-sans">Privacy Profile Exposure</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Evaluates sensitivity classification, public visibility, and unnecessary data oversharing across standard identity attributes.
                  </p>
                </div>
                <Link to="/scan">
                  <Button variant="outline" size="sm" className="w-full text-xs font-mono">
                    Run Privacy Scan →
                  </Button>
                </Link>
              </Card>

              {/* 3. Impersonation Risk */}
              <Card variant="cyber" className="hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      WEIGHT 20% • PHASE 9
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-slate-100 font-sans">Impersonation Detection</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Detects lookalike handles, homoglyph substitutions, authority role targeting, and generates defensive clone vectors.
                  </p>
                </div>
                <Link to="/scan">
                  <Button variant="outline" size="sm" className="w-full text-xs font-mono">
                    Run Impersonation Scan →
                  </Button>
                </Link>
              </Card>

              {/* 4. Credential Security */}
              <Card variant="cyber" className="hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      WEIGHT 20% • PHASE 10
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-slate-100 font-sans">Credential Security</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Evaluates MFA adoption, password manager isolation, reuse vulnerabilities, and rotation hygiene without collecting real passwords.
                  </p>
                </div>
                <Link to="/scan">
                  <Button variant="outline" size="sm" className="w-full text-xs font-mono">
                    Run Credential Audit →
                  </Button>
                </Link>
              </Card>

              {/* 5. Account Recovery */}
              <Card variant="cyber" className="hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <LifeBuoy className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      WEIGHT 15% • PHASE 11
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-slate-100 font-sans">Recovery Resiliency</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Audits knowledge-based security questions, emergency backup code readiness, and recovery email/phone channel isolation.
                  </p>
                </div>
                <Link to="/scan">
                  <Button variant="outline" size="sm" className="w-full text-xs font-mono">
                    Run Recovery Audit →
                  </Button>
                </Link>
              </Card>
            </div>
          </div>

          {/* Historical Scans & Reports Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                Recent Security Audits ({reports.length})
              </h3>
              <Link to="/report" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                View All Reports <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {isLoading ? (
              <Card variant="subtle" className="p-8 text-center text-xs font-mono text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping mr-2" />
                Loading security audits repository...
              </Card>
            ) : reports.length === 0 ? (
              <Card variant="subtle" className="p-8 text-center space-y-3">
                <ShieldCheck className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-300 font-mono">No Historical Audits Recorded</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Run your first digital identity exposure scan to generate and persist actionable security reports.
                </p>
                <Link to="/scan">
                  <Button size="sm">Start Security Scan</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-xl cyber-glass hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-100 font-sans">{rep.report_title}</span>
                        <RiskIndicator level={rep.risk_level} size="sm" />
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{rep.summary}</p>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(rep.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 self-start sm:self-auto">
                      <span className="text-sm font-bold font-mono text-cyan-300">
                        DIESS: {rep.diess_score}
                      </span>
                      <Link to={`/report?id=${rep.id}`}>
                        <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                          View Audit
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

      {/* Mode 2: Global Fleet Telemetry Dashboard */}
      {dashboardView === "fleet" && (
        <AdminAnalyticsView />
      )}
    </div>
  );
};
