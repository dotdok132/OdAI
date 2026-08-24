# OdAI - Interactive AI RPG Adventure & Roleplay Game

**OdAI** is an interactive AI roleplay and text adventure game mobile app (Android & Web), inspired by Character.AI, JanitorAI, and AI Dungeon.

## 🌿 Features

- **Multi-Provider AI Engine**:
  - **Google Gemini API**: Dynamic model discovery & automatic fallback chain (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-pro`).
  - **OpenRouter API**: Access to 100+ AI models.
  - **g4f (GPT4Free) Python Backend**: Unlimited free generation without API keys via `server.py`.
- **Character.AI / Polybase UI**:
  - Screen-based navigation (Chat List <-> Active Chat).
  - Floating Action Button (+), 3-dots dropdown menu, custom character avatars.
  - Typewriter text appearance animation with instant click-to-skip.
  - Double-tap inline paragraph editing, swipe action toolbar, TTS voice playback, text copying.
- **Roleplay (RP) & RPG Mechanics**:
  - Standard Roleplay syntax parsing (`*actions*`, `(OOC notes)`, `"dialogue"`).
  - 3D d20 Dice Roll Mechanics with procedural & AI realism guard.
  - Inventory management & World Memory (Remember).
  - Character.AI character card import (`.json` & URLs).
- **Responsive & Mobile Native**:
  - 100% Android Back Button & Gesture Navigation support via Capacitor.
  - Compact landscape phone mode with safe-area notch insets.
  - Dual-column split-screen layout for Tablets & Widescreens (`min-width >= 960px`).
  - Internationalization (i18n): English (Default) & Russian.

## 🚀 Quick Start

### Web / Capacitor Dev
```bash
npm install
npm run build
```

### Run Python g4f Backend Server
```bash
python server.py
```

### Build Android APK
```bash
npx cap sync
cd android && ./gradlew assembleDebug
```

## 📱 Prebuilt Android APK
The compiled Android APK `OdAI.apk` is available in the repository root.
