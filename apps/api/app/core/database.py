# app/core/database.py
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_size=10,
    max_overflow=20
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession
)

async def get_db():
    """Dependency to yield a database session."""
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    """Verify database connection on startup."""
    try:
        async with engine.begin() as conn:
            # Just verify we can connect and run a simple query
            await conn.execute("SELECT 1")
    except Exception as e:
        import logging
        logging.error(f"Failed to connect to database: {e}")
        raise
