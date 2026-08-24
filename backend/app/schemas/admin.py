"""Schemas for Aggregated Administrative Analytics and System Telemetry."""

from typing import List
from pydantic import BaseModel, Field


class CategoryCount(BaseModel):
    """Vulnerability category occurrence count and percentage."""
    category: str = Field(..., description="Vulnerability finding domain category")
    count: int = Field(..., description="Total occurrence count")
    percentage: float = Field(..., description="Percentage of total findings")


class RecommendationFrequency(BaseModel):
    """Most common security remediation recommendations across the fleet."""
    recommendation: str = Field(..., description="Actionable recommendation text")
    frequency: int = Field(..., description="Times recommended across audits")


class RiskDistribution(BaseModel):
    """Global distribution of risk levels across all scans."""
    low_risk: int = Field(default=0, description="Scans classified as LOW risk")
    medium_risk: int = Field(default=0, description="Scans classified as MEDIUM risk")
    high_risk: int = Field(default=0, description="Scans classified as HIGH risk")
    critical_risk: int = Field(default=0, description="Scans classified as CRITICAL risk")


class ScoreTrendAnalytics(BaseModel):
    """Security posture delta and improvement trends across users."""
    average_improvement_delta: float = Field(default=0.0, description="Average score change on repeated scans")
    improved_scans_count: int = Field(default=0, description="Number of scans demonstrating score improvement")
    degraded_scans_count: int = Field(default=0, description="Number of scans demonstrating score degradation")
    stable_scans_count: int = Field(default=0, description="Number of scans with unchanged scores")


class AdminAnalyticsResponse(BaseModel):
    """Zero-PII aggregated administrative telemetry payload."""
    total_scans: int = Field(default=0, description="Total scans evaluated")
    total_users: int = Field(default=0, description="Total registered agents")
    total_reports: int = Field(default=0, description="Total persisted audit reports")
    average_diess: float = Field(default=0.0, description="Global average DIESS score")
    risk_distribution: RiskDistribution = Field(default_factory=RiskDistribution)
    top_vulnerability_categories: List[CategoryCount] = Field(default_factory=list)
    top_remediation_actions: List[RecommendationFrequency] = Field(default_factory=list)
    improvement_trends: ScoreTrendAnalytics = Field(default_factory=ScoreTrendAnalytics)
