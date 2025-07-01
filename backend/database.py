from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from config import settings

DATABASE_URL = settings.DATABASE_URL

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL not found. Make sure you have a .env file with the correct variable."
    )

engine = create_async_engine(DATABASE_URL)

AsyncSessionLocal = async_sessionmaker(
    autocommit=False, autoflush=False, bind=engine, expire_on_commit=False
)


class Base(DeclarativeBase):
    pass
