"""End-to-end integration tests for Privacy Exposure Analysis workflow."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_e2e_minimal_private_flow():
    """Verify flow when user provides minimal necessary data kept private."""
    payload = {
        "fields": [
            {"field_name": "full_name", "is_provided": True, "is_public": False, "is_necessary": True, "sensitivity": "MEDIUM"},
            {"field_name": "email", "is_provided": True, "is_public": False, "is_necessary": True, "sensitivity": "HIGH"},
            {"field_name": "phone_number", "is_provided": False, "is_public": False, "is_necessary": False, "sensitivity": "CRITICAL"},
        ]
    }
    response = client.post("/api/v1/analysis/privacy", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    result = data["data"]
    assert result["score"] == 100.0
    assert result["risk_level"] == "LOW"
    assert result["exposed_sensitive_count"] == 0
    assert result["unnecessary_exposed_count"] == 0
    assert len(result["findings"]) == 0


def test_e2e_public_sensitive_information_flow():
    """Verify flow when critical phone number and birth date are publicly exposed."""
    payload = {
        "fields": [
            {"field_name": "phone_number", "is_provided": True, "is_public": True, "is_necessary": False, "sensitivity": "CRITICAL"},
            {"field_name": "date_of_birth", "is_provided": True, "is_public": True, "is_necessary": False, "sensitivity": "HIGH"},
            {"field_name": "email", "is_provided": True, "is_public": False, "is_necessary": True, "sensitivity": "HIGH"},
        ]
    }
    response = client.post("/api/v1/analysis/privacy", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    result = data["data"]
    assert result["score"] <= 40.0
    assert result["risk_level"] in ["HIGH", "CRITICAL"]
    assert result["exposed_sensitive_count"] == 2
    assert result["unnecessary_exposed_count"] == 2
    assert len(result["findings"]) == 2
    for finding in result["findings"]:
        assert finding["severity"] in ["HIGH", "CRITICAL"]
        assert len(finding["recommendation"]) > 10


def test_e2e_unnecessary_private_information_flow():
    """Verify advisory finding for unnecessary stored private data without score penalty."""
    payload = {
        "fields": [
            {"field_name": "interests", "is_provided": True, "is_public": False, "is_necessary": False, "sensitivity": "LOW"},
        ]
    }
    response = client.post("/api/v1/analysis/privacy", json=payload)
    assert response.status_code == 200
    data = response.json()
    result = data["data"]
    assert result["score"] == 100.0
    assert len(result["findings"]) == 1
    assert result["findings"][0]["severity"] == "LOW"
    assert "Unnecessary Stored Data" in result["findings"][0]["title"]


def test_e2e_empty_fields_flow():
    """Verify safe handling of empty fields array."""
    payload = {"fields": []}
    response = client.post("/api/v1/analysis/privacy", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["score"] == 100.0


def test_e2e_invalid_privacy_payload():
    """Verify validation error on malformed field structure."""
    payload = {"fields": [{"field_name": 12345}]}  # Missing required boolean fields
    response = client.post("/api/v1/analysis/privacy", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_ERROR"
