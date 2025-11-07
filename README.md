# CalTracker

> Built for Cal Hacks. AI-powered meal logging from a single photo.

[▶️ Demo Video](https://www.youtube.com/watch?v=U6-4qrMXV0M&feature=youtu.be)

## What it does

1. You snap a photo of your meal in the iOS app (SwiftUI).
2. The photo is sent to the FastAPI backend.
3. Backend calls the Gemini API to estimate calories, protein, fat, and other macros.
4. The result is stored in Supabase (PostgreSQL).
5. The web dashboard (Svelte + Tauri desktop shell) shows:
   - today’s intake
   - meal gallery
   - progress vs goals
   - friend/leaderboard view
   - planned charts for historical stats
6. A small physical screen device mirrors the key daily stats for at-a-glance tracking.

## Features

- 📸 **Photo-based meal capture** (iOS, SwiftUI)
- 🤖 **Image → nutrition via Gemini API**
- 🗄️ **Persistent storage with Supabase/PostgreSQL**
- 📊 **Daily calorie & macro dashboard**
- 🖼️ **Meal gallery for everything you’ve eaten**
- 🧑‍🤝‍🧑 **Share progress + leaderboards**
- 📈 **Planned charts** for intake over time
- 🖥️ **Companion physical display** tied to the user’s account

## Tech Stack

**Frontend (web/dashboard)**
- Svelte
- Tauri (desktop-style container)

**Mobile**
- SwiftUI (iOS)

**Backend**
- FastAPI (Python)
- Gemini API (image analysis)

**Data**
- Supabase
- PostgreSQL
