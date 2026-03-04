"""Tests for /rules/ and /templates/ endpoints."""


RULE_PAYLOAD = {
    "name": "Welcome Email",
    "trigger_days": 1,
    "trigger_type": "before",
    "joining_date_ref": "joining_date",
    "status": "active",
    "channel": "email",
}

TEMPLATE_PAYLOAD = {
    "name": "Welcome Template",
    "channel": "Email",
    "subject": "Welcome aboard!",
    "body": "Hi {{name}}, welcome to the team!",
}


# --- Rules ---

def test_create_rule(client):
    res = client.post("/rules/", json=RULE_PAYLOAD)
    assert res.status_code == 200
    assert res.json()["name"] == "Welcome Email"


def test_list_rules(client):
    client.post("/rules/", json=RULE_PAYLOAD)
    res = client.get("/rules/")
    assert res.status_code == 200
    assert len(res.json()) >= 1


def test_update_rule(client):
    created = client.post("/rules/", json=RULE_PAYLOAD).json()
    res = client.put(f"/rules/{created['id']}", json={**RULE_PAYLOAD, "trigger_days": 3})
    assert res.status_code == 200
    assert res.json()["trigger_days"] == 3


def test_delete_rule(client):
    created = client.post("/rules/", json=RULE_PAYLOAD).json()
    res = client.delete(f"/rules/{created['id']}")
    assert res.status_code == 200


# --- Templates ---

def test_create_template(client):
    res = client.post("/templates/", json=TEMPLATE_PAYLOAD)
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Welcome Template"
    assert data["channel"] == "Email"


def test_list_templates(client):
    client.post("/templates/", json=TEMPLATE_PAYLOAD)
    res = client.get("/templates/")
    assert res.status_code == 200
    assert len(res.json()) >= 1


def test_get_template(client):
    created = client.post("/templates/", json=TEMPLATE_PAYLOAD).json()
    res = client.get(f"/templates/{created['id']}")
    assert res.status_code == 200
    assert res.json()["id"] == created["id"]


def test_update_template(client):
    created = client.post("/templates/", json=TEMPLATE_PAYLOAD).json()
    res = client.put(f"/templates/{created['id']}", json={**TEMPLATE_PAYLOAD, "subject": "Updated Subject"})
    assert res.status_code == 200
    assert res.json()["subject"] == "Updated Subject"


def test_delete_template(client):
    created = client.post("/templates/", json=TEMPLATE_PAYLOAD).json()
    res = client.delete(f"/templates/{created['id']}")
    assert res.status_code == 200
    res2 = client.get(f"/templates/{created['id']}")
    assert res2.status_code == 404
