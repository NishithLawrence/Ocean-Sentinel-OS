"""
Automatic database seeding service for production deployment.
Ensures fresh database instances (e.g. Render deployments) are automatically populated from datasets/.

Path: backend/app/services/seed_service.py
"""
import logging
from pathlib import Path
from sqlalchemy.orm import Session

from app.models.reef import Reef

logger = logging.getLogger('seed_service')

PRIMARY_REEFS = [
    {"reef_name": "Great Barrier Reef - Sector A", "country": "Australia", "latitude": -18.2871, "longitude": 147.6992, "coral_health": 87.0},
    {"reef_name": "Coral Reef Feature #1", "country": "India", "latitude": 9.167513, "longitude": 78.820817, "coral_health": 73.85},
    {"reef_name": "Tubbataha Reefs", "country": "Philippines", "latitude": 8.952, "longitude": 119.885, "coral_health": 81.5},
    {"reef_name": "Belize Barrier Reef", "country": "Belize", "latitude": 17.315, "longitude": -87.534, "coral_health": 48.0},
    {"reef_name": "Raja Ampat", "country": "Indonesia", "latitude": -0.234, "longitude": 130.512, "coral_health": 92.0},
    {"reef_name": "Maldives Atoll", "country": "Maldives", "latitude": 3.202, "longitude": 73.221, "coral_health": 64.0},
    {"reef_name": "Ningaloo Reef", "country": "Australia", "latitude": -22.741, "longitude": 113.678, "coral_health": 79.0},
    {"reef_name": "Apo Reef", "country": "Philippines", "latitude": 13.659, "longitude": 120.462, "coral_health": 58.0},
    {"reef_name": "Red Sea Reef", "country": "Saudi Arabia", "latitude": 22.318, "longitude": 38.921, "coral_health": 71.0},
    {"reef_name": "Palau Reefs", "country": "Palau", "latitude": 7.515, "longitude": 134.582, "coral_health": 85.0},
    {"reef_name": "Florida Keys", "country": "USA", "latitude": 24.55, "longitude": -81.78, "coral_health": 42.0},
]


_is_seeding = False


def seed_database_if_empty(db: Session) -> None:
    """Check if database is empty and automatically run dataset integration pipeline."""
    global _is_seeding
    if _is_seeding:
        return
    _is_seeding = True
    try:
        # Seed base reef records if missing
        existing_count = db.query(Reef).count()
        if existing_count < len(PRIMARY_REEFS):
            logger.info("Initializing primary reef telemetry sites for production database...")
            for r_data in PRIMARY_REEFS:
                existing = db.query(Reef).filter(Reef.reef_name == r_data["reef_name"]).first()
                if not existing:
                    db.add(Reef(
                        reef_name=r_data["reef_name"],
                        country=r_data["country"],
                        latitude=r_data["latitude"],
                        longitude=r_data["longitude"],
                        coral_health=r_data["coral_health"],
                        sea_temperature=26.5,
                        bleaching_alert=False,
                        protected_area=False,
                        ghost_net_distance=None
                    ))
            db.commit()

        # Find dataset root directory
        backend_dir = Path(__file__).resolve().parent.parent.parent
        datasets_dir = backend_dir.parent / 'datasets'
        if not datasets_dir.is_dir():
            datasets_dir = backend_dir / 'datasets'

        if not datasets_dir.is_dir():
            logger.warning(f"Datasets directory not found at {datasets_dir}, skipping auto-import.")
            return

        logger.info(f"Executing dataset integration pipeline from: {datasets_dir}")

        # Run importers
        try:
            from scripts.imports.import_coral_reefs import import_coral_reefs
            import_coral_reefs(datasets_dir / 'Coral_Reefs_Location')
        except Exception as e:
            logger.warning(f"Auto-import Coral Reefs warning: {e}")

        try:
            from scripts.imports.import_missions import import_missions
            import_missions(datasets_dir / 'missions')
        except Exception as e:
            logger.warning(f"Auto-import Missions warning: {e}")

        try:
            from scripts.imports.import_weather import import_weather
            import_weather(datasets_dir / 'weather')
        except Exception as e:
            logger.warning(f"Auto-import Weather warning: {e}")

        try:
            from scripts.imports.import_protected_areas import import_protected_areas
            import_protected_areas(datasets_dir / 'protected_areas')
        except Exception as e:
            logger.warning(f"Auto-import Protected Areas warning: {e}")

        try:
            from scripts.imports.import_ghost_nets import import_ghost_nets
            import_ghost_nets(datasets_dir / 'ghost_nets')
        except Exception as e:
            logger.warning(f"Auto-import Ghost Nets warning: {e}")

        try:
            from scripts.imports.import_sea_temperature import import_sea_temperature
            import_sea_temperature(datasets_dir / 'sea_temperature')
        except Exception as e:
            logger.warning(f"Auto-import Sea Temperature warning: {e}")

        try:
            from scripts.imports.import_bleaching import import_bleaching
            import_bleaching(datasets_dir / 'bleaching')
        except Exception as e:
            logger.warning(f"Auto-import Bleaching warning: {e}")

        # Seed environmental alert signals for all reefs if alerts table is empty
        try:
            from app.models.alert import Alert
            from app.services.risk_assessment_service import create_assessment
            if db.query(Alert).first() is None:
                for reef in db.query(Reef).all():
                    create_assessment(db, reef.id)
                db.commit()
                logger.info("Successfully generated environmental risk alert signals.")
        except Exception as e:
            logger.warning(f"Auto-generate Alert signals warning: {e}")

        logger.info("Production dataset integration pipeline successfully completed.")

    except Exception as e:
        logger.error(f"Error during production dataset seeding: {e}")
    finally:
        _is_seeding = False
