"""Schemas for structured risk findings, base analysis results, and API envelopes."""

from typing import Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field, field_validator
from app.core.enums import Severity, RiskLevel, FindingCategory

DataT = TypeVar("DataT")


class Finding(BaseModel):
    """Structured security finding adhering to system standards."""
    id: Optional[str] = None
    category: FindingCategory = FindingCategory.USERNAME
    severity: Severity = Severity.LOW
    title: str = Field(..., min_length=1, description="Concise summary of the finding")
    description: str = Field(..., min_length=1, description="Detailed explanation of the risk")
    score_impact: float = Field(default=0.0, ge=0.0, le=100.0, description="Deduction or weighted impact on the score")
    recommendation: str = Field(..., min_length=1, description="Actionable remediation advice")


class BaseAnalysisResult(BaseModel):
    """Base schema for all domain risk analysis results."""
    score: float = Field(..., ge=0.0, le=100.0, description="Security score from 0 to 100")
    risk_level: RiskLevel = Field(..., description="Calculated risk tier")
    findings: List[Finding] = Field(default_factory=list, description="List of detected risk findings")
    summary: str = Field(..., description="Human-readable overview of results")

    @field_validator("score", mode="before")
    @classmethod
    def clamp_score(cls, v: float) -> float:
        """Guarantee score is strictly clamped between 0.0 and 100.0."""
        return max(0.0, min(100.0, round(float(v), 2)))


class ErrorDetail(BaseModel):
    """Standard error response structure."""
    code: str
    message: str
    details: Optional[dict] = None


class APIResponse(BaseModel, Generic[DataT]):
    """Standard envelope for all API responses."""
    success: bool = True
    data: Optional[DataT] = None
    error: Optional[ErrorDetail] = None
    message: Optional[str] = None
