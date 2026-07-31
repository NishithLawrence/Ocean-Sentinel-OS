"""Future centralized error-handler registration point."""
from fastapi import FastAPI


def register_error_handlers(_: FastAPI) -> None:
    """Reserved for standardized error responses; no behavior is registered yet."""
