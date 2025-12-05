import requests
import sys

print("Testing Time Machine LLM Consequence API...")
print("=" * 60)

try:
    response = requests.post(
        'http://localhost:5000/time/api/consequence',
        json={
            'action': 'Buy Apple stock',
            'year': 1980
        },
        timeout=30
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Consequence: {data['consequence']}")
        print(f"Cached: {data.get('cached', False)}")
        print("\nSUCCESS! LLM is generating consequences!")
    else:
        print(f"Error: {response.text}")
        
except Exception as e:
    print(f"Failed: {e}")
    import traceback
    traceback.print_exc()
