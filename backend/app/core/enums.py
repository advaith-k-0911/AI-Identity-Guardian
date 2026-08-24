"""Enumerations for risk scoring, findings, and sensitivity levels."""

from enum import Enum


class Severity(str, Enum):
    """Standard finding severity levels."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class RiskLevel(str, Enum):
    """Standard composite risk levels."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class Sensitivity(str, Enum):
    """Data sensitivity classification."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class FindingCategory(str, Enum):
    """Categorization of security findings."""
    USERNAME = "USERNAME"
    PRIVACY = "PRIVACY"
    IMPERSONATION = "IMPERSONATION"
    CREDENTIALS = "CREDENTIALS"
    RECOVERY = "RECOVERY"
