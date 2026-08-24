"""Unit tests for Account Recovery Security and Fallback Resilience Engine."""

import pytest
from app.core.enums import Severity, RiskLevel
from app.schemas.recovery import (
    RecoveryEmailStatus,
    RecoveryPhoneStatus,
    BackupCodesStatus,
    SecurityQuestionUsage,
    RecoveryAnalysisRequest,
)
from app.engines.recovery_engine import RecoveryRiskEngine


def test_gold_standard_recovery():
    """Verify 100.0 score for isolated 2FA recovery email, no SMS fallback, encrypted backup codes, and disabled security questions."""
    req = RecoveryAnalysisRequest(
        recovery_email_status=RecoveryEmailStatus.DEDICATED_ISOLATED_2FA,
        recovery_phone_status=RecoveryPhoneStatus.NO_SMS_FALLBACK,
        backup_codes_status=BackupCodesStatus.STORED_ENCRYPTED_VAULT,
        security_question_usage=SecurityQuestionUsage.NEVER_USED_DISABLED,
        is_recovery_contact_public=False,
    )
    res = RecoveryRiskEngine.analyze(req)
    assert res.score == 100.0
    assert res.risk_level == RiskLevel.LOW
    assert "EXCELLENT" in res.recovery_resilience_tier
    assert len(res.findings) == 0


def test_biographical_security_questions_and_missing_backup_codes():
    """Verify critical OSINT and missing backup code detections."""
    req = RecoveryAnalysisRequest(
        recovery_email_status=RecoveryEmailStatus.STANDARD_PERSONAL,
        recovery_phone_status=RecoveryPhoneStatus.STANDARD_CELLULAR,
        backup_codes_status=BackupCodesStatus.NOT_GENERATED_OR_LOST,
        security_question_usage=SecurityQuestionUsage.BIOGRAPHICAL_ANSWERS,
        is_recovery_contact_public=True,
    )
    res = RecoveryRiskEngine.analyze(req)
    assert res.score <= 10.0
    assert res.risk_level == RiskLevel.CRITICAL
    assert any(f.severity == Severity.CRITICAL for f in res.findings)
    assert any("Knowledge-Based Security Questions" in f.title for f in res.findings)
    assert any("Missing Emergency Recovery Backup Codes" in f.title for f in res.findings)
    assert any("Public Exposure" in f.title for f in res.findings)


def test_work_email_recovery_risk():
    """Verify high severity finding when work email is used for personal account recovery."""
    req = RecoveryAnalysisRequest(
        recovery_email_status=RecoveryEmailStatus.UNPROTECTED_WORK,
        backup_codes_status=BackupCodesStatus.PRINTED_PHYSICAL_SAFE,
        security_question_usage=SecurityQuestionUsage.PSEUDORANDOM_PASSWORDS,
    )
    res = RecoveryRiskEngine.analyze(req)
    assert res.score < 85.0
    assert any("Corporate / Unmanaged Recovery Email" in f.title for f in res.findings)
