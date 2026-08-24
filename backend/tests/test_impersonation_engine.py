"""Unit tests for Impersonation & Spoofing Risk Engine."""

import pytest
from app.core.enums import Severity, RiskLevel
from app.engines.impersonation_engine import ImpersonationRiskEngine


def test_clean_resilient_handle():
    """Verify strong resilience for a non-predictable pseudonymous handle."""
    res = ImpersonationRiskEngine.analyze(
        username="phantom_sentinel_k9",
        display_name="Anonymous Tester",
        role_or_title="Researcher",
    )
    assert res.score >= 85.0
    assert res.risk_level == RiskLevel.LOW
    assert res.susceptibility_tier == "LOW"
    assert len(res.lookalike_variants) > 0


def test_high_authority_executive_role():
    """Verify high severity finding when user has a high-value authority role (e.g. CEO, CISO)."""
    res = ImpersonationRiskEngine.analyze(
        username="alex_mercer",
        display_name="Alex Mercer",
        role_or_title="Chief Executive Officer (CEO)",
    )
    assert res.score <= 60.0
    assert res.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]
    assert any("High-Authority Role" in f.title for f in res.findings)


def test_canonical_name_mapping():
    """Verify detection when handle directly mirrors full legal name."""
    res = ImpersonationRiskEngine.analyze(
        username="alicesmith",
        display_name="Alice Smith",
    )
    assert any("Predictable Canonical" in f.title for f in res.findings)
    assert res.score < 100.0


def test_homoglyph_and_separator_mimicry():
    """Verify lookalike character substitution and separator duplication detection."""
    res = ImpersonationRiskEngine.analyze(
        username="cool_security_lead",
    )
    assert any("Separator Duplication" in f.title for f in res.findings)
    assert any("cool__security_lead" in v for v in res.lookalike_variants)


def test_lookalike_variants_generation():
    """Verify defensive generation of authority and homoglyph spoofed variants."""
    variants = ImpersonationRiskEngine.generate_lookalike_variants("satya_nadella")
    assert "satya_nadella_official" in variants or "satya__nadella" in variants
    assert len(variants) <= 8


def test_empty_username_handling():
    """Verify safe error finding on empty handle."""
    res = ImpersonationRiskEngine.analyze(username="")
    assert res.score == 0.0
    assert res.risk_level == RiskLevel.CRITICAL
    assert res.susceptibility_tier == "VERY HIGH"
