"""Unit and integration tests for AI Explanation Service and fallback resilience."""

import asyncio
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app
from app.core.enums import Severity, RiskLevel, FindingCategory
from app.schemas.findings import Finding
from app.schemas.ai import AIExplanationRequest
from app.services.ai_provider import (
    DeterministicFallbackProvider,
    GeminiAIProvider,
    AIExplanationService,
)

client = TestClient(app)


def _make_mock_findings():
    return [
        Finding(
            id="FIND-1",
            category=FindingCategory.USERNAME,
            severity=Severity.CRITICAL,
            title="Username Contains Full Real Name",
            description="Exposes legal name directly in public handle.",
            score_impact=30.0,
            recommendation="Adopt an anonymous pseudonym handle.",
        ),
        Finding(
            id="FIND-2",
            category=FindingCategory.CREDENTIALS,
            severity=Severity.HIGH,
            title="No Multi-Factor Authentication",
            description="Single-factor password login vulnerability.",
            score_impact=25.0,
            recommendation="Enable FIDO2 hardware key or TOTP authenticator app.",
        ),
    ]


def test_deterministic_fallback_with_findings():
    """Verify fallback provider translates findings into plain English with zero hallucination."""
    provider = DeterministicFallbackProvider()
    req = AIExplanationRequest(
        findings=_make_mock_findings(),
        diess_score=45.0,
        risk_level=RiskLevel.HIGH,
        context_title="@john_doe_99",
    )
    res = asyncio.run(provider.explain(req))
    assert res.is_fallback is True
    assert "john_doe_99" in res.narrative_summary
    assert len(res.finding_explanations) == 2
    assert res.finding_explanations[0].defensive_priority == "Immediate Action Required"
    assert len(res.actionable_takeaways) == 2
    assert "Adopt an anonymous pseudonym" in res.actionable_takeaways[0]


def test_deterministic_fallback_clean_posture():
    """Verify fallback provider generates positive briefing when findings are empty."""
    provider = DeterministicFallbackProvider()
    req = AIExplanationRequest(
        findings=[],
        diess_score=100.0,
        risk_level=RiskLevel.LOW,
        context_title="@crypto_sentinel",
    )
    res = asyncio.run(provider.explain(req))
    assert res.is_fallback is True
    assert "crypto_sentinel" in res.narrative_summary
    assert "100" in res.narrative_summary
    assert len(res.finding_explanations) == 0


def test_ai_explanation_service_graceful_fallback():
    """Verify AIExplanationService gracefully uses fallback when external key is absent."""
    req = AIExplanationRequest(
        findings=_make_mock_findings(),
        diess_score=50.0,
        risk_level=RiskLevel.MEDIUM,
    )
    res = asyncio.run(AIExplanationService.explain(req))
    assert res.narrative_summary is not None
    assert len(res.finding_explanations) == 2
    assert res.is_fallback is True


def test_gemini_provider_exception_handling():
    """Verify that Gemini provider failures fall back seamlessly without throwing."""
    provider = GeminiAIProvider(api_key="invalid_fake_key_123")
    req = AIExplanationRequest(
        findings=_make_mock_findings(),
        diess_score=40.0,
        risk_level=RiskLevel.HIGH,
    )
    res = asyncio.run(provider.explain(req))
    assert res is not None
    assert res.is_fallback is True
    assert len(res.finding_explanations) == 2


def test_api_ai_explain_endpoint():
    """Verify POST /api/v1/ai/explain returns structured AI explanation payload."""
    payload = {
        "findings": [
            {
                "id": "FIND-TEST",
                "category": "USERNAME",
                "severity": "HIGH",
                "title": "Birth Year Pattern Found",
                "description": "Username ends in 1995.",
                "score_impact": 20.0,
                "recommendation": "Remove birth year from handle.",
            }
        ],
        "diess_score": 80.0,
        "risk_level": "LOW",
        "context_title": "Test Scan",
        "audience_level": "general",
    }
    response = client.post("/api/v1/ai/explain", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    res = data["data"]
    assert "narrative_summary" in res
    assert "finding_explanations" in res
    assert "actionable_takeaways" in res
    assert len(res["finding_explanations"]) == 1
    assert "Remove birth year" in res["actionable_takeaways"][0]
