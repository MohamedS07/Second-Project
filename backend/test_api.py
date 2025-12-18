import requests
import random
import string
import os

BASE_URL = "http://localhost:8001"

def get_random_string(length=10):
    return ''.join(random.choices(string.ascii_letters, k=length))

def get_random_email():
    return f"{get_random_string()}@example.com"

def create_dummy_file(filename):
    with open(filename, "wb") as f:
        f.write(b"dummy content")
    return filename

def test_api():
    print("Starting Automated API Tests...")
    print("-" * 30)

    print("[TEST] Checking API Docs...")
    try:
        docs = requests.get(f"{BASE_URL}/openapi.json")
        if docs.status_code == 200:
            paths = docs.json().get("paths", {}).keys()
            print(f"[INFO] Available Paths: {list(paths)}")
        else:
            print(f"[WARN] Failed to get docs: {docs.status_code}")
    except Exception as e:
        print(f"[WARN] Failed to connect: {e}")

    # 1. Register & Login (User/Farmer)
    print("[TEST] Registering new user (Farmer)...")
    farmer_email = get_random_email()
    password = "password123"
    
    # Register
    resp = requests.post(f"{BASE_URL}/auth/register", json={
        "email": farmer_email,
        "password": password,
        "name": "Test Farmer",
        "phone": "1234567890"
    })
    if resp.status_code == 200:
        print("[OK] Register Success")
    else:
        print(f"[FAIL] Register Failed: {resp.text}")
        return

    
    print("[TEST] Logging in...")
    resp = requests.post(f"{BASE_URL}/auth/login", data={
        "username": farmer_email,
        "password": password
    })
    if resp.status_code == 200:
        farmer_token = resp.json()["access_token"]
        print("[OK] Login Success")
    else:
        print(f"[FAIL] Login Failed: {resp.text}")
        return

    
    print("[TEST] Creating Farmer Profile...")
    dummy_img = create_dummy_file("test_image.jpg")
    files = {
        "aadhar_photo": open(dummy_img, "rb"),
        "pan_photo": open(dummy_img, "rb"),
        "loan_detail_photo": open(dummy_img, "rb")
    }
    

    data = {
        "name": "Test Farmer",
        "village": "Test Village",
        "district": "Test District",
        "address": "123 Farm Lane",
        "phone": "1234567890",
        "loan_amount": "50000",
        "last_date": "2025-12-31",
        "bank_account_no": "9876543210",
        "bank_ifsc": "IFSC001",
        "apply_type": "Self"
    }
    headers = {"Authorization": f"Bearer {farmer_token}"}
    
    resp = requests.post(f"{BASE_URL}/farmers/", data=data, files=files, headers=headers)
    
    
    for f in files.values(): f.close()
    
    if resp.status_code == 200:
        print("[OK] Farmer Profile Created (Endpoints: 3)")
    else:
        print(f"[FAIL] Farmer Profile Failed: {resp.text}")

    
    print("[TEST] Checking Farmer Dashboard...")
    resp = requests.get(f"{BASE_URL}/farmers/dashboard", headers=headers)
    if resp.status_code == 200:
        print("[OK] Farmer Dashboard Accessed (Endpoints: 8)")
    else:
        print(f"[FAIL] Farmer Dashboard Failed: {resp.text}")

    
    print("[TEST] Checking Farmer List...")
    resp = requests.get(f"{BASE_URL}/farmers/")
    if resp.status_code == 200:
        farmers = resp.json()
        if len(farmers) > 0:
            print(f"[OK] Farmer List Accessed (Count: {len(farmers)}) (Endpoints: 11)")
        else:
             print("[WARN] Farmer List Accessed but empty (unexpected after create)")
    else:
        print(f"[FAIL] Farmer List Failed: {resp.text}")

    
    print("\n[TEST] Registering new user (Donor)...")
    donor_email = get_random_email()
    
    
    requests.post(f"{BASE_URL}/auth/register", json={"email": donor_email, "password": password, "name": "Test Donor", "phone": "111"})
    
    resp = requests.post(f"{BASE_URL}/auth/login", data={"username": donor_email, "password": password})
    donor_token = resp.json()["access_token"]
    
    
    print("[TEST] Creating Donor Profile...")
    donor_headers = {"Authorization": f"Bearer {donor_token}"}
    resp = requests.post(f"{BASE_URL}/donors/", json={
        "state": "Tamil Nadu",
        "apply_type": "Self"
    }, headers=donor_headers)
    
    if resp.status_code == 200:
         print("[OK] Donor Profile Created (Endpoints: 4)")
    else:
         print(f"[FAIL] Donor Profile Failed: {resp.text}")

    
    print("[TEST] Checking Donor Dashboard...")
    resp = requests.get(f"{BASE_URL}/donors/dashboard", headers=donor_headers)
    if resp.status_code == 200:
        print("[OK] Donor Dashboard Accessed (Endpoints: 9)")

    
    print("\n[TEST] Processing Payment (Donor -> Farmer)...")
    try:
        farmer_id = farmers[-1]['id']
        payment_data = {
            "farmer_id": farmer_id,
            "amount": 1000.0,
            "payment_method": "upi"
        }
        resp = requests.post(f"{BASE_URL}/payments/", json=payment_data, headers=donor_headers)
        if resp.status_code == 200:
            print(f"[OK] Payment Success: {resp.json()}")
        else:
             print(f"[FAIL] Payment Failed: {resp.text}")
    except Exception as e:
        print(f"[FAIL] Payment Test Error: {e}")

    
    print("\n[TEST] Registering new user (NGO)...")
    ngo_email = get_random_email()
    requests.post(f"{BASE_URL}/auth/register", json={"email": ngo_email, "password": password, "name": "Test NGO", "phone": "222"})
    resp = requests.post(f"{BASE_URL}/auth/login", data={"username": ngo_email, "password": password})
    ngo_token = resp.json()["access_token"]
    
    
    print("[TEST] Creating NGO Profile...")
    ngo_headers = {"Authorization": f"Bearer {ngo_token}"}
    files = {"proof_document": open(dummy_img, "rb")}
    data = {
        "ngo_name": "Helping Hands",
        "reg_number": "REG123",
        "district": "Chennai",
        "contact_person": "Mr. A",
        "contact_number": "9998887776"
    }
    resp = requests.post(f"{BASE_URL}/ngos/", data=data, files=files, headers=ngo_headers)
    files["proof_document"].close()
    
    if resp.status_code == 200:
         print("[OK] NGO Profile Created (Endpoints: 5)")
    else:
         print(f"[FAIL] NGO Profile Failed: {resp.text}")
         
    
    print("[TEST] Checking NGO Dashboard...")
    resp = requests.get(f"{BASE_URL}/ngos/dashboard", headers=ngo_headers)
    if resp.status_code == 200:
        print("[OK] NGO Dashboard Accessed (Endpoints: 10)")
        
    print("\n[INFO] Admin APIs (Endpoints 6, 7) require 'admin' role. Skipped automated check, but endpoints exist at /admin/...")
    
    
    
    try:
        farmer_id = farmers[-1]['id'] # Get ID of last farmer
        print(f"[TEST] Checking Specific Farmer Details (ID: {farmer_id})...")
        resp = requests.get(f"{BASE_URL}/farmers/{farmer_id}")
        if resp.status_code == 200:
             print("[OK] Specific Farmer Details Accessed (Endpoints: 7)")
        else:
             print(f"[FAIL] Specific Farmer Details Failed: {resp.text}")
    except:
        pass

    
    try:
        os.remove("test_image.jpg")
    except:
        pass
    
    print("-" * 30)
    print("Tests Completed.")

if __name__ == "__main__":
    test_api()
