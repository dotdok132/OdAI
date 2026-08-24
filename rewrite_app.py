import re

with open('app.js', 'r') as f:
    content = f.read()

# 1. Update elements object
elements_target = """const elements = {"""
elements_replacement = """const elements = {
  viewChatList: document.getElementById('view-chat-list'),
  viewChat: document.getElementById('view-chat'),
  mainSettingsBtn: document.getElementById('main-settings-btn'),
  mainChatsList: document.getElementById('main-chats-list'),
  fabNewChatBtn: document.getElementById('fab-new-chat-btn'),
  backToListBtn: document.getElementById('back-to-list-btn'),
  chatMenuBtn: document.getElementById('chat-menu-btn'),
  chatDropdownMenu: document.getElementById('chat-dropdown-menu'),
  dropdownInventoryBtn: document.getElementById('dropdown-inventory-btn'),
  dropdownRealismToggle: document.getElementById('dropdown-realism-toggle'),
  dropdownScenariosBtn: document.getElementById('dropdown-scenarios-btn'),
"""
content = content.replace(elements_target, elements_replacement)

# Make sure chatsArchiveList points to mainChatsList in elements if it exists.
content = content.replace("chatsArchiveList: document.getElementById('chats-archive-list')", "chatsArchiveList: document.getElementById('main-chats-list')")

# 2. Add showView function at the top
showview_code = """
// Функция переключения экранов
function showView(viewId) {
  elements.viewChatList.classList.remove('active');
  elements.viewChat.classList.remove('active');
  if (viewId === 'view-chat-list') {
    elements.viewChatList.classList.add('active');
    renderChatsArchiveList();
  } else if (viewId === 'view-chat') {
    elements.viewChat.classList.add('active');
  }
}
"""
content = content.replace('// Инициализация', showview_code + '\n// Инициализация')

# 3. Modify init()
init_target = """function init() {
  loadStateFromStorage();
  setupEventListeners();
  setupExportImportBackup();
  
  state.history = state.history.filter(b => b.type !== 'dice');
  renderStoryFeed();
  renderInventory();
  updateUIState();
}"""
init_replacement = """function init() {
  loadStateFromStorage();
  setupEventListeners();
  setupExportImportBackup();
  
  state.history = state.history.filter(b => b.type !== 'dice');
  renderStoryFeed();
  renderInventory();
  updateUIState();
  
  // При старте показываем список чатов
  showView('view-chat-list');
}"""
content = content.replace(init_target, init_replacement)

# 4. Update setupEventListeners
setup_ev_target = """  // Архив чатов (c.ai style)
  if (elements.chatsArchiveBtn) {
    elements.chatsArchiveBtn.addEventListener('click', () => {
      renderChatsArchiveList();
      openModal(elements.chatsArchiveModal);
    });
  }
  if (elements.closeArchiveModal) {
    elements.closeArchiveModal.addEventListener('click', () => closeModal(elements.chatsArchiveModal));
  }
  if (elements.archiveNewChatBtn) {
    elements.archiveNewChatBtn.addEventListener('click', () => {
      closeModal(elements.chatsArchiveModal);
      openModal(elements.scenarioModal);
    });
  }"""

setup_ev_replacement = """  // Навигация и экраны
  if (elements.mainSettingsBtn) {
    elements.mainSettingsBtn.addEventListener('click', () => openModal(elements.settingsModal));
  }
  if (elements.fabNewChatBtn) {
    elements.fabNewChatBtn.addEventListener('click', () => openModal(elements.scenarioModal));
  }
  if (elements.backToListBtn) {
    elements.backToListBtn.addEventListener('click', () => showView('view-chat-list'));
  }
  if (elements.chatMenuBtn) {
    elements.chatMenuBtn.addEventListener('click', () => {
      elements.chatDropdownMenu.classList.toggle('active');
    });
    // Закрытие при клике вне меню
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header-actions') && elements.chatDropdownMenu.classList.contains('active')) {
        elements.chatDropdownMenu.classList.remove('active');
      }
    });
  }
  
  // Кнопки внутри Dropdown-меню чата
  if (elements.dropdownInventoryBtn) {
    elements.dropdownInventoryBtn.addEventListener('click', () => {
      elements.chatDropdownMenu.classList.remove('active');
      elements.sidebarDrawer.classList.remove('collapsed');
    });
  }
  if (elements.dropdownRealismToggle) {
    elements.dropdownRealismToggle.addEventListener('click', (e) => {
      if (e.target.closest('.toggle-switch')) return; // handled by realismToggle listener
      elements.realismToggle.click();
    });
  }
  if (elements.dropdownScenariosBtn) {
    elements.dropdownScenariosBtn.addEventListener('click', () => {
      elements.chatDropdownMenu.classList.remove('active');
      openModal(elements.scenarioModal);
    });
  }"""

content = content.replace(setup_ev_target, setup_ev_replacement)

# Remove old event listeners for realismToggle, inventory, scenarios inside setupEventListeners since we rebound them or they are still there (we can keep realismToggle logic).
# Actually elements.realismToggle is still there in the dropdown, so its listener works!

# 5. Fix loadScenario and startCustomScenario to show chat view
# Search for `renderInventory();` in `loadScenario`
content = content.replace("renderInventory();\n}", "renderInventory();\n  showView('view-chat');\n}")
# startCustomScenario
content = content.replace("renderInventory();\n}", "renderInventory();\n  showView('view-chat');\n}", 1) # only replace next occurrence if multiple

# handleCAIImport
content = content.replace("renderInventory();\n\n    elements.caiImportInput.value = '';", "renderInventory();\n    showView('view-chat');\n\n    elements.caiImportInput.value = '';")
# handleCAIFileImport
content = content.replace("renderInventory();\n      closeModal(elements.scenarioModal);", "renderInventory();\n      closeModal(elements.scenarioModal);\n      showView('view-chat');")

# 6. switchChat
switch_chat_target = """function switchChat(chatId) {
  if (state.currentChatId === chatId) {
    closeModal(elements.chatsArchiveModal);
    return;
  }
  state.currentChatId = chatId;
  syncActiveChatToState();
  saveStateToStorage();
  renderStoryFeed();
  renderInventory();
  closeModal(elements.chatsArchiveModal);
}"""
switch_chat_replacement = """function switchChat(chatId) {
  state.currentChatId = chatId;
  syncActiveChatToState();
  saveStateToStorage();
  renderStoryFeed();
  renderInventory();
  showView('view-chat');
}"""
content = content.replace(switch_chat_target, switch_chat_replacement)


with open('app.js', 'w') as f:
    f.write(content)

