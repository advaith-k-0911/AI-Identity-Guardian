"""Schemas for AI Explanation Engine."""

from typing import List, Optional
from pydantic import BaseModel, Field
from app.core.enums import RiskLevel, Severity
from app.schemas.findings import Finding


class AIFindingExplanation(BaseModel):
    """Contextual plain-English explanation for an individual security finding."""
    finding_id: Optional[str] = None
    finding_title: str = Field(..., description="Original finding title")
    severity: Severity = Field(..., description="Deterministic severity")
    plain_language_impact: str = Field(..., description="Why this vulnerability matters in non-technical terms")
    defensive_priority: str = Field(..., description="Priority label: Immediate Action, Recommended Hardening, Low Precaution")
    recommended_action: str = Field(..., description="Clear step-by-step guidance to remediate the exposure")


class AIExplanationRequest(BaseModel):
    """Payload to request AI plain-English translation and defensive briefing."""
    findings: List[Finding] = Field(default_factory=list, description="Authoritative deterministic findings list")
    diess_score: float = Field(default=100.0, ge=0.0, le=100.0, description="Authoritative composite DIESS score")
    risk_level: RiskLevel = Field(default=RiskLevel.LOW, description="Authoritative risk classification")
    context_title: Optional[str] = Field(None, description="Optional context or username handle")
    audience_level: str = Field(default="general", description="Target audience style: general, technical, executive")


class AIExplanationResponse(BaseModel):
    """AI plain-English narrative summary and defensive roadmap."""
    narrative_summary: str = Field(..., description="Executive plain-English risk briefing")
    finding_explanations: List[AIFindingExplanation] = Field(default_factory=list, description="Granular explanations per finding")
    actionable_takeaways: List[str] = Field(default_factory=list, description="Top prioritized defense strategies")
    provider_used: str = Field(..., description="Name of the AI provider employed (e.g. Gemini, Deterministic Fallback)")
    is_fallback: bool = Field(default=False, description="Whether deterministic fallback synthesis was used")
