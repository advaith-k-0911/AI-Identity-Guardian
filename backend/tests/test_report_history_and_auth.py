"""Authorization and Historical Trend tests for Security Reports."""

import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def _register_and_get_token(prefix: str = "agent", password: str = "StrongSecret123!"):
    """Helper registering a unique user and returning JWT auth headers."""
    unique_email = f"{prefix}_{uuid.uuid4().hex[:8]}@secure.internal"
    resp = client.post(
        "/api/v1/auth/register",
        json={"email": unique_email, "password": password, "full_name": "Test Agent"},
    )
    assert resp.status_code == 201
    token = resp.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_user_report_isolation_and_authorization():
    """Verify that User A's reports cannot be accessed or listed by User B."""
    auth_a = _register_and_get_token("agent_alpha")
    auth_b = _register_and_get_token("agent_bravo")

    # User A creates a report
    rep_payload = {
        "report_title": "Confidential Alpha Audit",
        "identity_data": {"username": "agent_alpha"},
    }
    create_res = client.post("/api/v1/reports", json=rep_payload, headers=auth_a)
    assert create_res.status_code == 201
    rep_a_id = create_res.json()["data"]["id"]

    # User A retrieves their own report -> 200 OK
    get_res_a = client.get(f"/api/v1/reports/{rep_a_id}", headers=auth_a)
    assert get_res_a.status_code == 200
    assert get_res_a.json()["data"]["report_title"] == "Confidential Alpha Audit"

    # User B attempts to access User A's report -> 404 (Access Denied / Isolated)
    get_res_b = client.get(f"/api/v1/reports/{rep_a_id}", headers=auth_b)
    assert get_res_b.status_code == 404

    # User B lists reports -> User A's report is NOT present
    list_res_b = client.get("/api/v1/reports", headers=auth_b)
    assert list_res_b.status_code == 200
    rep_ids_b = [r["id"] for r in list_res_b.json()["data"]]
    assert rep_a_id not in rep_ids_b


def test_historical_score_delta_and_trend_progression():
    """Verify score change deltas and trend direction computation over sequential scans."""
    auth_headers = _register_and_get_token("trend_analyst")

    # Scan 1: Baseline Scan (Moderate score)
    res1 = client.post(
        "/api/v1/reports",
        json={
            "report_title": "Audit 1 - Baseline",
            "identity_data": {"username": "john_doe_1990", "full_name": "John Doe", "birth_year": 1990},
        },
        headers=auth_headers,
    )
    assert res1.status_code == 201
    score1 = res1.json()["data"]["diess_score"]

    # Scan 2: Improved Scan (Pseudonym handle)
    res2 = client.post(
        "/api/v1/reports",
        json={
            "report_title": "Audit 2 - Hardened Pseudonym",
            "identity_data": {"username": "quantum_cipher_nexus"},
        },
        headers=auth_headers,
    )
    assert res2.status_code == 201
    data2 = res2.json()["data"]
    score2 = data2["diess_score"]

    # Retrieve Audit 2 and check trend metrics
    get2 = client.get(f"/api/v1/reports/{data2['id']}", headers=auth_headers)
    assert get2.status_code == 200
    detail2 = get2.json()["data"]
    assert detail2["previous_score"] == score1
    assert detail2["score_delta"] == round(score2 - score1, 2)
    if score2 > score1:
        assert detail2["trend_direction"] == "IMPROVED"

    # List reports and check summary deltas
    list_res = client.get("/api/v1/reports", headers=auth_headers)
    assert list_res.status_code == 200
    summaries = list_res.json()["data"]
    assert len(summaries) >= 2


def test_delete_report_authorization():
    """Verify report deletion works for owner and denies non-owners."""
    auth_a = _register_and_get_token("delete_owner")
    auth_b = _register_and_get_token("delete_intruder")

    # Create report as User A
    create_res = client.post(
        "/api/v1/reports",
        json={"report_title": "Report to be Deleted", "identity_data": {"username": "user_del"}},
        headers=auth_a,
    )
    rep_id = create_res.json()["data"]["id"]

    # User B attempts to delete User A's report -> 404
    del_res_b = client.delete(f"/api/v1/reports/{rep_id}", headers=auth_b)
    assert del_res_b.status_code == 404

    # User A deletes their report -> 200 OK
    del_res_a = client.delete(f"/api/v1/reports/{rep_id}", headers=auth_a)
    assert del_res_a.status_code == 200

    # Verification: Report no longer exists
    get_res = client.get(f"/api/v1/reports/{rep_id}", headers=auth_a)
    assert get_res.status_code == 404
