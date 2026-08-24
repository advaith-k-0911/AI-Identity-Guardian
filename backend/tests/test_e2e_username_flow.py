"""End-to-end integration tests for Username Security Scan workflow."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_e2e_clean_username_flow():
    """Verify flow for a clean pseudonymous username."""
    payload = {
        "username": "nexus_phantom_99",
        "full_name": "John Doe",
        "birth_year": 1980,
    }
    response = client.post("/api/v1/analysis/username", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    result = data["data"]
    assert result["score"] == 100.0
    assert result["risk_level"] == "LOW"
    assert len(result["findings"]) == 0
    assert len(result["detected_patterns"]) == 0


def test_e2e_name_and_dob_leak_flow():
    """Verify flow for a username with real name and birth year."""
    payload = {
        "username": "johndoe1980",
        "full_name": "John Doe",
        "birth_year": 1980,
    }
    response = client.post("/api/v1/analysis/username", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    result = data["data"]
    assert result["score"] < 35.0
    assert result["risk_level"] == "CRITICAL"
    assert "FULL_NAME_MATCH" in result["detected_patterns"]
    assert "EXACT_BIRTH_YEAR" in result["detected_patterns"]
    assert "MULTIPLE_PERSONAL_DETAILS" in result["detected_patterns"]
    assert len(result["findings"]) == 3
    # Check that each finding contains severity, impact, description, recommendation
    for finding in result["findings"]:
        assert finding["severity"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        assert finding["score_impact"] > 0
        assert len(finding["recommendation"]) > 10


def test_e2e_sequential_numbers_flow():
    """Verify flow for sequential numbers in username."""
    payload = {
        "username": "player12345",
    }
    response = client.post("/api/v1/analysis/username", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    result = data["data"]
    assert "SEQUENTIAL_NUMBERS" in result["detected_patterns"]
    assert result["score"] == 85.0
    assert result["risk_level"] == "LOW"
