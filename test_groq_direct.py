import os
from dotenv import load_dotenv
load_dotenv()

from openai import OpenAI

api_key = os.getenv('GROQ_API_KEY')
print(f"API Key: {api_key[:20]}...")

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=api_key
)

try:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": "Say hello in one sentence"}
        ],
        max_tokens=50
    )
    print(f"SUCCESS: {response.choices[0].message.content}")
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
