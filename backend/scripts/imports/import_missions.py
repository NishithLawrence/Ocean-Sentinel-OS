"""
Missions Dataset Importer for Ocean Sentinel OS.
Phase 5.2 - Dedicated Missions Integration Script.

Path: backend/scripts/imports/import_missions.py
"""
import argparse
import csv
import logging
import sys
from datetime import datetime
from pathlib import Path

# Add backend directory to sys.path to ensure app imports resolve correctly
backend_dir = Path(__file__).resolve().parent.parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.database import SessionLocal, initialize_database
from app.models.mission import Mission
from app.models.reef import Reef
from app.models.team import Team
from app.models.user import User

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger('import_missions')


def parse_date(date_str: str):
    """Parse date string YYYY-MM-DD into a date object."""
    if not date_str or not date_str.strip():
        return None
    try:
        return datetime.strptime(date_str.strip(), '%Y-%m-%d').date()
    except ValueError:
        return None


def get_or_create_user(db) -> User:
    """Retrieve existing user or create default admin user for mission creator_id."""
    user = db.query(User).first()
    if not user:
        user = User(
            employee_id='EMP-001',
            full_name='System Commander',
            email='commander@oceansentinel.org',
            password_hash='$2b$12$eImiTXuWVxfM37uY4JANjO5E/0yFp2F7R8v0tW0S4l1y3Y4JANjO5E',  # stub hash
            role='Admin',
            organization='Ocean Sentinel OS'
        )
        db.add(user)
        db.flush()
        logger.info(f"Created default mission creator User ID={user.id}")
    return user


def get_or_create_team(db, team_name: str, country: str, mission_type: str) -> Team:
    """Retrieve existing team by name or create a new team."""
    tname = team_name.strip() if team_name else 'Team Alpha'
    team = db.query(Team).filter(Team.team_name == tname).first()
    if not team:
        team = Team(
            team_name=tname,
            leader_name=f"Commander ({tname})",
            specialization=f"{mission_type or 'Marine'} Specialist",
            member_count=6,
            contact_email=f"{tname.lower().replace(' ', '')}@oceansentinel.org",
            contact_phone='+1-555-0199',
            region=country or 'Global',
            availability=True,
            status='Active'
        )
        db.add(team)
        db.flush()
        logger.info(f"Created Team record ID={team.id} ({tname})")
    return team


def get_existing_reef(db, reef_name: str, lat_str: str, lon_str: str) -> Reef | None:
    """Find matching existing reef by name or coordinate proximity. Never create synthetic reefs."""
    rname = reef_name.strip() if reef_name else ''
    try:
        lat = float(lat_str)
        lon = float(lon_str)
    except (ValueError, TypeError):
        lat, lon = None, None

    if rname:
        reef = db.query(Reef).filter(
            (Reef.reef_name == rname) |
            (Reef.reef_name.ilike(f"%{rname}%"))
        ).first()
        if reef:
            return reef

    if lat is not None and lon is not None:
        reef = db.query(Reef).filter(
            (Reef.latitude >= lat - 1.0) & (Reef.latitude <= lat + 1.0) &
            (Reef.longitude >= lon - 1.0) & (Reef.longitude <= lon + 1.0)
        ).first()
        if reef:
            return reef

    return db.query(Reef).first()



def import_missions(dataset_dir: Path) -> dict:
    """Import missions CSV dataset into the database."""
    initialize_database()

    csv_path = dataset_dir / 'sample_missions.csv'
    if not csv_path.is_file():
        # Fallback check if passed directly
        csv_path = dataset_dir if dataset_dir.is_file() else dataset_dir / 'missions' / 'sample_missions.csv'

    if not csv_path.is_file():
        logger.error(f"Missions CSV file not found at {csv_path}")
        return {'discovered': 0, 'imported': 0, 'updated': 0, 'skipped': 0}

    logger.info(f"Loading missions CSV from: {csv_path}")
    db = SessionLocal()

    discovered_count = 0
    imported_count = 0
    updated_count = 0
    skipped_count = 0

    try:
        creator_user = get_or_create_user(db)

        with open(csv_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            discovered_count = len(rows)
            logger.info(f"Discovered {discovered_count} mission record(s) in CSV.")

            for idx, row in enumerate(rows, start=1):
                m_name = (row.get('mission_name') or '').strip()
                if not m_name:
                    logger.warning(f"Row #{idx} missing mission_name, skipping.")
                    skipped_count += 1
                    continue

                start_date = parse_date(row.get('start_date'))
                if not start_date:
                    logger.warning(f"Row #{idx} ({m_name}) has invalid start_date, skipping.")
                    skipped_count += 1
                    continue

                end_date = parse_date(row.get('end_date'))
                reef = get_existing_reef(
                    db,
                    reef_name=row.get('reef_name', ''),
                    lat_str=row.get('latitude', '0'),
                    lon_str=row.get('longitude', '0')
                )
                if not reef:
                    logger.warning(f"Row #{idx} ({m_name}) could not be matched to an existing reef, skipping.")
                    skipped_count += 1
                    continue
                team = get_or_create_team(
                    db,
                    team_name=row.get('assigned_team', ''),
                    country=row.get('country', ''),
                    mission_type=row.get('mission_type', '')
                )

                priority = (row.get('priority') or 'Medium').strip()
                status = (row.get('status') or 'Planned').strip()

                obj = (row.get('objective') or '').strip()
                nts = (row.get('notes') or '').strip()
                notes_content = f"{obj} — {nts}".strip(' —') if (obj or nts) else None

                # Query existing mission by mission_name or (reef_id + mission_date)
                existing = db.query(Mission).filter(
                    (Mission.mission_name == m_name) |
                    ((Mission.reef_id == reef.id) & (Mission.mission_date == start_date))
                ).first()

                if existing:
                    existing.mission_name = m_name
                    existing.reef_id = reef.id
                    existing.team_id = team.id
                    existing.mission_date = start_date
                    existing.completed_date = end_date
                    existing.priority = priority
                    existing.status = status
                    existing.notes = notes_content
                    updated_count += 1
                    logger.info(f"UPSERT: Updated mission ID={existing.id} ({m_name} - {status})")
                else:
                    new_mission = Mission(
                        mission_name=m_name,
                        reef_id=reef.id,
                        team_id=team.id,
                        created_by=creator_user.id,
                        mission_date=start_date,
                        completed_date=end_date,
                        priority=priority,
                        status=status,
                        notes=notes_content
                    )
                    db.add(new_mission)
                    db.flush()
                    imported_count += 1
                    logger.info(f"INSERT: Created mission ID={new_mission.id} ({m_name} - {status})")

        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Error during mission import execution: {e}")
        raise
    finally:
        db.close()

    results = {
        'discovered': discovered_count,
        'imported': imported_count,
        'updated': updated_count,
        'skipped': skipped_count
    }

    logger.info("=== Mission Import Execution Summary ===")
    logger.info(f"Discovered : {results['discovered']}")
    logger.info(f"Imported   : {results['imported']}")
    logger.info(f"Updated    : {results['updated']}")
    logger.info(f"Skipped    : {results['skipped']}")
    return results


def main():
    parser = argparse.ArgumentParser(description="Import Missions dataset into Ocean Sentinel OS")
    default_dir = Path(__file__).resolve().parent.parent.parent.parent / 'datasets' / 'missions'
    parser.add_argument(
        '--dataset-dir',
        type=Path,
        default=default_dir,
        help="Path to missions dataset directory"
    )
    args = parser.parse_args()
    import_missions(args.dataset_dir)


if __name__ == '__main__':
    main()
