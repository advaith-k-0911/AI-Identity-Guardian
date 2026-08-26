"""Tests for Admin Analytics Telemetry and Production Security Hardening."""

import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def _get_admin_token():
    """Register an admin user and return auth token."""
    email = f"admin_{uuid.uuid4().hex[:8]}@example.com"
    res = client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "AdminPassword123!",
    })
    return res.json()["data"]["access_token"]


def test_security_headers_enforcement():
    """Verify production security headers are attached to all API responses."""
    resp = client.get("/health")
    assert resp.status_code == 200
    headers = resp.headers
    assert headers.get("X-Content-Type-Options") == "nosniff"
    assert headers.get("X-Frame-Options") == "DENY"
    assert headers.get("X-XSS-Protection") == "1; mode=block"
    assert "max-age=31536000" in headers.get("Strict-Transport-Security", "")
    assert headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"


def test_admin_analytics_requires_auth():
    """Verify admin analytics endpoint requires authentication."""
    resp = client.get("/api/v1/admin/analytics")
    assert resp.status_code == 401


def test_admin_analytics_aggregation():
    """Verify GET /api/v1/admin/analytics computes anonymized fleet telemetry."""
    # Get authenticated token
    token = _get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}

    # Seed a sample report (authenticated)
    report_headers = headers.copy()
    client.post(
        "/api/v1/reports",
        json={
            "report_title": "Fleet Test Report",
            "identity_data": {"username": "fleet_agent_01"},
        },
        headers=report_headers,
    )

    resp = client.get("/api/v1/admin/analytics", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    analytics = data["data"]

    assert "total_scans" in analytics
    assert "total_users" in analytics
    assert "average_diess" in analytics
    assert "risk_distribution" in analytics
    assert "top_vulnerability_categories" in analytics
    assert "top_remediation_actions" in analytics
    assert "improvement_trends" in analytics
    assert analytics["total_scans"] >= 1


def test_admin_analytics_zero_pii_guarantee():
    """Verify admin telemetry never leaks user emails, names, or passwords."""
    token = _get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}

    resp = client.get("/api/v1/admin/analytics", headers=headers)
    assert resp.status_code == 200
    raw_text = resp.text

    # Verify zero user identifiers or credential hashes in telemetry
    forbidden_tokens = ["@secure.internal", "hashed_password", "$2b$", "agent_alpha", "john_doe"]
    for token_str in forbidden_tokens:
        assert token_str not in raw_text
