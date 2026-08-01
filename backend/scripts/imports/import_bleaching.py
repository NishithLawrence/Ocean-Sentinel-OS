"""
Bleaching Metrics Importer for Ocean Sentinel OS.
Phase 5 - Dedicated Bleaching Integration Script.

Path: backend/scripts/imports/import_bleaching.py
"""
import argparse
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
logger = logging.getLogger('import_bleaching')


def import_bleaching(dataset_dir: Path) -> dict:
    """Import NOAA Coral Reef Watch Bleaching Area Alert NetCDF dataset to update bleaching_alert on existing reefs."""
    initialize_database()

    nc_path = dataset_dir / 'ct5km_baa_v3.1_20260101.nc'
    if not nc_path.is_file():
        if dataset_dir.is_file():
            nc_path = dataset_dir

    if not nc_path.is_file():
        logger.error(f"Bleaching NetCDF dataset file not found at {nc_path}")
        return {'discovered': 0, 'imported': 0, 'updated': 0, 'skipped': 0}

    logger.info(f"Loading Bleaching Area Alert NetCDF dataset: {nc_path}")

    try:
        import netCDF4 as nc
    except ImportError:
        logger.error("netCDF4 module not available.")
        return {'discovered': 0, 'imported': 0, 'updated': 0, 'skipped': 0}

    db = SessionLocal()
    discovered_count = 0
    updated_count = 0
    skipped_count = 0

    try:
        ds = nc.Dataset(nc_path, mode='r')
        lats = ds.variables['lat'][:]
        lons = ds.variables['lon'][:]
        baa_var = ds.variables['bleaching_alert_area']

        discovered_count = lats.size * lons.size
        logger.info(f"Loaded NetCDF grid: {lats.size}x{lons.size} points ({discovered_count} total observations).")

        reefs = db.query(Reef).all()
        logger.info(f"Targeting {len(reefs)} existing reef record(s) for bleaching alert evaluation.")

        for reef in reefs:
            lat, lon = reef.latitude, reef.longitude

            # Find nearest grid indices
            lat_idx = int(round((lat - lats[0]) / (lats[-1] - lats[0]) * (len(lats) - 1)))
            lon_idx = int(round((lon - lons[0]) / (lons[-1] - lons[0]) * (len(lons) - 1)))

            lat_idx = max(0, min(len(lats) - 1, lat_idx))
            lon_idx = max(0, min(len(lons) - 1, lon_idx))

            val = baa_var[0, lat_idx, lon_idx]

            # Check for masked/unmasked value
            if hasattr(val, 'mask') and val.mask:
                val_found = None
                for dy in [-1, 0, 1]:
                    for dx in [-1, 0, 1]:
                        ny = max(0, min(len(lats) - 1, lat_idx + dy))
                        nx = max(0, min(len(lons) - 1, lon_idx + dx))
                        nval = baa_var[0, ny, nx]
                        if not (hasattr(nval, 'mask') and nval.mask):
                            val_found = int(nval)
                            break
                    if val_found is not None:
                        break
                val = val_found

            if val is not None and not (hasattr(val, 'mask') and val.mask):
                alert_level = int(val)
                # Level 2 (Warning) or Level 3 (Alert 1) / 4 (Alert 2) triggers bleaching_alert
                reef.bleaching_alert = (alert_level >= 2)
                updated_count += 1
                logger.info(f"UPSERT: Updated bleaching_alert={reef.bleaching_alert} (BAA Level {alert_level}) for reef ID={reef.id} ('{reef.reef_name}')")
            else:
                skipped_count += 1
                logger.info(f"UNMATCHED: Bleaching grid cell masked or invalid at reef ID={reef.id} ('{reef.reef_name}')")

        db.commit()
        ds.close()
    except Exception as e:
        db.rollback()
        logger.error(f"Error during bleaching import execution: {e}")
        raise
    finally:
        db.close()

    results = {
        'discovered': discovered_count,
        'imported': 0,  # Never creates new reefs
        'updated': updated_count,
        'skipped': skipped_count
    }

    logger.info("=== Bleaching Import Summary ===")
    logger.info(f"Discovered : {results['discovered']}")
    logger.info(f"Imported   : {results['imported']} (No new reefs created)")
    logger.info(f"Updated    : {results['updated']}")
    logger.info(f"Skipped    : {results['skipped']}")
    return results


def main():
    parser = argparse.ArgumentParser(description="Import Bleaching metrics dataset into Ocean Sentinel OS")
    default_dir = Path(__file__).resolve().parent.parent.parent.parent / 'datasets' / 'bleaching'
    parser.add_argument(
        '--dataset-dir',
        type=Path,
        default=default_dir,
        help="Path to bleaching dataset directory"
    )
    args = parser.parse_args()
    import_bleaching(args.dataset_dir)


if __name__ == '__main__':
    main()
