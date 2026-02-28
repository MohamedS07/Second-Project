import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy import text
from backend.database import engine

with engine.connect() as conn:
    result = conn.execute(text(
        "SELECT column_name FROM information_schema.columns WHERE table_name='farmers' AND column_name='decline_reason'"
    ))
    row = result.fetchone()
    if row:
        print("COLUMN EXISTS - migration already applied")
    else:
        conn.execute(text("ALTER TABLE farmers ADD COLUMN decline_reason TEXT"))
        conn.commit()
        print("COLUMN ADDED - migration applied successfully")
