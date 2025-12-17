import urllib.request
import urllib.parse
import json

def test_login():
    url = "http://localhost:8000/auth/login"
    data = urllib.parse.urlencode({
        "username": "admin@uzhavan.com",
        "password": "admin123"
    }).encode()
    
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")

    print(f"Sending POST to {url}...")
    try:
        with urllib.request.urlopen(req) as response:
            print(f"Status Code: {response.getcode()}")
            body = response.read().decode()
            print(f"Response Body: {body}")
            print("Login SUCCESS!")
    except urllib.error.HTTPError as e:
        print(f"Login FAILED! Status: {e.code}")
        print(f"Response: {e.read().decode()}")
    except Exception as e:
        print(f"Connection Error: {e}")

if __name__ == "__main__":
    test_login()
