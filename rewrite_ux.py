import re

with open('app.js', 'r') as f:
    content = f.read()

# 1. Auto-resize textarea
auto_resize_code = """
function setupTextareaAutoResize(el) {
  if (!el) return;
  el.addEventListener('input', function() {
    this.style.height = 'auto';
    const newHeight = Math.min(this.scrollHeight, 150); // max 150px
    this.style.height = newHeight + 'px';
  });
}
"""
content = content.replace('// Инициализация', auto_resize_code + '\n// Инициализация')

setup_ev_target = """  // Навигация и экраны"""
setup_ev_replacement = """  // Навигация и экраны
  setupTextareaAutoResize(elements.promptInput);
  setupTextareaAutoResize(elements.memoryInput);
  setupTextareaAutoResize(elements.authorNoteInput);
"""
content = content.replace(setup_ev_target, setup_ev_replacement)

# 2. Reset textarea height on send
send_target = """  if (!rawInput || state.isGenerating) return;"""
send_replacement = """  if (!rawInput || state.isGenerating) return;
  
  if (elements.promptInput) {
    elements.promptInput.style.height = 'auto';
  }"""
content = content.replace(send_target, send_replacement)


# 3. Disable send button visuals
# We need to add class .disabled to sendBtn when isGenerating is true, and remove it when false.
update_ui_state_target = """  if (elements.contextSlider) {
    elements.contextSlider.value = state.engineConfig.contextLength || 10;
    if (elements.contextVal) elements.contextVal.textContent = `${state.engineConfig.contextLength || 10} сообщ.`;
  }
}"""
update_ui_state_replacement = """  if (elements.contextSlider) {
    elements.contextSlider.value = state.engineConfig.contextLength || 10;
    if (elements.contextVal) elements.contextVal.textContent = `${state.engineConfig.contextLength || 10} сообщ.`;
  }
  
  if (elements.sendBtn) {
    if (state.isGenerating) {
      elements.sendBtn.classList.add('disabled');
      elements.sendBtn.style.opacity = '0.5';
      elements.sendBtn.style.cursor = 'not-allowed';
    } else {
      elements.sendBtn.classList.remove('disabled');
      elements.sendBtn.style.opacity = '1';
      elements.sendBtn.style.cursor = 'pointer';
    }
  }
}"""
content = content.replace(update_ui_state_target, update_ui_state_replacement)

# To ensure UI updates when isGenerating changes, we must call updateUIState() after changing state.isGenerating
content = content.replace('state.isGenerating = true;', 'state.isGenerating = true;\n  updateUIState();')
content = content.replace('state.isGenerating = false;', 'state.isGenerating = false;\n    updateUIState();')
# Wait, some places might have state.isGenerating = false without brackets if they are one-liners.
# I will just use regex to replace it properly.
content = re.sub(r'state\.isGenerating\s*=\s*false;', 'state.isGenerating = false; updateUIState();', content)
content = re.sub(r'state\.isGenerating\s*=\s*true;', 'state.isGenerating = true; updateUIState();', content)

with open('app.js', 'w') as f:
    f.write(content)

