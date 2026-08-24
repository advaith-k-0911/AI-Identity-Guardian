"""Schemas for Privacy Exposure Risk Analysis."""

from typing import List, Optional
from pydantic import BaseModel, Field
from app.core.enums import Sensitivity
from app.schemas.findings import BaseAnalysisResult, Finding


class PrivacyFieldInput(BaseModel):
    """Specification of a profile attribute for privacy analysis."""
    field_name: str = Field(..., description="Name of the attribute (e.g. full_name, email, phone)")
    is_provided: bool = Field(default=False, description="Whether the user provides this information")
    is_public: bool = Field(default=False, description="Whether the information is visible to the public")
    is_necessary: bool = Field(default=True, description="Whether the field is strictly necessary for the service")
    sensitivity: Sensitivity = Field(default=Sensitivity.MEDIUM, description="Inherent sensitivity level")


class PrivacyAnalysisRequest(BaseModel):
    """Input payload for analyzing privacy exposure."""
    fields: List[PrivacyFieldInput] = Field(..., description="List of profile fields and their visibility state")


class PrivacyAnalysisResult(BaseAnalysisResult):
    """Result payload for privacy exposure analysis."""
    exposed_sensitive_count: int = Field(default=0, description="Count of sensitive attributes publicly exposed")
    unnecessary_exposed_count: int = Field(default=0, description="Count of unnecessary attributes publicly exposed")
