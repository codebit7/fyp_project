# True Tilawah – Frontend

A React + TypeScript Quran memorization and recitation app with real-time WebSocket audio analysis.

---

## Project Structure (MVC)

```
true-tilawah/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── .env.example
└── src/
    │
    ├── main.tsx                          # App entry point
    ├── App.tsx                           # Root orchestrator (screen router)
    ├── index.css                         # Global styles (Tailwind v4)
    │
    ├── models/                           # ── MODEL layer ──
    │   └── types.ts                      # All TypeScript interfaces & types
    │
    ├── data/                             # Static / seed data
    │   └── quranData.ts                  # Surahs, Paras, Pages, Hizbs
    │
    ├── constants/
    │   └── appConstants.ts               # App-wide constants (user, WS URL, etc.)
    │
    ├── utils/
    │   └── shareUtils.ts                 # Share API + greeting helper
    │
    ├── controllers/                      # ── CONTROLLER layer (custom hooks) ──
    │   ├── useNavigation.ts              # Screen navigation + sidebar state
    │   ├── useSearch.ts                  # Search filtering across all entities
    │   ├── useRecorder.ts                # Mic capture + WS audio streaming
    │   └── useDailyAyah.ts              # Random daily ayah picker
    │
    ├── services/                         # External integrations
    │   ├── api/
    │   │   ├── authService.ts            # Login / register REST calls
    │   │   └── quranService.ts           # Quran data + bookmark REST calls
    │   └── websocket/
    │       └── audioStreamService.ts     # Real-time audio streaming over WS
    │
    └── views/                            # ── VIEW layer ──
        ├── components/
        │   ├── common/                   # Reusable primitives
        │   │   ├── index.ts              # Barrel export
        │   │   ├── Button.tsx
        │   │   ├── Card.tsx
        │   │   ├── Header.tsx
        │   │   ├── Input.tsx
        │   │   ├── NavButton.tsx
        │   │   └── SidebarItem.tsx
        │   ├── quran/
        │   │   └── AyahItem.tsx          # Single ayah card (share/play/bookmark)
        │   ├── dashboard/
        │   │   ├── DashboardCard.tsx     # Feature cards (Memorize/Recite/etc.)
        │   │   └── SearchBar.tsx         # Search input + results dropdown
        │   └── layout/
        │       ├── Sidebar.tsx           # Slide-in drawer
        │       ├── BottomNav.tsx         # Persistent tab bar
        │       └── SearchActionModal.tsx # Memorize vs Recite action picker
        └── screens/
            ├── OnboardingScreen.tsx
            ├── AuthScreen.tsx            # Login + Register with validation
            ├── DashboardScreen.tsx       # Home with greeting, cards, daily ayah
            ├── QuranListScreen.tsx       # Surah / Para / Page / Hizb tabs
            ├── DetailScreen.tsx          # Generic detail view (reused by all 4 entity types)
            ├── ReciteScreen.tsx          # Microphone + WS streaming + mistake feedback
            ├── TrackScreen.tsx           # Progress charts and stats
            ├── RetainScreens.tsx         # RetainScreen, RetainTestScreen, RetainResultsScreen
            └── SecondaryScreens.tsx      # Bookmarks, Profile, Settings, Help
```

---

## Prerequisites

| Tool       | Version   | Install                          |
|------------|-----------|----------------------------------|
| Node.js    | ≥ 18.x    | https://nodejs.org               |
| npm        | ≥ 9.x     | Comes with Node                  |
| Git        | any       | https://git-scm.com              |

---

## Quick Start

### 1 – Clone and install

```bash
git clone https://github.com/your-org/true-tilawah.git
cd true-tilawah
npm install
```

### 2 – Environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_AUDIO_URL=ws://localhost:8000/ws/audio
```

> The app works without a backend — it falls back to demo/static data automatically.

### 3 – Start the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Available Scripts

| Command              | Description                              |
|----------------------|------------------------------------------|
| `npm run dev`        | Start Vite dev server with HMR           |
| `npm run build`      | Type-check + production build → `dist/`  |
| `npm run preview`    | Preview the production build locally     |
| `npm run typecheck`  | Run TypeScript compiler (no emit)        |
| `npm run lint`       | Run ESLint on all `.ts` / `.tsx` files   |

---

## Real-Time Audio Streaming (WebSocket)

The **ReciteScreen** streams microphone audio to your backend for Tajweed analysis.

### How it works

```
Browser Mic
    │
    ▼
MediaRecorder (opus/webm, 250 ms chunks)
    │
    ▼  WebSocket  ws://localhost:8000/ws/audio
Backend (Python / FastAPI / Django Channels)
    │
    ▼  JSON response
{ "type": "mistake", "message": "Pronunciation: 'Ra' should be heavier", "timestamp": 1234567 }
    │
    ▼
ReciteScreen → mistake list displayed in real time
```

### Expected WebSocket message format (server → client)

```json
{
  "type": "mistake",
  "message": "Tajweed: Missing Ghunnah on 'Noon'",
  "timestamp": 1712345678901
}
```

`type` can be `"mistake"`, `"correct"`, or `"info"`.

### Running without a backend

When the WebSocket connection fails the app automatically runs in **demo mode**: simulated mistakes appear every few seconds so the UI is fully usable during frontend-only development.

### Example FastAPI backend (minimal)

```python
# backend/main.py
from fastapi import FastAPI, WebSocket

app = FastAPI()

@app.websocket("/ws/audio")
async def audio_ws(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_bytes()
        # Run your Tajweed model here
        await websocket.send_json({
            "type": "mistake",
            "message": "Pronunciation: 'Ra' should be heavier",
            "timestamp": 1712345678901
        })
```

```bash
pip install fastapi uvicorn
uvicorn backend.main:app --reload --port 8000
```

---

## REST API Endpoints (expected by services/api/)

| Method | Path                              | Description            |
|--------|-----------------------------------|------------------------|
| POST   | `/api/auth/login`                 | Login → returns token  |
| POST   | `/api/auth/register`              | Register new user      |
| GET    | `/api/quran/surahs`               | List all Surahs        |
| GET    | `/api/quran/surahs/:id/ayahs`     | Ayahs for a Surah      |
| POST   | `/api/bookmarks`                  | Save a bookmark        |

---

## Tech Stack

| Library          | Purpose                                |
|------------------|----------------------------------------|
| React 18         | UI rendering                           |
| TypeScript 5     | Type safety                            |
| Vite 5           | Build tool + dev server                |
| Tailwind CSS v4  | Utility-first styling                  |
| Motion (Framer)  | Animations & transitions               |
| Lucide React     | Icon set                               |
| WebSocket API    | Real-time audio streaming (native)     |
| MediaRecorder API| Microphone capture (native browser)    |

---

## Key Design Decisions

### Why a generic `DetailScreen`?
`SurahDetail`, `ParaDetail`, `PageDetail` and `HizbDetail` were structurally identical — only their data differed. A single `DetailScreen` component eliminates the duplication while staying fully typed.

### Why `useRecorder` wraps `audioStreamService`?
The service is a plain class singleton (easy to test, no React dependency). The hook adapts it to React's state/effect lifecycle and adds demo-mode fallback — clean separation of concerns.

### Why camelCase for all identifiers?
Consistent with TypeScript community conventions and easier for linters to enforce.

---

## Browser Support

| Browser      | Support |
|--------------|---------|
| Chrome 89+   | ✅ Full  |
| Firefox 90+  | ✅ Full  |
| Safari 15+   | ✅ Full  |
| Edge 89+     | ✅ Full  |

> `MediaRecorder` with `audio/webm;codecs=opus` is not supported on iOS Safari.  
> The app falls back to `audio/webm` automatically.

---

## Contributing

1. Fork the repository  
2. Create your feature branch: `git checkout -b feature/your-feature`  
3. Run `npm run typecheck && npm run lint` before committing  
4. Open a Pull Request — include a short description of what changed and why
