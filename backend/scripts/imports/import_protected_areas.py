"""
Protected Areas Importer for Ocean Sentinel OS.
Phase 5 - Dedicated Protected Areas Integration Script.

Path: backend/scripts/imports/import_protected_areas.py
"""
import argparse
import csv
import logging
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.database import SessionLocal, initialize_database
from app.models.reef import Reef

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger('import_protected_areas')


def import_protected_areas(dataset_dir: Path) -> dict:
    """Import WDPA Protected Areas dataset to update protected_area status on existing reefs."""
    initialize_database()

    csv_path = dataset_dir / 'WDPA_Aug2026_Public_csv' / 'WDPA_Aug2026_Public_csv.csv'
    if not csv_path.is_file():
        if dataset_dir.is_file():
            csv_path = dataset_dir

    if not csv_path.is_file():
        logger.error(f"Protected areas CSV file not found at {csv_path}")
        return {'discovered': 0, 'imported': 0, 'updated': 0, 'skipped': 0}

    logger.info(f"Loading WDPA protected areas dataset: {csv_path}")
    db = SessionLocal()

    discovered_count = 0
    updated_count = 0
    skipped_count = 0

    try:
        # Pre-fetch existing reefs
        existing_reefs = db.query(Reef).all()
        logger.info(f"Targeting {len(existing_reefs)} existing reef record(s) for protected area mapping.")

        with open(csv_path, mode='r', encoding='utf-8', errors='ignore') as f:
            reader = csv.DictReader(f)
            mpa_names = set()
            mpa_countries = set()

            for row in reader:
                discovered_count += 1
                realm = (row.get('REALM') or '').strip().lower()
                name_eng = (row.get('NAME_ENG') or row.get('NAME') or '').strip()
                iso3 = (row.get('ISO3') or '').strip()

                if realm == 'marine' or 'reef' in name_eng.lower() or 'reserve' in name_eng.lower() or 'park' in name_eng.lower():
                    if name_eng:
                        mpa_names.add(name_eng.lower())
                    if iso3:
                        mpa_countries.add(iso3.upper())

        logger.info(f"Identified {len(mpa_names)} Marine Protected Area designations in dataset.")

        # Update matching reefs
        for reef in existing_reefs:
            r_name = reef.reef_name.lower()
            r_country = reef.country.lower()

            is_protected = False
            # Check direct keyword or country designation matches
            for mpa in mpa_names:
                if mpa in r_name or r_name in mpa or ('barrier' in r_name and 'barrier' in mpa):
                    is_protected = True
                    break

            if not is_protected and r_country not in ['unspecified', 'global']:
                # Known marine conservation countries/regions
                if any(c in r_country for c in ['australia', 'belize', 'philippines', 'india', 'palau', 'maldives', 'saudi arabia', 'usa']):
                    is_protected = True

            if is_protected:
                reef.protected_area = True
                updated_count += 1
                logger.info(f"UPSERT: Updated protected_area=True for reef ID={reef.id} ('{reef.reef_name}')")
            else:
                skipped_count += 1
                logger.info(f"UNMATCHED: Reef ID={reef.id} ('{reef.reef_name}') not designated as protected area.")

        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Error during protected areas import execution: {e}")
        raise
    finally:
        db.close()

    results = {
        'discovered': discovered_count,
        'imported': 0,  # Never creates new reefs
        'updated': updated_count,
        'skipped': skipped_count
    }

    logger.info("=== Protected Areas Import Summary ===")
    logger.info(f"Discovered : {results['discovered']}")
    logger.info(f"Imported   : {results['imported']} (No new reefs created)")
    logger.info(f"Updated    : {results['updated']}")
    logger.info(f"Skipped    : {results['skipped']}")
    return results


def main():
    parser = argparse.ArgumentParser(description="Import Protected Areas dataset into Ocean Sentinel OS")
    default_dir = Path(__file__).resolve().parent.parent.parent.parent / 'datasets' / 'protected_areas'
    parser.add_argument(
        '--dataset-dir',
        type=Path,
        default=default_dir,
        help="Path to protected_areas dataset directory"
    )
    args = parser.parse_args()
    import_protected_areas(args.dataset_dir)


if __name__ == '__main__':
    main()
