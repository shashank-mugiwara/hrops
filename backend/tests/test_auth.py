import pytest
from ..models import AdminUser
import bcrypt
from ..api.endpoints.auth import get_db
from ..main import app

def test_login_success(client, db_session):
    app.dependency_overrides[get_db] = lambda: db_session

    # Hash password
    password = b"testpassword"
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)

    # Clean up before testing
    db_session.query(AdminUser).filter(AdminUser.username == "testadmin").delete()
    db_session.commit()

    # Create test user
    user = AdminUser(username="testadmin", password_hash=hashed.decode('utf-8'))
    db_session.add(user)
    db_session.commit()

    response = client.post("/login", json={"username": "testadmin", "password": "testpassword"})
    assert response.status_code == 200
    assert response.json() == {"success": True, "message": "Login successful"}

def test_login_invalid_password(client, db_session):
    app.dependency_overrides[get_db] = lambda: db_session
    password = b"testpassword"
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)

    db_session.query(AdminUser).filter(AdminUser.username == "testadmin2").delete()
    db_session.commit()

    user = AdminUser(username="testadmin2", password_hash=hashed.decode('utf-8'))
    db_session.add(user)
    db_session.commit()

    response = client.post("/login", json={"username": "testadmin2", "password": "wrongpassword"})
    assert response.status_code == 401
    assert "Invalid username or password" in response.json()["detail"]

def test_login_invalid_user(client, db_session):
    app.dependency_overrides[get_db] = lambda: db_session
    response = client.post("/login", json={"username": "nonexistent", "password": "password"})
    assert response.status_code == 401
    assert "Invalid username or password" in response.json()["detail"]

def test_signup_success(client, db_session):
    app.dependency_overrides[get_db] = lambda: db_session
    db_session.query(AdminUser).filter(AdminUser.username == "newuser").delete()
    db_session.commit()

    response = client.post("/signup", json={"username": "newuser", "password": "newpassword"})
    assert response.status_code == 200
    assert response.json() == {"success": True, "message": "User registered successfully"}

    # Verify user was created
    user = db_session.query(AdminUser).filter(AdminUser.username == "newuser").first()
    assert user is not None
    assert bcrypt.checkpw(b"newpassword", user.password_hash.encode('utf-8'))

def test_signup_duplicate_username(client, db_session):
    app.dependency_overrides[get_db] = lambda: db_session
    db_session.query(AdminUser).filter(AdminUser.username == "existinguser").delete()
    db_session.commit()

    # Create an initial user
    password = b"testpassword"
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)

    user = AdminUser(username="existinguser", password_hash=hashed.decode('utf-8'))
    db_session.add(user)
    db_session.commit()

    # Try to sign up with the same username
    response = client.post("/signup", json={"username": "existinguser", "password": "anotherpassword"})
    assert response.status_code == 400
    assert "Username already exists" in response.json()["detail"]
