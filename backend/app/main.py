"""FastAPI application entry point and API router registration."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # Ensures all SQLAlchemy metadata is registered before initialization.
from app.config import get_settings
from app.database import initialize_database
from app.routers import admin_router, analytics_router, auth_router, mission_router, reef_router, report_router, team_router, user_router

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    initialize_database()
    yield


app = FastAPI(title=settings.app_name, version='1.0.0', lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origin_list, allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

for router in (auth_router.router, user_router.router, reef_router.router, mission_router.router, team_router.router, analytics_router.router, report_router.router, admin_router.router):
    app.include_router(router, prefix='/api/v1')


@app.get('/health', tags=['System'])
def health_check() -> dict[str, str]:
    return {'status': 'ok'}
