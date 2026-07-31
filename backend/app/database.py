"""SQLAlchemy engine, session dependency, and model metadata."""
from collections.abc import Generator

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import get_settings

settings = get_settings()
connect_args = {'check_same_thread': False} if settings.database_url.startswith('sqlite') else {}
engine = create_engine(settings.database_url, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def initialize_database() -> None:
    """Create the documented tables when the application starts."""
    Base.metadata.create_all(bind=engine)
    # SQLite create_all does not add newly declared columns to an existing table.
    if engine.dialect.name == 'sqlite' and 'missions' in inspect(engine).get_table_names():
        mission_columns = {column['name'] for column in inspect(engine).get_columns('missions')}
        if 'completed_date' not in mission_columns:
            with engine.begin() as connection:
                connection.execute(text('ALTER TABLE missions ADD COLUMN completed_date DATE'))
