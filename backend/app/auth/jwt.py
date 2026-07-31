"""JWT creation and validation helpers."""
from datetime import UTC, datetime, timedelta

import jwt
from jwt.exceptions import InvalidTokenError

from app.config import get_settings


def create_access_token(subject: dict[str, object]) -> str:
    settings = get_settings()
    payload = subject.copy()
    payload['exp'] = datetime.now(UTC) + timedelta(minutes=settings.jwt_access_token_expire_minutes)
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict[str, object]:
    settings = get_settings()
    try:
        return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except InvalidTokenError as error:
        raise ValueError('Invalid or expired access token.') from error
