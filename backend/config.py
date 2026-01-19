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
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    BREVO_API_KEY: str
    MAIL_FROM: str
    MAIL_FROM_NAME: str
    FRONTEND_URL: str

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
