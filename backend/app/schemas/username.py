"""Schemas for Username Risk Analysis."""

from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.findings import BaseAnalysisResult, Finding


class UsernameAnalysisRequest(BaseModel):
    """Input payload for analyzing username risk."""
    username: str = Field(..., min_length=1, max_length=100, description="Username to analyze")
    full_name: Optional[str] = Field(None, max_length=100, description="Optional full name to detect PII leakage")
    birth_year: Optional[int] = Field(None, ge=1900, le=2100, description="Optional birth year to detect age/birthdate leaks")


class UsernameAnalysisResult(BaseAnalysisResult):
    """Result payload for username risk analysis."""
    username: str
    detected_patterns: List[str] = Field(default_factory=list, description="Patterns identified in username")
