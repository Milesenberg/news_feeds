import os
from dotenv import load_dotenv
load_dotenv()

print("Testing ElevenLabs...")
api_key = os.getenv('ELEVENLABS_API_KEY')
print(f"API Key found: {api_key[:10]}..." if api_key else "NO API KEY")

try:
    from elevenlabs.client import ElevenLabs
    client = ElevenLabs(api_key=api_key)
    print("Client created successfully")
    
    # Try generating a short test
    audio = client.generate(
        text="Test",
        voice="pNInz6obpgDQGcFmaJgB",
        model="eleven_monolingual_v1"
    )
    
    # Write to test file
    with open('test_audio.mp3', 'wb') as f:
        for chunk in audio:
            f.write(chunk)
    
    print("SUCCESS! Audio generated.")
    
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
