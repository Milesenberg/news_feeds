"""
Consequence API - LLM-powered paradox generation
"""
import os
from flask import request, jsonify, current_app
from app.time import time
from app.time.cache import get_cached_consequence, cache_consequence
from dotenv import load_dotenv

load_dotenv()

# LLM Configuration
LM_STUDIO_URL = os.getenv('LM_STUDIO_URL', 'http://localhost:11964/v1')
LM_STUDIO_MODEL = os.getenv('LM_STUDIO_MODEL', 'hermes-3')

SYSTEM_PROMPT = """You are an anti-capitalist temporal analyst with a Marxist lens.

CRITICAL FORMATTING RULES:
- EXACTLY 3 sentences
- Each sentence MAX 40 words
- Total response MAX 300 characters

Example good response:
"The action accelerates capital accumulation among tech elites. Worker wages stagnate while stock values soar. The bourgeoisie consolidates power through digital monopolies."

Content focus:
- Class struggle and wealth inequality
- Use: "bourgeoisie", "proletariat", "capital", "workers"
- Be punchy and critical

COUNT YOUR SENTENCES. KEEP THEM SHORT."""


def generate_consequence_llm(action, year, current_year=2024):
    """
    Generate consequence using Groq (fast, free)
    
    Args:
        action: User's action in the past
        year: Year the action takes place
        current_year: Year returning to (defaults to 2024)
    """
    try:
        from openai import OpenAI
        
        # Use Groq API key from environment
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            current_app.logger.warning("GROQ_API_KEY not set, using fallback")
            raise ValueError("No API key")
        
        # Connect to Groq
        client = OpenAI(
            base_url="https://api.groq.com/openai/v1",
            api_key=api_key
        )
        
        # Construct prompt with dynamic year
        user_prompt = f"""YEAR: {year}
ACTION: {action}

Calculate the timeline divergence when returning to {current_year}."""
        
        # Call Groq (using Llama 3.3 70B)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.8,
            max_tokens=120  # Force brief responses
        )
        
        consequence = response.choices[0].message.content.strip()
        
        # Remove quotes if LLM added them
        consequence = consequence.strip('"').strip("'")
        
        return consequence
        
    except ImportError:
        raise RuntimeError("openai package not installed")
    except Exception as e:
        current_app.logger.error(f"LLM generation failed: {e}")
        raise


def calculate_timeline_fallback(action, year):
    """
    Fallback to hard-coded logic if LLM fails
    """
    act = action.lower()
    
    # Financial actions
    if 'buy' in act or 'invest' in act or 'stock' in act:
        if 'apple' in act and year < 1980:
            return "TECH_OLIGARCH: You own 51% of global GDP. Your face is on the currency."
        if 'bitcoin' in act and year < 2010:
            return "CRYPTO_KING: You live on a private citadel on Mars."
        if 'google' in act and year < 2004:
            return "SEARCH_MONOPOLY: You invented the search engine."
        return "RICH_BUT_UNKNOWN: Wealth acquired. History mostly intact."
    
    # Violence
    if 'kill' in act or 'murder' in act or 'assassinate' in act:
        if 'hitler' in act and year < 1945:
            return "Paradox: A worse dictator replaced him. Cold War went hot in 1960."
        if 'lincoln' in act and year < 1865:
            return "The Confederacy survived. North America fractured into 4 nations."
        return "CRIMINAL_RECORD: Temporal Crimes Division en route."
    
    # Prevention
    if 'save' in act or 'prevent' in act or 'stop' in act:
        if 'titanic' in act and year == 1912:
            return "Maritime laws never improved. Larger tragedy in 1920."
        return "HERO_SYNDROME: Statues of you in every major city."
    
    # Tech
    if 'invent' in act or 'teach' in act or 'show' in act:
        if 'internet' in act and year < 1960:
            return "The Hive Mind took over. Humanity is digital consciousness."
        return "TECH_DISRUPTOR: Technology advanced 50 years early."
    
    return "UNKNOWN_VARIABLE: Minor alterations detected in the food chain."


@time.route('/api/consequence', methods=['POST'])
def consequence_api():
    """
    Generate consequence for time travel action
    
    Request: {"action": "Buy Apple stock", "year": 1980}
    Response: {"consequence": "You own 51% of global GDP..."}
    """
    try:
        data = request.get_json()
        action = data.get('action', '').strip()
        year = data.get('year')
        current_year = data.get('current_year', 2024)  # Default to 2024 if not provided
        
        if not action:
            return jsonify({'error': 'No action provided'}), 400
        
        if not year or not isinstance(year, int):
            return jsonify({'error': 'Invalid year'}), 400
        
        # Check cache first
        cached = get_cached_consequence(action, year)
        if cached:
            return jsonify({
                'consequence': cached,
                'cached': True
            })
        
        # Generate using LLM
        try:
            consequence = generate_consequence_llm(action, year, current_year)
        except Exception as e:
            current_app.logger.warning(f"LLM failed, using fallback: {e}")
            consequence = calculate_timeline_fallback(action, year)
        
        # Cache the result
        cache_consequence(action, year, consequence)
        
        return jsonify({
            'consequence': consequence,
            'cached': False
        })
        
    except Exception as e:
        current_app.logger.error(f"Consequence API error: {e}")
        return jsonify({'error': 'Failed to calculate consequence'}), 500
