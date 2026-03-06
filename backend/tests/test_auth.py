import pytest
from fastapi.testclient import TestClient
from ..main import app
from ..db import SessionLocal
from ..models import AdminUser
import bcrypt

client = TestClient(app)

def test_login_success(db_session):
    # Hash password
    password = b"testpassword"
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)

    # Create test user
    user = AdminUser(username="testadmin", password_hash=hashed.decode('utf-8'))
    db_session.add(user)
    db_session.commit()

    response = client.post("/api/login", json={"username": "testadmin", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json() == {"success": True, "message": "Login successful"}

def test_login_invalid_password(db_session):
    password = b"testpassword"
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)

    user = AdminUser(username="testadmin2", password_hash=hashed.decode('utf-8'))
    db_session.add(user)
    db_session.commit()

    response = client.post("/api/login", json={"username": "testadmin2", "password": "wrongpassword"})
    assert response.status_code == 401
    assert "Invalid username or password" in response.json()["detail"]

def test_login_invalid_user(db_session):
    response = client.post("/api/login", json={"username": "nonexistent", "password": "password"})
    assert response.status_code == 401
    assert "Invalid username or password" in response.json()["detail"]
