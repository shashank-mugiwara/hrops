"""Tests for /candidates/ endpoints."""


CANDIDATE_PAYLOAD = {
    "candidate_name": "Alice Smith",
    "candidate_email": "alice@example.com",
    "role": "Engineer",
    "status": "Active",
    "joining_date": "2026-04-01",
}


def test_create_candidate(client):
    res = client.post("/candidates/", json=CANDIDATE_PAYLOAD)
    assert res.status_code == 200
    data = res.json()
    assert data["candidate_name"] == "Alice Smith"
    assert data["candidate_email"] == "alice@example.com"
    assert "id" in data


def test_list_candidates(client):
    client.post("/candidates/", json=CANDIDATE_PAYLOAD)
    res = client.get("/candidates/")
    assert res.status_code == 200
    assert len(res.json()) == 1


def test_get_candidate(client):
    created = client.post("/candidates/", json=CANDIDATE_PAYLOAD).json()
    res = client.get(f"/candidates/{created['id']}")
    assert res.status_code == 200
    assert res.json()["id"] == created["id"]


def test_update_candidate(client):
    created = client.post("/candidates/", json=CANDIDATE_PAYLOAD).json()
    updated_payload = {**CANDIDATE_PAYLOAD, "role": "Senior Engineer"}
    res = client.put(f"/candidates/{created['id']}", json=updated_payload)
    assert res.status_code == 200
    assert res.json()["role"] == "Senior Engineer"


def test_delete_candidate(client):
    created = client.post("/candidates/", json=CANDIDATE_PAYLOAD).json()
    res = client.delete(f"/candidates/{created['id']}")
    assert res.status_code == 200
    # Confirm gone
    res2 = client.get(f"/candidates/{created['id']}")
    assert res2.status_code == 404


def test_candidate_not_found(client):
    res = client.get("/candidates/9999")
    assert res.status_code == 404


def test_search_candidates(client):
    client.post("/candidates/", json=CANDIDATE_PAYLOAD)
    client.post("/candidates/", json={**CANDIDATE_PAYLOAD, "candidate_name": "Bob Jones", "candidate_email": "bob@example.com"})
    res = client.get("/candidates/?search=alice")
    assert res.status_code == 200
    results = res.json()
    assert len(results) == 1
    assert results[0]["candidate_name"] == "Alice Smith"


def test_filter_by_status(client):
    client.post("/candidates/", json=CANDIDATE_PAYLOAD)
    client.post("/candidates/", json={**CANDIDATE_PAYLOAD, "candidate_email": "bob@example.com", "status": "Pending"})
    res = client.get("/candidates/?status=Active")
    assert res.status_code == 200
    results = res.json()
    assert all(c["status"] == "Active" for c in results)


def test_check_duplicates(client):
    client.post("/candidates/", json=CANDIDATE_PAYLOAD)
    res = client.post("/candidates/check_duplicates", json=["alice@example.com", "unknown@example.com"])
    assert res.status_code == 200
    data = res.json()
    assert "alice@example.com" in data["duplicates"]
    assert "unknown@example.com" not in data["duplicates"]


def test_candidate_activity(client):
    created = client.post("/candidates/", json=CANDIDATE_PAYLOAD).json()
    res = client.get(f"/candidates/{created['id']}/activity")
    assert res.status_code == 200
    logs = res.json()
    # Should have a 'created' audit log entry
    assert any(log["event_type"] == "created" for log in logs)


def test_bulk_delete_candidates(client):
    c1 = client.post("/candidates/", json=CANDIDATE_PAYLOAD).json()
    c2 = client.post("/candidates/", json={**CANDIDATE_PAYLOAD, "candidate_email": "bob@example.com"}).json()
    res = client.post("/candidates/bulk_action", json={"action": "delete", "candidate_ids": [c1["id"], c2["id"]]})
    assert res.status_code == 200
    assert client.get("/candidates/").json() == []


def test_csv_export(client):
    client.post("/candidates/", json=CANDIDATE_PAYLOAD)
    res = client.get("/candidates/export")
    assert res.status_code == 200
    assert "text/csv" in res.headers.get("content-type", "")
    content = res.text
    assert "Alice Smith" in content
