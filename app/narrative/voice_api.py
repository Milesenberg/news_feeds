"""
Voice Synthesis API for Narrative Game
Uses ElevenLabs TTS to generate character voices
"""

import os
import hashlib
from pathlib import Path
from flask import request, jsonify, send_file, current_app
from app.narrative import narrative

# Voice cache directory
CACHE_DIR = Path(__file__).parent / 'static' / 'voice_cache'
CACHE_DIR.mkdir(exist_ok=True)

# Character to ElevenLabs voice ID mapping
# These will need to be updated with actual voice IDs from your ElevenLabs account
VOICE_MAPPING = {
    'doc_stitch': 'ErXwobaYiN019PkySvjV',  # Antoni - mature masculine
    'fixer_jax': '21m00Tcm4TlvDq8ikWAM',   # Rachel - confident feminine
    'ai_companion': 'MF3mGyEYCl7XYWbV9V6O', # Elli - clear neutral feminine
    'system': 'pNInz6obpgDQGcFmaJgB',       # Adam - for digital modulation
    'unknown': 'pNInz6obpgDQGcFmaJgB'       # Fallback
}


def get_cache_filename(text, character_id):
    """Generate a unique cache filename based on text and character"""
    content = f"{character_id}:{text}"
    hash_obj = hashlib.md5(content.encode('utf-8'))
    return f"{character_id}_{hash_obj.hexdigest()}.mp3"


def generate_voice(text, character_id):
    """
    Generate voice using ElevenLabs API
    Returns path to generated audio file
    """
    try:
        from elevenlabs.client import ElevenLabs
        
        # Set API key from environment
        api_key = os.getenv('ELEVENLABS_API_KEY')
        if not api_key:
            raise ValueError("ELEVENLABS_API_KEY not set in environment")
        
        # Initialize client
        client = ElevenLabs(api_key=api_key)
        
        # Get voice ID for character
        voice_id = VOICE_MAPPING.get(character_id, VOICE_MAPPING['unknown'])
        
        # Generate audio using text_to_speech
        audio_generator = client.text_to_speech.convert(
            voice_id=voice_id,
            text=text,
            model_id="eleven_turbo_v2_5"  # Free tier model
        )
        
        # Save to cache (audio is an iterator of bytes)
        cache_file = CACHE_DIR / get_cache_filename(text, character_id)
        with open(cache_file, 'wb') as f:
            for chunk in audio_generator:
                f.write(chunk)
        
        return cache_file
        
    except ImportError as e:
        current_app.logger.error(f"Import error: {e}")
        raise RuntimeError(f"elevenlabs package not installed or wrong version: {e}")
    except Exception as e:
        current_app.logger.error(f"Voice generation failed: {e}")
        raise


@narrative.route('/api/voice', methods=['POST'])
def voice_api():
    """
    Voice generation API endpoint
    
    Request: {"text": "dialogue text", "character_id": "doc_stitch"}
    Response: MP3 audio file
    """
    print("[VOICE API] Request received")  # Render log
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        character_id = data.get('character_id', 'unknown')
        
        print(f"[VOICE API] Text: {text[:50]}..., Character: {character_id}")  # Render log
        
        if not text:
            print("[VOICE API] ERROR: No text provided")
            return jsonify({'error': 'No text provided'}), 400
        
        # Check cache first
        cache_file = CACHE_DIR / get_cache_filename(text, character_id)
        
        print(f"[VOICE API] Cache file: {cache_file}, Exists: {cache_file.exists()}")  # Render log
        
        if cache_file.exists():
            # Serve cached file
            print("[VOICE API] Serving from cache")
            return send_file(
                cache_file,
                mimetype='audio/mpeg',
                as_attachment=False,
                download_name=f'{character_id}_voice.mp3'
            )
        
        # Generate new voice
        print("[VOICE API] Generating new voice with ElevenLabs")
        audio_file = generate_voice(text, character_id)
        
        print(f"[VOICE API] Voice generated successfully: {audio_file}")
        return send_file(
            audio_file,
            mimetype='audio/mpeg',
            as_attachment=False,
            download_name=f'{character_id}_voice.mp3'
        )
        
    except ValueError as e:
        print(f"[VOICE API] ValueError: {e}")
        return jsonify({'error': str(e)}), 500
    except RuntimeError as e:
        print(f"[VOICE API] RuntimeError: {e}")
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        print(f"[VOICE API] Unexpected error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        current_app.logger.error(f"Voice API error: {e}")
        return jsonify({'error': 'Voice generation failed'}), 500
