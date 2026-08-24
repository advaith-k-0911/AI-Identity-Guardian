import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FileText,
  Search,
  Printer,
  Calendar,
  ShieldAlert,
  CheckCircle2,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  History,
  Copy,
  Check,
  Sparkles,
  Bot,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Trash2,
  Fingerprint,
  EyeOff,
  UserCheck,
  KeyRound,
  LifeBuoy,
} from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ScoreRing } from "../components/ui/ScoreRing";
import { RiskIndicator } from "../components/ui/RiskIndicator";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import { ReportDetailResponse, ReportSummaryResponse, AIExplanationResponse } from "../types";
import { api } from "../services/api";

export const ReportPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const reportIdParam = searchParams.get("id");

  const [inputReportId, setInputReportId] = useState(reportIdParam || "");
  const [currentReport, setCurrentReport] = useState<ReportDetailResponse | null>(null);
  const [recentReports, setRecentReports] = useState<ReportSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // AI Explanation State
  const [aiExplanation, setAiExplanation] = useState<AIExplanationResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Load recent reports list on mount
  useEffect(() => {
    loadRecentReports();
  }, []);

  // Fetch report if ID is present in URL
  useEffect(() => {
    if (reportIdParam) {
      loadReport(reportIdParam);
    } else {
      setCurrentReport(null);
    }
  }, [reportIdParam]);

  const loadRecentReports = async () => {
    try {
      const reports = await api.listReports(50);
      setRecentReports(reports);
    } catch (err) {
      console.warn("Could not load recent reports:", err);
    }
  };

  const loadReport = async (id: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setError(null);
    setAiExplanation(null);

    try {
      const report = await api.getReport(id.trim());
      setCurrentReport(report);
      setInputReportId(id.trim());
      setSearchParams({ id: id.trim() });
    } catch (err: any) {
      console.error("Failed to load report:", err);
      setError(err.message || `Report '${id}' not found or access is restricted.`);
      setCurrentReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputReportId.trim()) {
      loadReport(inputReportId.trim());
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteReport = async () => {
    if (!currentReport) return;
    if (!window.confirm("Are you sure you want to delete this security report? This cannot be undone.")) return;

    setIsDeleting(true);
    try {
      await api.deleteReport(currentReport.id);
      setCurrentReport(null);
      setInputReportId("");
      setSearchParams({});
      loadRecentReports();
    } catch (err: any) {
      alert(err.message || "Failed to delete report.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGenerateAiExplanation = async () => {
    if (!currentReport) return;
    setIsAiLoading(true);
    setAiError(null);

    try {
      const response = await api.explainFindings({
        findings: currentReport.findings,
        diess_score: currentReport.diess_score,
        risk_level: currentReport.risk_level,
        context_title: currentReport.report_title,
        audience_level: "general",
      });
      setAiExplanation(response);
    } catch (err: any) {
      console.error("AI Explanation failed:", err);
      setAiError(err.message || "Failed to synthesize AI explanation.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 print:py-0">
      {/* Page Header (Hidden in Print Mode) */}
      <div className="print:hidden">
        <PageHeader
          title="Security Reports & Historical Trend Vault"
          subtitle="Inspect comprehensive 5-vector audit findings, track posture progression over time, export official PDF audits, and generate AI insights."
          badge={<Badge severity="LOW">AUDIT REPOSITORY</Badge>}
          actions={
            <div className="flex gap-2">
              <Link to="/scan">
                <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Launch Scanner
                </Button>
              </Link>
            </div>
          }
        />
      </div>

      {/* Report Lookup Form Bar */}
      <div className="print:hidden">
        <Card variant="cyber" className="p-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputReportId}
                onChange={(e) => setInputReportId(e.target.value)}
                placeholder="Enter Report UUID (e.g. rep_3a7b9c...)"
                className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full sm:w-auto font-mono text-xs"
            >
              Retrieve Report
            </Button>
          </form>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading && (
        <LoadingState
          title="Querying Report Vault..."
          message="Retrieving persisted DIESS score, 5-dimension metrics, normalized identity findings, and structured audit logs."
        />
      )}

      {/* Error State */}
      {error && !isLoading && (
        <ErrorState
          title="Report Retrieval Error"
          message={error}
          onRetry={() => {
            if (inputReportId) loadReport(inputReportId);
          }}
        />
      )}

      {/* Report Detailed View */}
      {!isLoading && !error && currentReport && (
        <div className="space-y-8 animate-fadeIn">
          {/* Action Bar (Print / Share / Delete) */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl cyber-glass border border-slate-800 print:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">REPORT ID:</span>
              <span className="text-xs font-mono text-cyan-300 font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {currentReport.id}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyLink}
                leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              >
                {copied ? "Link Copied" : "Share Link"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                leftIcon={<Printer className="w-4 h-4 text-cyan-400" />}
              >
                Export PDF Audit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteReport}
                isLoading={isDeleting}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Delete Report
              </Button>
            </div>
          </div>

          {/* Historical Trend Banner (If delta is present) */}
          {currentReport.previous_score !== null && currentReport.previous_score !== undefined && (
            <div className="p-4 rounded-xl cyber-glass border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {currentReport.trend_direction === "IMPROVED" && (
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                )}
                {currentReport.trend_direction === "DEGRADED" && (
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                )}
                {currentReport.trend_direction === "STABLE" && (
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                    <Minus className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 font-sans">
                    Historical Posture Progression
                  </h4>
                  <p className="text-xs font-mono text-slate-400">
                    Previous Score: <strong className="text-slate-200">{currentReport.previous_score}</strong> → Current Score: <strong className="text-cyan-300">{currentReport.diess_score}</strong>
                  </p>
                </div>
              </div>

              <div>
                {currentReport.score_delta !== null && currentReport.score_delta !== undefined && (
                  <span
                    className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border ${
                      currentReport.score_delta > 0
                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                        : currentReport.score_delta < 0
                        ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                        : "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    {currentReport.score_delta > 0 ? `+${currentReport.score_delta} Improvement` : `${currentReport.score_delta} Delta`}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Report Executive Banner */}
          <div className="p-8 rounded-2xl cyber-glass border border-slate-800 space-y-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <FileText className="w-4 h-4" />
                  <span>OFFICIAL DIGITAL IDENTITY AUDIT REPORT</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-100 font-sans">
                  {currentReport.report_title}
                </h1>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>Audited on {new Date(currentReport.created_at).toUTCString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <ScoreRing
                  score={currentReport.diess_score}
                  size={120}
                  strokeWidth={10}
                  label="DIESS"
                />
                <div className="space-y-1">
                  <div className="text-xs font-mono text-slate-400 uppercase">Posture Level</div>
                  <RiskIndicator level={currentReport.risk_level} size="md" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
                Executive Audit Summary
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {currentReport.summary}
              </p>
            </div>
          </div>

          {/* 5-Dimension Score Progression Cards */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              5-Dimension Security Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl cyber-glass border border-slate-800 space-y-1 text-center">
                <Fingerprint className="w-4 h-4 text-cyan-400 mx-auto" />
                <span className="text-[11px] text-slate-400 block">Username (20%)</span>
                <span className="text-base font-bold text-slate-100">{currentReport.username_score ?? currentReport.diess_score}/100</span>
              </div>
              <div className="p-3.5 rounded-xl cyber-glass border border-slate-800 space-y-1 text-center">
                <EyeOff className="w-4 h-4 text-emerald-400 mx-auto" />
                <span className="text-[11px] text-slate-400 block">Privacy (25%)</span>
                <span className="text-base font-bold text-slate-100">{currentReport.privacy_score ?? currentReport.diess_score}/100</span>
              </div>
              <div className="p-3.5 rounded-xl cyber-glass border border-slate-800 space-y-1 text-center">
                <UserCheck className="w-4 h-4 text-amber-400 mx-auto" />
                <span className="text-[11px] text-slate-400 block">Impersonation (20%)</span>
                <span className="text-base font-bold text-slate-100">{currentReport.impersonation_score ?? 85}/100</span>
              </div>
              <div className="p-3.5 rounded-xl cyber-glass border border-slate-800 space-y-1 text-center">
                <KeyRound className="w-4 h-4 text-cyan-400 mx-auto" />
                <span className="text-[11px] text-slate-400 block">Credentials (20%)</span>
                <span className="text-base font-bold text-slate-100">{currentReport.credential_score ?? 85}/100</span>
              </div>
              <div className="p-3.5 rounded-xl cyber-glass border border-slate-800 space-y-1 text-center col-span-2 sm:col-span-1">
                <LifeBuoy className="w-4 h-4 text-emerald-400 mx-auto" />
                <span className="text-[11px] text-slate-400 block">Recovery (15%)</span>
                <span className="text-base font-bold text-slate-100">{currentReport.recovery_score ?? 90}/100</span>
              </div>
            </div>
          </div>

          {/* AI Explanation Section */}
          <div className="space-y-4 print:hidden">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                AI Defensive Intelligence Briefing
              </h3>
              {!aiExplanation && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGenerateAiExplanation}
                  isLoading={isAiLoading}
                  leftIcon={<Sparkles className="w-4 h-4 text-cyan-300" />}
                >
                  Generate AI Briefing
                </Button>
              )}
            </div>

            {aiError && (
              <ErrorState
                title="AI Briefing Error"
                message={aiError}
                onRetry={handleGenerateAiExplanation}
              />
            )}

            {aiExplanation && (
              <Card variant="cyber" className="p-6 space-y-6 border-cyan-500/40">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm font-semibold text-slate-100 font-sans">
                      Executive Plain-Language Translation
                    </span>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    Provider: {aiExplanation.provider_used}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    Overview Narrative:
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-sans">
                    {aiExplanation.narrative_summary}
                  </p>
                </div>

                {/* Granular AI Finding Breakdown */}
                {aiExplanation.finding_explanations.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Plain-English Finding Impacts ({aiExplanation.finding_explanations.length}):
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {aiExplanation.finding_explanations.map((exp, idx) => (
                        <div key={idx} className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-100 font-sans line-clamp-1">
                              {exp.finding_title}
                            </span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 whitespace-nowrap">
                              {exp.defensive_priority}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans">
                            {exp.plain_language_impact}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Defensive Takeaways */}
                {aiExplanation.actionable_takeaways.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      AI Prioritized Takeaways:
                    </h4>
                    <div className="space-y-1.5 font-mono text-xs">
                      {aiExplanation.actionable_takeaways.map((takeaway, i) => (
                        <div key={i} className="p-2.5 rounded-md bg-emerald-500/5 border border-emerald-500/20 text-slate-300 flex items-start gap-2">
                          <span className="text-emerald-400 font-bold font-mono">[{i + 1}]</span>
                          <span className="font-sans leading-relaxed">{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Detailed Findings Matrix */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              Detailed Vulnerability Findings ({currentReport.findings.length})
            </h3>

            {currentReport.findings.length === 0 ? (
              <Card variant="subtle" className="p-8 text-center text-sm font-mono text-emerald-400">
                ✓ Zero vulnerabilities recorded for this identity audit.
              </Card>
            ) : (
              <div className="space-y-4">
                {currentReport.findings.map((finding, idx) => (
                  <Card key={idx} variant="cyber" className="p-5 space-y-3 border-l-4 border-l-cyan-500">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Badge severity={finding.severity}>{finding.severity}</Badge>
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

                    <p className="text-sm text-slate-300 leading-relaxed font-sans">
                      {finding.description}
                    </p>

                    {finding.recommendation && (
                      <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 space-y-1">
                        <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-bold">
                          <Lightbulb className="w-3.5 h-3.5" />
                          Remediation Recommendation:
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {finding.recommendation}
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Actionable Recommendations Plan */}
          {currentReport.recommendations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Actionable Defense Roadmap ({currentReport.recommendations.length})
              </h3>
              <div className="space-y-2 font-mono text-xs">
                {currentReport.recommendations.map((rec, i) => (
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
      )}

      {/* Historical Scans List (When No Specific Report is Selected) */}
      {!currentReport && !isLoading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
              <History className="w-5 h-5 text-cyan-400" />
              Historical Scans Timeline ({recentReports.length})
            </h3>
          </div>

          {recentReports.length === 0 ? (
            <Card variant="subtle" className="p-12 text-center space-y-4">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-slate-300 font-sans">
                  No Audit Reports Found
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Run a security scan across any dimension and click &quot;Save as Official Report&quot; to archive permanent records.
                </p>
              </div>
              <Link to="/scan">
                <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Launch New Scan
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentReports.map((report) => (
                <Card
                  key={report.id}
                  variant="cyber"
                  className="hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 cursor-pointer"
                  onClick={() => loadReport(report.id)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <RiskIndicator level={report.risk_level} size="sm" />
                      <div className="flex items-center gap-2">
                        {report.score_delta !== null && report.score_delta !== undefined && (
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                              report.score_delta > 0
                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                                : report.score_delta < 0
                                ? "bg-rose-500/10 text-rose-300 border-rose-500/20"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {report.score_delta > 0 ? `+${report.score_delta}` : `${report.score_delta}`}
                          </span>
                        )}
                        <span className="text-xs font-mono text-cyan-300 font-bold">
                          DIESS: {report.diess_score}/100
                        </span>
                      </div>
                    </div>
                    <h4 className="text-base font-semibold text-slate-100 font-sans line-clamp-1">
                      {report.report_title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
                      {report.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                    <span>{new Date(report.created_at).toLocaleDateString()}</span>
                    <span className="text-cyan-400 flex items-center gap-1">
                      View Report →
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
