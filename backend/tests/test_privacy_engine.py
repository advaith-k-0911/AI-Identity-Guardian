"""Unit tests for Privacy Exposure Risk Engine."""

import pytest
from app.core.enums import Severity, RiskLevel, Sensitivity
from app.engines.privacy_engine import PrivacyRiskEngine
from app.schemas.privacy import PrivacyFieldInput


def test_zero_exposure_profile():
    """Verify that a completely private profile scores 100 with LOW risk."""
    fields = [
        PrivacyFieldInput(field_name="full_name", is_provided=True, is_public=False, is_necessary=True, sensitivity=Sensitivity.MEDIUM),
        PrivacyFieldInput(field_name="email", is_provided=True, is_public=False, is_necessary=True, sensitivity=Sensitivity.HIGH),
        PrivacyFieldInput(field_name="phone_number", is_provided=False, is_public=False, is_necessary=False, sensitivity=Sensitivity.CRITICAL),
    ]
    res = PrivacyRiskEngine.analyze(fields=fields)
    assert res.score == 100.0
    assert res.risk_level == RiskLevel.LOW
    assert res.exposed_sensitive_count == 0
    assert res.unnecessary_exposed_count == 0


def test_public_critical_phone_exposure():
    """Verify high impact deduction when phone number is publicly exposed."""
    fields = [
        PrivacyFieldInput(
            field_name="phone_number",
            is_provided=True,
            is_public=True,
            is_necessary=False,
            sensitivity=Sensitivity.CRITICAL,
        ),
    ]
    res = PrivacyRiskEngine.analyze(fields=fields)
    # Sensitivity deduction (30) + Unnecessary penalty (5) = 35 deduction
    assert res.score == 65.0
    assert res.exposed_sensitive_count == 1
    assert res.unnecessary_exposed_count == 1
    assert any(f.severity == Severity.CRITICAL for f in res.findings)


def test_public_sensitive_date_of_birth():
    """Verify detection and deduction for public date of birth."""
    fields = [
        PrivacyFieldInput(
            field_name="date_of_birth",
            is_provided=True,
            is_public=True,
            is_necessary=False,
            sensitivity=Sensitivity.HIGH,
        ),
    ]
    res = PrivacyRiskEngine.analyze(fields=fields)
    # 20 (HIGH) + 5 (unnecessary) = 25 deduction
    assert res.score == 75.0
    assert res.exposed_sensitive_count == 1
    assert any(f.severity == Severity.HIGH for f in res.findings)


def test_private_unnecessary_advisory():
    """Verify that private but unnecessary data receives an advisory with 0 deduction."""
    fields = [
        PrivacyFieldInput(
            field_name="interests",
            is_provided=True,
            is_public=False,
            is_necessary=False,
            sensitivity=Sensitivity.LOW,
        ),
    ]
    res = PrivacyRiskEngine.analyze(fields=fields)
    assert res.score == 100.0  # Kept private -> no score penalty
    assert len(res.findings) == 1
    assert res.findings[0].severity == Severity.LOW
    assert "Unnecessary Stored Data" in res.findings[0].title


def test_maximum_exposure_clamping():
    """Verify score clamping to 0 when multiple sensitive items are publicly exposed."""
    fields = [
        PrivacyFieldInput(field_name="phone_number", is_provided=True, is_public=True, is_necessary=False, sensitivity=Sensitivity.CRITICAL),
        PrivacyFieldInput(field_name="ssn", is_provided=True, is_public=True, is_necessary=False, sensitivity=Sensitivity.CRITICAL),
        PrivacyFieldInput(field_name="date_of_birth", is_provided=True, is_public=True, is_necessary=False, sensitivity=Sensitivity.HIGH),
        PrivacyFieldInput(field_name="email", is_provided=True, is_public=True, is_necessary=False, sensitivity=Sensitivity.HIGH),
        PrivacyFieldInput(field_name="home_address", is_provided=True, is_public=True, is_necessary=False, sensitivity=Sensitivity.HIGH),
    ]
    res = PrivacyRiskEngine.analyze(fields=fields)
    assert res.score == 0.0
    assert res.risk_level == RiskLevel.CRITICAL
    assert res.exposed_sensitive_count == 5


def test_default_fields_generation():
    """Verify default fields factory structure."""
    defaults = PrivacyRiskEngine.get_default_fields()
    assert len(defaults) == 6
    names = [f.field_name for f in defaults]
    assert "phone_number" in names
    assert "date_of_birth" in names
    assert "email" in names


def test_privacy_engine_determinism():
    """Verify identical inputs yield identical outputs."""
    defaults = PrivacyRiskEngine.get_default_fields()
    defaults[0].is_provided = True
    defaults[0].is_public = True

    run1 = PrivacyRiskEngine.analyze(defaults)
    run2 = PrivacyRiskEngine.analyze(defaults)
    assert run1.score == run2.score
    assert run1.risk_level == run2.risk_level
    assert len(run1.findings) == len(run2.findings)
