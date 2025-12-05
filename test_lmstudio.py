import requests

print("Testing direct LM Studio connection...")

try:
    # Test LM Studio health
    response = requests.get('http://localhost:11964/v1/models', timeout=5)
    print(f"LM Studio Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✓ LM Studio is accessible!")
        models = response.json()
        print(f"Available models: {models}")
    else:
        print(f"✗ Error: {response.text}")
        
except Exception as e:
    print(f"✗ LM Studio not accessible: {e}")
    print("\nMake sure:")
    print("1. LM Studio is running")
    print("2. Server is started on port 11964")
    print("3. A model is loaded")
