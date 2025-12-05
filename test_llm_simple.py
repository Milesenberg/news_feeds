from openai import OpenAI

print("Testing LM Studio LLM generation...")

client = OpenAI(
    base_url="http://localhost:11964/v1",
    api_key="not-needed"
)

try:
    response = client.chat.completions.create(
        model="hermes-3",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say 'Hello from LM Studio!' in one sentence."}
        ],
        temperature=0.7,
        max_tokens=50
    )
    
    print(f"SUCCESS! Response: {response.choices[0].message.content}")
    
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
