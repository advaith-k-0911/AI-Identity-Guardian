"""Schemas for Composite Digital Identity Risk Analysis (DIESS foundation)."""

from typing import List, Optional
from pydantic import BaseModel, Field
from app.core.enums import RiskLevel
from app.schemas.findings import Finding, BaseAnalysisResult
from app.schemas.username import UsernameAnalysisResult, UsernameAnalysisRequest
from app.schemas.privacy import PrivacyFieldInput, PrivacyAnalysisResult


class IdentityAnalysisRequest(BaseModel):
    """Unified request model for evaluating total digital identity exposure."""
    username: str = Field(..., min_length=1, max_length=100, description="Username handle to analyze")
    full_name: Optional[str] = Field(None, max_length=100, description="User legal or display name")
    birth_year: Optional[int] = Field(None, ge=1900, le=2100, description="Birth year")
    privacy_fields: Optional[List[PrivacyFieldInput]] = Field(
        default=None,
        description="Optional list of personal profile privacy configurations. If omitted, default baseline fields will be evaluated."
    )


class IdentityAnalysisResult(BaseModel):
    """Unified response model containing component scores and composite DIESS."""
    diess_score: float = Field(..., ge=0.0, le=100.0, description="Composite DIESS score (0-100)")
    risk_level: RiskLevel = Field(..., description="Overall risk level")
    username_result: UsernameAnalysisResult = Field(..., description="Username module score and findings")
    privacy_result: PrivacyAnalysisResult = Field(..., description="Privacy profile exposure score and findings")
    total_findings_count: int = Field(default=0, description="Total count of security and privacy findings")
    findings: List[Finding] = Field(default_factory=list, description="Combined list of structured findings")
    recommendations: List[str] = Field(default_factory=list, description="Prioritized list of remediation recommendations")
    summary: str = Field(..., description="Human-readable executive summary of identity security posture")
