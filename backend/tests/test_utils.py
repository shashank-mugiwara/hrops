import pytest
from datetime import timedelta
from jose import jwt
from backend.utils import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token,
    SECRET_KEY,
    ALGORITHM
)

def test_password_hashing():
    password = "secret_password"
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrong_password", hashed) is False

def test_decode_access_token_success():
    data = {"sub": "testuser"}
    token = create_access_token(data)
    decoded = decode_access_token(token)
    assert decoded["sub"] == "testuser"
    assert "exp" in decoded

def test_decode_access_token_expired():
    data = {"sub": "testuser"}
    # Create an expired token by passing a negative timedelta
    token = create_access_token(data, expires_delta=timedelta(minutes=-1))
    decoded = decode_access_token(token)
    assert decoded is None

def test_decode_access_token_invalid_signature():
    data = {"sub": "testuser"}
    # Manually encode a token with a different secret
    token = jwt.encode(data, "different-secret", algorithm=ALGORITHM)
    decoded = decode_access_token(token)
    assert decoded is None

def test_decode_access_token_malformed():
    decoded = decode_access_token("not-a-jwt-token")
    assert decoded is None

def test_decode_access_token_empty():
    decoded = decode_access_token("")
    assert decoded is None
