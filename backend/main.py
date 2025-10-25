from typing import Union
from fastapi import FastAPI, File, UploadFile, Form
from pydantic import BaseModel
from supabase import create_client, Client
from datetime import datetime, timezone
from dotenv import load_dotenv
import os

app = FastAPI()

load_dotenv()

URL = os.getenv("SUPABASE_URL")
KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(URL, KEY)


class ImgData(BaseModel):
    eid: str
    calories: int
    proteins: int
    fats: int
    carbs: int


@app.get("/")
async def root():
    return {"ok": True}


@app.post("/image")
async def image(
    img: UploadFile = File(...),
    eid: str = Form(...),
    uid: str = Form(...),
    timestamp: int = int(datetime.now(timezone.utc).timestamp())
):
    img_content = await img.read()

@app.post("/imageData")
async def image_data(data: ImgData):
    return {}

@app.post("/test")
async def test():
    supabase.table("test").insert({"id": 12, "created_at": "potato"}).execute()
    return {}

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}