"""Schemas for Credential Security and Authentication Hygiene Analysis."""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field
from app.core.enums import RiskLevel, FindingCategory
from app.schemas.findings import Finding, BaseAnalysisResult


class MfaMethod(str, Enum):
    """MFA authentication mechanism adopted by user."""
    HARDWARE_KEY = "HARDWARE_KEY"
    AUTHENTICATOR_APP = "AUTHENTICATOR_APP"
    SMS_EMAIL_OTP = "SMS_EMAIL_OTP"
    NONE = "NONE"


class PasswordManagerUsage(str, Enum):
    """How the user generates and manages credentials."""
    DEDICATED_MANAGER = "DEDICATED_MANAGER"
    BROWSER_MANAGER = "BROWSER_MANAGER"
    MANUAL_DOCUMENT = "MANUAL_DOCUMENT"
    MEMORY_ONLY = "MEMORY_ONLY"


class PasswordReuseScope(str, Enum):
    """Extent of password reuse across online services."""
    UNIQUE_ALL = "UNIQUE_ALL"
    SHARED_NONCRITICAL = "SHARED_NONCRITICAL"
    SHARED_CRITICAL_ACCOUNTS = "SHARED_CRITICAL_ACCOUNTS"


class PasswordAgeBracket(str, Enum):
    """Average age and rotation frequency of primary credentials."""
    UNDER_6_MONTHS = "UNDER_6_MONTHS"
    MONTHS_6_TO_12 = "6_TO_12_MONTHS"
    OVER_1_YEAR = "OVER_1_YEAR"
    UNKNOWN_OLD = "UNKNOWN_OLD"


class CredentialAnalysisRequest(BaseModel):
    """Payload evaluating user credential practices without collecting real passwords."""
    mfa_method: MfaMethod = Field(default=MfaMethod.NONE, description="Primary multi-factor authentication method")
    password_manager: PasswordManagerUsage = Field(default=PasswordManagerUsage.MEMORY_ONLY, description="Method of managing passwords")
    reuse_scope: PasswordReuseScope = Field(default=PasswordReuseScope.UNIQUE_ALL, description="Password reuse frequency across sites")
    password_age: PasswordAgeBracket = Field(default=PasswordAgeBracket.UNDER_6_MONTHS, description="Age bracket of primary passwords")
    sample_pattern_type: Optional[str] = Field(None, description="Optional non-confidential description of password pattern structure")


class CredentialAnalysisResult(BaseAnalysisResult):
    """Evaluation result for credential security and hygiene."""
    mfa_posture: str = Field(..., description="Summary of multi-factor authentication resilience")
    reuse_risk_tier: str = Field(..., description="Vulnerability level to credential stuffing and data breaches")
    recommendations: List[str] = Field(default_factory=list, description="Actionable remediation advice")
