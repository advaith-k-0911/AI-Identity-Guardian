"""Schemas for User Authentication and Profile Management."""

import re
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class UserRegisterRequest(BaseModel):
    """Payload to register a new user account."""
    email: str = Field(..., min_length=5, max_length=255, description="User's email address")
    password: str = Field(..., min_length=8, max_length=128, description="Account password (min 8 characters)")
    full_name: Optional[str] = Field(None, max_length=100, description="Optional legal or display name")

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        clean = v.strip().lower()
        if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", clean):
            raise ValueError("Invalid email address format.")
        return clean

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must contain at least 8 characters.")
        if len(v) > 128:
            raise ValueError("Password must not exceed 128 characters.")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit.")
        return v


class UserLoginRequest(BaseModel):
    """Payload to authenticate an existing user."""
    email: str = Field(..., min_length=5, max_length=255, description="User's email address")
    password: str = Field(..., description="Account password")

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        clean = v.strip().lower()
        if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", clean):
            raise ValueError("Invalid email address format.")
        return clean


class UserResponse(BaseModel):
    """Public user profile response."""
    id: str
    email: str
    full_name: Optional[str] = None
    created_at: datetime
    is_active: bool


class TokenResponse(BaseModel):
    """Authentication token response payload."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
