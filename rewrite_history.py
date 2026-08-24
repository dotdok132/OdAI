import re

with open('app.js', 'r') as f:
    content = f.read()

showview_target = """// Функция переключения экранов
function showView(viewId) {
  elements.viewChatList.classList.remove('active');
  elements.viewChat.classList.remove('active');
  if (viewId === 'view-chat-list') {
    elements.viewChatList.classList.add('active');
    renderChatsArchiveList();
  } else if (viewId === 'view-chat') {
    elements.viewChat.classList.add('active');
  }
}"""

showview_replacement = """// Функция переключения экранов
function showView(viewId, skipHistory = false) {
  elements.viewChatList.classList.remove('active');
  elements.viewChat.classList.remove('active');
  
  if (viewId === 'view-chat-list') {
    elements.viewChatList.classList.add('active');
    renderChatsArchiveList();
    if (!skipHistory) history.pushState({ view: 'list' }, '');
  } else if (viewId === 'view-chat') {
    elements.viewChat.classList.add('active');
    if (!skipHistory) history.pushState({ view: 'chat' }, '');
  }
}

// Перехват системной кнопки "Назад" (History API)
window.addEventListener('popstate', (e) => {
  const activeModals = document.querySelectorAll('.modal-overlay.active, .fullscreen-page.active');
  if (activeModals.length > 0) {
    activeModals.forEach(m => m.classList.remove('active'));
    // Добавляем фиктивный state чтобы следующий back снова сработал
    history.pushState({ view: elements.viewChat.classList.contains('active') ? 'chat' : 'list' }, '');
    return;
  }
  
  if (e.state && e.state.view === 'chat') {
    showView('view-chat', true);
  } else {
    showView('view-chat-list', true);
  }
});

// Открываем модалку и пушим state для кнопки "Назад"
const originalOpenModal = openModal;
openModal = function(modalEl) {
  originalOpenModal(modalEl);
  history.pushState({ modal: 'open' }, '');
}
"""
content = content.replace(showview_target, showview_replacement)

with open('app.js', 'w') as f:
    f.write(content)

