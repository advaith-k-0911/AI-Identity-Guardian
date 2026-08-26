/**
 * Centralized API Client for AI Identity Guardian Backend
 */

import {
  APIResponse,
  UsernameAnalysisRequest,
  UsernameAnalysisResult,
  PrivacyAnalysisRequest,
  PrivacyAnalysisResult,
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

export const getApiBaseUrl = (): string => {
  // 1. Build-time environment variable
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim() !== "" && !envUrl.startsWith("/")) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  // 2. Render production auto-detection
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("onrender.com")) {
      return "https://ai-identity-guardian-api.onrender.com/api/v1";
    }
  }

  // 3. Local development fallback: use the Vite proxy so CSP connect-src 'self' permits requests.
  return "/api/v1";
};

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("token");
    // Clear any legacy custom_api_url that might have been stored during debugging
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("custom_api_url");
    }
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
    const baseUrl = getApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${cleanEndpoint}`;
    
    const headers: Record<string, string> = {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers as Record<string, string>),
    };

    const currentToken = this.getToken();
    if (currentToken) {
      headers["Authorization"] = `Bearer ${currentToken}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(url, {
        mode: "cors",
        signal: options.signal || controller.signal,
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
      if (error.name === "AbortError") {
        throw new Error(`Request timed out. Backend may be waking up.`);
      }
      console.warn(`[AI Identity Guardian] API request failed for ${url}:`, error);
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Health Check endpoint - verifies backend connectivity
   */
  async checkHealth(): Promise<{ status: string; app_name: string; version: string }> {
    try {
      return await this.request<{ status: string; app_name: string; version: string }>("/health");
    } catch (err) {
      // Fallback probe to root /health on base domain if needed
      const baseUrl = getApiBaseUrl();
      const origin = baseUrl.replace(/\/api\/v1\/?$/, "");
      const res = await fetch(`${origin}/health`, { mode: "cors" });
      const data = await res.json();
      if (res.ok && (data.success || data.data?.status === "healthy")) {
        return data.data || { status: "healthy", app_name: "AI Identity Guardian", version: "0.1.0" };
      }
      throw err;
    }
  }

  // --- Authentication Endpoints ---

  async register(data: UserRegisterRequest): Promise<TokenResponse> {
    const res = await this.request<TokenResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setToken(res.access_token);
    return res;
  }

  async login(data: UserLoginRequest): Promise<TokenResponse> {
    const res = await this.request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setToken(res.access_token);
    return res;
  }

  async logout(): Promise<void> {
    try {
      await this.request("/auth/logout", { method: "POST" });
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>("/auth/me");
  }

  async getMe(): Promise<UserResponse> {
    return this.getCurrentUser();
  }

  // --- Security Risk Analysis Engines ---

  async analyzeUsername(data: UsernameAnalysisRequest): Promise<UsernameAnalysisResult> {
    return this.request<UsernameAnalysisResult>("/analysis/username", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async analyzePrivacy(data: PrivacyAnalysisRequest): Promise<PrivacyAnalysisResult> {
    return this.request<PrivacyAnalysisResult>("/analysis/privacy", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async analyzeImpersonation(data: ImpersonationAnalysisRequest): Promise<ImpersonationAnalysisResult> {
    return this.request<ImpersonationAnalysisResult>("/analysis/impersonation", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async analyzeCredentials(data: CredentialAnalysisRequest): Promise<CredentialAnalysisResult> {
    return this.request<CredentialAnalysisResult>("/analysis/credentials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async analyzeRecovery(data: RecoveryAnalysisRequest): Promise<RecoveryAnalysisResult> {
    return this.request<RecoveryAnalysisResult>("/analysis/recovery", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async analyzeDiess(data: ComprehensiveIdentityScanRequest): Promise<DiessCalculationResult> {
    return this.request<DiessCalculationResult>("/analysis/diess", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async explainFindings(data: AIExplanationRequest): Promise<AIExplanationResponse> {
    return this.request<AIExplanationResponse>("/ai/explain", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // --- Reports Persistence & History ---

  async saveReport(data: ReportCreateRequest): Promise<ReportDetailResponse> {
    return this.request<ReportDetailResponse>("/reports", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async createReport(data: ReportCreateRequest): Promise<ReportDetailResponse> {
    return this.saveReport(data);
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
