from typing import Union
from fastapi.responses import RedirectResponse
import json
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Cookie
from pydantic import BaseModel
from supabase import create_client, Client
from datetime import datetime
from zoneinfo import ZoneInfo
from dotenv import load_dotenv
from urllib.parse import urlencode, quote_plus
from uuid import uuid1
import requests
from google import genai
from google.genai import types
from uuid import uuid4
import os
import asyncio
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

URL = os.getenv("SUPABASE_URL")
KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(URL, KEY)

AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

# Google OAuth credentials from .env
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

prompt = """Analyze the given food image and do your best to estimate the following:
calories (kcal),
proteins (g),
fats (g),
carbs (g),
sugar (g),
fiber (g),
and satiety index (decimal number normalized from 1-10 with
10 being the highest and 1 the lowest - levels of satiety)

Return only valid JSON with no markdown. ESPECIALLY DO NOT WRAP IN JSON MARKDOWN.

Here is an example output, FOLLOW THIS FORMAT STRICTLY.:
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

def get_authorization_url(state: str):
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "state": state,
        "response_type": "code",
        "scope": "openid profile email",
        "access_type": "offline",
        "include_granted_scopes": "true",
    }
    return f"{AUTHORIZATION_URL}?{urlencode(params, quote_via=quote_plus)}"

def get_access_token(code: str):
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    response = requests.post(TOKEN_URL, data=data)
    response.raise_for_status()  # Will raise an exception for 4xx or 5xx errors
    return response.json()

def get_user_info(access_token: str):
    headers = {
        "Authorization": f"Bearer {access_token}",
    }
    response = requests.get(USERINFO_URL, headers=headers)
    response.raise_for_status()
    return response.json()


@app.get("/")
async def root():
    return {"ok": True}

@app.get("/oauth")
async def login(state: str, session: str = None, code: str = None):     
    if session != None:
        response = supabase.table("Sessions").select("*").eq("sid", session).execute()
        if len(response.data) != 0:
            uid = response.data[0].get("uid")
            user_info = supabase.table("Users").select("*").eq("uid", uid).execute()
            resp = RedirectResponse(url=state)
            resp.set_cookie(
                key="sid", value=session,
                httponly=True, samesite="none", secure=True, path="/",
            )
            return resp

    if code == None:
        return RedirectResponse(url=get_authorization_url(state))
    
    
    access_token = get_access_token(code).get("access_token")
    #return access_token
    response = get_user_info(access_token)
    session = str(uuid1())
    uid = response.get("email")

    user_info = supabase.table("Users").select("*").eq("uid", uid).execute()
    if(len(user_info.data) == 0):
        supabase.table("Users").insert({
            "uid": uid, "username": response.get("name")}).execute()
    user_info = supabase.table("Users").select("*").eq("uid", uid).execute()
    
    supabase.table("Sessions").insert({"sid": str(session), "uid": uid}).execute()
    
    resp = RedirectResponse(url = state)
    resp.set_cookie(
        key="sid",
        value=session,
        httponly=True,
        samesite="none",   # or "None" only if you serve over HTTPS
        secure=True,     # True only when you use HTTPS
        path="/",
    )

    return resp 

@app.get("/me")
def me(sid: str | None = Cookie(default=None)):
    if not sid:
        raise HTTPException(status_code=401)
    session = supabase.table("Sessions").select("*").eq("sid", sid).execute()
    if not session.data:
        raise HTTPException(status_code=401)
    uid = session.data[0]["uid"]
    user = supabase.table("Users").select("*").eq("uid", uid).execute().data[0]
    return {"uid": uid, "username": user["username"]}


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
            if response_text.startswith('```'):
                response_text = response_text.split('\n', 1)[1]
                response_text = response_text.rsplit('```', 1)[0]

            data = json.loads(response_text)
            return data
        
        except Exception as e:
            return (f"Error: {e}")
    
    tasks = [gemini(prompt, img) for i in range(10)]
    responses = await asyncio.gather(*tasks)
    results = [r for r in responses if r is not None]

    n = len(results)

    avg_calories = sum(r['calories'] for r in results) // n
    avg_fats = sum(r['fats'] for r in results) // n
    avg_proteins = sum(r['proteins'] for r in results) // n
    avg_carbs = sum(r['carbs'] for r in results) // n
    avg_fibers = sum(r['fibers'] for r in results) // n
    avg_sugars = sum(r['sugars'] for r in results) // n
    avg_satiety = sum(r['satiety'] for r in results) // n

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