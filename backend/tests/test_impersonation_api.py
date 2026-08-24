"""Integration tests for POST /api/v1/analysis/impersonation endpoint."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_api_impersonation_analysis_valid():
    """Verify POST /api/v1/analysis/impersonation returns structured response."""
    payload = {
        "username": "alex_cto_security",
        "display_name": "Alex Vance",
        "role_or_title": "Chief Technology Officer (CTO)",
    }
    response = client.post("/api/v1/analysis/impersonation", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    result = data["data"]
    assert "score" in result
    assert "risk_level" in result
    assert "susceptibility_tier" in result
    assert "lookalike_variants" in result
    assert len(result["lookalike_variants"]) > 0
    assert len(result["findings"]) > 0
    assert len(result["recommendations"]) > 0


def test_api_impersonation_analysis_invalid_payload():
    """Verify 422 validation error on missing username field."""
    payload = {"role_or_title": "Admin"}
    response = client.post("/api/v1/analysis/impersonation", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_ERROR"
