"""FastAPI dependency placeholders for future JWT-protected endpoints."""
from fastapi import HTTPException, status


def get_current_user() -> None:
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail='Authentication dependency is not implemented.')
