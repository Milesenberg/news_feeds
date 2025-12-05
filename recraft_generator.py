"""
Recraft AI Integration Script
Automates character and asset generation with consistent styling
"""

import os
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Configuration
RECRAFT_API_TOKEN = os.getenv('RECRAFT_API_TOKEN')
BASE_URL = "https://external.api.recraft.ai/v1"
OUTPUT_DIR = Path("recraft_assets")
OUTPUT_DIR.mkdir(exist_ok=True)


class RecraftClient:
    """Client for Recraft AI API"""
    
    def __init__(self, api_token=None):
        self.api_token = api_token or RECRAFT_API_TOKEN
        if not self.api_token:
            raise ValueError("RECRAFT_API_TOKEN not set in environment")
        
        self.headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }
    
    def generate_image(self, prompt, style="realistic_image", size="1024x1024", 
                      n=1, style_id=None, model="recraftv3"):
        """
        Generate an image with Recraft
        
        Args:
            prompt: Text description
            style: Style type (realistic_image, digital_illustration, vector_illustration, etc.)
            size: Image size (1024x1024, 1024x1365, 1365x1024, etc.)
            n: Number of images to generate
            style_id: Optional style ID for consistency
            model: Model to use (recraftv3)
        
        Returns:
            List of image URLs
        """
        endpoint = f"{BASE_URL}/images/generations"
        
        payload = {
            "prompt": prompt,
            "style": style,
            "size": size,
            "n": n,
            "model": model
        }
        
        if style_id:
            payload["style_id"] = style_id
        
        response = requests.post(endpoint, json=payload, headers=self.headers)
        response.raise_for_status()
        
        data = response.json()
        return [img["url"] for img in data.get("data", [])]
    
    def create_style(self, style_description):
        """
        Create a custom style for consistent generation
        
        Args:
            style_description: Description of the style
        
        Returns:
            style_id to use in subsequent generations
        """
        # Note: This endpoint might vary - check Recraft docs
        endpoint = f"{BASE_URL}/styles"
        
        payload = {
            "description": style_description
        }
        
        response = requests.post(endpoint, json=payload, headers=self.headers)
        response.raise_for_status()
        
        return response.json().get("style_id")
    
    def download_image(self, url, filename):
        """Download generated image to local file"""
        response = requests.get(url)
        response.raise_for_status()
        
        filepath = OUTPUT_DIR / filename
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"✓ Downloaded: {filepath}")
        return filepath


# Example usage functions for your narrative game

def generate_character_portraits(client, character_name, description, 
                                 style_id=None, variations=1):
    """
    Generate character portraits with consistent style
    
    Args:
        client: RecraftClient instance
        character_name: Name of character
        description: Physical description
        style_id: Optional style ID for consistency
        variations: Number of variations (expressions, angles)
    """
    base_prompt = f"Portrait of {character_name}, {description}, cyberpunk style, neon lighting, highly detailed"
    
    expressions = ["neutral", "smiling", "angry", "surprised", "sad"][:variations]
    images = []
    
    for expression in expressions:
        prompt = f"{base_prompt}, {expression} expression"
        print(f"Generating {character_name} - {expression}...")
        
        urls = client.generate_image(
            prompt=prompt,
            style="realistic_image",
            size="1024x1024",
            style_id=style_id
        )
        
        for i, url in enumerate(urls):
            filename = f"{character_name.lower().replace(' ', '_')}_{expression}_{i}.png"
            filepath = client.download_image(url, filename)
            images.append(filepath)
    
    return images


def generate_background(client, scene_name, description, style_id=None):
    """Generate background image for a scene"""
    prompt = f"{description}, cinematic, high quality, detailed environment, cyberpunk aesthetic"
    
    print(f"Generating background: {scene_name}...")
    urls = client.generate_image(
        prompt=prompt,
        style="realistic_image",
        size="1365x1024",  # Wider for backgrounds
        style_id=style_id
    )
    
    filename = f"bg_{scene_name.lower().replace(' ', '_')}.png"
    return client.download_image(urls[0], filename)


# Example batch generation
if __name__ == "__main__":
    print("=" * 60)
    print("RECRAFT AI - CHARACTER GENERATION")
    print("=" * 60)
    
    try:
        client = RecraftClient()
        
        # Generate consistent character set
        print("\n[1/3] Generating Doc Stitch variations...")
        doc_portraits = generate_character_portraits(
            client,
            character_name="Doc Stitch",
            description="elderly Asian man, cybernetic eye implant, weathered face, grey hair",
            variations=3
        )
        
        print("\n[2/3] Generating Jax variations...")
        jax_portraits = generate_character_portraits(
            client,
            character_name="Fixer Jax",
            description="confident young woman, short purple hair, leather jacket, tattoos",
            variations=3
        )
        
        print("\n[3/3] Generating clinic background...")
        bg = generate_background(
            client,
            scene_name="back_alley_clinic",
            description="dark alley clinic, neon signs, rain-soaked streets, dystopian city"
        )
        
        print("\n" + "=" * 60)
        print(f"SUCCESS! Generated {len(doc_portraits) + len(jax_portraits) + 1} images")
        print(f"Saved to: {OUTPUT_DIR.absolute()}")
        print("=" * 60)
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
