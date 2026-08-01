"""
Ghost Nets Importer for Ocean Sentinel OS.
Phase 5 - Dedicated Ghost Nets Integration Script.

Path: backend/scripts/imports/import_ghost_nets.py
"""
import argparse
import csv
import logging
import math
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
logger = logging.getLogger('import_ghost_nets')


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the Great Circle distance between two points in kilometers."""
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(max(0.0, 1.0 - a)))
    return R * c


def import_ghost_nets(dataset_dir: Path) -> dict:
    """Import Ghost Nets dataset observations to update ghost_net_distance on existing reefs."""
    initialize_database()

    if not dataset_dir.exists():
        logger.error(f"Ghost nets dataset path not found at {dataset_dir}")
        return {'discovered': 0, 'imported': 0, 'updated': 0, 'skipped': 0}

    net_points = []
    discovered_count = 0
    skipped_count = 0

    # Scan datasets/ghost_nets/ and datasets/weather/ for ghost net records
    files_to_scan = []
    if dataset_dir.is_dir():
        files_to_scan.extend(list(dataset_dir.rglob('*.txt')))
        files_to_scan.extend(list(dataset_dir.rglob('*.csv')))
    elif dataset_dir.is_file():
        files_to_scan.append(dataset_dir)

    # Also check weather/ for 049dbb49e89835ea6bb83df8931c1241.csv if present
    weather_ghost_net_file = dataset_dir.parent / 'weather' / '049dbb49e89835ea6bb83df8931c1241.csv'
    if weather_ghost_net_file.is_file():
        files_to_scan.append(weather_ghost_net_file)

    for filepath in files_to_scan:
        logger.info(f"Scanning file for ghost net coordinates: {filepath.name}")
        try:
            with open(filepath, mode='r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                f.seek(0)
                delimiter = '\t' if '\t' in content[:1000] else ',' if ',' in content[:1000] else ' '

                # Check headers
                first_line = content.splitlines()[0] if content.splitlines() else ''
                if 'lat' in first_line.lower() or 'distance' in first_line.lower():
                    reader = csv.DictReader(f, delimiter=delimiter)
                    for row in reader:
                        discovered_count += 1
                        lat_val = row.get('lat') or row.get('latitude') or row.get('"lat"')
                        lon_val = row.get('lon') or row.get('longitude') or row.get('"lon"')
                        dist_val = row.get('distance_to_reef_km')
                        region_id = row.get('region_id') or row.get('nearest_reef_id') or ''

                        if lat_val is not None and lon_val is not None:
                            try:
                                clean_lat = float(str(lat_val).replace('"', '').strip())
                                clean_lon = float(str(lon_val).replace('"', '').strip())
                                if -90.0 <= clean_lat <= 90.0 and -180.0 <= clean_lon <= 180.0:
                                    net_points.append(('point', clean_lat, clean_lon, region_id))
                                else:
                                    skipped_count += 1
                            except ValueError:
                                skipped_count += 1

                        if dist_val is not None:
                            try:
                                net_points.append(('explicit_dist', float(dist_val), region_id, None))
                            except ValueError:
                                pass
        except Exception as e:
            logger.warning(f"Error reading file {filepath}: {e}")

    logger.info(f"Discovered {discovered_count} ghost net observation records ({len(net_points)} valid data points).")

    db = SessionLocal()
    updated_count = 0

    try:
        reefs = db.query(Reef).all()
        logger.info(f"Targeting {len(reefs)} existing reef record(s) for ghost net distance calculations.")

        for reef in reefs:
            min_dist = float('inf')

            # Calculate proximity to all coordinate points
            for item in net_points:
                if item[0] == 'point':
                    _, rlat, rlon, rregion = item
                    dist = haversine_km(reef.latitude, reef.longitude, rlat, rlon)
                    if dist < min_dist:
                        min_dist = dist
                elif item[0] == 'explicit_dist':
                    _, edist, rregion, _ = item
                    if rregion and (rregion.lower() in reef.reef_name.lower() or reef.country.lower() in rregion.lower()):
                        if edist < min_dist:
                            min_dist = edist

            if min_dist != float('inf'):
                reef.ghost_net_distance = round(min_dist, 2)
                updated_count += 1
                logger.info(f"UPSERT: Updated ghost_net_distance={reef.ghost_net_distance} km for reef ID={reef.id} ('{reef.reef_name}')")
            else:
                logger.info(f"UNMATCHED: No ghost net observations near reef ID={reef.id} ('{reef.reef_name}')")

        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Error during ghost nets import execution: {e}")
        raise
    finally:
        db.close()

    results = {
        'discovered': discovered_count,
        'imported': 0,  # Never creates new reefs
        'updated': updated_count,
        'skipped': skipped_count
    }

    logger.info("=== Ghost Nets Import Summary ===")
    logger.info(f"Discovered : {results['discovered']}")
    logger.info(f"Imported   : {results['imported']} (No new reefs created)")
    logger.info(f"Updated    : {results['updated']}")
    logger.info(f"Skipped    : {results['skipped']}")
    return results


def main():
    parser = argparse.ArgumentParser(description="Import Ghost Nets dataset into Ocean Sentinel OS")
    default_dir = Path(__file__).resolve().parent.parent.parent.parent / 'datasets' / 'ghost_nets'
    parser.add_argument(
        '--dataset-dir',
        type=Path,
        default=default_dir,
        help="Path to ghost_nets dataset directory"
    )
    args = parser.parse_args()
    import_ghost_nets(args.dataset_dir)


if __name__ == '__main__':
    main()
