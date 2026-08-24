"""Unit tests for Credential Security and Authentication Hygiene Engine."""

import pytest
from app.core.enums import Severity, RiskLevel
from app.schemas.credentials import (
    MfaMethod,
    PasswordManagerUsage,
    PasswordReuseScope,
    PasswordAgeBracket,
    CredentialAnalysisRequest,
)
from app.engines.credential_engine import CredentialRiskEngine


def test_gold_standard_credentials():
    """Verify 100.0 score for hardware MFA, dedicated password manager, and unique passwords."""
    req = CredentialAnalysisRequest(
        mfa_method=MfaMethod.HARDWARE_KEY,
        password_manager=PasswordManagerUsage.DEDICATED_MANAGER,
        reuse_scope=PasswordReuseScope.UNIQUE_ALL,
        password_age=PasswordAgeBracket.UNDER_6_MONTHS,
    )
    res = CredentialRiskEngine.analyze(req)
    assert res.score == 100.0
    assert res.risk_level == RiskLevel.LOW
    assert "EXCELLENT" in res.mfa_posture
    assert "LOW" in res.reuse_risk_tier
    assert len(res.findings) == 0


def test_no_mfa_and_shared_critical_passwords():
    """Verify critical deductions when MFA is absent and passwords are shared on banking/email."""
    req = CredentialAnalysisRequest(
        mfa_method=MfaMethod.NONE,
        password_manager=PasswordManagerUsage.MEMORY_ONLY,
        reuse_scope=PasswordReuseScope.SHARED_CRITICAL_ACCOUNTS,
        password_age=PasswordAgeBracket.OVER_1_YEAR,
    )
    res = CredentialRiskEngine.analyze(req)
    assert res.score <= 20.0
    assert res.risk_level == RiskLevel.CRITICAL
    assert any(f.severity == Severity.CRITICAL for f in res.findings)
    assert any("Absence of Multi-Factor" in f.title for f in res.findings)
    assert any("Critical Account Credential Reuse" in f.title for f in res.findings)


def test_plaintext_storage_and_predictable_pattern():
    """Verify high severity findings for plaintext notes and name/year password habits."""
    req = CredentialAnalysisRequest(
        mfa_method=MfaMethod.AUTHENTICATOR_APP,
        password_manager=PasswordManagerUsage.MANUAL_DOCUMENT,
        reuse_scope=PasswordReuseScope.SHARED_NONCRITICAL,
        sample_pattern_type="NAME_YEAR",
    )
    res = CredentialRiskEngine.analyze(req)
    assert res.score < 60.0
    assert any("Plaintext Password Storage" in f.title for f in res.findings)
    assert any("Predictable Password Construction" in f.title for f in res.findings)


def test_sms_otp_sim_swap_risk():
    """Verify medium severity finding for SMS-based 2FA."""
    req = CredentialAnalysisRequest(
        mfa_method=MfaMethod.SMS_EMAIL_OTP,
        password_manager=PasswordManagerUsage.DEDICATED_MANAGER,
        reuse_scope=PasswordReuseScope.UNIQUE_ALL,
    )
    res = CredentialRiskEngine.analyze(req)
    assert res.score == 85.0
    assert res.risk_level == RiskLevel.LOW
    assert any("SIM-Swap" in f.title for f in res.findings)
