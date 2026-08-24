"""Unit tests for Username Risk Engine."""

import pytest
from app.core.enums import Severity, RiskLevel
from app.engines.username_engine import UsernameRiskEngine


def test_clean_pseudonymous_username():
    """Verify that a strong, pseudonymous handle scores 100 with LOW risk."""
    res = UsernameRiskEngine.analyze(
        username="phantom_sentinel_x",
        full_name="Alice Smith",
        birth_year=1992,
    )
    assert res.score == 100.0
    assert res.risk_level == RiskLevel.LOW
    assert len(res.findings) == 0
    assert len(res.detected_patterns) == 0


def test_full_name_leak():
    """Verify detection when username contains full legal name."""
    res = UsernameRiskEngine.analyze(
        username="alice_smith_hq",
        full_name="Alice Smith",
    )
    assert res.score < 100.0
    assert "FULL_NAME_MATCH" in res.detected_patterns
    assert any(f.severity == Severity.CRITICAL for f in res.findings)


def test_partial_name_leak():
    """Verify detection when username contains first or last name."""
    res = UsernameRiskEngine.analyze(
        username="alice_explorer",
        full_name="Alice Smith",
    )
    assert res.score <= 80.0
    assert "PARTIAL_NAME_MATCH" in res.detected_patterns


def test_exact_birth_year_leak():
    """Verify detection when username includes exact 4-digit birth year."""
    res = UsernameRiskEngine.analyze(
        username="robert1990",
        birth_year=1990,
    )
    assert res.score <= 75.0
    assert "EXACT_BIRTH_YEAR" in res.detected_patterns
    assert any("1990" in f.description for f in res.findings)


def test_two_digit_birth_year_suffix():
    """Verify detection when username ends with 2-digit birth year."""
    res = UsernameRiskEngine.analyze(
        username="robert90",
        birth_year=1990,
    )
    assert "BIRTH_YEAR_2DIGIT" in res.detected_patterns
    assert any(f.severity == Severity.MEDIUM for f in res.findings)


def test_standalone_year_pattern_without_dob():
    """Verify detection of probable 4-digit year when DOB is not provided."""
    res = UsernameRiskEngine.analyze(
        username="sentinel1984",
        birth_year=None,
    )
    assert "PROBABLE_YEAR" in res.detected_patterns
    assert res.score == 85.0


def test_sequential_numbers():
    """Verify detection of ascending and descending sequential numbers."""
    res_asc = UsernameRiskEngine.analyze(username="player123")
    assert "SEQUENTIAL_NUMBERS" in res_asc.detected_patterns

    res_desc = UsernameRiskEngine.analyze(username="player321")
    assert "REVERSE_SEQUENTIAL_NUMBERS" in res_desc.detected_patterns


def test_repeating_digits():
    """Verify detection of repeated digits (e.g. 000, 777)."""
    res = UsernameRiskEngine.analyze(username="spartan777")
    assert "REPEATING_DIGITS" in res.detected_patterns


def test_compound_multiple_personal_details():
    """Verify compounded critical risk when full name and birth year are combined."""
    res = UsernameRiskEngine.analyze(
        username="alicesmith1992",
        full_name="Alice Smith",
        birth_year=1992,
    )
    assert "MULTIPLE_PERSONAL_DETAILS" in res.detected_patterns
    assert res.risk_level == RiskLevel.CRITICAL
    assert res.score < 35.0


def test_empty_or_whitespace_username():
    """Verify safe handling of empty or blank username."""
    res = UsernameRiskEngine.analyze(username="")
    assert res.score == 0.0
    assert res.risk_level == RiskLevel.CRITICAL
    assert "EMPTY_USERNAME" in res.detected_patterns

    res_spaces = UsernameRiskEngine.analyze(username="   ")
    assert res_spaces.score == 0.0


def test_short_handle_warning():
    """Verify warning for very short handles (<4 chars)."""
    res = UsernameRiskEngine.analyze(username="abc")
    assert "SHORT_HANDLE" in res.detected_patterns
    assert res.score == 95.0


def test_case_insensitivity_and_clamping():
    """Verify case-insensitivity and score bounds."""
    res = UsernameRiskEngine.analyze(
        username="ALICESMITH1992",
        full_name="alice smith",
        birth_year=1992,
    )
    assert 0.0 <= res.score <= 100.0
    assert "FULL_NAME_MATCH" in res.detected_patterns


def test_engine_determinism():
    """Verify that multiple identical runs produce strictly equal results."""
    run1 = UsernameRiskEngine.analyze("john_doe_95", "John Doe", 1995)
    run2 = UsernameRiskEngine.analyze("john_doe_95", "John Doe", 1995)
    assert run1.score == run2.score
    assert run1.risk_level == run2.risk_level
    assert run1.detected_patterns == run2.detected_patterns
    assert len(run1.findings) == len(run2.findings)
