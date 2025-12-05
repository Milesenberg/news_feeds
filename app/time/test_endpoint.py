"""Test endpoint to verify Groq integration"""
from app.time import time
from flask import jsonify
from app.time.consequence_api import generate_consequence_llm

@time.route('/api/test-groq', methods=['GET'])
def test_groq():
    """Test if Groq API is working"""
    try:
        result = generate_consequence_llm("test action", 1980, 2025)
        return jsonify({
            'status': 'success',
            'result': result,
            'length': len(result)
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500
