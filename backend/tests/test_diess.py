"""Unit and integration tests for DIESS (Digital Identity Exposure & Security Score) Unified Scoring."""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.enums import RiskLevel
from app.schemas.username import UsernameAnalysisResult
from app.schemas.privacy import PrivacyAnalysisResult
from app.schemas.impersonation import ImpersonationAnalysisResult
from app.schemas.credentials import CredentialAnalysisResult
from app.schemas.recovery import RecoveryAnalysisResult
from app.schemas.diess import DiessGrade, ComprehensiveIdentityScanRequest
from app.services.diess_service import DiessService

client = TestClient(app)


def _make_mock_results(
    user_score: float = 100.0,
    priv_score: float = 100.0,
    imp_score: float = 100.0,
    cred_score: float = 100.0,
    rec_score: float = 100.0,
):
    """Helper creating mock sub-module results."""
    u = UsernameAnalysisResult(score=user_score, risk_level=RiskLevel.LOW, findings=[], summary="", username="user1", detected_patterns=[])
    p = PrivacyAnalysisResult(score=priv_score, risk_level=RiskLevel.LOW, findings=[], summary="", exposed_sensitive_count=0, unnecessary_exposed_count=0)
    i = ImpersonationAnalysisResult(score=imp_score, risk_level=RiskLevel.LOW, findings=[], recommendations=[], summary="", username="user1", susceptibility_tier="LOW", lookalike_variants=[])
    c = CredentialAnalysisResult(score=cred_score, risk_level=RiskLevel.LOW, findings=[], recommendations=[], summary="", mfa_posture="EXCELLENT", reuse_risk_tier="LOW")
    r = RecoveryAnalysisResult(score=rec_score, risk_level=RiskLevel.LOW, findings=[], recommendations=[], summary="", recovery_resilience_tier="EXCELLENT", backup_codes_status_summary="READY")
    return u, p, i, c, r


def test_diess_perfect_score():
    """Verify 100.0 score results in Excellent grade and Low risk."""
    u, p, i, c, r = _make_mock_results(100, 100, 100, 100, 100)
    res = DiessService.calculate_diess(u, p, i, c, r)
    assert res.overall_score == 100.0
    assert res.grade == DiessGrade.EXCELLENT
    assert res.risk_level == RiskLevel.LOW
    assert len(res.weighted_breakdown) == 5


def test_diess_zero_score():
    """Verify 0.0 score results in Critical Risk grade and Critical risk level."""
    u, p, i, c, r = _make_mock_results(0, 0, 0, 0, 0)
    res = DiessService.calculate_diess(u, p, i, c, r)
    assert res.overall_score == 0.0
    assert res.grade == DiessGrade.CRITICAL_RISK
    assert res.risk_level == RiskLevel.CRITICAL


def test_diess_mixed_score_weighted_calculation():
    """Verify exact weighted sum: 0.20*80 + 0.25*60 + 0.20*90 + 0.20*70 + 0.15*80 = 75.0."""
    u, p, i, c, r = _make_mock_results(80.0, 60.0, 90.0, 70.0, 80.0)
    res = DiessService.calculate_diess(u, p, i, c, r)
    expected_sum = (0.20 * 80.0) + (0.25 * 60.0) + (0.20 * 90.0) + (0.20 * 70.0) + (0.15 * 80.0)
    assert abs(res.overall_score - expected_sum) < 0.01
    assert res.overall_score == 75.0
    assert res.grade == DiessGrade.GOOD
    assert res.risk_level == RiskLevel.LOW


def test_diess_boundary_values():
    """Verify exact threshold boundary behaviors."""
    # 90.0 vs 89.9
    grade, risk = DiessService.resolve_grade_and_risk(90.0)
    assert grade == DiessGrade.EXCELLENT and risk == RiskLevel.LOW

    grade, risk = DiessService.resolve_grade_and_risk(89.9)
    assert grade == DiessGrade.GOOD and risk == RiskLevel.LOW

    # 75.0 vs 74.9
    grade, risk = DiessService.resolve_grade_and_risk(75.0)
    assert grade == DiessGrade.GOOD and risk == RiskLevel.LOW

    grade, risk = DiessService.resolve_grade_and_risk(74.9)
    assert grade == DiessGrade.MEDIUM_RISK and risk == RiskLevel.MEDIUM

    # 50.0 vs 49.9
    grade, risk = DiessService.resolve_grade_and_risk(50.0)
    assert grade == DiessGrade.MEDIUM_RISK and risk == RiskLevel.MEDIUM

    grade, risk = DiessService.resolve_grade_and_risk(49.9)
    assert grade == DiessGrade.HIGH_RISK and risk == RiskLevel.HIGH

    # 25.0 vs 24.9
    grade, risk = DiessService.resolve_grade_and_risk(25.0)
    assert grade == DiessGrade.HIGH_RISK and risk == RiskLevel.HIGH

    grade, risk = DiessService.resolve_grade_and_risk(24.9)
    assert grade == DiessGrade.CRITICAL_RISK and risk == RiskLevel.CRITICAL


def test_diess_missing_modules_normalization():
    """Verify weight re-normalization when only a subset of modules is provided."""
    u, p, _, _, _ = _make_mock_results(100.0, 100.0)
    # Only username and privacy provided
    res = DiessService.calculate_diess(username_res=u, privacy_res=p)
    assert res.overall_score == 100.0
    assert len(res.weighted_breakdown) == 2
    # Check that weights sum to 1.0
    weight_sum = sum(b.weight for b in res.weighted_breakdown)
    assert abs(weight_sum - 1.0) < 0.001


def test_diess_custom_thresholds():
    """Verify custom threshold override support."""
    custom_t = {"EXCELLENT": 95.0, "GOOD": 80.0, "MEDIUM": 60.0, "HIGH": 30.0}
    grade, risk = DiessService.resolve_grade_and_risk(92.0, custom_thresholds=custom_t)
    # 92 is below 95, so it should be Good under custom threshold
    assert grade == DiessGrade.GOOD


def test_api_comprehensive_diess_endpoint():
    """Verify POST /api/v1/analysis/diess runs full 5-vector assessment."""
    payload = {
        "username": "quantum_sec_officer",
        "full_name": "Quantum Officer",
        "role_or_title": "Security Analyst",
    }
    response = client.post("/api/v1/analysis/diess", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    res = data["data"]
    assert "overall_score" in res
    assert "grade" in res
    assert "weighted_breakdown" in res
    assert len(res["weighted_breakdown"]) == 5
