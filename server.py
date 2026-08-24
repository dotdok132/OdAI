"""
OdAI Backend Server with working g4f (GPT4Free) integration, Deep AI Realism Judge & static file serving
"""
import os
import sys
import time
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='.')
CORS(app)

# Import g4f dynamically
try:
    import g4f
    g4f_available = True
    print("[OdAI Server] g4f module successfully loaded!")
except Exception as e:
    g4f_available = False
    print(f"[OdAI Server] Warning: g4f not available ({e})")

# Safe import for curl_cffi
try:
    from curl_cffi import requests as cffi_requests
    cffi_available = True
except Exception:
    cffi_available = False
    import urllib.request

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    safe_extensions = {'.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.json', '.webmanifest'}
    if not any(filename.endswith(ext) for ext in safe_extensions) or '..' in filename:
        from flask import abort
        abort(403)
    return send_from_directory('.', filename)

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        "status": "ok",
        "g4f_available": g4f_available,
        "cffi_available": cffi_available
    })

# Deep AI Realism Judge Endpoint: Evaluates player actions semantically without any hardcoded word lists
@app.route('/api/validate-realism', methods=['POST'])
def validate_realism_ai():
    data = request.json or {}
    action = data.get('action', '')
    scenario = data.get('scenario', 'fantasy')
    inventory = data.get('inventory', [])
    lang = data.get('lang', 'en')

    if not action or not g4f_available:
        return jsonify({"allowed": True})

    try:
        if lang == 'en':
            guard_prompt = (
                "You are an AI Arbiter of realism and physics for an interactive RPG game in English.\n"
                f"World Setting: {scenario}.\n"
                f"Player Inventory: {json.dumps(inventory, ensure_ascii=False)}.\n\n"
                f"Player attempts the action: \"{action}\"\n\n"
                "TASK:\n"
                "Analyze the action deeply based on world logic and common sense.\n"
                "1. Disallow impossible actions (e.g. using an item not in inventory, using modern weapons in fantasy, violating world laws).\n"
                "2. Allow logical actions (looking around, speaking, using inventory items).\n\n"
                "RESPOND STRICTLY IN JSON:\n"
                "{\"allowed\": false, \"reason\": \"Detailed explanation why this action is impossible\"}\n"
                "OR\n"
                "{\"allowed\": true, \"reason\": \"\"}"
            )
        else:
            guard_prompt = (
                "Вы — ИИ-Арбитр реализма и физики в текстовой ролевой игре (RPG).\n"
                f"Текущий сеттинг мира: {scenario}.\n"
                f"Инвентарь игрока: {json.dumps(inventory, ensure_ascii=False)}.\n\n"
                f"Игрок пытается совершить действие: \"{action}\"\n\n"
                "ЗАДАЧА:\n"
                "Проанализируйте действие глубоко и контекстуально на основе логики выбранного мира и здравого смысла.\n"
                "1. Запрещены невозможные вещи (например: достать, создать или использовать предмет/оружие, которого нет в инвентаре).\n"
                "2. Разрешены логичные действия.\n\n"
                "ОТВЕТЬТЕ ИСКЛЮЧИТЕЛЬНО В ФОРМАТЕ JSON:\n"
                "{\"allowed\": false, \"reason\": \"Подробное объяснение ИИ\"}\n"
                "ИЛИ\n"
                "{\"allowed\": true, \"reason\": \"\"}"
            )

        response = g4f.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": guard_prompt}]
        )

        res_text = str(response).strip()

        # Extract JSON from AI response
        if "{" in res_text and "}" in res_text:
            json_str = res_text[res_text.find("{"):res_text.rfind("}")+1]
            eval_data = json.loads(json_str)
            return jsonify(eval_data)

    except Exception as e:
        print(f"[AI Realism Judge Exception]: {e}")

    return jsonify({"allowed": True})

@app.route('/api/generate', methods=['POST'])
def generate_story():
    data = request.json or {}
    prompt = data.get('prompt', '')
    scenario = data.get('scenario', 'fantasy')
    memory = data.get('memory', '')
    author_note = data.get('authorNote', '')
    history = data.get('history', [])
    lang = data.get('lang', 'en')

    if not g4f_available:
        return jsonify({"error": "g4f library not loaded on server"}), 500

    try:
        if lang == 'es':
            system_prompt = (
                "Eres un Dungeon Master y narrador para un juego interactivo de rol en español.\n"
                f"Escenario del Mundo: {scenario}.\n"
                f"Memoria del Mundo (Recordar): {memory}.\n"
                f"Estilo de Escritura: {author_note}.\n"
                "REGLA DE D20 Y REALISMO:\n"
                "1. Mira la tirada del dado d20 en la acción del jugador: '[🎲 d20: X]'!\n"
                "   - FALLO (1-5): ¡El personaje DEBE fallar!\n"
                "   - ÉXITO (12-20): ¡El personaje tiene éxito!\n"
                "2. Responde naturalmente en español con 2-4 oraciones completas."
            )
        elif lang == 'uk':
            system_prompt = (
                "Ви — ведучий майстер (Dungeon Master) для інтерактивної текстової рольової гри українською мовою.\n"
                f"Сценарій світу: {scenario}.\n"
                f"Пам'ять світу (Remember): {memory}.\n"
                f"Замітка автора (Стиль): {author_note}.\n"
                "СТРОГЕ ПРАВИЛО КУБИКА d20 ТА РЕАЛІЗМУ:\n"
                "1. Уважно дивіться на результат кубика: '[🎲 d20: X]'!\n"
                "2. Відповідайте українською мовою у 2-4 закінчених реченнях."
            )
        elif lang == 'ru':
            system_prompt = (
                "Вы — ведущий мастер (Dungeon Master) для интерактивной текстовой игры в стиле AI Dungeon и D&D.\n"
                f"Сценарий мира: {scenario}.\n"
                f"Память мира (Remember): {memory}.\n"
                f"Заметка автора (Стиль): {author_note}.\n"
                "СТРОГОЕ ПРАВИЛО КУБИКА d20 И РЕАЛИЗМА:\n"
                "1. Внимательно смотрите на прикрепленный результат кубика: '[🎲 d20: X]'!\n"
                "2. Отвечайте на русском языке в 2-4 законченных предложениях."
            )
        else:
            system_prompt = (
                "You are a Dungeon Master and storyteller for an interactive roleplay game in English.\n"
                f"Scenario Setting: {scenario}.\n"
                f"World Memory (Remember): {memory}.\n"
                f"Writing Style: {author_note}.\n"
                "RULE OF D20 AND REALISM:\n"
                "1. Look at the dice roll in the player action: '[🎲 d20: X]'!\n"
                "   - FAIL (1-5): Character MUST fail!\n"
                "   - SUCCESS (12-20): Character succeeds!\n"
                "2. Respond naturally in English with 2-4 complete sentences. Always finish complete sentences!"
            )

        messages = [{"role": "system", "content": system_prompt}]

        for h in history[-8:]:
            h_type = h.get('type')
            if h_type in ['do', 'say', 'story']:
                role = "user"
            elif h_type == 'system':
                role = "system" # Map realism guard and system notices to system context
            else:
                role = "assistant"
            messages.append({"role": role, "content": h.get('text', '')})

        if prompt and (not history or history[-1].get('text') != prompt):
            messages.append({"role": "user", "content": prompt})

        print(f"[OdAI Server] Generating AI story response via g4f ({lang})...")
        
        candidate_models = ["gpt-4o-mini", "gpt-4o", "llama-3.1-70b", "gpt-3.5-turbo"]
        output_text = None
        last_err = None

        for model_name in candidate_models:
            try:
                response = g4f.ChatCompletion.create(
                    model=model_name,
                    messages=messages
                )
                res_str = str(response).strip()
                if res_str and len(res_str) >= 5 and "NoValidHarFileError" not in res_str:
                    output_text = res_str
                    break
            except Exception as e:
                last_err = str(e)
                print(f"[OdAI Server] g4f model '{model_name}' exception: {e}")

        if not output_text:
            raise ValueError(f"g4f error: {last_err or 'Empty response from all models'}")

        print(f"[OdAI Server] Generation SUCCESS: {output_text[:80]}...")

        return jsonify({
            "response": output_text,
            "engine": "g4f"
        })

    except Exception as e:
        print(f"[OdAI Server] g4f generation error: {e}")
        return jsonify({"error": f"g4f error: {str(e)}"}), 500

@app.route('/api/import-character', methods=['POST'])
def import_character():
    data = request.json or {}
    url_or_id = data.get('url', '').strip()
    if not url_or_id:
        return jsonify({"error": "Укажите ссылку или ID персонажа"}), 400

    try:
        import re

        url_or_id = url_or_id.strip()
        if url_or_id.startswith('http://') or url_or_id.startswith('https://'):
            target_url = url_or_id
            char_id = url_or_id.split('/')[-1].split('?')[0]
        else:
            char_id = url_or_id
            target_url = f'https://character.ai/chat/{char_id}'

        print(f"[OdAI Parser] Fetching Character.AI URL: {target_url}")

        html_text = ""
        if cffi_available:
            r = cffi_requests.get(target_url, impersonate='chrome120', allow_redirects=True, timeout=15)
            if r.status_code == 200:
                html_text = r.text
        else:
            req = urllib.request.Request(target_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req, timeout=15) as resp:
                html_text = resp.read().decode('utf-8', errors='ignore')

        name = ""
        title = ""
        greeting = ""
        description = ""
        definition = ""

        if html_text:
            match_data = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html_text)
            if match_data:
                try:
                    next_data = json.loads(match_data.group(1))
                    props = next_data.get('props', {}).get('pageProps', {})
                    queries = props.get('dehydratedState', {}).get('queries', [])
                    for q in queries:
                        q_data = q.get('state', {}).get('data', {})
                        if isinstance(q_data, dict):
                            c = q_data.get('character')
                            if isinstance(c, dict) and c.get('name'):
                                name = c.get('name', '')
                                title = c.get('title', '')
                                greeting = c.get('greeting', '')
                                description = c.get('description', '')
                                definition = c.get('definition', '')
                                break
                except Exception as ex:
                    print(f"[OdAI Parser] JSON parse error: {ex}")

            if not name:
                og_title = re.search(r'<meta\s+property="og:title"\s+content="([^"]*)"', html_text)
                if og_title:
                    t = og_title.group(1)
                    if 'Chat with' in t:
                        name = t.split('Chat with')[1].split('|')[0].strip()
                    else:
                        name = t.split('|')[0].strip()

            if not description:
                og_desc = re.search(r'<meta\s+property="og:description"\s+content="([^"]*)"', html_text)
                if og_desc:
                    description = og_desc.group(1).replace('Chat with :', '').strip()

            if not name:
                name = "Неизвестный Персонаж (C.AI Защищен)"
                description = "Character.AI включил защиту от парсинга (Cloudflare). Описание не может быть загружено по ссылке автоматически."

        if not name:
            name = f"Character {char_id[:8]}"

        memory_text = f"Character: {name}.\n"
        if title:
            memory_text += f"Title: {title}.\n"
        if description:
            memory_text += f"Description: {description}.\n"
        if definition:
            memory_text += f"Details: {definition}.\n"

        author_note = f"Roleplay with {name}. Keep character personality and tone."
        intro_text = greeting or f"You meet {name}. They look at you, waiting for your move."

        return jsonify({
            "success": True,
            "character": {
                "id": char_id,
                "name": name,
                "title": title or name,
                "greeting": intro_text,
                "memory": memory_text.strip(),
                "authorNote": author_note
            }
        })

    except Exception as e:
        print(f"[OdAI Parser Error]: {e}")
        return jsonify({"error": f"Failed to parse character: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    print(f"[OdAI Server] Running OdAI Server on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
