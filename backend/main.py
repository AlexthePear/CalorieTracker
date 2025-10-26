from typing import Union
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from supabase import create_client, Client
from datetime import datetime, timezone
from dotenv import load_dotenv
from urllib.parse import urlencode, quote_plus
from uuid import uuid1
import requests
import os

app = FastAPI()

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


def get_authorization_url():
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
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


class ImgData(BaseModel):
    eid: str
    calories: int
    proteins: int
    fats: int
    carbs: int


@app.get("/")
async def root():
    return {"ok": True}

@app.get("/oauth")
async def login(session: str = None, code: str = None):
    # TODO: Add session states
    if session != None:
        response = supabase.table("Sessions").select("*").eq("sid", session).execute()
        if len(response.data) != 0:
            uid = response.data[0].get("uid")
            user_info = supabase.table("Users").select("*").eq("uid", uid).execute()
            return user_info.data[0]

    if code == None:
        print(get_authorization_url())
        return RedirectResponse(url=get_authorization_url())
    
    
    access_token = get_access_token(code).get("access_token")
    #return access_token
    response = get_user_info(access_token)
    session = uuid1()
    uid = response.get("email")

    supabase.table("Sessions").insert({"sid": str(session), "uid": uid}).execute()
    
    
    user_info = supabase.table("Users").select("*").eq("uid", uid).execute()
    if(len(user_info.data) == 0):
        supabase.table("Users").insert({
            "uid": uid, "username": response.get("name")}).execute()
    user_info = supabase.table("Users").select("*").eq("uid", uid).execute()
    return user_info.data[0]


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