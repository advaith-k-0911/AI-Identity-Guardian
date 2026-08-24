"""Unit tests verifying architectural foundation and core data schemas."""

import pytest
from app.core.config import settings
from app.core.enums import Severity, RiskLevel, FindingCategory, Sensitivity
from app.schemas.findings import Finding, BaseAnalysisResult, APIResponse, ErrorDetail
from app.schemas.username import UsernameAnalysisRequest, UsernameAnalysisResult
from app.schemas.privacy import PrivacyFieldInput, PrivacyAnalysisRequest, PrivacyAnalysisResult


def test_core_enums():
    """Verify standard severity, risk, and sensitivity levels."""
    assert Severity.LOW == "LOW"
    assert Severity.MEDIUM == "MEDIUM"
    assert Severity.HIGH == "HIGH"
    assert Severity.CRITICAL == "CRITICAL"

    assert RiskLevel.LOW == "LOW"
    assert RiskLevel.CRITICAL == "CRITICAL"

    assert Sensitivity.HIGH == "HIGH"
    assert FindingCategory.USERNAME == "USERNAME"
    assert FindingCategory.PRIVACY == "PRIVACY"


def test_config_defaults():
    """Verify application configuration defaults."""
    assert settings.APP_NAME == "AI Identity Guardian"
    assert settings.API_V1_STR == "/api/v1"
    assert isinstance(settings.CORS_ORIGINS, list)


def test_finding_schema():
    """Verify structured finding validation."""
    finding = Finding(
        id="FIND-001",
        category=FindingCategory.USERNAME,
        severity=Severity.HIGH,
        title="Username Leaks Birth Year",
        description="The username ends with '1998' which matches the user birth year.",
        score_impact=20.0,
        recommendation="Remove the birth year from your handle."
    )
    assert finding.severity == Severity.HIGH
    assert finding.score_impact == 20.0


def test_base_analysis_result_clamping():
    """Verify that scores are strictly clamped between 0 and 100."""
    result = BaseAnalysisResult(
        score=105.0,  # Clamped to 100
        risk_level=RiskLevel.LOW,
        findings=[],
        summary="Test analysis."
    )
    assert result.score == 100.0

    result_low = BaseAnalysisResult(
        score=-15.0,  # Clamped to 0
        risk_level=RiskLevel.CRITICAL,
        findings=[],
        summary="Test critical analysis."
    )
    assert result_low.score == 0.0


def test_username_schemas():
    """Verify username analysis input and result schemas."""
    req = UsernameAnalysisRequest(
        username="johndoe1995",
        full_name="John Doe",
        birth_year=1995
    )
    assert req.username == "johndoe1995"
    assert req.birth_year == 1995

    res = UsernameAnalysisResult(
        score=45.0,
        risk_level=RiskLevel.MEDIUM,
        findings=[],
        summary="Moderate username exposure.",
        username="johndoe1995",
        detected_patterns=["NAME_MATCH", "BIRTH_YEAR"]
    )
    assert res.score == 45.0
    assert len(res.detected_patterns) == 2


def test_privacy_schemas():
    """Verify privacy analysis input and result schemas."""
    field_input = PrivacyFieldInput(
        field_name="email",
        is_provided=True,
        is_public=True,
        is_necessary=False,
        sensitivity=Sensitivity.HIGH
    )
    req = PrivacyAnalysisRequest(fields=[field_input])
    assert len(req.fields) == 1

    res = PrivacyAnalysisResult(
        score=60.0,
        risk_level=RiskLevel.MEDIUM,
        findings=[],
        summary="Some privacy exposure detected.",
        exposed_sensitive_count=1,
        unnecessary_exposed_count=1
    )
    assert res.exposed_sensitive_count == 1
