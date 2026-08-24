"""Unit and integration tests for database persistence and report endpoints."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import inspect
from app.main import app
from app.db.session import engine

client = TestClient(app)


def test_database_tables_exist():
    """Verify that all normalized tables are successfully created in the database."""
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    assert "identity_scans" in tables
    assert "username_analyses" in tables
    assert "privacy_analyses" in tables
    assert "findings" in tables
    assert "recommendations" in tables
    assert "reports" in tables


def test_create_report_from_identity_data():
    """Verify POST /api/v1/reports persists a scan from raw identity data."""
    payload = {
        "report_title": "Executive Identity Audit",
        "identity_data": {
            "username": "alex_secure_99",
            "full_name": "Alex Mercer",
            "birth_year": 1988,
            "privacy_fields": [
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
    }
    response = client.post("/api/v1/reports", json=payload)
    assert response.status_code == 201
    json_data = response.json()
    assert json_data["success"] is True
    report = json_data["data"]
    assert "id" in report
    assert report["report_title"] == "Executive Identity Audit"
    assert 0.0 <= report["diess_score"] <= 100.0
    assert report["username_result"] is not None
    assert report["privacy_result"] is not None
    assert len(report["findings"]) > 0
    assert len(report["recommendations"]) > 0

    # Test retrieval using the newly created ID
    report_id = report["id"]
    get_res = client.get(f"/api/v1/reports/{report_id}")
    assert get_res.status_code == 200
    get_data = get_res.json()["data"]
    assert get_data["id"] == report_id
    assert get_data["report_title"] == "Executive Identity Audit"


def test_get_report_not_found():
    """Verify 404 response when querying a non-existent report ID."""
    response = client.get("/api/v1/reports/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
    json_data = response.json()
    assert json_data["success"] is False
    assert "not found" in json_data["error"]["message"].lower()


def test_list_reports_endpoint():
    """Verify GET /api/v1/reports returns historical report summaries."""
    response = client.get("/api/v1/reports")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert isinstance(json_data["data"], list)
    assert len(json_data["data"]) >= 1


def test_create_report_invalid_payload():
    """Verify 400 response when neither identity_data nor identity_result is provided."""
    payload = {"report_title": "Empty Report"}
    response = client.post("/api/v1/reports", json=payload)
    assert response.status_code == 400
    json_data = response.json()
    assert json_data["success"] is False
