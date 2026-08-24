"""Pydantic schemas package for API contracts and data validation."""

from app.schemas.findings import Finding, BaseAnalysisResult, APIResponse, ErrorDetail
from app.schemas.username import UsernameAnalysisRequest, UsernameAnalysisResult
from app.schemas.privacy import PrivacyFieldInput, PrivacyAnalysisRequest, PrivacyAnalysisResult
from app.schemas.identity import IdentityAnalysisRequest, IdentityAnalysisResult
from app.schemas.reports import ReportCreateRequest, ReportSummaryResponse, ReportDetailResponse
from app.schemas.auth import UserRegisterRequest, UserLoginRequest, UserResponse, TokenResponse
from app.schemas.impersonation import ImpersonationAnalysisRequest, ImpersonationAnalysisResult
from app.schemas.credentials import (
    MfaMethod,
    PasswordManagerUsage,
    PasswordReuseScope,
    PasswordAgeBracket,
    CredentialAnalysisRequest,
    CredentialAnalysisResult,
)
from app.schemas.recovery import (
    RecoveryEmailStatus,
    RecoveryPhoneStatus,
    BackupCodesStatus,
    SecurityQuestionUsage,
    RecoveryAnalysisRequest,
    RecoveryAnalysisResult,
)
from app.schemas.diess import (
    DiessGrade,
    DiessWeightComponent,
    DiessModuleScores,
    DiessCalculationResult,
    ComprehensiveIdentityScanRequest,
)
from app.schemas.ai import (
    AIFindingExplanation,
    AIExplanationRequest,
    AIExplanationResponse,
)
from app.schemas.admin import (
    CategoryCount,
    RecommendationFrequency,
    RiskDistribution,
    ScoreTrendAnalytics,
    AdminAnalyticsResponse,
)

__all__ = [
    "Finding",
    "BaseAnalysisResult",
    "APIResponse",
    "ErrorDetail",
    "UsernameAnalysisRequest",
    "UsernameAnalysisResult",
    "PrivacyFieldInput",
    "PrivacyAnalysisRequest",
    "PrivacyAnalysisResult",
    "IdentityAnalysisRequest",
    "IdentityAnalysisResult",
    "ReportCreateRequest",
    "ReportSummaryResponse",
    "ReportDetailResponse",
    "UserRegisterRequest",
    "UserLoginRequest",
    "UserResponse",
    "TokenResponse",
    "ImpersonationAnalysisRequest",
    "ImpersonationAnalysisResult",
    "MfaMethod",
    "PasswordManagerUsage",
    "PasswordReuseScope",
    "PasswordAgeBracket",
    "CredentialAnalysisRequest",
    "CredentialAnalysisResult",
    "RecoveryEmailStatus",
    "RecoveryPhoneStatus",
    "BackupCodesStatus",
    "SecurityQuestionUsage",
    "RecoveryAnalysisRequest",
    "RecoveryAnalysisResult",
    "DiessGrade",
    "DiessWeightComponent",
    "DiessModuleScores",
    "DiessCalculationResult",
    "ComprehensiveIdentityScanRequest",
    "AIFindingExplanation",
    "AIExplanationRequest",
    "AIExplanationResponse",
    "CategoryCount",
    "RecommendationFrequency",
    "RiskDistribution",
    "ScoreTrendAnalytics",
    "AdminAnalyticsResponse",
]
