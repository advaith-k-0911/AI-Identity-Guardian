"""Authentication and authorization integration tests."""

import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_register_user_success():
    """Verify user registration with bcrypt password hashing."""
    unique_email = f"guardian_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "email": unique_email,
        "password": "SuperSecretPassword123!",
        "full_name": "Guardian User",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    token_data = data["data"]
    assert "access_token" in token_data
    assert token_data["user"]["email"] == unique_email
    assert token_data["user"]["full_name"] == "Guardian User"
    assert "password" not in token_data["user"]
    assert "hashed_password" not in token_data["user"]


def test_register_duplicate_email():
    """Verify error when attempting to register with an existing email."""
    unique_email = f"dup_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "email": unique_email,
        "password": "SuperSecretPassword123!",
    }
    res1 = client.post("/api/v1/auth/register", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/v1/auth/register", json=payload)
    assert res2.status_code == 400
    data = res2.json()
    assert data["success"] is False
    assert "Registration could not be completed" in data["error"]["message"]


def test_register_weak_password():
    """Verify validation error when password is under 8 characters."""
    payload = {
        "email": f"weak_{uuid.uuid4().hex[:8]}@example.com",
        "password": "123",  # Under 8 characters
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False


def test_login_user_success():
    """Verify user authentication with correct credentials."""
    unique_email = f"login_{uuid.uuid4().hex[:8]}@example.com"
    password = "SuperSecretPassword123!"
    client.post("/api/v1/auth/register", json={"email": unique_email, "password": password})

    payload = {
        "email": unique_email,
        "password": password,
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]


def test_login_wrong_password():
    """Verify 401 Unauthorized for incorrect password."""
    unique_email = f"wrong_{uuid.uuid4().hex[:8]}@example.com"
    password = "SuperSecretPassword123!"
    client.post("/api/v1/auth/register", json={"email": unique_email, "password": password})

    payload = {
        "email": unique_email,
        "password": "WrongPassword999!",
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert "incorrect" in data["error"]["message"].lower()


def test_get_me_flow():
    """Verify GET /api/v1/auth/me for authenticated user and 401 for unauthenticated."""
    # 1. Test unauthenticated
    unauth_res = client.get("/api/v1/auth/me")
    assert unauth_res.status_code == 401

    # 2. Register & Login to obtain token
    unique_email = f"me_{uuid.uuid4().hex[:8]}@example.com"
    reg_res = client.post("/api/v1/auth/register", json={
        "email": unique_email,
        "password": "SuperSecretPassword123!",
    })
    token = reg_res.json()["data"]["access_token"]

    # 3. Test with Bearer token
    auth_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert auth_res.status_code == 200
    data = auth_res.json()
    assert data["success"] is True
    assert data["data"]["email"] == unique_email


def test_authenticated_report_ownership_flow():
    """Verify reports created by authenticated users are linked to their account."""
    unique_email = f"report_user_{uuid.uuid4().hex[:8]}@example.com"
    reg_res = client.post("/api/v1/auth/register", json={
        "email": unique_email,
        "password": "SuperSecretPassword123!",
    })
    token = reg_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create authenticated report
    report_payload = {
        "report_title": "My Private Security Report",
        "identity_data": {
            "username": "guardian_agent_007",
        }
    }
    create_res = client.post("/api/v1/reports", json=report_payload, headers=headers)
    assert create_res.status_code == 201
    report_id = create_res.json()["data"]["id"]

    # 3. List reports with user token
    list_res = client.get("/api/v1/reports", headers=headers)
    assert list_res.status_code == 200
    user_reports = list_res.json()["data"]
    assert any(r["id"] == report_id for r in user_reports)
