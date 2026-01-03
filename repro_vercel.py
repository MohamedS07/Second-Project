import sys
import os

# Simulate Vercel environment where we might be at root
# backend/main.py does: sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# This adds the root to sys.path

print("Simulating Vercel startup...")

# Mimic the sys.path modification in backend/main.py
current_dir = os.getcwd()
print(f"Current working directory: {current_dir}")

# Assuming we run this from root
sys.path.append(current_dir)

try:
    print("Attempting to import backend.main...")
    from backend import main
    print("Import successful!")
    print(f"App object: {main.app}")
except Exception as e:
    print(f"Import failed with error: {e}")
    import traceback
    traceback.print_exc()
