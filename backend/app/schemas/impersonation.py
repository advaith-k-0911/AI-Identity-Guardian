"""Schemas for Impersonation Risk and Spoofing Susceptibility Analysis."""

from typing import List, Optional
from pydantic import BaseModel, Field
from app.core.enums import RiskLevel, FindingCategory
from app.schemas.findings import Finding, BaseAnalysisResult


class ImpersonationAnalysisRequest(BaseModel):
    """Input payload to evaluate impersonation attack surface."""
    username: str = Field(..., min_length=1, max_length=100, description="Target handle to analyze")
    display_name: Optional[str] = Field(None, max_length=100, description="Public legal or display name")
    role_or_title: Optional[str] = Field(None, max_length=100, description="Organizational title or role (e.g. Admin, CEO, Support)")
    bio_keywords: Optional[List[str]] = Field(default_factory=list, description="Keywords or details from public bio")


class ImpersonationAnalysisResult(BaseAnalysisResult):
    """Result payload for impersonation susceptibility evaluation."""
    username: str
    susceptibility_tier: str = Field(..., description="Impersonation vulnerability category")
    lookalike_variants: List[str] = Field(default_factory=list, description="Top predictable spoofed handle vectors")
    recommendations: List[str] = Field(default_factory=list, description="Actionable remediation steps")
