import re

with open('app.js', 'r') as f:
    content = f.read()

swipe_target = """    // Content wrapper
    const contentDiv = document.createElement('div');
    contentDiv.className = 'chat-content';"""

swipe_replacement = """    // Content wrapper
    const contentDiv = document.createElement('div');
    contentDiv.className = 'chat-content';
    
    // Swipe gestures
    let touchstartX = 0;
    let touchendX = 0;
    wrapper.addEventListener('touchstart', e => {
      touchstartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    wrapper.addEventListener('touchend', e => {
      touchendX = e.changedTouches[0].screenX;
      if (touchstartX - touchendX > 50) { // Swipe left
        if(!isSystem) wrapper.classList.toggle('show-actions');
      } else if (touchendX - touchstartX > 50) { // Swipe right
        wrapper.classList.remove('show-actions');
      }
    }, {passive: true});
    
    // Swipe Action Toolbar (Copy/Delete)
    if (!isSystem) {
      const actionToolbar = document.createElement('div');
      actionToolbar.className = 'msg-action-toolbar';
      actionToolbar.innerHTML = `
        <button class="msg-action-btn" title="Копировать" onclick="navigator.clipboard.writeText(this.parentElement.parentElement.querySelector('.msg-text').textContent)">📋</button>
      `;
      wrapper.appendChild(actionToolbar);
    }
"""
content = content.replace(swipe_target, swipe_replacement)

with open('app.js', 'w') as f:
    f.write(content)

