from dotenv import load_dotenv
from google.genai import types
from google import genai
import time
import asyncio


load_dotenv()
prompt = """Analyze this food image and estimate total calories, macronutrients (g), fiber(g), sugar(g), and satiety index (decimal/numeric e.g. 3.23=323% and 0.47=47%). Return only valid JSON with no markdown:
{
  "calories_cal": number,
  "macronutrients": {
    "fat_g": number,
    "protein_g": number,
    "carbs_g": number
  },
  "fiber_g": number,
  "sugar_g": number,
  "satiety_index": number
}"""

# The client gets the API key from the environment variable `GEMINI_API_KEY`.
client = genai.Client()

# Load image without resizing
with open('/home/vanessaroque/Downloads/nuggs2.jpg', 'rb') as f:
    image_bytes = f.read()

start_time = time.time()
first_chunk_time = None
response_chunks = []

print("Streaming response...")
for chunk in client.models.generate_content_stream(
    model="gemini-2.5-flash-image",
    contents=[
        types.Part.from_bytes(
            data=image_bytes,
            mime_type='image/jpeg',
        ),
        prompt
    ]
):
    if first_chunk_time is None:
        first_chunk_time = time.time()
    response_chunks.append(chunk.text)
    print(chunk.text, end='', flush=True)

end_time = time.time()
full_response = ''.join(response_chunks)

async def get_nutrition_avg(image_path):
    """
    Call Gemini API 5 times asynchronously with the same image and return averaged nutrition data.

    Args:
        image_path: Path to the food image

    Returns:
        dict: JSON with averaged calories and macronutrients
    """
    import json

    # Read image once
    with open(image_path, 'rb') as f:
        image_bytes = f.read()

    async def call_api(call_num):
        """Make a single API call"""
        print(f"API call {call_num}/5 started...", flush=True)

        try:
            # Run the blocking API call in a thread pool
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: client.models.generate_content(
                    model="gemini-2.5-flash-image",
                    contents=[
                        types.Part.from_bytes(
                            data=image_bytes,
                            mime_type='image/jpeg',
                        ),
                        prompt
                    ]
                )
            )

            # Parse JSON response
            response_text = response.text.strip()
            # Remove markdown code blocks if present
            if response_text.startswith('```'):
                response_text = response_text.split('\n', 1)[1]
                response_text = response_text.rsplit('```', 1)[0]

            data = json.loads(response_text)
            print(f"API call {call_num}/5 completed", flush=True)
            return data

        except Exception as e:
            print(f"API call {call_num}/5 error: {e}", flush=True)
            return None

    # Call API 5 times concurrently
    print("Calling Gemini API 5 times asynchronously to get averaged results...")
    tasks = [call_api(i+1) for i in range(5)]
    responses = await asyncio.gather(*tasks)

    # Filter out None results (failed calls)
    results = [r for r in responses if r is not None]

    if not results:
        raise Exception("All API calls failed")

    # Calculate averages
    avg_calories = sum(r['calories_cal'] for r in results) / len(results)
    avg_fat = sum(r['macronutrients']['fat_g'] for r in results) / len(results)
    avg_protein = sum(r['macronutrients']['protein_g'] for r in results) / len(results)
    avg_carbs = sum(r['macronutrients']['carbs_g'] for r in results) / len(results)
    avg_fiber = sum(r['fiber_g'] for r in results) / len(results)
    avg_sugar = sum(r['sugar_g'] for r in results) / len(results)
    avg_satiety = sum(r['satiety_index'] for r in results) / len(results)

    # Return finalized JSON
    return {
        "calories_cal": round(avg_calories, 1),
        "macronutrients": {
            "fat_g": round(avg_fat, 1),
            "protein_g": round(avg_protein, 1),
            "carbs_g": round(avg_carbs, 1)
        },
        "fiber_g": round(avg_fiber, 1),
        "sugar_g": round(avg_sugar, 1),
        "satiety_index": round(avg_satiety, 2),
        "samples_used": len(results)
    }

print(f"\n\nTotal API Response Time: {end_time - start_time:.2f} seconds")
print(f"Time to first chunk: {first_chunk_time - start_time:.2f} seconds")

# Example usage of get_nutrition_avg
print("\n" + "=" * 60)
print("Testing get_nutrition_avg function")
print("=" * 60)
result = asyncio.run(get_nutrition_avg('/home/vanessaroque/Downloads/nuggs.jpg'))
import json
print(json.dumps(result, indent=2))
