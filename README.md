<p align="center">
  <img src="logo.png" width="128" height="128" alt="OdAI Emblem Logo" style="border-radius: 50%;">
  <h1 align="center">OdAI — Interactive AI RPG & Roleplay Adventure</h1>
</p>

<p align="center">
  <a href="https://od-ai.vercel.app/"><img src="https://img.shields.io/badge/Web%20App-od--ai.vercel.app-10b981?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"></a>
  <a href="https://github.com/dotdok132/OdAI/releases/latest"><img src="https://img.shields.io/badge/Android%20APK-Download-059669?style=for-the-badge&logo=android&logoColor=white" alt="Android APK"></a>
</p>

<p align="center">
  <a href="https://github.com/dotdok132/OdAI/releases/latest"><img src="https://img.shields.io/github/v/release/dotdok132/OdAI?color=10b981&label=Release" alt="Release"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"></a>
  <a href="https://github.com/dotdok132/OdAI"><img src="https://img.shields.io/badge/Speed-100%25%20Vanilla%20JS-blueviolet" alt="Performance"></a>
</p>

**OdAI** is an ultra-fast, lightweight, interactive AI roleplay and text adventure game application for Android and Web browsers, inspired by Character.AI, JanitorAI, and SillyTavern.

---

## 🌐 Live Web App

Play OdAI directly in your browser without installing anything:
👉 **[https://od-ai.vercel.app/](https://od-ai.vercel.app/)**

---

## 🌟 Key Highlights & Features

- **✨ Auto-Generate AI Bot by Title & Character Name**:
  - Simply enter any franchise title (e.g. *Cyberpunk 2077*, *Naruto*, *Witcher 3*, *Marvel*, *Bleach*) and character name (e.g. *Judy Alvarez*, *Kakashi*, *Geralt*).
  - AI automatically researches the plot lore, world rules, personality, speech patterns, and generates an immersive starter scene!

- **⚡ Behavior Presets**:
  - Switch between response styles on the fly:
    - **⚡ Concise & No-Fluff (Лаконичный и Без Воды)**: Direct 1-2 sentence replies without recap filler.
    - **⚔️ Strict & Hardcore**: Realistic, challenging consequences.
    - **💖 Romantic & Emotional**: Deep emotional resonance and sensory detail.
    - **🎭 Classic Master**: Balanced roleplay experience.
    - **🌌 Dark Fantasy / 🌀 Chaotic / 🔎 Noir**.

- **🤖 Universal Multi-Provider AI Engine (With Auto-Failover)**:
  - **Google Gemini API**: Dynamic model discovery & automatic fallback chain (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`, `gemini-1.5-pro`).
  - **OpenRouter API**: Access 100+ AI models (Claude 3.5, DeepSeek R1, Llama 3.3 70B, Qwen).
  - **Local AI Models**: Connect to local Ollama / LM Studio instances on your PC.
  - **g4f (GPT4Free) Python Backend**: Free model server option.

- **🌐 Multilingual i18n Engine (4 Languages)**:
  - 🇬🇧 **English**
  - 🇪🇸 **Español**
  - 🇺🇦 **Українська**
  - 🇷🇺 **Русский**
  - Complete UI dictionary, starter scenarios, and localized system prompts.

- **🎲 Roleplay (RP) & RPG Mechanics**:
  - Standard Roleplay syntax formatting (`*actions*`, `(OOC notes)`, `"dialogue"`).
  - 3D d20 Dice Roll Mechanics with **Casual Mode (God Mode)**.
  - World Memory (Remember) & Author Notes.
  - Character.AI character card import (`.json` & direct links).

- **🎨 Modern Theme Engine & Desktop Polish**:
  - 6 Curated Themes: **Emerald**, **Cyberpunk**, **Gothic**, **Classic**, **Midnight**, **Goth-Dark**.
  - Floating centered 1200px card container layout on PC screens (`min-width >= 960px`) with smooth rounded corners (`18px border-radius`).
  - Theme-adaptive dynamic action buttons.

---

## ⚡ Free AI Setup (No Credit Cards Required)

1. **Google Gemini API (Recommended - 100% Free, Zero Cards, Zero Server)**:
   - Get a free API key from [aistudio.google.com](https://aistudio.google.com/).
   - Paste key into OdAI Settings for instant high-speed access to Gemini models with zero server overhead!

2. **OpenRouter API (Free Tier)**:
   - Access free models via [OpenRouter.ai](https://openrouter.ai/).

3. **Local LLMs (Ollama / LM Studio)**:
   - Run models locally on your PC and point OdAI to `http://localhost:11434/v1` or `http://localhost:1234/v1`.

---

## 🚀 Quick Start & Development

### Web Bundle Build
```bash
npm install
npm run build
```

### Build Android APK
```bash
npx cap sync android
cd android && ./gradlew assembleRelease
```

---

## 📱 Prebuilt Android APK
The compiled Android release APK is available under [GitHub Releases](https://github.com/dotdok132/OdAI/releases/latest).

---

## 📜 License
MIT License. Created with ❤️ for AI roleplay enthusiasts.
