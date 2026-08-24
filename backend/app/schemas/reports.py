"""Schemas for Persistent Security Reports and Historical Trend Analysis."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from app.core.enums import RiskLevel
from app.schemas.findings import Finding
from app.schemas.username import UsernameAnalysisResult
from app.schemas.privacy import PrivacyAnalysisResult
from app.schemas.identity import IdentityAnalysisResult, IdentityAnalysisRequest


class ReportCreateRequest(BaseModel):
    """Payload to generate and persist a digital identity security report."""
    report_title: Optional[str] = Field(default="Digital Identity Security Report", max_length=200)
    identity_data: Optional[IdentityAnalysisRequest] = Field(
        None,
        description="Optional identity scan payload. If provided, full analysis will execute and persist."
    )
    identity_result: Optional[IdentityAnalysisResult] = Field(
        None,
        description="Optional pre-calculated scan result to directly persist."
    )


class ReportSummaryResponse(BaseModel):
    """Brief metadata summary of a persistent report with historical score deltas."""
    id: str
    scan_id: str
    created_at: datetime
    report_title: str
    diess_score: float
    risk_level: RiskLevel
    summary: str
    score_delta: Optional[float] = Field(None, description="Score change relative to previous chronological scan")
    previous_score: Optional[float] = Field(None, description="Score of preceding scan")
    trend_direction: Optional[str] = Field(None, description="Trend indicator: IMPROVED, DEGRADED, STABLE, INITIAL")


class ReportDetailResponse(BaseModel):
    """Complete persistent report breakdown across all 5 security dimensions with historical deltas."""
    id: str
    scan_id: str
    created_at: datetime
    report_title: str
    diess_score: float
    risk_level: RiskLevel
    summary: str
    score_delta: Optional[float] = Field(None, description="Score change relative to previous chronological scan")
    previous_score: Optional[float] = Field(None, description="Score of preceding scan")
    trend_direction: Optional[str] = Field(None, description="Trend indicator: IMPROVED, DEGRADED, STABLE, INITIAL")
    username_score: Optional[float] = None
    privacy_score: Optional[float] = None
    impersonation_score: Optional[float] = None
    credential_score: Optional[float] = None
    recovery_score: Optional[float] = None
    username_result: Optional[UsernameAnalysisResult] = None
    privacy_result: Optional[PrivacyAnalysisResult] = None
    findings: List[Finding] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
