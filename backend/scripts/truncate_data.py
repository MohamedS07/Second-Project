import sys
import os


sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy import text
from backend.database import engine

def main():
    print("[MIGRATION] Loaded modules.")
    with engine.connect() as conn:
        print("[MIGRATION] Connected to DB.")
        
        for tab in ['payments', 'farmers', 'donors', 'ngos']:
            print(f"[MIGRATION] Truncating table {tab}...")
            conn.execute(text(f"TRUNCATE TABLE {tab} CASCADE"))
            conn.commit()
            print(f"[OK] {tab} truncated.")

        
        print("[MIGRATION] Cleaning users table...")
        r = conn.execute(text("DELETE FROM users WHERE role != 'admin'"))
        conn.commit()
        print(f"[OK] Users cleaned. Rows affected: {r.rowcount}")

if __name__ == "__main__":
    try:
        main()
        print("[DONE] Database reset.")
    except Exception as e:
        print(f"[CRASH] {str(e)}")
        sys.exit(1)
