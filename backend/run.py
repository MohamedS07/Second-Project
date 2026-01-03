import uvicorn

import sys
import os

if __name__ == "__main__":
    # Add project root to sys.path
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
