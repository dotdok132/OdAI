with open('app.js', 'r') as f:
    js = f.read()

js = js.replace("function init() {", "function init() {\n  console.log('[DEBUG] init() started!');")
js = js.replace("function openModal(modalEl) {", "function openModal(modalEl) {\n  console.log('[DEBUG] openModal called with:', modalEl ? modalEl.id : null);")

with open('app.js', 'w') as f:
    f.write(js)

