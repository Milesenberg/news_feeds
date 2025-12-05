#!/usr/bin/env python
"""
Diagnostic script to test ElevenLabs integration step-by-step
"""
import os
import sys

print("=" * 60)
print("ELEVENLABS DIAGNOSTIC")
print("=" * 60)

# Step 1: Check environment
print("\n[1/5] Checking .env file...")
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv('ELEVENLABS_API_KEY')
if api_key:
    print(f"[OK] API Key found: {api_key[:15]}...")
else:
    print("[FAIL] NO API KEY FOUND!")
    sys.exit(1)

# Step 2: Check package installation
print("\n[2/5] Checking elevenlabs package...")
try:
    import elevenlabs
    print(f"[OK] Package version: {elevenlabs.__version__}")
except ImportError as e:
    print(f"[FAIL] Import failed: {e}")
    sys.exit(1)

# Step 3: Check client creation  
print("\n[3/5] Creating ElevenLabs client...")
try:
    from elevenlabs.client import ElevenLabs
    client = ElevenLabs(api_key=api_key)
    print("[OK] Client created")
except Exception as e:
    print(f"[FAIL] Client creation failed: {e}")
    sys.exit(1)

# Step 4: List available methods
print("\n[4/5] Checking available API methods...")
print(f"  - text_to_speech: {hasattr(client, 'text_to_speech')}")
print(f"  - voices: {hasattr(client, 'voices')}")

# Step 5: Try actual API call
print("\n[5/5] Testing actual TTS generation...")
try:
    audio_generator = client.text_to_speech.convert(
        voice_id="pNInz6obpgDQGcFmaJgB",  # Adam voice
        text="Test",
        model_id="eleven_monolingual_v1"
    )
    
    # Save to file
    with open('diagnostic_test.mp3', 'wb') as f:
        for chunk in audio_generator:
            f.write(chunk)
    
    print("[OK] SUCCESS! Audio file created: diagnostic_test.mp3")
    
except Exception as e:
    print(f"[FAIL] API call failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 60)
print("ALL CHECKS PASSED!")
print("=" * 60)
