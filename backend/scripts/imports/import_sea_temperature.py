"""
Sea Surface Temperature (SST) Importer for Ocean Sentinel OS.
Phase 5 - Dedicated Sea Temperature Integration Script.

Path: backend/scripts/imports/import_sea_temperature.py
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
logger = logging.getLogger('import_sea_temperature')


def import_sea_temperature(dataset_dir: Path) -> dict:
    """Import CoralTemp Sea Surface Temperature (SST) NetCDF dataset to update sea_temperature on existing reefs."""
    initialize_database()

    nc_path = dataset_dir / 'coraltemp_v3.1_20260730.nc'
    if not nc_path.is_file():
        if dataset_dir.is_file():
            nc_path = dataset_dir

    if not nc_path.is_file():
        logger.error(f"SST NetCDF dataset file not found at {nc_path}")
        return {'discovered': 0, 'imported': 0, 'updated': 0, 'skipped': 0}

    logger.info(f"Loading CoralTemp SST NetCDF dataset: {nc_path}")

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
        sst_var = ds.variables['analysed_sst']

        discovered_count = lats.size * lons.size
        logger.info(f"Loaded NetCDF grid: {lats.size}x{lons.size} points ({discovered_count} total observations).")

        reefs = db.query(Reef).all()
        logger.info(f"Targeting {len(reefs)} existing reef record(s) for SST sampling.")

        for reef in reefs:
            lat, lon = reef.latitude, reef.longitude

            # Find nearest grid indices
            lat_idx = int(round((lat - lats[0]) / (lats[-1] - lats[0]) * (len(lats) - 1)))
            lon_idx = int(round((lon - lons[0]) / (lons[-1] - lons[0]) * (len(lons) - 1)))

            lat_idx = max(0, min(len(lats) - 1, lat_idx))
            lon_idx = max(0, min(len(lons) - 1, lon_idx))

            val = sst_var[0, lat_idx, lon_idx]

            # Check for masked/unmasked value
            if hasattr(val, 'mask') and val.mask:
                # Search immediate 3x3 grid neighborhood for nearby ocean cell
                val_found = None
                for dy in [-1, 0, 1]:
                    for dx in [-1, 0, 1]:
                        ny = max(0, min(len(lats) - 1, lat_idx + dy))
                        nx = max(0, min(len(lons) - 1, lon_idx + dx))
                        nval = sst_var[0, ny, nx]
                        if not (hasattr(nval, 'mask') and nval.mask):
                            val_found = float(nval)
                            break
                    if val_found is not None:
                        break
                val = val_found

            if val is not None and not (hasattr(val, 'mask') and val.mask):
                sst_c = float(val)
                # Convert Kelvin to Celsius if stored in Kelvin (> 100)
                if sst_c > 100.0:
                    sst_c -= 273.15
                reef.sea_temperature = round(sst_c, 2)
                updated_count += 1
                logger.info(f"UPSERT: Updated sea_temperature={reef.sea_temperature}°C for reef ID={reef.id} ('{reef.reef_name}') at [{lat}, {lon}]")
            else:
                skipped_count += 1
                logger.info(f"UNMATCHED: SST grid cell masked or invalid at reef ID={reef.id} ('{reef.reef_name}')")

        db.commit()
        ds.close()
    except Exception as e:
        db.rollback()
        logger.error(f"Error during SST import execution: {e}")
        raise
    finally:
        db.close()

    results = {
        'discovered': discovered_count,
        'imported': 0,  # Never creates new reefs
        'updated': updated_count,
        'skipped': skipped_count
    }

    logger.info("=== Sea Temperature Import Summary ===")
    logger.info(f"Discovered : {results['discovered']}")
    logger.info(f"Imported   : {results['imported']} (No new reefs created)")
    logger.info(f"Updated    : {results['updated']}")
    logger.info(f"Skipped    : {results['skipped']}")
    return results


def main():
    parser = argparse.ArgumentParser(description="Import Sea Surface Temperature dataset into Ocean Sentinel OS")
    default_dir = Path(__file__).resolve().parent.parent.parent.parent / 'datasets' / 'sea_temperature'
    parser.add_argument(
        '--dataset-dir',
        type=Path,
        default=default_dir,
        help="Path to sea_temperature dataset directory"
    )
    args = parser.parse_args()
    import_sea_temperature(args.dataset_dir)


if __name__ == '__main__':
    main()
