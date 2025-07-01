import os
from pydantic_settings import BaseSettings

from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    DATABASE_URL: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str

    class Config:
        env_file = ".env"


settings = Settings()
