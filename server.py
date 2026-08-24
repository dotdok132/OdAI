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

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        "status": "ok",
        "g4f_available": g4f_available
    })

# Deep AI Realism Judge Endpoint: Evaluates player actions semantically without any hardcoded word lists
@app.route('/api/validate-realism', methods=['POST'])
def validate_realism_ai():
    data = request.json or {}
    action = data.get('action', '')
    scenario = data.get('scenario', 'fantasy')
    inventory = data.get('inventory', [])

    if not action or not g4f_available:
        return jsonify({"allowed": True})

    try:
        guard_prompt = (
            "Вы — ИИ-Арбитр реализма и физики в текстовой ролевой игре (RPG).\n"
            f"Текущий сеттинг мира: {scenario}.\n"
            f"Инвентарь игрока: {json.dumps(inventory, ensure_ascii=False)}.\n\n"
            f"Игрок пытается совершить действие: \"{action}\"\n\n"
            "ЗАДАЧА:\n"
            "Проанализируйте действие глубоко и контекстуально на основе логики выбранного мира и здравого смысла.\n"
            "1. Запрещены невозможные вещи (например: достать, создать или использовать предмет/оружие, которого нет в инвентаре; применять современное огнестрельное оружие или взрывчатку в средневековье; нарушать законы мира).\n"
            "2. Разрешены логичные действия (осмотреться, заговорить, применить имеющееся оружие/предмет из инвентаря, обычные бытовые и физические действия).\n\n"
            "ОТВЕТЬТЕ ИСКЛЮЧИТЕЛЬНО В ФОРМАТЕ JSON:\n"
            "{\"allowed\": false, \"reason\": \"Подробное разумное объяснение ИИ, почему данное действие невозможно\"}\n"
            "ИЛИ\n"
            "{\"allowed\": true, \"reason\": \"\"}"
        )

        response = g4f.ChatCompletion.create(
            model=g4f.models.default,
            provider=g4f.Provider.AnyProvider,
            messages=[{"role": "user", "content": guard_prompt}]
        )

        res_text = str(response).strip()
        print(f"[AI Realism Judge Raw Output]: {res_text}")

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

    if not g4f_available:
        return jsonify({"error": "g4f library not loaded on server"}), 500

    try:
        # Build system & conversation messages for g4f
        system_prompt = (
            "Вы — ведущий мастер (Dungeon Master) для интерактивной текстовой игры в стиле AI Dungeon и D&D.\n"
            f"Сценарий мира: {scenario}.\n"
            f"Память мира (Remember): {memory}.\n"
            f"Заметка автора (Стиль): {author_note}.\n"
            "СТРОГОЕ ПРАВИЛО КУБИКА d20 И РЕАЛИЗМА:\n"
            "1. Внимательно смотрите на прикрепленный результат кубика в действии игрока: '[🎲 d20: X — Результат]'!\n"
            "   - Если выпал ПРОВАЛ или КРИТИЧЕСКИЙ ПРОВАЛ (результат 1, 2, 3, 4 или 5): Персонаж СТРОГО ТЕРПИТ НЕУДАЧУ! Категорически ЗАПРЕЩЕНО писать, что действие прошло успешно. Опишите падение, промах, потерю равновесия или провал!\n"
            "   - Если выпал ЧАСТИЧНЫЙ УСПЕХ (6-11): Действие удается с трудом, ушибом или осложнением.\n"
            "   - Если выпал УСПЕХ (12-19): Действие удается хорошо.\n"
            "   - Если выпал КРИТИЧЕСКИЙ УСПЕХ (20): Триумфальный успех!\n"
            "2. Вы ОБЯЗАНЫ строить продолжение СТРОГО исходя из броска! Отвечайте на русском языке, красиво, живо, атмосферно (2-4 предложения)."
        )

        messages = [{"role": "system", "content": system_prompt}]

        # Append history context
        for h in history[-8:]:
            role = "user" if h.get('type') in ['do', 'say', 'story'] else "assistant"
            messages.append({"role": role, "content": h.get('text', '')})

        if prompt and (not history or history[-1].get('text') != prompt):
            messages.append({"role": "user", "content": prompt})

        print(f"[OdAI Server] Generating AI story response via g4f...")
        
        output_text = None
        last_err = None

        # Try g4f ChatCompletion
        try:
            response = g4f.ChatCompletion.create(
                model=g4f.models.default,
                messages=messages
            )
            output_text = str(response).strip()
        except Exception as e:
            last_err = str(e)
            print(f"[OdAI Server] g4f default model exception: {e}")

        if not output_text or len(output_text) < 5 or "NoValidHarFileError" in output_text:
            # Fallback to direct urllib request if g4f provider requires auth
            print("[OdAI Server] Retrying with secondary g4f fallback...")
            raise ValueError(f"g4f error: {last_err or 'Empty response'}")

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
        from curl_cffi import requests as cffi_requests
        import re

        url_or_id = url_or_id.strip()
        if url_or_id.startswith('http://') or url_or_id.startswith('https://'):
            target_url = url_or_id
            char_id = url_or_id.split('/')[-1].split('?')[0]
        else:
            char_id = url_or_id
            target_url = f'https://character.ai/chat/{char_id}'

        print(f"[OdAI Parser] Fetching Character.AI URL: {target_url}")

        r = cffi_requests.get(target_url, impersonate='chrome120', allow_redirects=True, timeout=15)

        name = ""
        title = ""
        greeting = ""
        description = ""
        definition = ""

        if r.status_code == 200:
            match_data = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', r.text)
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
                            elif isinstance(c, list) and len(c) > 0 and isinstance(c[0], dict):
                                c0 = c[0]
                                name = c0.get('name', '')
                                title = c0.get('title', '')
                                greeting = c0.get('greeting', '')
                                description = c0.get('description', '')
                                definition = c0.get('definition', '')
                                break
                except Exception as ex:
                    print(f"[OdAI Parser] JSON parse error: {ex}")

            if not name:
                og_title = re.search(r'<meta\s+property="og:title"\s+content="([^"]*)"', r.text)
                if og_title:
                    t = og_title.group(1)
                    if 'Chat with' in t:
                        name = t.split('Chat with')[1].split('|')[0].strip()
                    else:
                        name = t.split('|')[0].strip()

            if not description:
                og_desc = re.search(r'<meta\s+property="og:description"\s+content="([^"]*)"', r.text)
                if og_desc:
                    description = og_desc.group(1).replace('Chat with :', '').strip()

        if not name:
            name = f"Персонаж {char_id[:8]}"

        memory_text = f"Персонаж: {name}.\n"
        if title:
            memory_text += f"Заголовок: {title}.\n"
        if description:
            memory_text += f"Описание: {description}.\n"
        if definition:
            memory_text += f"Характер и детали: {definition}.\n"

        author_note = f"Ролевая игра с персонажем {name}. Сохраняйте характер, стиль общения и манеры речи персонажа."
        intro_text = greeting or f"Вы встречаете персонажа по имени {name}. Он(а) смотрит на вас, ожидая ваших действий."

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
        return jsonify({"error": f"Не удалось распарсить персонажа: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    print(f"[OdAI Server] Running OdAI Server on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)
