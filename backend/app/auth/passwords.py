"""Python 3.13-compatible password hashing using bcrypt directly."""
import hashlib

import bcrypt


def _password_bytes(password: str) -> bytes:
    """Preserve the full password by hashing it before bcrypt's 72-byte limit."""
    return hashlib.sha256(password.encode('utf-8')).digest()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(_password_bytes(password), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(_password_bytes(password), password_hash.encode('utf-8'))
    except (TypeError, ValueError):
        return False
