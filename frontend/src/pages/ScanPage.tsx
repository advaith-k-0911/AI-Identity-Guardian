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

  const handleUsernameSubmit = async (data: UsernameAnalysisRequest) => {
    setIsUsernameLoading(true);
    setUsernameError(null);
    try {
      const result = await api.analyzeUsername(data);
      setUsernameResult(result);
    } catch (err: any) {
      setUsernameError(err.message || "Failed to analyze username security.");
    } finally {
      setIsUsernameLoading(false);
    }
  };

  const handlePrivacySubmit = async (fields: PrivacyFieldInput[]) => {
    setIsPrivacyLoading(true);
    setPrivacyError(null);
    setLastPrivacyPayload(fields);
    try {
      const result = await api.analyzePrivacy({ fields });
      setPrivacyResult(result);
    } catch (err: any) {
      setPrivacyError(err.message || "Failed to analyze privacy exposure.");
    } finally {
      setIsPrivacyLoading(false);
    }
  };

  const handleImpersonationSubmit = async (data: ImpersonationAnalysisRequest) => {
    setIsImpersonationLoading(true);
    setImpersonationError(null);
    try {
      const result = await api.analyzeImpersonation(data);
      setImpersonationResult(result);
    } catch (err: any) {
      setImpersonationError(err.message || "Failed to analyze impersonation risk.");
    } finally {
      setIsImpersonationLoading(false);
    }
  };

  const handleCredentialSubmit = async (data: CredentialAnalysisRequest) => {
    setIsCredentialLoading(true);
    setCredentialError(null);
    try {
      const result = await api.analyzeCredentials(data);
      setCredentialResult(result);
    } catch (err: any) {
      setCredentialError(err.message || "Failed to analyze credential security.");
    } finally {
      setIsCredentialLoading(false);
    }
  };

  const handleRecoverySubmit = async (data: RecoveryAnalysisRequest) => {
    setIsRecoveryLoading(true);
    setRecoveryError(null);
    try {
      const result = await api.analyzeRecovery(data);
      setRecoveryResult(result);
    } catch (err: any) {
      setRecoveryError(err.message || "Failed to analyze recovery security.");
    } finally {
      setIsRecoveryLoading(false);
    }
  };

  const tabs = [
    { id: "username" as const, label: "Username", icon: Fingerprint },
    { id: "privacy" as const, label: "Privacy", icon: EyeOff },
    { id: "impersonation" as const, label: "Impersonation", icon: UserCheck },
    { id: "credentials" as const, label: "Credentials", icon: KeyRound },
    { id: "recovery" as const, label: "Recovery", icon: LifeBuoy },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Security Scanner"
        subtitle="Evaluate username PII leaks, privacy exposure, impersonation risk, credential hygiene, and recovery resilience."
        badge={<Badge severity="LOW">ACTIVE</Badge>}
      />

      {/* Module Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 space-x-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                active
                  ? "border-green-500 text-green-600 dark:text-green-400 bg-green-500/5"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Username Module */}
      {activeTab === "username" && (
        <div className="space-y-6">
          {!isUsernameLoading && !usernameResult && !usernameError && (
            <UsernameAnalysisForm onSubmit={handleUsernameSubmit} isLoading={isUsernameLoading} />
          )}
          {isUsernameLoading && (
            <LoadingState title="Analyzing Username Security..." message="Evaluating naming patterns, year suffixes, and compound exposures." />
          )}
          {usernameError && !isUsernameLoading && (
            <ErrorState title="Username Analysis Failed" message={usernameError} onRetry={() => setUsernameError(null)} />
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
                        identity_data: { username: usernameResult.username },
                      });
                      navigate(`/report?id=${rep.id}`);
                    } catch (e) {
                      console.error("Save report failed:", e);
                    }
                  }}
                  leftIcon={<FileText className="w-4 h-4" />}
                >
                  Save Report
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

      {/* Privacy Module */}
      {activeTab === "privacy" && (
        <div className="space-y-6">
          {!isPrivacyLoading && !privacyResult && !privacyError && (
            <PrivacyAnalysisForm onSubmit={handlePrivacySubmit} isLoading={isPrivacyLoading} />
          )}
          {isPrivacyLoading && (
            <LoadingState title="Evaluating Privacy Exposure..." message="Analyzing attribute sensitivity and public data exposure." />
          )}
          {privacyError && !isPrivacyLoading && (
            <ErrorState title="Privacy Analysis Failed" message={privacyError} onRetry={() => setPrivacyError(null)} />
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
                        },
                      });
                      navigate(`/report?id=${rep.id}`);
                    } catch (e) {
                      console.error("Save report failed:", e);
                    }
                  }}
                  leftIcon={<FileText className="w-4 h-4" />}
                >
                  Save Report
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

      {/* Impersonation Module */}
      {activeTab === "impersonation" && (
        <div className="space-y-6">
          {!isImpersonationLoading && !impersonationResult && !impersonationError && (
            <ImpersonationAnalysisForm onSubmit={handleImpersonationSubmit} isLoading={isImpersonationLoading} />
          )}
          {isImpersonationLoading && (
            <LoadingState title="Analyzing Impersonation Risk..." message="Evaluating homoglyphs, authority targeting, and lookalike vectors." />
          )}
          {impersonationError && !isImpersonationLoading && (
            <ErrorState title="Impersonation Analysis Failed" message={impersonationError} onRetry={() => setImpersonationError(null)} />
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
                        identity_data: { username: impersonationResult.username },
                      });
                      navigate(`/report?id=${rep.id}`);
                    } catch (e) {
                      console.error("Save report failed:", e);
                    }
                  }}
                  leftIcon={<FileText className="w-4 h-4" />}
                >
                  Save Report
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

      {/* Credentials Module */}
      {activeTab === "credentials" && (
        <div className="space-y-6">
          {!isCredentialLoading && !credentialResult && !credentialError && (
            <CredentialAnalysisForm onSubmit={handleCredentialSubmit} isLoading={isCredentialLoading} />
          )}
          {isCredentialLoading && (
            <LoadingState title="Auditing Credential Security..." message="Evaluating MFA strength, password management, and reuse risk." />
          )}
          {credentialError && !isCredentialLoading && (
            <ErrorState title="Credential Audit Failed" message={credentialError} onRetry={() => setCredentialError(null)} />
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
                        report_title: "Credential Security Audit",
                        identity_data: { username: "credential_audit" },
                      });
                      navigate(`/report?id=${rep.id}`);
                    } catch (e) {
                      console.error("Save report failed:", e);
                    }
                  }}
                  leftIcon={<FileText className="w-4 h-4" />}
                >
                  Save Report
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

      {/* Recovery Module */}
      {activeTab === "recovery" && (
        <div className="space-y-6">
          {!isRecoveryLoading && !recoveryResult && !recoveryError && (
            <RecoveryAnalysisForm onSubmit={handleRecoverySubmit} isLoading={isRecoveryLoading} />
          )}
          {isRecoveryLoading && (
            <LoadingState title="Auditing Recovery Security..." message="Evaluating backup channels, security questions, and recovery isolation." />
          )}
          {recoveryError && !isRecoveryLoading && (
            <ErrorState title="Recovery Audit Failed" message={recoveryError} onRetry={() => setRecoveryError(null)} />
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
                        report_title: "Account Recovery Audit",
                        identity_data: { username: "recovery_audit" },
                      });
                      navigate(`/report?id=${rep.id}`);
                    } catch (e) {
                      console.error("Save report failed:", e);
                    }
                  }}
                  leftIcon={<FileText className="w-4 h-4" />}
                >
                  Save Report
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
