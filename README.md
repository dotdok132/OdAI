<p align="center">
  <img src="logo.png" width="128" height="128" alt="OdAI Emblem Logo" style="border-radius: 50%;">
  <h1 align="center">OdAI — Interactive AI RPG & Roleplay Adventure</h1>
</p>

<p align="center">
  <a href="https://github.com/dotdok132/OdAI/releases/latest"><img src="https://img.shields.io/github/v/release/dotdok132/OdAI?color=10b981&label=Version" alt="Release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"></a>
  <a href="https://github.com/dotdok132/OdAI/releases/latest"><img src="https://img.shields.io/badge/Platform-Android%20%7C%20Web-brightgreen" alt="Platform"></a>
</p>

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
  - **g4f (GPT4Free) Python Backend**: Optional server for free model generation via `server.py`.

- **🎭 Character.AI / Polybase UI**:
  - Screen-based navigation (Chat Archive List <-> Active Chat Feed).
  - Floating Action Button (+), 3-dots dropdown menu, custom character avatars.
  - Typewriter text appearance animation with instant click-to-skip.
  - Double-tap inline paragraph editing, swipe action toolbar, TTS voice playback, text copying.

- **🎲 Roleplay (RP) & RPG Mechanics**:
  - Standard Roleplay syntax parsing (`*actions*`, `(OOC notes)`, `"dialogue"`).
  - 3D d20 Dice Roll Mechanics with **Casual Mode (God Mode / Always Succeed)**.
  - AI Realism Guard & World Memory (Remember).
  - Character.AI character card import (`.json` & URLs).

- **📱 Mobile Native & True Fullscreen Responsive**:
  - 100% Android Back Button & Edge Swipe Gesture Navigation via Capacitor.
  - **True Fullscreen Edge-to-Edge Landscape Phone Mode** (`100vw` x `100dvh`).
  - Dual-column split-screen layout for Tablets & Widescreens (`min-width >= 960px` & `min-height >= 600px`).

---

## ☁️ 1-Click Free Cloud Server Deployment (For g4f Backend)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/dotdok132/OdAI)

### Free Cloud Deployment Options:
1. **Render.com (1-Click Deployment)**:
   - Click the **Deploy to Render** button above or log into [Render.com](https://render.com).
   - Select `dotdok132/OdAI` ➔ Environment: `Python 3` ➔ Render auto-builds `server.py` 24/7!
2. **Hugging Face Spaces (24/7 Docker)**:
   - Create Space on [Hugging Face](https://huggingface.co/new-space) ➔ Select **Docker** ➔ Link `dotdok132/OdAI`.

---

## 🚀 Quick Start

### Web / Capacitor Dev
```bash
npm install
npm run build
```

### Build Android APK
```bash
npx cap sync
cd android && ./gradlew assembleDebug
```

---

## 📱 Prebuilt Android APK
The compiled Android APK `OdAI.apk` is available under [GitHub Releases](https://github.com/dotdok132/OdAI/releases/latest).
