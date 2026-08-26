"""API endpoint integration tests using FastAPI TestClient."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_index_endpoint():
    """Verify GET / returns operational status."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "healthy"
    assert data["data"]["app_name"] == "AI Identity Guardian"


def test_root_health_endpoint():
    """Verify GET /health returns operational status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "healthy"
    assert data["data"]["app_name"] == "AI Identity Guardian"


def test_v1_health_endpoint():
    """Verify GET /api/v1/health returns operational status."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "healthy"


def test_username_analysis_endpoint_valid():
    """Verify POST /api/v1/analysis/username with clean input."""
    payload = {
        "username": "cyber_guardian_99",
        "full_name": "Jane Smith",
        "birth_year": 1985,
    }
    response = client.post("/api/v1/analysis/username", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "data" in json_data
    assert json_data["data"]["score"] == 100.0
    assert json_data["data"]["risk_level"] == "LOW"
    assert json_data["data"]["username"] == "cyber_guardian_99"


def test_username_analysis_endpoint_with_findings():
    """Verify POST /api/v1/analysis/username detecting name and year."""
    payload = {
        "username": "janesmith1985",
        "full_name": "Jane Smith",
        "birth_year": 1985,
    }
    response = client.post("/api/v1/analysis/username", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["score"] < 40.0
    assert json_data["data"]["risk_level"] == "CRITICAL"
    assert "FULL_NAME_MATCH" in json_data["data"]["detected_patterns"]
    assert "EXACT_BIRTH_YEAR" in json_data["data"]["detected_patterns"]


def test_username_analysis_invalid_payload():
    """Verify validation error handling on invalid / empty payload."""
    payload = {}  # Missing required 'username' field
    response = client.post("/api/v1/analysis/username", json=payload)
    assert response.status_code == 422
    json_data = response.json()
    assert json_data["success"] is False
    assert json_data["error"]["code"] == "VALIDATION_ERROR"
    assert "username" in json_data["error"]["message"]


def test_privacy_defaults_endpoint():
    """Verify GET /api/v1/analysis/privacy/defaults returns baseline fields."""
    response = client.get("/api/v1/analysis/privacy/defaults")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) >= 5


def test_privacy_analysis_endpoint_valid():
    """Verify POST /api/v1/analysis/privacy with valid field entries."""
    payload = {
        "fields": [
            {
                "field_name": "phone_number",
                "is_provided": True,
                "is_public": True,
                "is_necessary": False,
                "sensitivity": "CRITICAL"
            },
            {
                "field_name": "email",
                "is_provided": True,
                "is_public": False,
                "is_necessary": True,
                "sensitivity": "HIGH"
            }
        ]
    }
    response = client.post("/api/v1/analysis/privacy", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["exposed_sensitive_count"] == 1
    assert json_data["data"]["score"] == 65.0
    assert len(json_data["data"]["findings"]) == 1


def test_privacy_analysis_invalid_sensitivity():
    """Verify validation error when an invalid sensitivity enum value is provided."""
    payload = {
        "fields": [
            {
                "field_name": "phone_number",
                "is_provided": True,
                "is_public": True,
                "is_necessary": False,
                "sensitivity": "EXTREME_SUPER_HIGH"  # Invalid enum value
            }
        ]
    }
    response = client.post("/api/v1/analysis/privacy", json=payload)
    assert response.status_code == 422
    json_data = response.json()
    assert json_data["success"] is False
    assert json_data["error"]["code"] == "VALIDATION_ERROR"


def test_identity_composite_analysis_endpoint():
    """Verify POST /api/v1/analysis/identity evaluates both modules and calculates DIESS."""
    payload = {
        "username": "alex_morgan_1994",
        "full_name": "Alex Morgan",
        "birth_year": 1994,
        "privacy_fields": [
            {
                "field_name": "date_of_birth",
                "is_provided": True,
                "is_public": True,
                "is_necessary": False,
                "sensitivity": "HIGH"
            }
        ]
    }
    response = client.post("/api/v1/analysis/identity", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "diess_score" in json_data["data"]
    assert "username_result" in json_data["data"]
    assert "privacy_result" in json_data["data"]
    assert len(json_data["data"]["recommendations"]) > 0
    assert 0.0 <= json_data["data"]["diess_score"] <= 100.0
