/**
 * TypeScript definitions for AI Identity Guardian frontend
 * Synced with backend schemas
 */

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type Sensitivity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type FindingCategory = "USERNAME" | "PRIVACY" | "IMPERSONATION" | "CREDENTIALS" | "RECOVERY";

export interface Finding {
  id?: string;
  category: FindingCategory;
  severity: Severity;
  title: string;
  description: string;
  score_impact: number;
  recommendation: string;
}

export interface BaseAnalysisResult {
  score: number;
  risk_level: RiskLevel;
  findings: Finding[];
  summary: string;
}

export interface UsernameAnalysisRequest {
  username: string;
  full_name?: string;
  birth_year?: number;
}

export interface UsernameAnalysisResult extends BaseAnalysisResult {
  username: string;
  detected_patterns: string[];
}

export interface PrivacyFieldInput {
  field_name: string;
  is_provided: boolean;
  is_public: boolean;
  is_necessary: boolean;
  sensitivity: Sensitivity;
}

export interface PrivacyAnalysisRequest {
  fields: PrivacyFieldInput[];
}

export interface PrivacyAnalysisResult extends BaseAnalysisResult {
  exposed_sensitive_count: number;
  unnecessary_exposed_count: number;
}

export interface ImpersonationAnalysisRequest {
  username: string;
  display_name?: string;
  role_or_title?: string;
  bio_keywords?: string[];
}

export interface ImpersonationAnalysisResult extends BaseAnalysisResult {
  username: string;
  susceptibility_tier: string;
  lookalike_variants: string[];
  recommendations: string[];
}

export type MfaMethod = "HARDWARE_KEY" | "AUTHENTICATOR_APP" | "SMS_EMAIL_OTP" | "NONE";
export type PasswordManagerUsage = "DEDICATED_MANAGER" | "BROWSER_MANAGER" | "MANUAL_DOCUMENT" | "MEMORY_ONLY";
export type PasswordReuseScope = "UNIQUE_ALL" | "SHARED_NONCRITICAL" | "SHARED_CRITICAL_ACCOUNTS";
export type PasswordAgeBracket = "UNDER_6_MONTHS" | "6_TO_12_MONTHS" | "OVER_1_YEAR" | "UNKNOWN_OLD";

export interface CredentialAnalysisRequest {
  mfa_method: MfaMethod;
  password_manager: PasswordManagerUsage;
  reuse_scope: PasswordReuseScope;
  password_age: PasswordAgeBracket;
  sample_pattern_type?: string;
}

export interface CredentialAnalysisResult extends BaseAnalysisResult {
  mfa_posture: string;
  reuse_risk_tier: string;
  recommendations: string[];
}

export type RecoveryEmailStatus = "DEDICATED_ISOLATED_2FA" | "STANDARD_PERSONAL" | "UNPROTECTED_WORK" | "NONE";
export type RecoveryPhoneStatus = "NO_SMS_FALLBACK" | "SIM_LOCKED_CELLULAR" | "STANDARD_CELLULAR" | "NONE";
export type BackupCodesStatus = "STORED_ENCRYPTED_VAULT" | "PRINTED_PHYSICAL_SAFE" | "STORED_PLAINTEXT" | "NOT_GENERATED_OR_LOST";
export type SecurityQuestionUsage = "NEVER_USED_DISABLED" | "PSEUDORANDOM_PASSWORDS" | "BIOGRAPHICAL_ANSWERS";

export interface RecoveryAnalysisRequest {
  recovery_email_status: RecoveryEmailStatus;
  recovery_phone_status: RecoveryPhoneStatus;
  backup_codes_status: BackupCodesStatus;
  security_question_usage: SecurityQuestionUsage;
  is_recovery_contact_public: boolean;
}

export interface RecoveryAnalysisResult extends BaseAnalysisResult {
  recovery_resilience_tier: string;
  backup_codes_status_summary: string;
  recommendations: string[];
}

export type DiessGrade = "Excellent" | "Good" | "Medium Risk" | "High Risk" | "Critical Risk";

export interface DiessWeightComponent {
  module_key: string;
  module_name: string;
  score: number;
  weight: number;
  weighted_contribution: number;
}

export interface DiessModuleScores {
  username?: number;
  privacy?: number;
  impersonation?: number;
  credentials?: number;
  recovery?: number;
}

export interface DiessCalculationResult {
  overall_score: number;
  grade: DiessGrade;
  risk_level: RiskLevel;
  module_scores: DiessModuleScores;
  weighted_breakdown: DiessWeightComponent[];
  username_result?: UsernameAnalysisResult;
  privacy_result?: PrivacyAnalysisResult;
  impersonation_result?: ImpersonationAnalysisResult;
  credential_result?: CredentialAnalysisResult;
  recovery_result?: RecoveryAnalysisResult;
  findings: Finding[];
  recommendations: string[];
  summary: string;
}

export interface ComprehensiveIdentityScanRequest {
  username: string;
  full_name?: string;
  birth_year?: number;
  role_or_title?: string;
  privacy_request?: PrivacyAnalysisRequest;
  credential_request?: CredentialAnalysisRequest;
  recovery_request?: RecoveryAnalysisRequest;
}

export interface AIFindingExplanation {
  finding_id?: string;
  finding_title: string;
  severity: Severity;
  plain_language_impact: string;
  defensive_priority: string;
  recommended_action: string;
}

export interface AIExplanationRequest {
  findings: Finding[];
  diess_score: number;
  risk_level: RiskLevel;
  context_title?: string;
  audience_level?: string;
}

export interface AIExplanationResponse {
  narrative_summary: string;
  finding_explanations: AIFindingExplanation[];
  actionable_takeaways: string[];
  provider_used: string;
  is_fallback: boolean;
}

export interface CategoryCount {
  category: string;
  count: number;
  percentage: number;
}

export interface RecommendationFrequency {
  recommendation: string;
  frequency: number;
}

export interface RiskDistribution {
  low_risk: number;
  medium_risk: number;
  high_risk: number;
  critical_risk: number;
}

export interface ScoreTrendAnalytics {
  average_improvement_delta: number;
  improved_scans_count: number;
  degraded_scans_count: number;
  stable_scans_count: number;
}

export interface AdminAnalyticsResponse {
  total_scans: number;
  total_users: number;
  total_reports: number;
  average_diess: number;
  risk_distribution: RiskDistribution;
  top_vulnerability_categories: CategoryCount[];
  top_remediation_actions: RecommendationFrequency[];
  improvement_trends: ScoreTrendAnalytics;
}

export interface IdentityAnalysisRequest {
  username: string;
  full_name?: string;
  birth_year?: number;
  privacy_fields?: PrivacyFieldInput[];
}

export interface IdentityAnalysisResult {
  diess_score: number;
  risk_level: RiskLevel;
  username_result: UsernameAnalysisResult;
  privacy_result: PrivacyAnalysisResult;
  total_findings_count: number;
  findings: Finding[];
  recommendations: string[];
  summary: string;
}

export interface ReportCreateRequest {
  report_title?: string;
  identity_data?: IdentityAnalysisRequest;
  identity_result?: IdentityAnalysisResult;
}

export interface ReportSummaryResponse {
  id: string;
  scan_id: string;
  created_at: string;
  report_title: string;
  diess_score: number;
  risk_level: RiskLevel;
  summary: string;
  score_delta?: number;
  previous_score?: number;
  trend_direction?: "IMPROVED" | "DEGRADED" | "STABLE" | "INITIAL";
}

export interface ReportDetailResponse {
  id: string;
  scan_id: string;
  created_at: string;
  report_title: string;
  diess_score: number;
  risk_level: RiskLevel;
  summary: string;
  score_delta?: number;
  previous_score?: number;
  trend_direction?: "IMPROVED" | "DEGRADED" | "STABLE" | "INITIAL";
  username_score?: number;
  privacy_score?: number;
  impersonation_score?: number;
  credential_score?: number;
  recovery_score?: number;
  username_result?: UsernameAnalysisResult;
  privacy_result?: PrivacyAnalysisResult;
  findings: Finding[];
  recommendations: string[];
}

export interface UserRegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  message?: string;
}
