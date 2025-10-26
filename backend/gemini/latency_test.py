from dotenv import load_dotenv
from google import genai
from google.genai import types
import time

load_dotenv()

prompt = """Analyze this food image and estimate total calories (kcal) and macronutrients (g). Return only valid JSON with no markdown:
{
  "calories_cal": number,
  "macronutrients": {
    "fat_g": number,
    "protein_g": number,
    "carbs_g": number
  }
}"""

client = genai.Client()

with open('/home/vanessaroque/Downloads/food1.jpg', 'rb') as f:
    image_bytes = f.read()

print("=" * 60)
print("Testing different latency optimization strategies")
print("=" * 60)

# Test 1: Streaming response (faster time-to-first-token)
print("\n1. STREAMING RESPONSE TEST")
print("-" * 60)
start_time = time.time()
first_chunk_time = None
response_chunks = []

for chunk in client.models.generate_content_stream(
    model="gemini-2.0-flash-exp",
    contents=[
        types.Part.from_bytes(data=image_bytes, mime_type='image/jpeg'),
        prompt
    ]
):
    if first_chunk_time is None:
        first_chunk_time = time.time()
        print(f"Time to first chunk: {first_chunk_time - start_time:.2f}s")
    response_chunks.append(chunk.text)

end_time = time.time()
full_response = ''.join(response_chunks)
print(f"Total streaming time: {end_time - start_time:.2f}s")
print(f"Response: {full_response[:100]}...")

# Test 2: Try gemini-2.0-flash-exp (latest experimental model)
print("\n2. GEMINI-2.0-FLASH-EXP (latest experimental)")
print("-" * 60)
start_time = time.time()
response = client.models.generate_content(
    model="gemini-2.0-flash-exp",
    contents=[
        types.Part.from_bytes(data=image_bytes, mime_type='image/jpeg'),
        prompt
    ]
)
end_time = time.time()
print(f"Response time: {end_time - start_time:.2f}s")
print(f"Response: {response.text[:100]}...")

# Test 3: Current model (gemini-2.5-flash) for comparison
print("\n3. GEMINI-2.5-FLASH (current baseline)")
print("-" * 60)
start_time = time.time()
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[
        types.Part.from_bytes(data=image_bytes, mime_type='image/jpeg'),
        prompt
    ]
)
end_time = time.time()
print(f"Response time: {end_time - start_time:.2f}s")
print(f"Response: {response.text[:100]}...")

print("\n" + "=" * 60)
print("RECOMMENDATIONS:")
print("=" * 60)
print("- Use streaming for better perceived performance (faster first response)")
print("- Compare model versions above to see which is fastest")
print("- Consider caching responses for repeated images")
print("- For production: use async/concurrent requests if processing multiple images")
