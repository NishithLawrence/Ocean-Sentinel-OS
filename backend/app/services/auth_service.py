"""Authentication persistence and credential verification service."""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.passwords import hash_password, verify_password
from app.models.user import User
from app.schemas.auth import RegisterRequest


def register_user(db: Session, payload: RegisterRequest) -> User:
    user = User(
        employee_id=payload.employee_id.strip(),
        full_name=payload.full_name.strip(),
        email=str(payload.email).lower(),
        password_hash=hash_password(payload.password),
        role='Marine Conservation Officer',
        organization=payload.organization.strip(),
        assigned_region=payload.assigned_region.strip() if payload.assigned_region else None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def find_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email.lower()))


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = find_user_by_email(db, email)
    if user is None or not verify_password(password, user.password_hash):
        return None
    return user
