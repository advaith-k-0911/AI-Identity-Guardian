/**
 * Centralized API Client for AI Identity Guardian Backend
 */

import {
  APIResponse,
  UsernameAnalysisRequest,
  UsernameAnalysisResult,
  PrivacyAnalysisRequest,
  PrivacyAnalysisResult,
  PrivacyFieldInput,
  IdentityAnalysisRequest,
  IdentityAnalysisResult,
  ReportCreateRequest,
  ReportSummaryResponse,
  ReportDetailResponse,
  UserRegisterRequest,
  UserLoginRequest,
  UserResponse,
  TokenResponse,
  ImpersonationAnalysisRequest,
  ImpersonationAnalysisResult,
  CredentialAnalysisRequest,
  CredentialAnalysisResult,
  RecoveryAnalysisRequest,
  RecoveryAnalysisResult,
  ComprehensiveIdentityScanRequest,
  DiessCalculationResult,
  AIExplanationRequest,
  AIExplanationResponse,
  AdminAnalyticsResponse,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("token");
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem("token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    const currentToken = this.getToken();
    if (currentToken) {
      headers["Authorization"] = `Bearer ${currentToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data: APIResponse<T> = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg = data.error?.message || `Request failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      return data.data as T;
    } catch (error: any) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Health Check endpoint
   */
  async checkHealth(): Promise<{ status: string; app_name: string; version: string }> {
    return this.request<{ status: string; app_name: string; version: string }>("/health");
  }

  // --- Authentication Endpoints ---

  async register(payload: UserRegisterRequest): Promise<TokenResponse> {
    const res = await this.request<TokenResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    this.setToken(res.access_token);
    return res;
  }

  async login(payload: UserLoginRequest): Promise<TokenResponse> {
    const res = await this.request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    this.setToken(res.access_token);
    return res;
  }

  async logout(): Promise<void> {
    try {
      await this.request<void>("/auth/logout", { method: "POST" });
    } finally {
      this.setToken(null);
    }
  }

  async getMe(): Promise<UserResponse> {
    return this.request<UserResponse>("/auth/me", { method: "GET" });
  }

  // --- Risk Analysis Endpoints ---

  async analyzeUsername(payload: UsernameAnalysisRequest): Promise<UsernameAnalysisResult> {
    return this.request<UsernameAnalysisResult>("/analysis/username", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async analyzePrivacy(payload: PrivacyAnalysisRequest): Promise<PrivacyAnalysisResult> {
    return this.request<PrivacyAnalysisResult>("/analysis/privacy", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async getPrivacyDefaults(): Promise<PrivacyFieldInput[]> {
    return this.request<PrivacyFieldInput[]>("/analysis/privacy/defaults", {
      method: "GET",
    });
  }

  async analyzeImpersonation(payload: ImpersonationAnalysisRequest): Promise<ImpersonationAnalysisResult> {
    return this.request<ImpersonationAnalysisResult>("/analysis/impersonation", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async analyzeCredentials(payload: CredentialAnalysisRequest): Promise<CredentialAnalysisResult> {
    return this.request<CredentialAnalysisResult>("/analysis/credentials", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async analyzeRecovery(payload: RecoveryAnalysisRequest): Promise<RecoveryAnalysisResult> {
    return this.request<RecoveryAnalysisResult>("/analysis/recovery", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async analyzeDiess(payload: ComprehensiveIdentityScanRequest): Promise<DiessCalculationResult> {
    return this.request<DiessCalculationResult>("/analysis/diess", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async explainFindings(payload: AIExplanationRequest): Promise<AIExplanationResponse> {
    return this.request<AIExplanationResponse>("/ai/explain", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async analyzeIdentity(payload: IdentityAnalysisRequest): Promise<IdentityAnalysisResult> {
    return this.request<IdentityAnalysisResult>("/analysis/identity", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // --- Reports Endpoints ---

  async createReport(payload: ReportCreateRequest): Promise<ReportDetailResponse> {
    return this.request<ReportDetailResponse>("/reports", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async getReport(reportId: string): Promise<ReportDetailResponse> {
    return this.request<ReportDetailResponse>(`/reports/${reportId}`);
  }

  async deleteReport(reportId: string): Promise<{ deleted_report_id: string }> {
    return this.request<{ deleted_report_id: string }>(`/reports/${reportId}`, {
      method: "DELETE",
    });
  }

  async listReports(limit = 50, offset = 0): Promise<ReportSummaryResponse[]> {
    return this.request<ReportSummaryResponse[]>(`/reports?limit=${limit}&offset=${offset}`);
  }

  async getAdminAnalytics(): Promise<AdminAnalyticsResponse> {
    return this.request<AdminAnalyticsResponse>("/admin/analytics");
  }
}

export const api = new ApiClient();
