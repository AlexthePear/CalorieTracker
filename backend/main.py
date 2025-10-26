from typing import Union
import json
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from datetime import datetime
from zoneinfo import ZoneInfo
from dotenv import load_dotenv
from google import genai
from google.genai import types
from uuid import uuid4
import os
import asyncio

app = FastAPI()

load_dotenv()

URL = os.getenv("SUPABASE_URL")
KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(URL, KEY)

prompt = """Analyze the given food image and do your best to estimate the following:
calories (kcal),
proteins (g),
fats (g),
carbs (g),
sugar (g),
fiber (g),
and satiety index (decimal number normalized from 1-10 with
10 being the highest and 1 the lowest - levels of satiety)

Return only valid JSON with no markdown, follow this format strictly.
Here is an example output:
{
    "calories": int,
    "proteins": int,
    "fats": int,
    "carbs": int,
    "sugars": int,
    "fibers": int,
    "satiety": int
}
"""

bucket = "images"

client = genai.Client()

class Macros(BaseModel):
    calories : int
    proteins: int
    carbs : int
    fats : int
    sugars: int
    fibers : int
    satiety : int

@app.get("/")
async def root():
    return {"ok": True}


@app.post("/entry")
async def image(
    img: UploadFile = File(...),
    uid: str = Form(...)
):
    img_content = await img.read()
    eid = str(uuid4())
    timestamp = str(datetime.now(ZoneInfo("America/Los_Angeles")))

    async def gemini(prompt: str = Form(...), img: UploadFile = File(...)):
        try:
            loop = asyncio.get_running_loop()
            response = await loop.run_in_executor(
                None,
                lambda: client.models.generate_content(
                    model = "gemini-2.5-flash-image",
                    contents = [
                        types.Part.from_bytes(
                            data = img_content,
                            mime_type = 'image/jpeg',
                        ),
                        prompt
                    ]
                )
            )

            response_text = response.text.strip()
            data = json.loads(response_text)
            return data
        
        except Exception as e:
            return (f"Error: {e}")
    
    tasks = [gemini(prompt, img) for i in range(5)]
    responses = await asyncio.gather(*tasks)

    avg_calories = sum(r['calories'] for r in responses) // 5
    avg_fats = sum(r['fats'] for r in responses) // 5
    avg_proteins = sum(r['proteins'] for r in responses) // 5
    avg_carbs = sum(r['carbs'] for r in responses) // 5
    avg_fibers = sum(r['fibers'] for r in responses) // 5
    avg_sugars = sum(r['sugars'] for r in responses) // 5
    avg_satiety = sum(r['satiety'] for r in responses) // 5

    nutrition = Macros(
        calories = avg_calories,
        fats = avg_fats,
        proteins = avg_proteins,
        carbs = avg_carbs,
        fibers = avg_fibers,
        sugars = avg_sugars,
        satiety = avg_satiety
    )

    path = f"{eid}.jpg"

    try:
        supabase.storage.from_(bucket).upload(
            path,
            img_content
        )
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"Upload failed: {e}")
    
    public_url = supabase.storage.from_(bucket).get_public_url(path)
    
    supabase.table("Entries").insert({
        "eid": eid,
        "uid": uid,
        "image": public_url,
        "calories": nutrition.calories,
        "proteins": nutrition.proteins,
        "carbs": nutrition.carbs,
        "fats": nutrition.fats,
        "sugars": nutrition.sugars,
        "fibers": nutrition.fibers,
        "timestamp": timestamp,
        "satiety_index": nutrition.satiety
    }).execute()

    return {"Good"}

# @app.post("/test")
# async def test():
#     supabase.table("test").insert({"id": 12, "created_at": "potato"}).execute()
#     return {}

# @app.get("/items/{item_id}")
# async def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}