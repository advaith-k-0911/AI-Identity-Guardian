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
  TrendingUp,
  TrendingDown,
  Minus,
  Trash2,
} from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ScoreRing } from "../components/ui/ScoreRing";
import { RiskIndicator } from "../components/ui/RiskIndicator";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import { ReportDetailResponse, ReportSummaryResponse } from "../types";
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

  useEffect(() => {
    loadRecentReports();
  }, []);

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
    try {
      const report = await api.getReport(id.trim());
      setCurrentReport(report);
      setInputReportId(id.trim());
      setSearchParams({ id: id.trim() });
    } catch (err: any) {
      setError(err.message || `Report '${id}' not found.`);
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
    if (!window.confirm("Delete this report? This cannot be undone.")) return;
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

  return (
    <div className="space-y-8 print:py-0">
      <div className="print:hidden">
        <PageHeader
          title="Security Reports"
          subtitle="Inspect audit findings, track posture progression, and export reports."
          badge={<Badge severity="LOW">AUDITS</Badge>}
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

      {/* Search Bar */}
      <div className="print:hidden">
        <Card variant="cyber" className="p-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputReportId}
                onChange={(e) => setInputReportId(e.target.value)}
                placeholder="Enter Report UUID"
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-black dark:text-white placeholder-zinc-400 font-mono focus:outline-none focus:border-green-500 transition-all"
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

      {isLoading && <LoadingState title="Loading Report..." message="Retrieving audit findings and DIESS metrics." />}

      {error && !isLoading && (
        <ErrorState title="Report Not Found" message={error} onRetry={() => { if (inputReportId) loadReport(inputReportId); }} />
      )}

      {/* Report Detail */}
      {!isLoading && !error && currentReport && (
        <div className="space-y-8">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 print:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">REPORT ID:</span>
              <span className="text-xs font-mono text-green-600 dark:text-green-400 font-bold bg-zinc-50 dark:bg-black px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800">
                {currentReport.id}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopyLink}
                leftIcon={copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}>
                {copied ? "Copied" : "Share Link"}
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}
                leftIcon={<Printer className="w-4 h-4 text-green-500" />}>
                Export PDF
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteReport} isLoading={isDeleting}
                leftIcon={<Trash2 className="w-4 h-4" />}>
                Delete
              </Button>
            </div>
          </div>

          {/* Trend Banner */}
          {currentReport.previous_score !== null && currentReport.previous_score !== undefined && (
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {currentReport.trend_direction === "IMPROVED" && (
                  <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                )}
                {currentReport.trend_direction === "DEGRADED" && (
                  <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                )}
                {currentReport.trend_direction === "STABLE" && (
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400">
                    <Minus className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-semibold text-black dark:text-white font-sans">Score Progression</h4>
                  <p className="text-xs font-mono text-zinc-500">
                    Previous: <strong className="text-zinc-700 dark:text-zinc-300">{currentReport.previous_score}</strong> &rarr; Current: <strong className="text-green-600 dark:text-green-400">{currentReport.diess_score}</strong>
                  </p>
                </div>
              </div>
              {currentReport.score_delta !== null && currentReport.score_delta !== undefined && (
                <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border ${
                  currentReport.score_delta > 0
                    ? "bg-green-500/10 text-green-500 border-green-500/30"
                    : currentReport.score_delta < 0
                    ? "bg-red-500/10 text-red-400 border-red-500/30"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700"
                }`}>
                  {currentReport.score_delta > 0 ? `+${currentReport.score_delta}` : `${currentReport.score_delta}`}
                </span>
              )}
            </div>
          )}

          {/* Report Header */}
          <div className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-green-600 dark:text-green-400">
                  <FileText className="w-4 h-4" />
                  <span>AUDIT REPORT</span>
                </div>
                <h1 className="text-3xl font-bold text-black dark:text-white font-sans">
                  {currentReport.report_title}
                </h1>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                  <Calendar className="w-4 h-4" />
                  <span>Audited on {new Date(currentReport.created_at).toUTCString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-zinc-50 dark:bg-black p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <ScoreRing score={currentReport.diess_score} size={120} strokeWidth={10} label="DIESS" />
                <div className="space-y-1">
                  <div className="text-xs font-mono text-zinc-500 uppercase">Posture</div>
                  <RiskIndicator level={currentReport.risk_level} size="md" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800">
              <div className="text-xs font-mono uppercase tracking-wider text-green-600 dark:text-green-400 mb-1 font-bold">
                Executive Summary
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                {currentReport.summary}
              </p>
            </div>
          </div>

          {/* 5-Dimension Scores */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-black dark:text-white font-sans flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400" />
              Security Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-xs">
              {[
                { label: "Username (20%)", score: currentReport.username_score ?? currentReport.diess_score, icon: "USR" },
                { label: "Privacy (25%)", score: currentReport.privacy_score ?? currentReport.diess_score, icon: "PRV" },
                { label: "Impersonation (20%)", score: currentReport.impersonation_score ?? 85, icon: "IMP" },
                { label: "Credentials (20%)", score: currentReport.credential_score ?? 85, icon: "CRD" },
                { label: "Recovery (15%)", score: currentReport.recovery_score ?? 90, icon: "RCV" },
              ].map((dim, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-1 text-center">
                  <span className="text-[11px] text-zinc-500 block">{dim.label}</span>
                  <span className="text-base font-bold text-black dark:text-white">{dim.score}/100</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Findings */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-black dark:text-white font-sans flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-green-500 dark:text-green-400" />
              Findings ({currentReport.findings.length})
            </h3>

            {currentReport.findings.length === 0 ? (
              <Card variant="subtle" className="p-8 text-center text-sm font-mono text-green-500">
                No vulnerabilities found.
              </Card>
            ) : (
              <div className="space-y-4">
                {currentReport.findings.map((finding, idx) => (
                  <Card key={idx} variant="cyber" className="p-5 space-y-3 border-l-4 border-l-green-500">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Badge severity={finding.severity}>{finding.severity}</Badge>
                        <h4 className="text-base font-semibold text-black dark:text-white font-sans">
                          {finding.title}
                        </h4>
                      </div>
                      {finding.score_impact > 0 && (
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                          -{finding.score_impact} pts
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                      {finding.description}
                    </p>
                    {finding.recommendation && (
                      <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 space-y-1">
                        <div className="text-xs font-mono uppercase tracking-wider text-green-600 dark:text-green-400 flex items-center gap-1.5 font-bold">
                          <Lightbulb className="w-3.5 h-3.5" />
                          Recommendation:
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                          {finding.recommendation}
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recommendations */}
          {currentReport.recommendations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-black dark:text-white font-sans flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />
                Action Plan ({currentReport.recommendations.length})
              </h3>
              <div className="space-y-2 font-mono text-xs">
                {currentReport.recommendations.map((rec, i) => (
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
      )}

      {/* Reports List */}
      {!currentReport && !isLoading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-black dark:text-white font-sans flex items-center gap-2">
              <History className="w-5 h-5 text-green-500 dark:text-green-400" />
              All Reports ({recentReports.length})
            </h3>
          </div>

          {recentReports.length === 0 ? (
            <Card variant="subtle" className="p-12 text-center space-y-4">
              <FileText className="w-12 h-12 text-zinc-400 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-base font-semibold text-zinc-600 dark:text-zinc-300 font-sans">No Reports Found</h4>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Run a security scan and save results to create reports.
                </p>
              </div>
              <Link to="/scan">
                <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>Start Scan</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentReports.map((report) => (
                <Card
                  key={report.id}
                  variant="cyber"
                  className="hover:border-green-500/40 transition-all flex flex-col justify-between space-y-4 cursor-pointer"
                  onClick={() => loadReport(report.id)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <RiskIndicator level={report.risk_level} size="sm" />
                      <div className="flex items-center gap-2">
                        {report.score_delta !== null && report.score_delta !== undefined && (
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            report.score_delta > 0
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : report.score_delta < 0
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700"
                          }`}>
                            {report.score_delta > 0 ? `+${report.score_delta}` : `${report.score_delta}`}
                          </span>
                        )}
                        <span className="text-xs font-mono text-green-600 dark:text-green-400 font-bold">
                          DIESS: {report.diess_score}/100
                        </span>
                      </div>
                    </div>
                    <h4 className="text-base font-semibold text-black dark:text-white font-sans line-clamp-1">
                      {report.report_title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                      {report.summary}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-400">
                    <span>{new Date(report.created_at).toLocaleDateString()}</span>
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                      View Report
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
