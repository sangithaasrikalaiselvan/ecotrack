# app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    JWT_PRIVATE_KEY: str
    JWT_PUBLIC_KEY: str
    ALLOWED_ORIGINS: List[str]
    ANTHROPIC_API_KEY: str = ""
    APP_NAME: str = "EcoTrack AI"
    DEBUG: bool = True
    MAX_CHAT_MESSAGE_LENGTH: int = 2000

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # if not self.ANTHROPIC_API_KEY or self.ANTHROPIC_API_KEY.strip() == "" or self.ANTHROPIC_API_KEY == "your_key_here":
        #     raise ValueError("ANTHROPIC_API_KEY cannot be empty")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
