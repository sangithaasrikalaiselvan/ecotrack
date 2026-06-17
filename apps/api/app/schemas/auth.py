# app/schemas/auth.py
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
import uuid
import re
from datetime import datetime
from typing import Optional

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)

    @field_validator('name')
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError('Name cannot be empty after stripping whitespace.')
        return v

    @field_validator('password')
    def validate_password(cls, v: str) -> str:
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter.')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit.')
        return v

    @field_validator('email', mode='before')
    def validate_email(cls, v: str) -> str:
        if isinstance(v, str):
            return v.lower()
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    country_code: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
