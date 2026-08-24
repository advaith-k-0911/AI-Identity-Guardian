"""Integration tests for POST /api/v1/analysis/recovery endpoint."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_api_recovery_analysis_valid():
    """Verify POST /api/v1/analysis/recovery returns structured response."""
    payload = {
        "recovery_email_status": "DEDICATED_ISOLATED_2FA",
        "recovery_phone_status": "NO_SMS_FALLBACK",
        "backup_codes_status": "STORED_ENCRYPTED_VAULT",
        "security_question_usage": "NEVER_USED_DISABLED",
        "is_recovery_contact_public": False,
    }
    response = client.post("/api/v1/analysis/recovery", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    result = data["data"]
    assert "score" in result
    assert "risk_level" in result
    assert "recovery_resilience_tier" in result
    assert "backup_codes_status_summary" in result
    assert result["score"] == 100.0


def test_api_recovery_analysis_defaults():
    """Verify POST /api/v1/analysis/recovery works with default empty object."""
    response = client.post("/api/v1/analysis/recovery", json={})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "score" in data["data"]
