with open('app.js', 'r') as f:
    js = f.read()

js = js.replace("  console.log('[DEBUG] init() started!');", "")
js = js.replace("  console.log('[DEBUG] openModal called with:', modalEl ? modalEl.id : null);", "")

with open('app.js', 'w') as f:
    f.write(js)

