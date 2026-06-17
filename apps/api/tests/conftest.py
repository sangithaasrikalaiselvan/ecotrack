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
