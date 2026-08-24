# OdAI - Interactive AI RPG Adventure & Roleplay Game

[![Release](https://img.shields.io/github/v/release/dotdok132/OdAI?color=10b981)](https://github.com/dotdok132/OdAI/releases/latest)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Android](https://img.shields.io/badge/Platform-Android%20%7C%20Web-brightgreen)](https://github.com/dotdok132/OdAI/releases/tag/v1.0.21)

**OdAI** is an interactive AI roleplay and text adventure game mobile application for Android and Web browsers, inspired by Character.AI, JanitorAI, and AI Dungeon.

---

## 🌿 Features

- **🌐 Multilingual i18n Engine (4 Languages Supported)**:
  - 🇬🇧 **English** (Default)
  - 🇪🇸 **Español**
  - 🇺🇦 **Українська**
  - 🇷🇺 **Русский**
  - Complete UI dictionary, starter scenarios, and localized AI system prompt generators.

- **🤖 Multi-Provider AI Engine**:
  - **Google Gemini API**: Dynamic model discovery & automatic fallback chain (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-pro`).
  - **OpenRouter API**: Access to 100+ free and premium AI models.
  - **g4f (GPT4Free) Python Backend**: Unlimited free generation without API keys via `server.py` with multi-threading and fallback providers.

- **🎭 Character.AI / Polybase UI**:
  - Screen-based navigation (Chat Archive List <-> Active Chat Feed).
  - Floating Action Button (+), 3-dots dropdown menu, custom character avatars.
  - Typewriter text appearance animation with instant click-to-skip.
  - Double-tap inline paragraph editing, swipe action toolbar, TTS voice playback, text copying.

- **🎲 Roleplay (RP) & RPG Engine**:
  - Standard Roleplay syntax parsing (`*actions*`, `(OOC notes)`, `"dialogue"`).
  - 3D d20 Dice Roll Mechanics with procedural & AI realism guard.
  - Inventory management & World Memory (Remember).
  - Character.AI character card import (`.json` & URLs).

- **📱 Mobile Native & Responsive**:
  - 100% Android Back Button & Edge Swipe Gesture Navigation via Capacitor.
  - Compact landscape phone mode with safe-area notch insets (`env(safe-area-inset)`).
  - Dual-column split-screen layout for Tablets & Widescreens (`min-width >= 960px`).

---

## 🚀 Quick Start

### Web / Capacitor Dev
```bash
npm install
npm run build
```

### Run Python g4f Backend Server
```bash
./venv/bin/python server.py
```

### Build Android APK
```bash
npx cap sync
cd android && ./gradlew assembleDebug
```

---

## 📱 Prebuilt Android APK
The compiled Android APK `OdAI.apk` (v1.0.21) is available in the root repository directory and under [GitHub Releases](https://github.com/dotdok132/OdAI/releases/latest).
