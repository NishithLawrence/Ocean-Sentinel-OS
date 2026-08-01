"""
Coral Reef Dataset Importer for Ocean Sentinel OS.
Phase 5.1 - Dedicated Coral Reef Integration Script.

Path: backend/scripts/imports/import_coral_reefs.py
"""
import argparse
import csv
import json
import logging
import os
import sys
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
logger = logging.getLogger('import_coral_reefs')


def extract_coordinates(geometry: dict) -> list[tuple[float, float]]:
    """Extract all (lon, lat) pairs from a GeoJSON geometry dictionary."""
    gtype = geometry.get('type')
    coords = geometry.get('coordinates', [])
    points = []

    if gtype == 'Point':
        if len(coords) >= 2:
            points.append((float(coords[0]), float(coords[1])))
    elif gtype == 'Polygon':
        for ring in coords:
            for pt in ring:
                if len(pt) >= 2:
                    points.append((float(pt[0]), float(pt[1])))
    elif gtype == 'MultiPolygon':
        for poly in coords:
            for ring in poly:
                for pt in ring:
                    if len(pt) >= 2:
                        points.append((float(pt[0]), float(pt[1])))
    return points


def calculate_centroid(points: list[tuple[float, float]]) -> tuple[float, float] | None:
    """Calculate the average (latitude, longitude) centroid from a list of (lon, lat) points."""
    if not points:
        return None
    sum_lon = sum(p[0] for p in points)
    sum_lat = sum(p[1] for p in points)
    count = len(points)
    avg_lat = round(sum_lat / count, 6)
    avg_lon = round(sum_lon / count, 6)

    if -90.0 <= avg_lat <= 90.0 and -180.0 <= avg_lon <= 180.0:
        return (avg_lat, avg_lon)
    return None


def parse_coral_health_from_stats(stats_csv_path: Path) -> float:
    """Parse Coral/Algae cover fraction from statistics.csv if present."""
    if not stats_csv_path.is_file():
        logger.warning(f"Statistics file not found at {stats_csv_path}, using default coral health.")
        return 50.0

    try:
        with open(stats_csv_path, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                class_type = (row.get('class_type') or '').strip().lower()
                class_name = (row.get('class_name') or '').strip().lower()
                if class_type == 'benthic' and 'coral' in class_name:
                    cover_fraction = float(row.get('cover_fraction', 0.5))
                    return round(cover_fraction * 100.0, 2)
    except Exception as e:
        logger.warning(f"Error reading statistics CSV ({e}), using default coral health.")

    return 50.0


def import_coral_reefs(dataset_dir: Path) -> dict:
    """Import coral reef features from dataset directory into database."""
    initialize_database()

    geojson_path = dataset_dir / 'boundary' / 'boundary.geojson'
    stats_path = dataset_dir / 'stats' / 'statistics.csv'

    if not geojson_path.is_file():
        logger.error(f"GeoJSON file not found at {geojson_path}")
        return {'discovered': 0, 'imported': 0, 'updated': 0, 'skipped_invalid': 0}

    logger.info(f"Loading GeoJSON features from: {geojson_path}")
    with open(geojson_path, mode='r', encoding='utf-8') as f:
        geojson_data = json.load(f)

    features = geojson_data.get('features', [])
    if not features and geojson_data.get('type') == 'Feature':
        features = [geojson_data]

    total_discovered = len(features)
    logger.info(f"Discovered {total_discovered} reef feature(s).")

    coral_health = parse_coral_health_from_stats(stats_path)
    logger.info(f"Calculated coral health index: {coral_health}%")

    imported_count = 0
    updated_count = 0
    skipped_invalid = 0

    db = SessionLocal()
    try:
        for idx, feature in enumerate(features, start=1):
            geometry = feature.get('geometry')
            if not geometry:
                logger.warning(f"Feature #{idx} has no geometry, skipping.")
                skipped_invalid += 1
                continue

            points = extract_coordinates(geometry)
            centroid = calculate_centroid(points)

            if not centroid:
                logger.warning(f"Feature #{idx} has invalid centroid coordinates, skipping.")
                skipped_invalid += 1
                continue

            lat, lon = centroid
            props = feature.get('properties') or {}
            raw_name = props.get('name') or props.get('Name') or props.get('REEF_NAME')

            if raw_name and raw_name.lower() != 'boundary':
                reef_name = str(raw_name).strip()
            else:
                reef_name = f"Coral Reef Feature #{idx}"

            country = str(props.get('country') or props.get('Country') or 'Unspecified').strip()

            # Query existing record by name or coordinate match to enforce idempotence & UPSERT
            existing = db.query(Reef).filter(
                (Reef.reef_name == reef_name) |
                ((Reef.latitude >= lat - 0.0005) & (Reef.latitude <= lat + 0.0005) &
                 (Reef.longitude >= lon - 0.0005) & (Reef.longitude <= lon + 0.0005))
            ).first()

            if existing:
                existing.reef_name = reef_name
                existing.latitude = lat
                existing.longitude = lon
                existing.coral_health = coral_health
                existing.country = country if country != 'Unspecified' else existing.country
                updated_count += 1
                logger.info(f"UPSERT: Updated existing reef record ID={existing.id} ({reef_name} at [{lat}, {lon}])")
            else:
                new_reef = Reef(
                    reef_name=reef_name,
                    country=country,
                    latitude=lat,
                    longitude=lon,
                    coral_health=coral_health,
                    sea_temperature=25.0,  # Required application model default
                    bleaching_alert=False,
                    protected_area=False,
                    ghost_net_distance=None,
                    ai_priority_score=None,
                    priority_level=None
                )
                db.add(new_reef)
                db.flush()
                imported_count += 1
                logger.info(f"INSERT: Created new reef record ID={new_reef.id} ({reef_name} at [{lat}, {lon}])")

        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Failed during import transaction: {e}")
        raise
    finally:
        db.close()

    results = {
        'discovered': total_discovered,
        'imported': imported_count,
        'updated': updated_count,
        'skipped_invalid': skipped_invalid
    }
    logger.info("=== Import Execution Summary ===")
    logger.info(f"Features Discovered : {results['discovered']}")
    logger.info(f"New Reefs Inserted  : {results['imported']}")
    logger.info(f"Existing Reefs Upserted/Skipped Duplicates: {results['updated']}")
    logger.info(f"Invalid Skipped     : {results['skipped_invalid']}")
    return results


def main():
    parser = argparse.ArgumentParser(description="Import Coral Reef dataset into Ocean Sentinel OS")
    default_dir = Path(__file__).resolve().parent.parent.parent.parent / 'datasets' / 'Coral_Reefs_Location'
    parser.add_argument(
        '--dataset-dir',
        type=Path,
        default=default_dir,
        help="Path to Coral_Reefs_Location dataset directory"
    )
    args = parser.parse_args()
    import_coral_reefs(args.dataset_dir)


if __name__ == '__main__':
    main()
