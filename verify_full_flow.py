import requests
import json
import random
import string

BASE_URL = "https://uzhavan-connect.vercel.app/api/auth"

def generate_random_email():
    return f"test_{''.join(random.choices(string.ascii_lowercase, k=8))}@example.com"

def test_full_flow():
    email = generate_random_email()
    password = "password123"
    
    print(f"Testing Full Flow with {email}...")
    
    
    print("1. Registering...")
    reg_payload = {
        "name": "Test User",
        "email": email,
        "phone": "1234567890",
        "password": password,
        "role": "farmer"
    }
    
    try:
        reg_response = requests.post(f"{BASE_URL}/register", json=reg_payload)
        print(f"Register Status: {reg_response.status_code}")
        if reg_response.status_code != 200:
            print(f"Register Failed: {reg_response.text}")
            return
            
        print("Registration Successful.")
        
        
        print("2. Logging in...")
        login_payload = {
            "email": email,
            "password": password
        }
        
        login_response = requests.post(f"{BASE_URL}/login", json=login_payload)
        print(f"Login Status: {login_response.status_code}")
        if login_response.status_code != 200:
            print(f"Login Failed: {login_response.text}")
        else:
            print("Login Successful!")
            print(login_response.json())
            
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_full_flow()
