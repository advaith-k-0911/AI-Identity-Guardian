"""Application configuration using Pydantic Settings."""

import os
import secrets
import logging
from typing import List, Union, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger("app.config")


def _generate_default_secret() -> str:
    """Generate a cryptographically secure random secret key."""
    return secrets.token_hex(32)


class Settings(BaseSettings):
    """Global configuration settings for AI Identity Guardian."""
    
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    APP_NAME: str = "AI Identity Guardian"
    APP_VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Security & JWT
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    def model_post_init(self, __context) -> None:
        """Validate that SECRET_KEY is properly set in production."""
        if not self.SECRET_KEY or self.SECRET_KEY == "":
            # Generate a random key for development
            object.__setattr__(self, 'SECRET_KEY', _generate_default_secret())
            if self.ENVIRONMENT == "production":
                logger.critical(
                    "SECURITY: SECRET_KEY was not set in the environment. "
                    "A random key has been generated for this process. "
                    "Set SECRET_KEY in your .env or environment variables for production!"
                )
            else:
                logger.warning("SECRET_KEY not set; auto-generated for development.")

    # DIESS Canonical Weights (Total = 1.00)
    DIESS_WEIGHT_USERNAME: float = 0.20
    DIESS_WEIGHT_PRIVACY: float = 0.25
    DIESS_WEIGHT_IMPERSONATION: float = 0.20
    DIESS_WEIGHT_CREDENTIALS: float = 0.20
    DIESS_WEIGHT_RECOVERY: float = 0.15

    # DIESS Grading Thresholds
    DIESS_THRESHOLD_EXCELLENT: float = 90.0
    DIESS_THRESHOLD_GOOD: float = 75.0
    DIESS_THRESHOLD_MEDIUM: float = 50.0
    DIESS_THRESHOLD_HIGH: float = 25.0

    # CORS Configuration
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]

    # Database
    DATABASE_URL: str = "sqlite:///./ai_identity_guardian.db"

    # AI Explanation Settings
    GEMINI_API_KEY: Optional[str] = None
    AI_MODEL_NAME: str = "gemini-2.5-flash"
    AI_PROVIDER: str = "auto"  # "gemini", "fallback", or "auto"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return []

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
