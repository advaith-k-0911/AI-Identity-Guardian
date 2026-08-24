import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fingerprint, EyeOff, UserCheck, KeyRound, LifeBuoy, FileText } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import { UsernameAnalysisForm } from "../components/username/UsernameAnalysisForm";
import { UsernameResultsView } from "../components/username/UsernameResultsView";
import { PrivacyAnalysisForm } from "../components/privacy/PrivacyAnalysisForm";
import { PrivacyResultsView } from "../components/privacy/PrivacyResultsView";
import { ImpersonationAnalysisForm } from "../components/impersonation/ImpersonationAnalysisForm";
import { ImpersonationResultsView } from "../components/impersonation/ImpersonationResultsView";
import { CredentialAnalysisForm } from "../components/credentials/CredentialAnalysisForm";
import { CredentialResultsView } from "../components/credentials/CredentialResultsView";
import { RecoveryAnalysisForm } from "../components/recovery/RecoveryAnalysisForm";
import { RecoveryResultsView } from "../components/recovery/RecoveryResultsView";
import {
  UsernameAnalysisRequest,
  UsernameAnalysisResult,
  PrivacyAnalysisResult,
  PrivacyFieldInput,
  ImpersonationAnalysisRequest,
  ImpersonationAnalysisResult,
  CredentialAnalysisRequest,
  CredentialAnalysisResult,
  RecoveryAnalysisRequest,
  RecoveryAnalysisResult,
} from "../types";
import { api } from "../services/api";

export const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"username" | "privacy" | "impersonation" | "credentials" | "recovery">("username");

  // Username State
  const [usernameResult, setUsernameResult] = useState<UsernameAnalysisResult | null>(null);
  const [isUsernameLoading, setIsUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Privacy State
  const [privacyResult, setPrivacyResult] = useState<PrivacyAnalysisResult | null>(null);
  const [lastPrivacyPayload, setLastPrivacyPayload] = useState<PrivacyFieldInput[] | null>(null);
  const [isPrivacyLoading, setIsPrivacyLoading] = useState(false);
  const [privacyError, setPrivacyError] = useState<string | null>(null);

  // Impersonation State
  const [impersonationResult, setImpersonationResult] = useState<ImpersonationAnalysisResult | null>(null);
  const [isImpersonationLoading, setIsImpersonationLoading] = useState(false);
  const [impersonationError, setImpersonationError] = useState<string | null>(null);

  // Credential State
  const [credentialResult, setCredentialResult] = useState<CredentialAnalysisResult | null>(null);
  const [isCredentialLoading, setIsCredentialLoading] = useState(false);
  const [credentialError, setCredentialError] = useState<string | null>(null);

  // Recovery State
  const [recoveryResult, setRecoveryResult] = useState<RecoveryAnalysisResult | null>(null);
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Username Scan Handler
  const handleUsernameSubmit = async (data: UsernameAnalysisRequest) => {
    setIsUsernameLoading(true);
    setUsernameError(null);
    try {
      const result = await api.analyzeUsername(data);
      setUsernameResult(result);
    } catch (err: any) {
      console.error("Username scan failed:", err);
      setUsernameError(err.message || "Failed to analyze username security.");
    } finally {
      setIsUsernameLoading(false);
    }
  };

  // Privacy Scan Handler
  const handlePrivacySubmit = async (fields: PrivacyFieldInput[]) => {
    setIsPrivacyLoading(true);
    setPrivacyError(null);
    setLastPrivacyPayload(fields);
    try {
      const result = await api.analyzePrivacy({ fields });
      setPrivacyResult(result);
    } catch (err: any) {
      console.error("Privacy scan failed:", err);
      setPrivacyError(err.message || "Failed to analyze privacy profile exposure.");
    } finally {
      setIsPrivacyLoading(false);
    }
  };

  // Impersonation Scan Handler
  const handleImpersonationSubmit = async (data: ImpersonationAnalysisRequest) => {
    setIsImpersonationLoading(true);
    setImpersonationError(null);
    try {
      const result = await api.analyzeImpersonation(data);
      setImpersonationResult(result);
    } catch (err: any) {
      console.error("Impersonation scan failed:", err);
      setImpersonationError(err.message || "Failed to analyze impersonation risk.");
    } finally {
      setIsImpersonationLoading(false);
    }
  };

  // Credential Scan Handler
  const handleCredentialSubmit = async (data: CredentialAnalysisRequest) => {
    setIsCredentialLoading(true);
    setCredentialError(null);
    try {
      const result = await api.analyzeCredentials(data);
      setCredentialResult(result);
    } catch (err: any) {
      console.error("Credential scan failed:", err);
      setCredentialError(err.message || "Failed to analyze credential security.");
    } finally {
      setIsCredentialLoading(false);
    }
  };

  // Recovery Scan Handler
  const handleRecoverySubmit = async (data: RecoveryAnalysisRequest) => {
    setIsRecoveryLoading(true);
    setRecoveryError(null);
    try {
      const result = await api.analyzeRecovery(data);
      setRecoveryResult(result);
    } catch (err: any) {
      console.error("Recovery scan failed:", err);
      setRecoveryError(err.message || "Failed to analyze recovery security.");
    } finally {
      setIsRecoveryLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <PageHeader
        title="Multi-Vector Security Scanner"
        subtitle="Evaluate username PII leaks, privacy exposure, impersonation susceptibility, credential hygiene, and recovery resilience."
        badge={<Badge severity="LOW">ACTIVE PROTECTION</Badge>}
      />

      {/* Module Selector Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("username")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === "username"
              ? "border-cyan-400 text-cyan-300 bg-cyan-500/5 shadow-glow-cyan"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <Fingerprint className="w-4 h-4" />
          <span>Username Threat</span>
          <Badge severity="LOW" size="sm">Phase 5</Badge>
        </button>

        <button
          onClick={() => setActiveTab("privacy")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === "privacy"
              ? "border-emerald-400 text-emerald-300 bg-emerald-500/5 shadow-glow-cyan"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <EyeOff className="w-4 h-4" />
          <span>Privacy Exposure</span>
          <Badge severity="LOW" size="sm">Phase 6</Badge>
        </button>

        <button
          onClick={() => setActiveTab("impersonation")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === "impersonation"
              ? "border-amber-400 text-amber-300 bg-amber-500/5 shadow-glow-cyan"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Impersonation Risk</span>
          <Badge severity="LOW" size="sm">Phase 9</Badge>
        </button>

        <button
          onClick={() => setActiveTab("credentials")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === "credentials"
              ? "border-cyan-400 text-cyan-300 bg-cyan-500/5 shadow-glow-cyan"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Credential Hygiene</span>
          <Badge severity="LOW" size="sm">Phase 10</Badge>
        </button>

        <button
          onClick={() => setActiveTab("recovery")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTab === "recovery"
              ? "border-emerald-400 text-emerald-300 bg-emerald-500/5 shadow-glow-cyan"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
        >
          <LifeBuoy className="w-4 h-4" />
          <span>Recovery Resiliency</span>
          <Badge severity="LOW" size="sm">Phase 11</Badge>
        </button>
      </div>

      {/* 1. Username Module Tab Content */}
      {activeTab === "username" && (
        <div className="space-y-6 animate-fadeIn">
          {!isUsernameLoading && !usernameResult && !usernameError && (
            <UsernameAnalysisForm
              onSubmit={handleUsernameSubmit}
              isLoading={isUsernameLoading}
            />
          )}

          {isUsernameLoading && (
            <LoadingState
              title="Executing Username Security Engine..."
              message="Evaluating naming predictability, year suffix patterns, digit entropy, and compound exposures."
            />
          )}

          {usernameError && !isUsernameLoading && (
            <ErrorState
              title="Username Analysis Failed"
              message={usernameError}
              onRetry={() => setUsernameError(null)}
            />
          )}

          {!isUsernameLoading && !usernameError && usernameResult && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    try {
                      const rep = await api.createReport({
                        report_title: `Username Audit: @${usernameResult.username}`,
                        identity_data: {
                          username: usernameResult.username,
                        }
                      });
                      navigate(`/report?id=${rep.id}`);
                    } catch (e) {
                      console.error("Save report failed:", e);
                    }
                  }}
                  leftIcon={<FileText className="w-4 h-4" />}
                >
                  Save as Official Report
                </Button>
              </div>
              <UsernameResultsView
                result={usernameResult}
                onReset={() => setUsernameResult(null)}
                onNext={() => setActiveTab("privacy")}
              />
            </div>
          )}
        </div>
      )}

      {/* 2. Privacy Module Tab Content */}
      {activeTab === "privacy" && (
        <div className="space-y-6 animate-fadeIn">
          {!isPrivacyLoading && !privacyResult && !privacyError && (
            <PrivacyAnalysisForm
              onSubmit={handlePrivacySubmit}
              isLoading={isPrivacyLoading}
            />
          )}

          {isPrivacyLoading && (
            <LoadingState
              title="Evaluating Privacy Exposure Matrix..."
              message="Evaluating attribute sensitivity, necessity checks, public data exposure, and composite surface reduction."
            />
          )}

          {privacyError && !isPrivacyLoading && (
            <ErrorState
              title="Privacy Exposure Analysis Failed"
              message={privacyError}
              onRetry={() => setPrivacyError(null)}
            />
          )}

          {!isPrivacyLoading && !privacyError && privacyResult && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    try {
                      const rep = await api.createReport({
                        report_title: "Privacy Profile Exposure Audit",
                        identity_data: {
                          username: "privacy_user",
                          privacy_fields: lastPrivacyPayload || undefined,
                        }
                      });
                      navigate(`/report?id=${rep.id}`);
                    } catch (e) {
                      console.error("Save report failed:", e);
                    }
                  }}
                  leftIcon={<FileText className="w-4 h-4" />}
                >
                  Save as Official Report
                </Button>
              </div>
              <PrivacyResultsView
                result={privacyResult}
                onReset={() => setPrivacyResult(null)}
                onSwitchToUsername={() => setActiveTab("impersonation")}
              />
            </div>
          )}
        </div>
      )}

      {/* 3. Impersonation Module Tab Content */}
      {activeTab === "impersonation" && (
        <div className="space-y-6 animate-fadeIn">
          {!isImpersonationLoading && !impersonationResult && !impersonationError && (
            <ImpersonationAnalysisForm
              onSubmit={handleImpersonationSubmit}
              isLoading={isImpersonationLoading}
            />
          )}

          {isImpersonationLoading && (
            <LoadingState
              title="Analyzing Impersonation Attack Surface..."
              message="Evaluating homoglyphs, separator duplication, authority role targeting, and generating defensive lookalike vectors."
            />
          )}

          {impersonationError && !isImpersonationLoading && (
            <ErrorState
              title="Impersonation Analysis Failed"
              message={impersonationError}
              onRetry={() => setImpersonationError(null)}
            />
          )}

          {!isImpersonationLoading && !impersonationError && impersonationResult && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    try {
                      const rep = await api.createReport({
                        report_title: `Impersonation Audit: @${impersonationResult.username}`,
                        identity_data: {
                          username: impersonationResult.username,
                        }
                      });
                      navigate(`/report?id=${rep.id}`);
                    } catch (e) {
                      console.error("Save report failed:", e);
                    }
                  }}
                  leftIcon={<FileText className="w-4 h-4" />}
                >
                  Save as Official Report
                </Button>
              </div>
              <ImpersonationResultsView
                result={impersonationResult}
                onReset={() => setImpersonationResult(null)}
                onNext={() => setActiveTab("credentials")}
              />
            </div>
          )}
        </div>
      )}

      {/* 4. Credential Security Module Tab Content */}
      {activeTab === "credentials" && (
        <div className="space-y-6 animate-fadeIn">
          {!isCredentialLoading && !credentialResult && !credentialError && (
            <CredentialAnalysisForm
              onSubmit={handleCredentialSubmit}
              isLoading={isCredentialLoading}
            />
          )}

          {isCredentialLoading && (
            <LoadingState
              title="Auditing Credential Architecture & Hygiene..."
              message="Evaluating multi-factor authentication strength, password manager adoption, and credential reuse vulnerability."
            />
          )}

          {credentialError && !isCredentialLoading && (
            <ErrorState
              title="Credential Security Audit Failed"
              message={credentialError}
              onRetry={() => setCredentialError(null)}
            />
          )}

          {!isCredentialLoading && !credentialError && credentialResult && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    try {
                      const rep = await api.createReport({
                        report_title: "Credential Security & Auth Audit",
                        identity_data: {
                          username: "credential_audit",
                        }
                      });
                      navigate(`/report?id=${rep.id}`);
                    } catch (e) {
                      console.error("Save report failed:", e);
                    }
                  }}
                  leftIcon={<FileText className="w-4 h-4" />}
                >
                  Save as Official Report
                </Button>
              </div>
              <CredentialResultsView
                result={credentialResult}
                onReset={() => setCredentialResult(null)}
                onNext={() => setActiveTab("recovery")}
              />
            </div>
          )}
        </div>
      )}

      {/* 5. Account Recovery Module Tab Content */}
      {activeTab === "recovery" && (
        <div className="space-y-6 animate-fadeIn">
          {!isRecoveryLoading && !recoveryResult && !recoveryError && (
            <RecoveryAnalysisForm
              onSubmit={handleRecoverySubmit}
              isLoading={isRecoveryLoading}
            />
          )}

          {isRecoveryLoading && (
            <LoadingState
              title="Auditing Account Recovery Architecture..."
              message="Evaluating knowledge-based question predictability, emergency backup code readiness, and recovery channel isolation."
            />
          )}

          {recoveryError && !isRecoveryLoading && (
            <ErrorState
              title="Account Recovery Audit Failed"
              message={recoveryError}
              onRetry={() => setRecoveryError(null)}
            />
          )}

          {!isRecoveryLoading && !recoveryError && recoveryResult && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={async () => {
                    try {
                      const rep = await api.createReport({
                        report_title: "Account Recovery Architecture Audit",
                        identity_data: {
                          username: "recovery_audit",
                        }
                      });
                      navigate(`/report?id=${rep.id}`);
                    } catch (e) {
                      console.error("Save report failed:", e);
                    }
                  }}
                  leftIcon={<FileText className="w-4 h-4" />}
                >
                  Save as Official Report
                </Button>
              </div>
              <RecoveryResultsView
                result={recoveryResult}
                onReset={() => setRecoveryResult(null)}
                onNext={() => setActiveTab("username")}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
