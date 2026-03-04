"""Tests for /groups/ and /departments/ endpoints."""


GROUP_PAYLOAD = {"name": "Engineering", "description": "Tech team"}
DEPT_PAYLOAD = {"name": "Product", "description": "Product dept"}


# --- Departments ---

def test_create_department(client):
    res = client.post("/departments/", json=DEPT_PAYLOAD)
    assert res.status_code == 200
    assert res.json()["name"] == "Product"


def test_list_departments(client):
    client.post("/departments/", json=DEPT_PAYLOAD)
    res = client.get("/departments/")
    assert res.status_code == 200
    assert len(res.json()) >= 1


# --- Groups ---

def test_create_group(client):
    res = client.post("/groups/", json=GROUP_PAYLOAD)
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Engineering"
    assert "id" in data


def test_list_groups(client):
    client.post("/groups/", json=GROUP_PAYLOAD)
    res = client.get("/groups/")
    assert res.status_code == 200
    assert len(res.json()) >= 1


def test_get_group(client):
    created = client.post("/groups/", json=GROUP_PAYLOAD).json()
    res = client.get(f"/groups/{created['id']}")
    assert res.status_code == 200
    assert res.json()["name"] == "Engineering"


def test_update_group(client):
    created = client.post("/groups/", json=GROUP_PAYLOAD).json()
    res = client.put(f"/groups/{created['id']}", json={**GROUP_PAYLOAD, "description": "Updated"})
    assert res.status_code == 200
    assert res.json()["description"] == "Updated"


def test_delete_group(client):
    created = client.post("/groups/", json=GROUP_PAYLOAD).json()
    res = client.delete(f"/groups/{created['id']}")
    assert res.status_code == 200


def test_bulk_delete_groups(client):
    g1 = client.post("/groups/", json=GROUP_PAYLOAD).json()
    g2 = client.post("/groups/", json={"name": "Design"}).json()
    res = client.post("/groups/bulk_action", json={"action": "delete", "group_ids": [g1["id"], g2["id"]]})
    assert res.status_code == 200
    assert res.json()["deleted"] == 2


def test_group_member_and_rule_counts(client):
    """member_count and rule_count should be integers."""
    created = client.post("/groups/", json=GROUP_PAYLOAD).json()
    res = client.get("/groups/")
    group = next(g for g in res.json() if g["id"] == created["id"])
    assert isinstance(group["member_count"], int)
    assert isinstance(group["rule_count"], int)
