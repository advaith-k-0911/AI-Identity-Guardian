"""Integration tests for POST /api/v1/analysis/credentials endpoint."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_api_credentials_analysis_valid():
    """Verify POST /api/v1/analysis/credentials returns structured response."""
    payload = {
        "mfa_method": "AUTHENTICATOR_APP",
        "password_manager": "DEDICATED_MANAGER",
        "reuse_scope": "UNIQUE_ALL",
        "password_age": "UNDER_6_MONTHS",
    }
    response = client.post("/api/v1/analysis/credentials", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    result = data["data"]
    assert "score" in result
    assert "risk_level" in result
    assert "mfa_posture" in result
    assert "reuse_risk_tier" in result
    assert result["score"] == 100.0


def test_api_credentials_analysis_defaults():
    """Verify POST /api/v1/analysis/credentials works with default empty object."""
    response = client.post("/api/v1/analysis/credentials", json={})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "score" in data["data"]
