import requests
import json

API_URL = "https://uzhavan-connect.vercel.app/api/auth/login"

def test_login():
    print(f"Testing Login at {API_URL}...")
    
    
    payload = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(API_URL, json=payload)
        
        print(f"Status Code: {response.status_code}")
        print("Response Body:")
        print(response.text)
        
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_login()
