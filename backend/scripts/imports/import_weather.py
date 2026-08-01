"""
Weather Dataset Importer for Ocean Sentinel OS.
Phase 5.2 - Dedicated Weather Integration Script.

Path: backend/scripts/imports/import_weather.py
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
from app.models.reef import Reef

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger('import_weather')


def is_weather_file(filepath: Path) -> bool:
    """Check if a CSV file contains weather observation headers."""
    if not filepath.is_file() or not filepath.name.endswith('.csv'):
        return False
    try:
        with open(filepath, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f)
            header = next(reader, [])
            header_clean = [h.strip().lower() for h in header]
            # Must contain weather observation fields
            return 'temp_c' in header_clean or 'wind_speed_kmh' in header_clean
    except Exception:
        return False


def import_weather(dataset_dir: Path) -> dict:
    """Import weather dataset observations into Ocean Sentinel OS."""
    initialize_database()

    if not dataset_dir.exists():
        logger.error(f"Weather dataset path not found at {dataset_dir}")
        return {'discovered': 0, 'imported': 0, 'updated': 0, 'skipped': 0}

    csv_files = []
    if dataset_dir.is_file():
        if is_weather_file(dataset_dir):
            csv_files.append(dataset_dir)
    else:
        for f in dataset_dir.glob('*.csv'):
            if is_weather_file(f):
                csv_files.append(f)

    if not csv_files:
        logger.warning(f"No weather observation CSV files found in {dataset_dir}")
        return {'discovered': 0, 'imported': 0, 'updated': 0, 'skipped': 0}

    logger.info(f"Found {len(csv_files)} weather dataset file(s).")
    db = SessionLocal()

    discovered_count = 0
    imported_count = 0
    updated_count = 0
    skipped_count = 0

    try:
        for csv_file in csv_files:
            logger.info(f"Processing weather file: {csv_file.name}")
            with open(csv_file, mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                rows = list(reader)
                discovered_count += len(rows)

                for idx, row in enumerate(rows, start=1):
                    region_name = (row.get('region_name') or row.get('region_id') or '').strip()
                    temp_str = row.get('temp_c')

                    if not region_name or temp_str is None:
                        skipped_count += 1
                        continue

                    try:
                        temp_c = float(temp_str)
                    except ValueError:
                        skipped_count += 1
                        continue

                    # Search for matching reef record(s) by reef_name or region_name
                    reefs = db.query(Reef).filter(
                        (Reef.reef_name == region_name) |
                        (Reef.reef_name.ilike(f"%{region_name}%")) |
                        (Reef.country.ilike(f"%{region_name}%"))
                    ).all()

                    if reefs:
                        for reef in reefs:
                            reef.sea_temperature = round(temp_c, 2)
                        updated_count += len(reefs)
                        logger.info(f"UPSERT: Updated sea_temperature={temp_c}°C for {len(reefs)} reef(s) matching '{region_name}'")
                    else:
                        skipped_count += 1
                        logger.info(f"UNMATCHED: No existing reef found matching weather region '{region_name}', skipping record creation.")

        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Error during weather import execution: {e}")
        raise
    finally:
        db.close()

    results = {
        'discovered': discovered_count,
        'imported': 0,
        'updated': updated_count,
        'skipped': skipped_count
    }

    logger.info("=== Weather Import Execution Summary ===")
    logger.info(f"Discovered : {results['discovered']}")
    logger.info(f"Imported   : {results['imported']} (No new reefs created from weather data)")
    logger.info(f"Updated    : {results['updated']}")
    logger.info(f"Skipped/Unmatched: {results['skipped']}")
    return results


def main():
    parser = argparse.ArgumentParser(description="Import Weather dataset into Ocean Sentinel OS")
    default_dir = Path(__file__).resolve().parent.parent.parent.parent / 'datasets' / 'weather'
    parser.add_argument(
        '--dataset-dir',
        type=Path,
        default=default_dir,
        help="Path to weather dataset directory"
    )
    args = parser.parse_args()
    import_weather(args.dataset_dir)


if __name__ == '__main__':
    main()
