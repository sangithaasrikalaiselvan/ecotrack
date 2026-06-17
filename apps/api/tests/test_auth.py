import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import create_access_token
import uuid
from datetime import datetime, timedelta, timezone
from jose import jwt
from app.core.config import settings
from app.core.security import ALGORITHM

@pytest.mark.asyncio
async def test_register_success(client: AsyncClient):
    payload = {
        "name": "Alice Wonderland",
        "email": "alice@example.com",
        "password": "StrongPassword123"
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "alice@example.com"
    assert "id" in data

@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient, db: AsyncSession, create_test_user):
    await create_test_user(db, "bob@example.com", "Password123")
    payload = {
        "name": "Bob Duplicate",
        "email": "bob@example.com",
        "password": "Password123"
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 409

@pytest.mark.asyncio
async def test_register_weak_password(client: AsyncClient):
    payload = {
        "name": "Charlie",
        "email": "charlie@example.com",
        "password": "weakpassword"  # Missing uppercase and digit
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 422
    data = response.json()
    # Check that error includes the custom validation message
    assert any("at least one uppercase letter" in err["message"] for err in data["detail"])

@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, db: AsyncSession, create_test_user):
    await create_test_user(db, "diana@example.com", "ValidPass1")
    payload = {
        "email": "diana@example.com",
        "password": "ValidPass1"
    }
    response = await client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    # Check that refresh token is set in cookies
    assert "refresh_token" in response.cookies

@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient, db: AsyncSession, create_test_user):
    await create_test_user(db, "eve@example.com", "ValidPass1")
    payload = {
        "email": "eve@example.com",
        "password": "WrongPassword1"
    }
    response = await client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

@pytest.mark.asyncio
async def test_login_nonexistent_email(client: AsyncClient):
    payload = {
        "email": "nobody@example.com",
        "password": "ValidPass1"
    }
    response = await client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

@pytest.mark.asyncio
async def test_get_me_authenticated(client: AsyncClient, db: AsyncSession, create_test_user):
    user = await create_test_user(db, "frank@example.com", "ValidPass1")
    access_token = create_access_token(user.id)
    response = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "frank@example.com"

@pytest.mark.asyncio
async def test_get_me_no_token(client: AsyncClient):
    response = await client.get("/api/v1/auth/me")
    assert response.status_code in (401, 403)  # HTTPBearer returns 403 when no token is present

@pytest.mark.asyncio
async def test_get_me_expired_token(client: AsyncClient):
    # Create an expired token
    expire = datetime.now(timezone.utc) - timedelta(minutes=15)
    to_encode = {"sub": str(uuid.uuid4()), "exp": expire, "type": "access"}
    expired_token = jwt.encode(to_encode, settings.JWT_PRIVATE_KEY, algorithm=ALGORITHM)
    
    response = await client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {expired_token}"}
    )
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_refresh_token_rotation(client: AsyncClient, db: AsyncSession, create_test_user):
    user = await create_test_user(db, "george@example.com", "ValidPass1")
    
    # Login to get refresh token
    login_response = await client.post("/api/v1/auth/login", json={
        "email": "george@example.com",
        "password": "ValidPass1"
    })
    refresh_token = login_response.cookies.get("refresh_token")
    
    import asyncio
    await asyncio.sleep(1)
    
    # Refresh request
    client.cookies.set("refresh_token", refresh_token)
    refresh_response = await client.post("/api/v1/auth/refresh")
    
    assert refresh_response.status_code == 200
    assert "access_token" in refresh_response.json()
    new_refresh_token = refresh_response.cookies.get("refresh_token")
    assert new_refresh_token is not None
    assert new_refresh_token != refresh_token

@pytest.mark.asyncio
async def test_logout_clears_cookie(client: AsyncClient):
    # Set a dummy cookie
    client.cookies.set("refresh_token", "dummy_token")
    response = await client.post("/api/v1/auth/logout")
    assert response.status_code == 200
    # Cookie should be cleared (empty string or max-age=0)
    assert not response.cookies.get("refresh_token")
