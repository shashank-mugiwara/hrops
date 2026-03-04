"""Tests for /settings/ endpoint."""


def test_get_settings_defaults(client):
    """First GET auto-creates the row with defaults."""
    res = client.get("/settings/")
    assert res.status_code == 200
    data = res.json()
    assert data["email_provider"] == "smtp"
    assert data["smtp_use_tls"] is True
    assert data["slack_socket_mode"] is False


def test_update_settings_smtp(client):
    payload = {
        "email_provider": "smtp",
        "smtp_host": "smtp.gmail.com",
        "smtp_port": 587,
        "smtp_user": "noreply@company.com",
        "smtp_password": "secret",
        "smtp_use_tls": True,
        "smtp_from_address": "HR Team <noreply@company.com>",
        "slack_bot_token": None,
        "slack_socket_mode": False,
        "slack_app_token": None,
        "slack_channel_id": None,
    }
    res = client.put("/settings/", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["smtp_host"] == "smtp.gmail.com"
    assert data["smtp_port"] == 587
    assert data["smtp_from_address"] == "HR Team <noreply@company.com>"


def test_update_settings_aws_ses(client):
    payload = {
        "email_provider": "aws_ses",
        "smtp_host": None,
        "smtp_port": None,
        "smtp_user": None,
        "smtp_password": None,
        "smtp_use_tls": True,
        "smtp_from_address": None,
        "slack_bot_token": None,
        "slack_socket_mode": False,
        "slack_app_token": None,
        "slack_channel_id": None,
    }
    res = client.put("/settings/", json=payload)
    assert res.status_code == 200
    assert res.json()["email_provider"] == "aws_ses"


def test_update_settings_slack(client):
    payload = {
        "email_provider": "smtp",
        "smtp_host": None,
        "smtp_port": 587,
        "smtp_user": None,
        "smtp_password": None,
        "smtp_use_tls": True,
        "smtp_from_address": None,
        "slack_bot_token": "xoxb-12345",
        "slack_socket_mode": True,
        "slack_app_token": "xapp-67890",
        "slack_channel_id": "C0XXXXXXX",
    }
    res = client.put("/settings/", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["slack_bot_token"] == "xoxb-12345"
    assert data["slack_socket_mode"] is True
    assert data["slack_app_token"] == "xapp-67890"
    assert data["slack_channel_id"] == "C0XXXXXXX"


def test_settings_persisted_between_calls(client):
    """PUT then GET should return same values."""
    payload = {
        "email_provider": "smtp",
        "smtp_host": "mail.example.com",
        "smtp_port": 465,
        "smtp_user": "user",
        "smtp_password": "pass",
        "smtp_use_tls": False,
        "smtp_from_address": None,
        "slack_bot_token": None,
        "slack_socket_mode": False,
        "slack_app_token": None,
        "slack_channel_id": None,
    }
    client.put("/settings/", json=payload)
    res = client.get("/settings/")
    assert res.status_code == 200
    data = res.json()
    assert data["smtp_host"] == "mail.example.com"
    assert data["smtp_port"] == 465
    assert data["smtp_use_tls"] is False
