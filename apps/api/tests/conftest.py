# tests/conftest.py
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool
import uuid
import os

os.environ["ANTHROPIC_API_KEY"] = "dummy_test_key"
os.environ["ALLOWED_ORIGINS"] = '["http://localhost:3000"]'
os.environ["JWT_PUBLIC_KEY"] = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr2eanhUDhEB6RBF+aN1f\nbkQAUCRUuLTI3Aj/2M1EddzYvQrf4TUAXwcw89lyTKkIrvB4W1wYhXYxJcJAYJLA\ngAxZPo7LvllZgWHf+eAvVTAltEwYw60ET1Sf17mLObu/lkKjY5UDsyIVCLYQ7STx\nhpVgYTawLtNN7iFk7+0mzev/iZj9q8CqroT5rzhBl2C4FOMu7UgyarS3H52+nUqH\nhDiDVZLVyD4H6PeY3GmdHf+l3BMLFZDojBa+TiVBLnSbM7vFSG8531az35M7Z3GK\na1iOjdqKdgm60fPdvjECkbxRQSohG5EuNDROwDSs86JFy/iVLZP1jZqXhQM6sLJb\n4wIDAQAB\n-----END PUBLIC KEY-----"
os.environ["JWT_PRIVATE_KEY"] = "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAr2eanhUDhEB6RBF+aN1fbkQAUCRUuLTI3Aj/2M1EddzYvQrf\n4TUAXwcw89lyTKkIrvB4W1wYhXYxJcJAYJLAgAxZPo7LvllZgWHf+eAvVTAltEwY\nw60ET1Sf17mLObu/lkKjY5UDsyIVCLYQ7STxhpVgYTawLtNN7iFk7+0mzev/iZj9\nq8CqroT5rzhBl2C4FOMu7UgyarS3H52+nUqHhDiDVZLVyD4H6PeY3GmdHf+l3BML\nFZDojBa+TiVBLnSbM7vFSG8531az35M7Z3GKa1iOjdqKdgm60fPdvjECkbxRQSoh\nG5EuNDROwDSs86JFy/iVLZP1jZqXhQM6sLJb4wIDAQABAoIBAAxr9goE60irN51o\nxGl7vT2LU58D+6X6/jsq6Kd7Xez032UqhyalQL9PZzrq/B+2sXaQxrfoQpT3r6JW\nFTC2+Sqi9T0AvX1fntQ9ULBwR8SCJ4wS/tv4qD9P+w6QGsPTangjLvv8j78DW7b6\ntyHRhciQp+XVNXk+HfI5FjNcOZfH5STBPLOG/phTdOH93nwbHvSHOP7cen/Hl9bL\nX8W0C1OCqBt8PViscP3xYtdSJloxQPhw7zZYB9bZUHKfa+mwKdioBvMUsJi0KI8C\nSNiuWddTSa+7FG60s2riOAP7ltINJgma5bX3AdONZdgXTQygMhIIwNa/DawHPYDt\nKDGylWUCgYEA5l2f2wXa+d2hLCJY4UX5Zv6A8DKawsOakDAUsDRjN74mCJ33qCfZ\nMts4y9SKShC3JGLWg9tiMiDMeULAsJZheDXIXvGXA91a733YRlbx9eRudqTISfUj\ndUAsUuWxOl3jcEzOjfvtIInwrpIp+Zfov8kFlGJ+9h3IAbzXzcYTUO0CgYEAwuxR\nTwbh+qfUpoA6NI0R8kL875TNqmaW0n6A9nLEx96G2SQMD26Y8FFNiRnMpMmD3aH8\nR0h97bQsdWKfxDBV8OPw+eQ+uPgdSf59hyBMsfjRo53nMRSDyd8rJ7JAB5TFim78\n6haxcNrylcrSbAYh+Ue7guvoRMtO0ZnydVrFVg8CgYAacn07w/xT22H5kyfpFQOB\nE47yBJ1H5vUDwMFfSWRqreXn71rTb1+8OvbWT9xgjHK6Nq6yDKnFX4aaFVPR8jHW\nfzY10D6qLuuVuzjtOmYk+MjFzj1AYGhluaxdCAnEzaqi5e6A1n9u0OdU42r2QL5z\n5jxBwN0anGit6mRMN4VYMQKBgAck5i4BUJMBR7f6hyeZ7Ah3EBIv4AHY1LpOTKe7\nuR6iN0sKGS8PnKdiM3dM7MU1ZZHf+AEc1RC7Q83hmX11UBEOKazfArWA0oH9w9gK\nBQWY2wYmKW0RFWt2tHw1+kbM2xihzL8/qa07ORzoXCH9b41VZbf8sXyj/vWLsOlA\nNG9dAoGBAIBEaMXynPjJGUJzcx9zyTAH3SGqI1VUhE3GKuKlPGknry4SlbcXViVM\nukflKu91xK8U1sFurDDj85Iqb8mykwweFfSZ5unn4gbYY/6+D4Lj8Km48KptzVtf\ngGLzVBhGm7x8+jjXOVKHQjxuXrmwGN7LSgMXKRDpPMK724qTVdAD\n-----END RSA PRIVATE KEY-----"
os.environ["DATABASE_URL"] = "postgresql+asyncpg://postgres:postgres@localhost:5432/ecotrack"
os.environ["REDIS_URL"] = "redis://localhost:6379/0"

from app.main import app
from app.models import Base
from app.core.database import get_db
from app.core.security import hash_password
from app.models.user import User

from sqlalchemy.ext.compiler import compiles
from sqlalchemy.dialects.postgresql import UUID, JSONB

@compiles(UUID, 'sqlite')
def compile_uuid(type_, compiler, **kw):
    return "VARCHAR(36)"

@compiles(JSONB, 'sqlite')
def compile_jsonb(type_, compiler, **kw):
    return "JSON"

# SQLite in-memory database
SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = async_sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)

@pytest_asyncio.fixture(scope="session")
def event_loop():
    import asyncio
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture
async def db():
    async with TestingSessionLocal() as session:
        yield session

@pytest_asyncio.fixture
async def client(db: AsyncSession):
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def create_test_user():
    async def _create(db: AsyncSession, email: str, password: str) -> User:
        user = User(
            id=uuid.uuid4(),
            name="Test User",
            email=email,
            password_hash=hash_password(password),
            country_code="US",
            is_active=True
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user
    return _create
