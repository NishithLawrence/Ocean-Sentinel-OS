import sqlite3

conn = sqlite3.connect("ocean_sentinel.db")
cursor = conn.cursor()

print("=== Tables ===")
tables = cursor.execute(
    "SELECT name FROM sqlite_master WHERE type='table'"
).fetchall()
print(tables)

for table in ["users", "reefs", "missions", "teams"]:
    try:
        count = cursor.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        print(f"{table}: {count}")
    except Exception as e:
        print(f"{table}: ERROR -> {e}")

conn.close()
