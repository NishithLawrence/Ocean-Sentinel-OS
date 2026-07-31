from pydantic import BaseModel, EmailStr, Field, field_validator

from app.schemas.user import UserRead


class RegisterRequest(BaseModel):
    employee_id: str = Field(min_length=1, max_length=50)
    full_name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    organization: str = Field(min_length=1, max_length=255)
    assigned_region: str | None = Field(default=None, max_length=255)

    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, value: str) -> str:
        if not any(character.isupper() for character in value):
            raise ValueError('Password must include an uppercase letter.')
        if not any(character.islower() for character in value):
            raise ValueError('Password must include a lowercase letter.')
        if not any(character.isdigit() for character in value):
            raise ValueError('Password must include a number.')
        if not any(not character.isalnum() for character in value):
            raise ValueError('Password must include a special character.')
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'Bearer'
    user: UserRead
