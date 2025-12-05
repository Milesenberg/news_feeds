
import requests
import sys

try:
    print("Testing Voice API...")
    response = requests.post(
        'http://localhost:5000/narrative/api/voice',
        json={'text': 'System check.', 'character_id': 'system'}
    )
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Success! Audio content received.")
        print(f"Content length: {len(response.content)} bytes")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
