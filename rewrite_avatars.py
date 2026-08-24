import re

with open('app.js', 'r') as f:
    content = f.read()

avatar_target = """    // Avatar (skip for system messages)
    if (!isSystem) {
      const avatar = document.createElement('div');
      avatar.className = 'chat-avatar';
      avatar.textContent = isAI ? 'DM' : '⚔';
      wrapper.appendChild(avatar);
    }"""
avatar_replacement = """    // Avatar (skip for system messages)
    if (!isSystem) {
      const avatar = document.createElement('div');
      avatar.className = 'chat-avatar';
      if (isAI) {
        const activeSession = getCurrentChatSession();
        avatar.textContent = activeSession && activeSession.title ? activeSession.title.charAt(0).toUpperCase() : 'AI';
        avatar.style.background = 'var(--accent-gradient)';
        avatar.style.border = 'none';
        avatar.style.color = '#fff';
      } else {
        avatar.innerHTML = '👤';
      }
      wrapper.appendChild(avatar);
    }"""
content = content.replace(avatar_target, avatar_replacement)

with open('app.js', 'w') as f:
    f.write(content)

