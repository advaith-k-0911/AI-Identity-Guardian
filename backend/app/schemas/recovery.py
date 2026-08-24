"""Schemas for Account Recovery Security and Fallback Resilience Analysis."""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field
from app.core.enums import RiskLevel, FindingCategory
from app.schemas.findings import Finding, BaseAnalysisResult


class RecoveryEmailStatus(str, Enum):
    """Configuration and isolation of recovery email accounts."""
    DEDICATED_ISOLATED_2FA = "DEDICATED_ISOLATED_2FA"
    STANDARD_PERSONAL = "STANDARD_PERSONAL"
    UNPROTECTED_WORK = "UNPROTECTED_WORK"
    NONE = "NONE"


class RecoveryPhoneStatus(str, Enum):
    """Configuration and SIM-lock status of recovery telephone numbers."""
    NO_SMS_FALLBACK = "NO_SMS_FALLBACK"
    SIM_LOCKED_CELLULAR = "SIM_LOCKED_CELLULAR"
    STANDARD_CELLULAR = "STANDARD_CELLULAR"
    NONE = "NONE"


class BackupCodesStatus(str, Enum):
    """Hygiene and availability of offline 2FA recovery backup codes."""
    STORED_ENCRYPTED_VAULT = "STORED_ENCRYPTED_VAULT"
    PRINTED_PHYSICAL_SAFE = "PRINTED_PHYSICAL_SAFE"
    STORED_PLAINTEXT = "STORED_PLAINTEXT"
    NOT_GENERATED_OR_LOST = "NOT_GENERATED_OR_LOST"


class SecurityQuestionUsage(str, Enum):
    """How knowledge-based security questions are treated."""
    NEVER_USED_DISABLED = "NEVER_USED_DISABLED"
    PSEUDORANDOM_PASSWORDS = "PSEUDORANDOM_PASSWORDS"
    BIOGRAPHICAL_ANSWERS = "BIOGRAPHICAL_ANSWERS"


class RecoveryAnalysisRequest(BaseModel):
    """Payload evaluating recovery architecture without collecting secret answers or codes."""
    recovery_email_status: RecoveryEmailStatus = Field(default=RecoveryEmailStatus.NONE, description="Recovery email isolation and MFA status")
    recovery_phone_status: RecoveryPhoneStatus = Field(default=RecoveryPhoneStatus.NONE, description="Recovery phone configuration and SIM protection")
    backup_codes_status: BackupCodesStatus = Field(default=BackupCodesStatus.NOT_GENERATED_OR_LOST, description="Availability and storage of offline backup codes")
    security_question_usage: SecurityQuestionUsage = Field(default=SecurityQuestionUsage.BIOGRAPHICAL_ANSWERS, description="Security question usage practice")
    is_recovery_contact_public: bool = Field(default=False, description="Whether recovery email/phone is listed publicly on social/web")


class RecoveryAnalysisResult(BaseAnalysisResult):
    """Result payload for account recovery security assessment."""
    recovery_resilience_tier: str = Field(..., description="Overall recovery architecture resilience category")
    backup_codes_status_summary: str = Field(..., description="Summary of emergency backup codes preparedness")
    recommendations: List[str] = Field(default_factory=list, description="Actionable recovery fortification steps")
