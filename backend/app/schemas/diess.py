"""Schemas for DIESS (Digital Identity Exposure & Security Score) Unified Scoring."""

from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from app.core.enums import RiskLevel
from app.schemas.findings import Finding, BaseAnalysisResult
from app.schemas.username import UsernameAnalysisRequest, UsernameAnalysisResult
from app.schemas.privacy import PrivacyAnalysisRequest, PrivacyAnalysisResult
from app.schemas.impersonation import ImpersonationAnalysisRequest, ImpersonationAnalysisResult
from app.schemas.credentials import CredentialAnalysisRequest, CredentialAnalysisResult
from app.schemas.recovery import RecoveryAnalysisRequest, RecoveryAnalysisResult


class DiessGrade(str, Enum):
    """DIESS 5-tier performance grade."""
    EXCELLENT = "Excellent"
    GOOD = "Good"
    MEDIUM_RISK = "Medium Risk"
    HIGH_RISK = "High Risk"
    CRITICAL_RISK = "Critical Risk"


class DiessWeightComponent(BaseModel):
    """Granular mathematical breakdown of an individual module's contribution to DIESS."""
    module_key: str = Field(..., description="Unique module identifier")
    module_name: str = Field(..., description="Human-readable module title")
    score: float = Field(..., ge=0.0, le=100.0, description="Raw sub-module score (0-100)")
    weight: float = Field(..., ge=0.0, le=1.0, description="Assigned fractional weight (e.g. 0.20)")
    weighted_contribution: float = Field(..., description="Points contributed to final score (score * weight)")


class DiessModuleScores(BaseModel):
    """Raw numerical scores for all 5 security modules."""
    username: Optional[float] = Field(None, ge=0.0, le=100.0)
    privacy: Optional[float] = Field(None, ge=0.0, le=100.0)
    impersonation: Optional[float] = Field(None, ge=0.0, le=100.0)
    credentials: Optional[float] = Field(None, ge=0.0, le=100.0)
    recovery: Optional[float] = Field(None, ge=0.0, le=100.0)


class DiessCalculationResult(BaseModel):
    """Unified DIESS evaluation result."""
    overall_score: float = Field(..., ge=0.0, le=100.0, description="Final composite DIESS score (0-100)")
    grade: DiessGrade = Field(..., description="5-tier descriptive grade")
    risk_level: RiskLevel = Field(..., description="Standard risk level classification")
    module_scores: DiessModuleScores = Field(..., description="Individual module score values")
    weighted_breakdown: List[DiessWeightComponent] = Field(default_factory=list, description="Detailed component weights and contributions")
    username_result: Optional[UsernameAnalysisResult] = None
    privacy_result: Optional[PrivacyAnalysisResult] = None
    impersonation_result: Optional[ImpersonationAnalysisResult] = None
    credential_result: Optional[CredentialAnalysisResult] = None
    recovery_result: Optional[RecoveryAnalysisResult] = None
    findings: List[Finding] = Field(default_factory=list, description="Aggregated findings across all modules")
    recommendations: List[str] = Field(default_factory=list, description="Prioritized remediation plan")
    summary: str = Field(..., description="Executive summary of the DIESS score and primary exposures")


class ComprehensiveIdentityScanRequest(BaseModel):
    """Payload to execute an all-in-one 5-vector digital identity scan."""
    username: str = Field(..., min_length=1, max_length=100, description="Target handle")
    full_name: Optional[str] = Field(None, description="Optional legal or display name")
    birth_year: Optional[int] = Field(None, description="Optional birth year")
    role_or_title: Optional[str] = Field(None, description="Optional organization title or role")
    privacy_request: Optional[PrivacyAnalysisRequest] = None
    credential_request: Optional[CredentialAnalysisRequest] = None
    recovery_request: Optional[RecoveryAnalysisRequest] = None
