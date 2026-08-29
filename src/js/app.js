import { SCENARIOS, THEME_PRESETS, I18N } from './config.js';
import DOMPurify from 'dompurify';
/**
 * OdAI - Интерактивный AI Движок Приключений (AI Dungeon Clone)
 * Интеграция с g4f (GPT4Free), 100% ИИ Защита Реализма (быстрый арбитр с анимированным статусом), 3D d20 Dice Mechanics, Инвентарь, Память Мира.
 */

// Сценарии по умолчанию (Multilingual: English, Spanish, Ukrainian, Russian)


// Словарь локализации на 4 языка (en, es, uk, ru)

function safeGetStorage(key, fallback = null) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn(`[Storage] Reading '${key}' failed:`, e);
    return fallback;
  }
}

function safeSetStorage(key, val) {
  try {
    localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
  } catch (e) {
    console.warn(`[Storage] Writing '${key}' failed:`, e);
  }
}

// Начальное состояние приложения
const state = {
  language: 'en', // Default English language ('en' | 'ru' | 'uk' | 'es')
  chats: [], // Массив сессий { id, title, scenarioKey, history, inventory, memory, authorNote, updatedAt }
  currentChatId: null,
  currentScenarioKey: 'fantasy',
  history: [], // Текущая активная история
  inventory: [],
  memory: "",
  authorNote: "",
  realismMode: true,
  casualMode: false,
  dndMode: safeGetStorage('odai_dnd_mode') === 'true',
  dndStats: {
    playerHp: 30,
    maxPlayerHp: 30,
    playerClass: 'Fighter',
    playerAC: 15,
    enemyHp: 0,         // 0 = нет активного врага
    maxEnemyHp: 0,
    enemyName: '',
    enemyAC: 12,
    combatActive: false
  },
  behaviorPreset: safeGetStorage('odai_behavior_preset') || 'classic', // 'classic' | 'strict' | 'romantic' | 'dark' | 'chaotic' | 'noir'
  forceD20: false, // Флаг принудительного броска d20 на следующее действие
  currentMode: 'do', // 'do' | 'say' | 'story'
  isGenerating: false,
  engineConfig: {
    mode: 'g4f', // 'g4f' | 'built-in' | 'gemini' | 'openai'
    apiKey: '',
    temperature: 0.8
  }
};
window.state = state;

// DOM Элементы
const elements = {
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
  dropdownCasualToggle: document.getElementById('dropdown-casual-toggle'),
  dropdownBehaviorSelect: document.getElementById('dropdown-behavior-select'),

  storyFeed: document.getElementById('story-feed'),
  promptInput: document.getElementById('prompt-input'),
  customPromptInput: document.getElementById('custom-prompt-input'),
  sendBtn: document.getElementById('send-btn'),
  modeBtns: document.querySelectorAll('.mode-btn'),
  realismToggle: document.getElementById('realism-toggle'),
  typingIndicator: document.getElementById('typing-indicator'),
  typingStatusText: document.getElementById('typing-status-text'),
  
  // Боковая панель
  sidebarDrawer: document.getElementById('sidebar-drawer'),
  toggleInventoryBtn: document.getElementById('toggle-inventory-btn'),
  closeDrawerBtn: document.getElementById('close-drawer-btn'),
  inventoryList: document.getElementById('inventory-list'),
  inventoryBadgeCount: document.getElementById('inventory-badge-count'),
  itemCountLabel: document.getElementById('item-count-label'),
  newItemInput: document.getElementById('new-item-input'),
  addItemBtn: document.getElementById('add-item-btn'),
  memoryInput: document.getElementById('memory-input'),
  authorNoteInput: document.getElementById('author-note-input'),
  
  // Инструменты истории
  rollD20Btn: document.getElementById('roll-d20-btn'),
  d20BtnLabel: document.getElementById('d20-btn-label'),
  continueBtn: document.getElementById('continue-btn'),
  undoBtn: document.getElementById('undo-btn'),
  retryBtn: document.getElementById('retry-btn'),
  eraseBtn: document.getElementById('erase-btn'),
  newStoryBtn: document.getElementById('new-story-btn'),
  
  // Модальные окна
  scenariosBtn: document.getElementById('scenarios-btn'),
  scenarioModal: document.getElementById('scenario-modal'),
  closeScenarioModal: document.getElementById('close-scenario-modal'),
  scenarioCards: document.querySelectorAll('.scenario-card'),
  customPromptInput: document.getElementById('custom-prompt-input'),
  startCustomBtn: document.getElementById('start-custom-btn'),
  aiCreatorTitle: document.getElementById('ai-creator-title'),
  aiCreatorName: document.getElementById('ai-creator-name'),
  aiCreatorSituation: document.getElementById('ai-creator-situation'),
  aiCreatorSubmitBtn: document.getElementById('ai-creator-submit-btn'),
  aiCreatorStatus: document.getElementById('ai-creator-status'),
  pwaInstallBtn: document.getElementById('pwa-install-btn'),
  
  // D&D 5e Mode HUD & Controls
  dropdownDndToggle: document.getElementById('dropdown-dnd-toggle'),
  dndToggle: document.getElementById('dnd-toggle'),
  dndHudBar: document.getElementById('dnd-hud-bar'),
  dndPlayerHpText: document.getElementById('dnd-player-hp-text'),
  dndPlayerHpFill: document.getElementById('dnd-player-hp-fill'),
  dndEnemyCard: document.getElementById('dnd-enemy-card'),
  dndEnemyName: document.getElementById('dnd-enemy-name'),
  dndEnemyHpText: document.getElementById('dnd-enemy-hp-text'),
  dndEnemyHpFill: document.getElementById('dnd-enemy-hp-fill'),
  dndAttackBtn: document.getElementById('dnd-attack-btn'),
  dndHealBtn: document.getElementById('dnd-heal-btn'),
  dndDiceBtns: document.querySelectorAll('.dnd-dice-btn'),
  
  // Архив чатов (c.ai style)
  chatsArchiveBtn: document.getElementById('chats-archive-btn'),
  chatsArchiveModal: document.getElementById('chats-archive-modal'),
  closeArchiveModal: document.getElementById('close-archive-modal'),
  archiveNewChatBtn: document.getElementById('archive-new-chat-btn'),
  chatsArchiveList: document.getElementById('main-chats-list'),

  // Импорт Character.AI & карточек
  caiImportInput: document.getElementById('cai-import-input'),
  caiImportBtn: document.getElementById('cai-import-btn'),
  caiImportStatus: document.getElementById('cai-import-status'),
  caiFileInput: document.getElementById('cai-file-input'),
  caiFileBtn: document.getElementById('cai-file-btn'),

  // Элементы шапки и полноэкранного режима
  fullscreenToggleBtn: document.getElementById('fullscreen-toggle-btn'),
  languageSelect: document.getElementById('language-select'),
  
  // Настройки ИИ и подключений
  settingsModal: document.getElementById('settings-modal'),
  closeSettingsModal: document.getElementById('close-settings-modal'),
  saveSettingsBtn: document.getElementById('save-settings-btn'),
  providerCards: document.querySelectorAll('.provider-card'),
  providerPanels: document.querySelectorAll('.provider-panel'),
  geminiKeyInput: document.getElementById('gemini-key-input'),
  geminiModelSelect: document.getElementById('gemini-model-select'),
  openrouterKeyInput: document.getElementById('openrouter-key-input'),
  openrouterModelInput: document.getElementById('openrouter-model-input'),
  openrouterPresetSelect: document.getElementById('openrouter-preset-select'),
  serverUrlInput: document.getElementById('server-url-input'),
  openaiBaseUrlInput: document.getElementById('openai-baseurl-input'),
  apiKeyInput: document.getElementById('api-key-input'),
  openaiModelInput: document.getElementById('openai-model-input'),
  groqKeyInput: document.getElementById('groq-key-input'),
  groqModelSelect: document.getElementById('groq-model-select'),
  anthropicKeyInput: document.getElementById('anthropic-key-input'),
  anthropicModelSelect: document.getElementById('anthropic-model-select'),
  tempSlider: document.getElementById('temp-slider'),
  tempVal: document.getElementById('temp-val'),
  contextSlider: document.getElementById('context-slider'),
  contextVal: document.getElementById('context-val'),
  testConnectionBtn: document.getElementById('test-connection-btn'),
  connectionStatusBadge: document.getElementById('connection-status-badge')
};

// Вспомогательная функция для формирования URL эндпоинтов
function getApiEndpoint(path) {
  const customUrl = (state.engineConfig && state.engineConfig.serverUrl) ? state.engineConfig.serverUrl.trim() : '';
  if (customUrl) {
    return `${customUrl.replace(/\/$/, '')}${path}`;
  }
  // По умолчанию подключение к локальному серверу на порту 8080
  if (window.location.protocol === 'file:' || window.location.protocol === 'capacitor:') {
    return `http://127.0.0.1:8080${path}`;
  }
  return path;
}


// Функция переключения экранов

function applyI18nLanguage(lang) {
  state.language = lang || 'en';
  document.documentElement.lang = state.language;
  const dict = I18N[state.language] || I18N.en;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.dataset.i18nPh;
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.dataset.i18nTitle;
    if (dict[key]) {
      el.title = dict[key];
    }
  });

  if (elements.promptInput) {
    elements.promptInput.placeholder = dict.inputPlaceholder || "Type a message...";
  }

  const langSelect = document.getElementById('language-select');
  if (langSelect) langSelect.value = state.language;

  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) themeSelect.value = state.theme || 'dark';

  applyTheme(state.theme || 'dark', state.customThemeColors);

  renderChatsArchiveList();
  renderStoryFeed();
  saveStateToStorage();
}

// Применение темы оформления
function applyTheme(themeKey, customColors) {
  state.theme = themeKey || 'dark';
  if (customColors) state.customThemeColors = customColors;

  let themeVars;
  if (state.theme === 'custom' && state.customThemeColors) {
    const c = state.customThemeColors;
    themeVars = {
      bgBase: c.bgBase || '#09090b',
      bgSurface: c.bgSurface || '#121215',
      bgElevated: lightenDarkenColor(c.bgSurface || '#121215', 12),
      bgOverlay: lightenDarkenColor(c.bgSurface || '#121215', 24),
      bgInput: lightenDarkenColor(c.bgSurface || '#121215', 6),
      textPrimary: c.text || '#e4e4e7',
      textSecondary: adjustAlpha(c.text || '#e4e4e7', 0.75),
      textMuted: adjustAlpha(c.text || '#e4e4e7', 0.55),
      accentPrimary: c.accent || '#10b981',
      accentSecondary: c.accent || '#34d399',
      accentGradient: `linear-gradient(135deg, ${c.accent || '#10b981'}, ${c.accent || '#34d399'})`
    };
  } else {
    themeVars = THEME_PRESETS[state.theme] || THEME_PRESETS.dark;
  }

  const root = document.documentElement;
  root.style.setProperty('--bg-base', themeVars.bgBase);
  root.style.setProperty('--bg-surface', themeVars.bgSurface);
  root.style.setProperty('--bg-elevated', themeVars.bgElevated);
  root.style.setProperty('--bg-overlay', themeVars.bgOverlay);
  root.style.setProperty('--bg-input', themeVars.bgInput);
  root.style.setProperty('--text-primary', themeVars.textPrimary);
  root.style.setProperty('--text-secondary', themeVars.textSecondary);
  root.style.setProperty('--text-muted', themeVars.textMuted);
  root.style.setProperty('--accent-primary', themeVars.accentPrimary);
  root.style.setProperty('--accent-secondary', themeVars.accentSecondary);
  root.style.setProperty('--accent-gradient', themeVars.accentGradient);

  if (state.theme === 'light') {
    root.style.setProperty('--border-subtle', 'rgba(0, 0, 0, 0.08)');
    root.style.setProperty('--border-medium', 'rgba(0, 0, 0, 0.15)');
  } else {
    root.style.setProperty('--border-subtle', 'rgba(255, 255, 255, 0.06)');
    root.style.setProperty('--border-medium', 'rgba(255, 255, 255, 0.1)');
  }

  // Обновление цвета статус-бара на мобильных устройствах
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.content = themeVars.bgBase;

  // Отображение контейнера выбора своих цветов
  const customBox = document.getElementById('custom-theme-box');
  if (customBox) {
    customBox.style.display = state.theme === 'custom' ? 'block' : 'none';
  }

  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) themeSelect.value = state.theme;

  saveStateToStorage();
}

function lightenDarkenColor(col, amt) {
  let num = parseInt(col.replace('#', ''), 16);
  if (isNaN(num)) return col;
  let r = (num >> 16) + amt;
  let b = ((num >> 8) & 0x00FF) + amt;
  let g = (num & 0x0000FF) + amt;
  r = Math.min(255, Math.max(0, r));
  b = Math.min(255, Math.max(0, b));
  g = Math.min(255, Math.max(0, g));
  return '#' + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
}

function adjustAlpha(hex, alpha) {
  let num = parseInt(hex.replace('#', ''), 16);
  if (isNaN(num)) return hex;
  let r = (num >> 16);
  let g = ((num >> 8) & 0x00FF);
  let b = (num & 0x0000FF);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


function toggleAppFullscreen() {
  if (!document.fullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => console.warn("Fullscreen request error:", err));
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => console.warn("Exit fullscreen error:", err));
    }
  }
}

function showView(viewId, skipHistory = false) {
  elements.viewChatList.classList.remove('active');
  elements.viewChatList.style.display = 'none';
  elements.viewChat.classList.remove('active');
  elements.viewChat.style.display = 'none';
  
  if (viewId === 'view-chat-list') {
    elements.viewChatList.classList.add('active');
    elements.viewChatList.style.display = 'flex';
    renderChatsArchiveList();
    if (!skipHistory) history.pushState({ view: 'list' }, '');
  } else if (viewId === 'view-chat') {
    elements.viewChat.classList.add('active');
    elements.viewChat.style.display = 'flex';
    if (!skipHistory) history.pushState({ view: 'chat' }, '');
  }
}

// Авто-адаптация при повороте экрана или изменении размера окно
window.addEventListener('resize', () => {
  const activeView = elements.viewChat && elements.viewChat.classList.contains('active') ? 'view-chat' : 'view-chat-list';
  showView(activeView, true);
});


// Интеграция с нативным Capacitor App плагином для жестов Android Назад
function setupNativeAndroidBackButton() {
  const Capacitor = window.Capacitor;
  if (Capacitor && Capacitor.Plugins && Capacitor.Plugins.App) {
    Capacitor.Plugins.App.addListener('backButton', () => {
      // 1. Закрыть открытые модальные окна / настройки
      const activeModal = document.querySelector('.modal-overlay.active, .fullscreen-page.active');
      if (activeModal) {
        activeModal.classList.remove('active');
        return;
      }

      // 2. Закрыть боковое меню инвентаря
      if (elements.sidebarDrawer && !elements.sidebarDrawer.classList.contains('collapsed')) {
        elements.sidebarDrawer.classList.add('collapsed');
        const backdrop = document.getElementById('sidebar-backdrop');
        if (backdrop) backdrop.classList.remove('active');
        return;
      }

      // 3. Закрыть выпадающее меню чата
      if (elements.chatDropdownMenu && elements.chatDropdownMenu.classList.contains('active')) {
        elements.chatDropdownMenu.classList.remove('active');
        return;
      }

      // 4. Если находимся в чате — вернуться к главному списку чатов
      if (elements.viewChat && elements.viewChat.classList.contains('active')) {
        showView('view-chat-list');
        return;
      }

      // 5. Если на главном экране — свернуть приложение вместо вылета
      try {
        Capacitor.Plugins.App.minimizeApp();
      } catch (e) {}
    });
  }
}

// Перехват системной кнопки "Назад" (History API)
window.addEventListener('popstate', (e) => {
  const activeModals = document.querySelectorAll('.modal-overlay.active, .fullscreen-page.active');
  if (activeModals.length > 0) {
    activeModals.forEach(m => m.classList.remove('active'));
    // Do NOT pushState here — it creates an infinite back-button loop
    return;
  }
  
  if (e.state && e.state.view === 'chat') {
    showView('view-chat', true);
  } else {
    showView('view-chat-list', true);
  }
});





function setupTextareaAutoResize(el, maxH = 220) {
  if (!el) return;

  const adjustHeight = () => {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    el.style.height = 'auto';
    const computedStyle = (typeof window !== 'undefined' && window.getComputedStyle) ? window.getComputedStyle(el) : {};
    const minH = parseInt(computedStyle.minHeight || '36', 10) || 36;
    const limitH = Math.max(maxH, minH);
    const targetH = Math.min(el.scrollHeight, limitH);

    el.style.height = Math.max(targetH, minH) + 'px';
    if (el.scrollHeight > limitH) {
      el.style.overflowY = 'auto';
    } else {
      el.style.overflowY = 'hidden';
    }
    if (window.scrollY !== scrollPos) {
      window.scrollTo(0, scrollPos);
    }
  };

  ['input', 'paste', 'change', 'keyup', 'focus', 'compositionend', 'blur'].forEach(evt => {
    el.addEventListener(evt, () => setTimeout(adjustHeight, 0));
  });

  // Watch for external content insertions (Google Translate, GBoard, copy-paste)
  let lastVal = el.value;
  setInterval(() => {
    if (el.value !== lastVal) {
      lastVal = el.value;
      adjustHeight();
    }
  }, 250);

  adjustHeight();
}

// Инициализация
function init() {

  loadStateFromStorage();
  applyI18nLanguage(state.language || 'en');
  applyTheme(state.theme || 'dark', state.customThemeColors);
  setupEventListeners();
  setupExportImportBackup();
  setupNativeAndroidBackButton();
  
  state.history = state.history.filter(b => b.type !== 'dice');
  renderStoryFeed();
  renderInventory();
  updateUIState();
  
  // При старте показываем список чатов
  showView('view-chat-list');
}

// Поиск активной сессии
function getCurrentChatSession() {
  if (!state.currentChatId && state.chats.length > 0) {
    state.currentChatId = state.chats[0].id;
  }
  return state.chats.find(c => c.id === state.currentChatId) || null;
}

function getLocalizedText(val) {
  if (!val) return "";
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    const lang = state.language || 'en';
    return val[lang] || val.en || val.ru || Object.values(val)[0] || "";
  }
  return String(val);
}

// Синхронизация активной сессии с состоянием UI
function syncActiveChatToState() {
  const activeSession = getCurrentChatSession();
  if (activeSession) {
    state.history = (activeSession.history || []).filter(b => b.type !== 'dice');
    state.inventory = activeSession.inventory || ["Железный длинный меч", "Кожаный доспех", "Целебный бальзам (x2)"];
    state.memory = activeSession.memory || "";
    state.authorNote = activeSession.authorNote || "";
    state.currentScenarioKey = activeSession.scenarioKey || 'fantasy';
    if (elements.memoryInput) elements.memoryInput.value = state.memory;
    if (elements.authorNoteInput) elements.authorNoteInput.value = state.authorNote;

    // Header Character Profile Sync
    const nameEl = document.getElementById('header-character-name');
    const subEl = document.getElementById('header-character-sub');
    const avatarEl = document.getElementById('header-avatar-img');
    if (nameEl) nameEl.textContent = getLocalizedText(activeSession.title) || 'OdAI Master';
    if (subEl) {
      const scenObj = SCENARIOS[activeSession.scenarioKey]?.title || 'Интерактивный ИИ';
      const scenTitle = getLocalizedText(scenObj);
      subEl.textContent = `@${scenTitle}`;
    }
    if (avatarEl) {
      if (activeSession.avatarUrl) {
        avatarEl.innerHTML = `<img src="${activeSession.avatarUrl}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
      } else {
        avatarEl.innerHTML = `<img src="logo.png" style="width:100%; height:100%; border-radius:50%; object-fit:cover; box-shadow: 0 0 8px rgba(106,154,85,0.4);">`;
      }
    }
  }
}

// Обновление сессии данными из текущего состояния
function updateActiveChatSession() {
  let activeSession = getCurrentChatSession();
  if (!activeSession) {
    activeSession = {
      id: 'chat_' + Date.now(),
      title: getLocalizedText(SCENARIOS[state.currentScenarioKey]?.title) || "Новое приключение",
      scenarioKey: state.currentScenarioKey,
      history: state.history,
      inventory: state.inventory,
      memory: state.memory,
      authorNote: state.authorNote,
      updatedAt: new Date().toISOString()
    };
    state.chats.unshift(activeSession);
    state.currentChatId = activeSession.id;
  } else {
    activeSession.history = state.history;
    activeSession.inventory = state.inventory;
    activeSession.memory = state.memory;
    activeSession.authorNote = state.authorNote;
  }
}

// Removed duplicate functions

// Загрузка состояния из LocalStorage (с поддержкой автомиграции)
function loadStateFromStorage() {
  const saved = safeGetStorage('odai_app_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.realismMode = parsed.realismMode !== undefined ? parsed.realismMode : true;
      state.casualMode = parsed.casualMode !== undefined ? parsed.casualMode : false;
      if (parsed.language) state.language = parsed.language;
      if (parsed.theme) state.theme = parsed.theme;
      if (parsed.customThemeColors) state.customThemeColors = parsed.customThemeColors;
      state.engineConfig = parsed.engineConfig || state.engineConfig;

      if (parsed.chats && Array.isArray(parsed.chats) && parsed.chats.length > 0) {
        state.chats = parsed.chats;
        state.currentChatId = parsed.currentChatId || parsed.chats[0].id;
      } else if (parsed.history && parsed.history.length > 0) {
        // Миграция из старого формата одиночной истории
        const legacyChat = {
          id: 'chat_' + Date.now(),
          title: getLocalizedText(SCENARIOS[parsed.currentScenarioKey || 'fantasy']?.title) || "Сохраненный чат",
          scenarioKey: parsed.currentScenarioKey || 'fantasy',
          history: (parsed.history || []).filter(b => b.type !== 'dice'),
          inventory: parsed.inventory || ["Железный длинный меч", "Кожаный доспех", "Целебный бальзам (x2)"],
          memory: parsed.memory || "",
          authorNote: parsed.authorNote || "",
          updatedAt: new Date().toISOString()
        };
        state.chats = [legacyChat];
        state.currentChatId = legacyChat.id;
      }
    } catch (e) {
      console.error("Ошибка загрузки сохраненного состояния:", e);
    }
  }

  // Если сессий нет — создаем начальный фэнтези чат
  if (state.chats.length === 0) {
    const scen = SCENARIOS.fantasy;
    const lang = state.language || 'en';
    const titleText = typeof scen.title === 'object' ? (scen.title[lang] || scen.title.en || scen.title.ru) : scen.title;
    const introText = typeof scen.intro === 'object' ? (scen.intro[lang] || scen.intro.en || scen.intro.ru) : scen.intro;
    const invList = Array.isArray(scen.inventory) ? scen.inventory : (typeof scen.inventory === 'object' ? (scen.inventory[lang] || scen.inventory.en || scen.inventory.ru || []) : []);
    const defaultChat = {
      id: 'chat_' + Date.now(),
      title: titleText,
      scenarioKey: 'fantasy',
      history: [{ id: Date.now(), type: 'ai', text: introText, timestamp: new Date().toLocaleTimeString() }],
      inventory: [...invList],
      memory: "Вы — искатель приключений, исследующий древние руины в поисках артефактов.",
      authorNote: "Мрачное фэнтези, глубокая атмосфера, подробные описания мира.",
      updatedAt: new Date().toISOString()
    };
    state.chats = [defaultChat];
    state.currentChatId = defaultChat.id;
  }

  syncActiveChatToState();
  updateToggleUI();
}

// Сохранение состояния в LocalStorage с оптимизированным debounce
let _saveStateTimer = null;
function saveStateToStorageDebounced(delay = 400) {
  if (_saveStateTimer) clearTimeout(_saveStateTimer);
  _saveStateTimer = setTimeout(() => {
    saveStateToStorage();
  }, delay);
}

function updateToggleUI() {
  const realismWrap = document.getElementById('realism-toggle');
  const dropdownRealism = document.getElementById('dropdown-realism-toggle');
  if (realismWrap) realismWrap.classList.toggle('active', !!state.realismMode);
  if (dropdownRealism) dropdownRealism.setAttribute('aria-checked', state.realismMode ? 'true' : 'false');

  const casualWrap = document.getElementById('casual-toggle');
  const dropdownCasual = document.getElementById('dropdown-casual-toggle');
  if (casualWrap) casualWrap.classList.toggle('active', !!state.casualMode);
  if (dropdownCasual) dropdownCasual.setAttribute('aria-checked', state.casualMode ? 'true' : 'false');

  const dndWrap = document.getElementById('dnd-toggle');
  const dropdownDnd = document.getElementById('dropdown-dnd-toggle');
  if (dndWrap) dndWrap.classList.toggle('active', !!state.dndMode);
  if (dropdownDnd) dropdownDnd.setAttribute('aria-checked', state.dndMode ? 'true' : 'false');

  renderDndHud();
}

function renderDndHud() {
  if (!elements.dndHudBar) return;
  if (!state.dndMode) {
    elements.dndHudBar.style.display = 'none';
    return;
  }

  elements.dndHudBar.style.display = 'flex';
  const stats = state.dndStats;

  // --- Player HP ---
  const playerPct = stats.maxPlayerHp > 0
    ? Math.max(0, Math.min(100, Math.round((stats.playerHp / stats.maxPlayerHp) * 100)))
    : 100;
  if (elements.dndPlayerHpText) elements.dndPlayerHpText.textContent = `${stats.playerHp}/${stats.maxPlayerHp}`;
  if (elements.dndPlayerHpFill) {
    elements.dndPlayerHpFill.style.width = `${playerPct}%`;
    elements.dndPlayerHpFill.style.background = playerPct < 30
      ? 'linear-gradient(90deg, #ef4444, #dc2626)'
      : playerPct < 60
        ? 'linear-gradient(90deg, #f59e0b, #eab308)'
        : 'linear-gradient(90deg, #22c55e, #10b981)';
  }

  // --- Enemy HP (показываем только если есть активный враг) ---
  const hasEnemy = stats.combatActive && stats.enemyHp > 0 && stats.enemyName;
  if (elements.dndEnemyCard) elements.dndEnemyCard.style.display = hasEnemy ? 'flex' : 'none';
  if (hasEnemy) {
    const enemyPct = stats.maxEnemyHp > 0
      ? Math.max(0, Math.min(100, Math.round((stats.enemyHp / stats.maxEnemyHp) * 100)))
      : 0;
    if (elements.dndEnemyName) elements.dndEnemyName.textContent = stats.enemyName;
    if (elements.dndEnemyHpText) elements.dndEnemyHpText.textContent = `${stats.enemyHp}/${stats.maxEnemyHp}`;
    if (elements.dndEnemyHpFill) elements.dndEnemyHpFill.style.width = `${enemyPct}%`;
  }

  // --- Attack btn: неактивна если нет врага или идет генерация ---
  if (elements.dndAttackBtn) {
    elements.dndAttackBtn.disabled = state.isGenerating || !stats.combatActive || stats.enemyHp <= 0;
  }
  
  // --- Остальные кнопки блокируются во время генерации ---
  if (elements.dndHealBtn) {
    elements.dndHealBtn.disabled = state.isGenerating;
  }
  
  if (elements.dndDiceBtns) {
    elements.dndDiceBtns.forEach(btn => {
      btn.disabled = state.isGenerating;
    });
  }
}

function handleDndToggle() {
  state.dndMode = !state.dndMode;
  // При включении — сбрасываем боевое состояние чисто
  if (state.dndMode) {
    state.dndStats.playerHp = state.dndStats.maxPlayerHp;
    state.dndStats.enemyHp = 0;
    state.dndStats.enemyName = '';
    state.dndStats.combatActive = false;
  }
  safeSetStorage('odai_dnd_mode', String(state.dndMode));
  updateToggleUI();
  saveStateToStorage();
}

function rollDiceRandom(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// --- Полноценная D&D 5e атака с проверкой AC ---
async function handleDndAttack() {
  if (state.isGenerating) return;
  const stats = state.dndStats;
  if (!stats.combatActive || stats.enemyHp <= 0) return;

  const lang = state.language || 'en';
  const d20 = rollDiceRandom(20);
  const isCritHit = d20 === 20;
  const isCritMiss = d20 === 1;
  // Модификатор атаки: +5 (proficiency +3, STR +2)
  const attackRoll = isCritMiss ? 1 : isCritHit ? 20 : d20 + 5;
  const hits = isCritHit || (!isCritMiss && attackRoll >= stats.enemyAC);

  let dmg = 0;
  if (hits) {
    dmg = rollDiceRandom(8) + 3; // 1d8+3 longsword
    if (isCritHit) dmg += rollDiceRandom(8); // D&D 5e правило крита: доп. кубик
    stats.enemyHp = Math.max(0, stats.enemyHp - dmg);
    if (stats.enemyHp === 0) stats.combatActive = false;
  }

  renderDndHud();

  const enemyN = stats.enemyName || 'врага';
  let msg = '';

  if (lang === 'ru' || lang === 'uk') {
    if (isCritMiss) {
      msg = `*Замахиваюсь оружием, но неловко оступаюсь! 🎲 [Атака d20: 1 — КРИТИЧЕСКИЙ ПРОМАХ! Оружие выскальзывает из рук.]*`;
    } else if (isCritHit) {
      msg = `*Наношу КРИТИЧЕСКИЙ удар по ${enemyN}! 🎲 [Атака d20: 20 — КРИТ!] Урон: ${dmg} HP! Осталось у врага: ${stats.enemyHp}/${stats.maxEnemyHp} HP.*`;
    } else if (hits) {
      msg = `*Атакую ${enemyN}! 🎲 [Атака d20: ${d20}+5 = ${attackRoll} vs AC ${stats.enemyAC} — Попадание!] Урон: ${dmg} HP. Осталось у врага: ${stats.enemyHp}/${stats.maxEnemyHp} HP.*`;
    } else {
      msg = `*Атакую ${enemyN}, но удар уходит мимо. 🎲 [Атака d20: ${d20}+5 = ${attackRoll} vs AC ${stats.enemyAC} — Промах!]*`;
    }
    if (stats.enemyHp === 0) msg += ` Противник повержен!`;
  } else {
    if (isCritMiss) {
      msg = `*I swing my weapon but fumble badly! 🎲 [Attack d20: 1 — CRITICAL MISS! The weapon slips.]*`;
    } else if (isCritHit) {
      msg = `*CRITICAL HIT on ${enemyN}! 🎲 [Attack d20: 20 — CRIT!] Damage: ${dmg} HP! Enemy remaining: ${stats.enemyHp}/${stats.maxEnemyHp} HP.*`;
    } else if (hits) {
      msg = `*I attack ${enemyN}! 🎲 [Attack d20: ${d20}+5 = ${attackRoll} vs AC ${stats.enemyAC} — Hit!] Damage: ${dmg} HP. Enemy remaining: ${stats.enemyHp}/${stats.maxEnemyHp} HP.*`;
    } else {
      msg = `*I attack ${enemyN} but miss. 🎲 [Attack d20: ${d20}+5 = ${attackRoll} vs AC ${stats.enemyAC} — Miss!]*`;
    }
    if (stats.enemyHp === 0) msg += ` The enemy is defeated!`;
  }

  if (elements.promptInput) elements.promptInput.value = msg;
  await handleSendAction();
}

// --- Лечение: Short Rest (1d8+CON) или Potion (2d4+2) ---
function handleDndHeal() {
  const stats = state.dndStats;
  const lang = state.language || 'en';
  const potionDmg = rollDiceRandom(4) + rollDiceRandom(4) + 2;
  const oldHp = stats.playerHp;
  stats.playerHp = Math.min(stats.maxPlayerHp, stats.playerHp + potionDmg);
  const healed = stats.playerHp - oldHp;
  renderDndHud();

  let msg = '';
  if (lang === 'ru' || lang === 'uk') {
    msg = `*Выпиваю зелье лечения! 🧪 [Восстановлено: ${healed} HP (2d4+2)] HP: ${stats.playerHp}/${stats.maxPlayerHp}.*`;
  } else {
    msg = `*I drink a healing potion! 🧪 [Restored: ${healed} HP (2d4+2)] HP: ${stats.playerHp}/${stats.maxPlayerHp}.*`;
  }
  if (elements.promptInput) elements.promptInput.value = msg;
}

// --- Бросок произвольного кубика (в поле ввода) ---
function handleDndDiceRollBtn(sides) {
  const result = rollDiceRandom(sides);
  const lang = state.language || 'en';
  const text = lang === 'ru' || lang === 'uk'
    ? `🎲 (Бросок d${sides}: ${result})`
    : `🎲 (Roll d${sides}: ${result})`;
  if (elements.promptInput) {
    const cur = elements.promptInput.value.trim();
    elements.promptInput.value = cur ? `${cur} ${text}` : text;
  }
}

// D&D таблица HP врагов по типу существ (CR)
const DND_ENEMY_HP_TABLE = [
  { patterns: ['zombie', 'зомби', 'undead', 'скелет', 'skeleton'], hp: 22, ac: 8 },
  { patterns: ['goblin', 'гоблин'], hp: 7, ac: 15 },
  { patterns: ['orc', 'орк', 'орг'], hp: 15, ac: 13 },
  { patterns: ['troll', 'тролль'], hp: 84, ac: 15 },
  { patterns: ['dragon', 'дракон', 'wyrm', 'draco'], hp: 195, ac: 19 },
  { patterns: ['giant', 'гигант', 'великан'], hp: 114, ac: 13 },
  { patterns: ['ogre', 'огр'], hp: 59, ac: 11 },
  { patterns: ['wolf', 'волк', 'dire wolf', 'dire'], hp: 11, ac: 13 },
  { patterns: ['bear', 'медведь'], hp: 34, ac: 11 },
  { patterns: ['demon', 'демон', 'devil', 'дьявол', 'balor', 'балор'], hp: 262, ac: 19 },
  { patterns: ['vampire', 'вампир'], hp: 144, ac: 16 },
  { patterns: ['lich', 'лич', 'лич'], hp: 135, ac: 17 },
  { patterns: ['knight', 'рыцарь', 'лицар'], hp: 52, ac: 18 },
  { patterns: ['guard', 'страж', 'стражник', 'охранник', 'soldier', 'солдат', 'воин'], hp: 11, ac: 16 },
  { patterns: ['bandit', 'бандит', 'разбойник', 'разбійник', 'thug', 'бандюк'], hp: 11, ac: 12 },
  { patterns: ['cultist', 'культист'], hp: 9, ac: 12 },
  { patterns: ['wizard', 'маг', 'mage', 'sorcerer', 'чародей', 'warlock'], hp: 40, ac: 12 },
  { patterns: ['boss', 'босс', 'chief', 'вождь', 'lord', 'лорд', 'master', 'мастер'], hp: 120, ac: 17 },
];

function lookupEnemyStats(name) {
  if (!name) return { hp: 20, ac: 12 };
  const lower = name.toLowerCase();
  for (const entry of DND_ENEMY_HP_TABLE) {
    if (entry.patterns.some(p => lower.includes(p))) {
      return { hp: entry.hp, ac: entry.ac };
    }
  }
  // Generic humanoid fallback
  return { hp: Math.floor(Math.random() * 20) + 15, ac: 12 };
}

// --- Разбор ответа ИИ: извлечение врага и урона ---
function processAIDndResponse(text) {
  if (!state.dndMode || !text) return;
  const stats = state.dndStats;

  // 1. Ищем тег нового врага в ЛЮБОМ формате:
  //   (enemy: Name, HP: X, AC: Y)
  //   (Враг: Имя, HP: X, AC: Y)
  //   (Ворог: Ім'я, HP: X, AC: Y)
  //   [Enemy: Name, HP: X] — квадратные скобки тоже
  //   Enemy: Name HP: X AC: Y  — без скобок
  const enemyTagPatterns = [
    // Со скобками (круглые или квадратные)
    /[([]\s*(?:enemy|враг|ворог|enemigo|противник|opponent)\s*:\s*([^\],;)]+?)(?:[,;]\s*hp\s*:\s*(\d+))?(?:[,;]\s*ac\s*:\s*(\d+))?\s*[)\]]/i,
    // Без скобок, отдельной строкой (начинается с ключевого слова)
    /^(?:enemy|враг|ворог|enemigo|противник)\s*:\s*(.+?)(?:,\s*hp\s*:\s*(\d+))?(?:,\s*ac\s*:\s*(\d+))?$/im,
  ];

  let enemyMatch = null;
  for (const pat of enemyTagPatterns) {
    enemyMatch = text.match(pat);
    if (enemyMatch) break;
  }

  if (enemyMatch) {
    const newName = enemyMatch[1].trim().replace(/[.,!*_]/g, '');
    const parsedHp = enemyMatch[2] ? parseInt(enemyMatch[2], 10) : null;
    const parsedAC = enemyMatch[3] ? parseInt(enemyMatch[3], 10) : null;
    const lookup = lookupEnemyStats(newName);
    const finalHp = (parsedHp && parsedHp > 0) ? parsedHp : lookup.hp;
    const finalAC = (parsedAC && parsedAC > 0) ? parsedAC : lookup.ac;

    // Спавним врага (в том числе замена старого на нового посреди сессии)
    stats.enemyName = newName;
    stats.enemyHp = finalHp;
    stats.maxEnemyHp = finalHp;
    stats.enemyAC = finalAC;
    stats.combatActive = true;
    console.log(`[D&D] Enemy spawned/replaced: "${newName}" HP:${finalHp} AC:${finalAC}`);
    renderDndHud();
    // Не выходим — продолжаем, ИИ мог в том же сообщении нанести урон
  }

  // 2. Ищем урон по игроку (в том же или без врага-тега)
  if (stats.combatActive && stats.enemyHp > 0) {
    // Форматы: "наносит: 8 HP" | "deals 6 damage" | "Враг наносит урон: 7 HP" | "(Enemy deals X HP damage)"
    const dmgPatterns = [
      /(?:наносит\s+урон|наносит|deals\s+damage|deals|inflige|hits?\s+for|ударяет|бьёт|задевает)\s*:?\s*(\d+)\s*(?:hp|урона|damage|кп|daño)?/i,
      /\((?:enemy|враг|ворог)\s+(?:deals|наносит)\s+(\d+)\s*(?:hp\s+damage|урона|hp)?\)/i,
    ];
    for (const pat of dmgPatterns) {
      const dmgMatch = text.match(pat);
      if (dmgMatch) {
        const dmg = parseInt(dmgMatch[1], 10);
        if (!isNaN(dmg) && dmg > 0 && dmg <= 100) {
          stats.playerHp = Math.max(0, stats.playerHp - dmg);
          console.log(`[D&D] Enemy dealt ${dmg} dmg. Player HP: ${stats.playerHp}/${stats.maxPlayerHp}`);
          renderDndHud();
        }
        break;
      }
    }
  }
}

function toggleRealismGuard() {
  state.realismMode = !state.realismMode;
  updateToggleUI();
  saveStateToStorage();
}

function toggleCasualMode() {
  state.casualMode = !state.casualMode;
  updateToggleUI();
  saveStateToStorage();
}

function saveStateToStorage() {
  try {
    updateActiveChatSession();
    const dataToSave = {
      chats: state.chats,
      currentChatId: state.currentChatId,
      realismMode: state.realismMode,
      casualMode: state.casualMode,
      language: state.language,
      theme: state.theme,
      customThemeColors: state.customThemeColors,
      engineConfig: state.engineConfig
    };
    localStorage.setItem('odai_app_state', JSON.stringify(dataToSave));
  } catch (e) {
    console.warn("Не удалось сохранить состояние в localStorage (превышена квота или приватный режим):", e);
  }
}

// Настройка слушателей событий
function setupEventListeners() {
  // Навигация и экраны
  setupTextareaAutoResize(elements.promptInput);
  setupTextareaAutoResize(elements.customPromptInput);
  setupTextareaAutoResize(elements.memoryInput);
  setupTextareaAutoResize(elements.authorNoteInput);

  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    themeSelect.value = state.theme || 'dark';
    themeSelect.addEventListener('change', (e) => {
      applyTheme(e.target.value, state.customThemeColors);
    });
  }

  const colorBgInput = document.getElementById('custom-color-bg');
  const colorSurfaceInput = document.getElementById('custom-color-surface');
  const colorAccentInput = document.getElementById('custom-color-accent');
  const colorTextInput = document.getElementById('custom-color-text');

  if (state.customThemeColors) {
    if (colorBgInput) colorBgInput.value = state.customThemeColors.bgBase || '#09090b';
    if (colorSurfaceInput) colorSurfaceInput.value = state.customThemeColors.bgSurface || '#121215';
    if (colorAccentInput) colorAccentInput.value = state.customThemeColors.accent || '#10b981';
    if (colorTextInput) colorTextInput.value = state.customThemeColors.text || '#e4e4e7';
  }

  const updateCustomColors = () => {
    state.customThemeColors = {
      bgBase: colorBgInput ? colorBgInput.value : '#09090b',
      bgSurface: colorSurfaceInput ? colorSurfaceInput.value : '#121215',
      accent: colorAccentInput ? colorAccentInput.value : '#10b981',
      text: colorTextInput ? colorTextInput.value : '#e4e4e7'
    };
    if (state.theme === 'custom') {
      applyTheme('custom', state.customThemeColors);
    }
  };

  [colorBgInput, colorSurfaceInput, colorAccentInput, colorTextInput].forEach(input => {
    if (input) {
      input.addEventListener('input', updateCustomColors);
      input.addEventListener('change', updateCustomColors);
    }
  });

  if (elements.mainSettingsBtn) {
    elements.mainSettingsBtn?.addEventListener('click', () => openModal(elements.settingsModal));
  }
  if (elements.fabNewChatBtn) {
    elements.fabNewChatBtn?.addEventListener('click', () => openModal(elements.scenarioModal));
  }
  if (elements.backToListBtn) {
    elements.backToListBtn?.addEventListener('click', () => showView('view-chat-list'));
  }
  if (elements.chatMenuBtn) {
    elements.chatMenuBtn?.addEventListener('click', () => {
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
    elements.dropdownInventoryBtn?.addEventListener('click', () => {
      elements.chatDropdownMenu.classList.remove('active');
      elements.sidebarDrawer.classList.remove('collapsed');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (backdrop) backdrop.classList.add('active');
    });
  }
  if (elements.dropdownRealismToggle) {
    elements.dropdownRealismToggle.addEventListener('click', () => {
      toggleRealismGuard();
    });
  }
  if (elements.dropdownScenariosBtn) {
    elements.dropdownScenariosBtn?.addEventListener('click', () => {
      elements.chatDropdownMenu.classList.remove('active');
      openModal(elements.scenarioModal);
    });
  }
  if (elements.dropdownCasualToggle) {
    elements.dropdownCasualToggle.addEventListener('click', () => {
      toggleCasualMode();
    });
  }
  if (elements.dropdownDndToggle) {
    elements.dropdownDndToggle.addEventListener('click', () => {
      handleDndToggle();
    });
  }
  if (elements.dndAttackBtn) {
    elements.dndAttackBtn.addEventListener('click', handleDndAttack);
  }
  if (elements.dndHealBtn) {
    elements.dndHealBtn.addEventListener('click', handleDndHeal);
  }
  if (elements.dndDiceBtns) {
    elements.dndDiceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const sides = parseInt(btn.dataset.dice, 10);
        if (sides) handleDndDiceRollBtn(sides);
      });
    });
  }
  if (elements.dropdownBehaviorSelect) {
    elements.dropdownBehaviorSelect.value = state.behaviorPreset || 'classic';
    elements.dropdownBehaviorSelect.addEventListener('change', (e) => {
      state.behaviorPreset = e.target.value;
      localStorage.setItem('odai_behavior_preset', state.behaviorPreset);
    });
  }

  // Переключатель принудительного броска d20 для следующего действия
  elements.rollD20Btn?.addEventListener('click', () => {
    state.forceD20 = !state.forceD20;
    if (state.forceD20) {
      elements.rollD20Btn.style.borderColor = 'var(--accent-gold)';
      elements.rollD20Btn.style.color = 'var(--accent-gold)';
      if (elements.d20BtnLabel) elements.d20BtnLabel.textContent = "d20: Да!";
    } else {
      elements.rollD20Btn.style.borderColor = '';
      elements.rollD20Btn.style.color = '';
      if (elements.d20BtnLabel) elements.d20BtnLabel.textContent = "d20: Авто";
    }
  });

  if (elements.realismToggle) {
    elements.realismToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleRealismGuard();
    });
  }

  // Sidebar drawer open/close with backdrop
  const getSidebarBackdrop = () => document.getElementById('sidebar-backdrop');
  elements.toggleInventoryBtn?.addEventListener('click', () => {
    const isCollapsed = elements.sidebarDrawer.classList.toggle('collapsed');
    const backdrop = getSidebarBackdrop();
    if (backdrop) backdrop.classList.toggle('active', !isCollapsed);
  });
  elements.closeDrawerBtn?.addEventListener('click', () => {
    elements.sidebarDrawer.classList.add('collapsed');
    const backdrop = getSidebarBackdrop();
    if (backdrop) backdrop.classList.remove('active');
  });

  // Global function for backdrop onclick
  const backdrop = document.getElementById('sidebar-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', closeSidebarDrawer);
  }
  window.closeSidebarDrawer = function() {
    elements.sidebarDrawer.classList.add('collapsed');
    const backdrop = getSidebarBackdrop();
    if (backdrop) backdrop.classList.remove('active');
  };

  // Добавление предмета в инвентарь
  elements.addItemBtn?.addEventListener('click', addInventoryItemFromInput);
  elements.newItemInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addInventoryItemFromInput();
  });

  // Обновление Памяти и Заметки автора
  elements.memoryInput?.addEventListener('change', () => {
    state.memory = elements.memoryInput.value;
    saveStateToStorage();
  });
  elements.authorNoteInput?.addEventListener('change', () => {
    state.authorNote = elements.authorNoteInput.value;
    saveStateToStorage();
  });

  // Отправка ввода
  elements.sendBtn?.addEventListener('click', handleSendAction);
  elements.promptInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendAction();
    }
  });

  // Кнопки управления историей
  if (elements.continueBtn) elements.continueBtn?.addEventListener('click', handleContinueAction);
  if (elements.undoBtn) elements.undoBtn?.addEventListener('click', handleUndo);
  if (elements.retryBtn) elements.retryBtn?.addEventListener('click', handleRetry);
  if (elements.eraseBtn) elements.eraseBtn?.addEventListener('click', handleErase);
  if (elements.newStoryBtn) elements.newStoryBtn?.addEventListener('click', () => openModal(elements.scenarioModal));

  
  // Глобальное делегирование кликов по карточкам сценариев
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.scenario-card');
    if (card) {
      const key = card.dataset.scenario;
      if (key && SCENARIOS[key]) {
        loadScenario(key);
        closeModal(elements.scenarioModal);
      }
    }
  });

  // Выбор сценария
  if (elements.scenariosBtn) elements.scenariosBtn?.addEventListener('click', () => openModal(elements.scenarioModal));
  if (elements.closeScenarioModal) elements.closeScenarioModal?.addEventListener('click', () => closeModal(elements.scenarioModal));
  elements.scenarioCards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.scenario;
      loadScenario(key);
      closeModal(elements.scenarioModal);
    });
  });
  elements.startCustomBtn?.addEventListener('click', () => {
    const text = elements.customPromptInput.value.trim();
    if (text) {
      startCustomScenario(text);
      closeModal(elements.scenarioModal);
    }
  });

  // Авто-генератор бота по тайтлу и имени
  if (elements.aiCreatorSubmitBtn) {
    elements.aiCreatorSubmitBtn?.addEventListener('click', handleAICreatorSubmit);
  }

  // Импорт из Character.AI и файлов
  if (elements.caiImportBtn) {
    elements.caiImportBtn?.addEventListener('click', handleCAIImport);
  }
  if (elements.caiImportInput) {
    elements.caiImportInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleCAIImport();
    });
  }
  if (elements.caiFileBtn && elements.caiFileInput) {
    elements.caiFileBtn?.addEventListener('click', () => elements.caiFileInput.click());
    elements.caiFileInput?.addEventListener('change', handleCAIFileImport);
  }

  // Fullscreen toggle
  elements.fullscreenToggleBtn?.addEventListener('click', toggleAppFullscreen);

  // Настройки
  elements.mainSettingsBtn?.addEventListener('click', () => openModal(elements.settingsModal));
  elements.closeSettingsModal?.addEventListener('click', () => closeModal(elements.settingsModal));

  // Язык интерфейса
  elements.languageSelect?.addEventListener('change', (e) => {
    state.language = e.target.value;
    applyI18nLanguage(state.language);
    saveStateToStorage();
  });
  
  // Accordion Items in Fullscreen Settings (Providers & Settings Sections)
  const accordionItems = document.querySelectorAll('.accordion-item[data-provider], .settings-accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header, .settings-accordion-header');
    if (header) {
      header.addEventListener('click', () => {
        if (item.dataset.provider) {
          document.querySelectorAll('.accordion-item[data-provider]').forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          state.engineConfig.mode = item.dataset.provider;
        } else {
          item.classList.toggle('active');
        }
      });
    }
  });

  document.querySelectorAll('.toggle-pass-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
      }
    });
  });

  if (elements.testConnectionBtn) {
    elements.testConnectionBtn?.addEventListener('click', testAIConnection);
  }

  if (elements.tempSlider) {
    elements.tempSlider?.addEventListener('input', (e) => {
      if (elements.tempVal) elements.tempVal.textContent = e.target.value;
    });
  }

  if (elements.contextSlider) {
    elements.contextSlider?.addEventListener('input', (e) => {
      const dict = I18N[state.language] || I18N.en;
      if (elements.contextVal) elements.contextVal.textContent = `${e.target.value} ${dict.messagesCount || 'msgs'}`;
    });
  }

  elements.openrouterPresetSelect?.addEventListener('change', (e) => {
    if (e.target.value !== 'custom' && elements.openrouterModelInput) {
      elements.openrouterModelInput.value = e.target.value;
    }
  });

  elements.saveSettingsBtn?.addEventListener('click', () => {
    if (elements.geminiKeyInput) state.engineConfig.geminiKey = elements.geminiKeyInput.value.trim();
    if (elements.geminiModelSelect) state.engineConfig.geminiModel = elements.geminiModelSelect.value;
    if (elements.openrouterKeyInput) state.engineConfig.openrouterKey = elements.openrouterKeyInput.value.trim();
    if (elements.openrouterModelInput) state.engineConfig.openrouterModel = elements.openrouterModelInput.value.trim();
    if (elements.serverUrlInput) state.engineConfig.serverUrl = elements.serverUrlInput.value.trim();
    if (elements.openaiBaseUrlInput) state.engineConfig.openaiBaseUrl = elements.openaiBaseUrlInput.value.trim();
    if (elements.apiKeyInput) state.engineConfig.apiKey = elements.apiKeyInput.value.trim();
    if (elements.openaiModelInput) state.engineConfig.openaiModel = elements.openaiModelInput.value.trim();
    if (elements.groqKeyInput) state.engineConfig.groqKey = elements.groqKeyInput.value.trim();
    if (elements.groqModelSelect) state.engineConfig.groqModel = elements.groqModelSelect.value;
    if (elements.anthropicKeyInput) state.engineConfig.anthropicKey = elements.anthropicKeyInput.value.trim();
    if (elements.anthropicModelSelect) state.engineConfig.anthropicModel = elements.anthropicModelSelect.value;

    saveStateToStorage();
    closeModal(elements.settingsModal);
  });
}

function switchProviderPanel(provider) {
  if (!elements.providerPanels) return;
  elements.providerPanels.forEach(panel => {
    panel.style.display = panel.id === `panel-${provider}` ? 'block' : 'none';
  });
}

// 3D Animated d20 Dice Roller Engine
function animateD20Roll(reason, callback) {
  const overlay = document.getElementById('dice-overlay-modal');
  const dieFace = document.getElementById('d20-die-face');
  const labelText = document.getElementById('dice-overlay-label');

  if (!overlay || !dieFace || !labelText) {
    const val = Math.floor(Math.random() * 20) + 1;
    callback({ val: val, label: val >= 12 ? `Успех (${val})` : `Провал (${val})`, category: val >= 12 ? 'success' : 'failure' });
    return;
  }

  overlay.classList.add('active');
  dieFace.classList.add('rolling');
  dieFace.classList.remove('landed');
  labelText.textContent = `Бросок d20: ${reason}...`;

  let ticks = 0;
  const interval = setInterval(() => {
    dieFace.textContent = Math.floor(Math.random() * 20) + 1;
    ticks++;
  }, 50);

  setTimeout(() => {
    clearInterval(interval);
    let finalVal = Math.floor(Math.random() * 20) + 1;
    dieFace.textContent = finalVal;
    dieFace.classList.remove('rolling');
    dieFace.classList.add('landed');

    if (state.casualMode) {
      finalVal = Math.floor(Math.random() * 6) + 15; // Force 15..20 guaranteed success!
      dieFace.textContent = finalVal;
    }

    let category = "success";
    let statusText = "Успех";
    if (state.casualMode) {
      category = "crit-success";
      const lang = state.language || 'en';
      const pref = lang === 'ru' ? 'Казуальный Успех (' : (lang === 'uk' ? 'Казуальний Успіх (' : (lang === 'es' ? 'Éxito Casual (' : 'Casual Success ('));
      statusText = `✨ ${pref}${finalVal})!`;
    } else if (finalVal === 20) { category = "crit-success"; statusText = "Критический Успех (20)!"; }
    else if (finalVal >= 12) { category = "success"; statusText = `Успех (${finalVal})`; }
    else if (finalVal >= 6) { category = "partial"; statusText = `Частичный успех (${finalVal})`; }
    else { category = "failure"; statusText = finalVal === 1 ? "Критический провал (1)!" : `Провал (${finalVal})`; }

    labelText.textContent = statusText;

    setTimeout(() => {
      overlay.classList.remove('active');
      callback({
        val: finalVal,
        label: statusText,
        category: category
      });
    }, 700);
  }, 850);
}

// Вспомогательные функции модалок
function openModal(modalEl) {

  if (!modalEl) return;
  modalEl.classList.add('active');
  try {
    history.pushState({ modal: 'open' }, '');
  } catch (e) {}
}
function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('active');
}

// Загрузка сценария
// Загрузка нового сценария (создает новую сессию чата)
function loadScenario(scenarioKey) {
  const scen = SCENARIOS[scenarioKey] || SCENARIOS.fantasy;
  const lang = state.language || 'en';
  const titleText = typeof scen.title === 'object' ? (scen.title[lang] || scen.title.en || scen.title.ru) : scen.title;
  const introText = typeof scen.intro === 'object' ? (scen.intro[lang] || scen.intro.en || scen.intro.ru) : scen.intro;
  const invList = Array.isArray(scen.inventory) ? scen.inventory : (typeof scen.inventory === 'object' ? (scen.inventory[lang] || scen.inventory.en || scen.inventory.ru || []) : []);
  
  const newChat = {
    id: 'chat_' + Date.now(),
    title: `${titleText} #${state.chats.length + 1}`,
    scenarioKey: scenarioKey,
    history: [{
      id: Date.now(),
      type: 'ai',
      text: introText,
      timestamp: new Date().toLocaleTimeString()
    }],
    inventory: [...invList],
    memory: scen.defaultMemory ? (typeof scen.defaultMemory === 'object' ? (scen.defaultMemory[lang] || scen.defaultMemory.en || '') : scen.defaultMemory) : '',
    authorNote: scen.defaultAuthorNote ? (typeof scen.defaultAuthorNote === 'object' ? (scen.defaultAuthorNote[lang] || scen.defaultAuthorNote.en || '') : scen.defaultAuthorNote) : '',
    updatedAt: new Date().toISOString()
  };

  state.chats.unshift(newChat);
  state.currentChatId = newChat.id;
  syncActiveChatToState();
  saveStateToStorage();
  renderStoryFeed();
  renderInventory();
  showView('view-chat');
}

// Запуск пользовательского сценария (создает новую сессию чата)
function startCustomScenario(customText) {
  const previewTitle = customText.slice(0, 25).trim() + (customText.length > 25 ? '...' : '');
  const newChat = {
    id: 'chat_' + Date.now(),
    title: previewTitle || `Мой мир #${state.chats.length + 1}`,
    scenarioKey: 'custom',
    history: [{
      id: Date.now(),
      type: 'ai',
      text: customText,
      timestamp: new Date().toLocaleTimeString()
    }],
    inventory: ["Дневник", "Карманный нож", "Личные вещи"],
    memory: state.memory || "",
    authorNote: state.authorNote || "",
    updatedAt: new Date().toISOString()
  };

  state.chats.unshift(newChat);
  state.currentChatId = newChat.id;
  syncActiveChatToState();
  saveStateToStorage();
  renderStoryFeed();
  renderInventory();
  showView('view-chat');
}

// Импорт персонажа по ссылке Character.AI (с автоматическим фолбэком на клиентский парсинг)
async function handleCAIImport() {
  if (!elements.caiImportInput) return;
  const urlVal = elements.caiImportInput.value.trim();
  if (!urlVal) return;

  if (elements.caiImportStatus) {
    elements.caiImportStatus.style.display = 'block';
    elements.caiImportStatus.textContent = 'Импорт персонажа из Character.AI...';
    elements.caiImportStatus.style.color = 'var(--accent-secondary)';
  }
  if (elements.caiImportBtn) elements.caiImportBtn.disabled = true;

  let char = null;

  // 1. Попытка через бэкенд
  try {
    const endpoint = getApiEndpoint('/api/import-character');
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlVal })
    });

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.success && data.character) {
        char = data.character;
      }
    }
  } catch (err) {
    console.warn("Backend import unreachable, switching to client-side CORS proxy...", err);
  }

  // 2. Фолбэк: Клиентский парсер без сервера
  if (!char) {
    try {
      if (elements.caiImportStatus) elements.caiImportStatus.textContent = 'Подключение напрямую через клиентский парсер...';
      char = await parseCAIClientSide(urlVal);
    } catch (fallbackErr) {
      if (elements.caiImportStatus) {
        elements.caiImportStatus.textContent = `Ошибка: ${fallbackErr.message}`;
        elements.caiImportStatus.style.color = 'var(--accent-red)';
      }
      if (elements.caiImportBtn) elements.caiImportBtn.disabled = false;
      return;
    }
  }

  if (char) {
    const newChat = {
      id: 'chat_' + Date.now(),
      title: char.name || 'Персонаж c.ai',
      scenarioKey: 'custom',
      history: [{
        id: Date.now(),
        type: 'ai',
        text: char.greeting,
        timestamp: new Date().toLocaleTimeString()
      }],
      inventory: ["Личные вещи персонажа"],
      memory: char.memory,
      authorNote: char.authorNote,
      updatedAt: new Date().toISOString()
    };

    state.chats.unshift(newChat);
    state.currentChatId = newChat.id;
    syncActiveChatToState();
    saveStateToStorage();
    renderStoryFeed();
    renderInventory();
    showView('view-chat');

    elements.caiImportInput.value = '';
    if (elements.caiImportStatus) elements.caiImportStatus.style.display = 'none';
    closeModal(elements.scenarioModal);
  }

  if (elements.caiImportBtn) elements.caiImportBtn.disabled = false;
}

// Автономный парсер карточки c.ai на стороне клиента (без сервера)
async function parseCAIClientSide(urlVal) {
  const targetUrl = urlVal.startsWith('http') ? urlVal : `https://character.ai/chat/${urlVal}`;
  const proxyEndpoints = [
    `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`
  ];

  let htmlText = '';
  for (const proxy of proxyEndpoints) {
    try {
      const res = await fetch(proxy);
      if (res.ok) {
        htmlText = await res.text();
        if (htmlText && htmlText.length > 500) break;
      }
    } catch(e) {}
  }

  if (!htmlText) {
    throw new Error("Не удалось загрузить ссылку c.ai на мобильном устройстве. Укажите Server URL в Настройках или импортируйте карточку .json!");
  }

  const match = htmlText.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
  let name = '', greeting = '', description = '', definition = '';

  if (match) {
    try {
      const data = JSON.parse(match[1]);
      const queries = data?.props?.pageProps?.dehydratedState?.queries || [];
      for (const q of queries) {
        const c = q?.state?.data?.character;
        if (c) {
          const charObj = Array.isArray(c) ? c[0] : c;
          if (charObj && charObj.name) {
            name = charObj.name;
            greeting = charObj.greeting || '';
            description = charObj.description || '';
            definition = charObj.definition || '';
            break;
          }
        }
      }
    } catch(e) {}
  }

  if (!name) {
    const ogTitle = htmlText.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
    if (ogTitle) {
      name = ogTitle[1].replace(/^Chat with\s+/i, '').split('|')[0].trim();
    }
  }

  if (!description) {
    const ogDesc = htmlText.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i);
    if (ogDesc) description = ogDesc[1].replace(/Chat with\s*:\s*/i, '').trim();
  }

  if (!name) name = 'Персонаж c.ai';

  return {
    name: name,
    title: name,
    greeting: greeting || `Вы встречаете персонажа по имени ${name}. Он(а) смотрит на вас, ожидая ваших действий.`,
    memory: `Персонаж: ${name}.\nОписание: ${description}\nДетали: ${definition}`.trim(),
    authorNote: `Ролевая игра с персонажем ${name}. Сохраняйте характер и манеру речи персонажа.`
  };
}

// Импорт карточки из файла (.json)
function handleCAIFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      const dataObj = parsed.data || parsed;
      const name = dataObj.name || dataObj.char_name || parsed.name || "Импортированный персонаж";
      const greeting = dataObj.greeting || dataObj.first_mes || parsed.greeting || `Вы встречаете ${name}.`;
      const description = dataObj.description || dataObj.char_persona || parsed.description || "";
      const personality = dataObj.personality || dataObj.mes_example || parsed.personality || "";

      const newChat = {
        id: 'chat_' + Date.now(),
        title: name,
        scenarioKey: 'custom',
        history: [{
          id: Date.now(),
          type: 'ai',
          text: greeting,
          timestamp: new Date().toLocaleTimeString()
        }],
        inventory: ["Личные вещи персонажа"],
        memory: `Персонаж: ${name}.\nОписание: ${description}\nХарактер: ${personality}`.trim(),
        authorNote: `Ролевая игра с персонажем ${name}. Сохраняйте характер персонажа.`,
        updatedAt: new Date().toISOString()
      };

      state.chats.unshift(newChat);
      state.currentChatId = newChat.id;
      syncActiveChatToState();
      saveStateToStorage();
      renderStoryFeed();
      renderInventory();
      closeModal(elements.scenarioModal);
      showView('view-chat');

    } catch (err) {
      alert("Ошибка чтения JSON карточки: " + err.message);
    }
  };
  reader.readAsText(file);
}

// Отрисовка списка сессий в Архиве чатов (Character.AI Style)
function renderChatsArchiveList() {
  if (!elements.chatsArchiveList) return;
  elements.chatsArchiveList.innerHTML = '';

  if (!state.chats || state.chats.length === 0) {
    elements.chatsArchiveList.innerHTML = `
      <div class="empty-archive-notice">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>
        <span>У вас пока нет сохраненных сессий чатов.</span>
      </div>
    `;
    return;
  }

  // Сортировка по времени последнего обновления
  const sortedChats = [...state.chats].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

  sortedChats.forEach(chat => {
    const card = document.createElement('div');
    card.className = `chat-card ${chat.id === state.currentChatId ? 'active' : ''}`;

    const lastMsg = (chat.history || []).slice().reverse().find(m => m.text);
    const lastPreview = lastMsg ? (lastMsg.text.length > 75 ? lastMsg.text.slice(0, 75) + '...' : lastMsg.text) : 'Пустая сессия';
    const msgCount = (chat.history || []).filter(m => m.type !== 'dice').length;
    const dateFormatted = chat.updatedAt ? new Date(chat.updatedAt).toLocaleString([], { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';
    const scenTitle = getLocalizedText(SCENARIOS[chat.scenarioKey]?.title) || (chat.scenarioKey === 'custom' ? 'Пользовательский' : chat.scenarioKey);

    const dict = I18N[state.language] || I18N.en;
    const renameTitle = state.language === 'ru' ? 'Переименовать сессию' : 'Rename session';
    const deleteTitle = state.language === 'ru' ? 'Удалить сессию' : 'Delete session';
    const worldLabelText = state.language === 'ru' ? 'Мир' : (state.language === 'uk' ? 'Світ' : (state.language === 'es' ? 'Mundo' : 'World'));

    card.innerHTML = `
      <div class="chat-card-header">
        <div class="chat-card-title-row">
          <span class="chat-card-title" title="${escapeHTML(chat.title)}">${escapeHTML(chat.title)}</span>
          <span class="chat-card-badge">${msgCount} ${dict.messagesCount || 'msgs'}</span>
        </div>
        <div class="chat-card-actions">
          <button class="chat-card-btn rename-btn" title="${renameTitle}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button class="chat-card-btn delete-btn" title="${deleteTitle}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
      <div class="chat-card-preview">${escapeHTML(lastPreview)}</div>
      <div class="chat-card-footer">
        <span>${worldLabelText}: ${escapeHTML(scenTitle)}</span>
        <span>${dateFormatted}</span>
      </div>
    `;

    // Клик по карточке — переключение чата
    card.addEventListener('click', (e) => {
      if (e.target.closest('.chat-card-btn') || e.target.closest('.chat-card-rename-input')) return;
      switchChat(chat.id);
    });

    // Переименование
    const renameBtn = card.querySelector('.rename-btn');
    renameBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      enableChatRename(card, chat);
    });

    // Удаление
    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Удалить сессию "${chat.title}"?`)) {
        deleteChatSession(chat.id);
      }
    });

    elements.chatsArchiveList.appendChild(card);
  });
}

function enableChatRename(cardEl, chat) {
  const titleRow = cardEl.querySelector('.chat-card-title-row');
  const titleEl = cardEl.querySelector('.chat-card-title');
  if (!titleEl) return;

  const oldTitle = chat.title;
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'chat-card-rename-input';
  input.value = oldTitle;

  titleEl.replaceWith(input);
  input.focus();
  input.select();

  const saveRename = () => {
    const newTitle = input.value.trim();
    if (newTitle && newTitle !== oldTitle) {
      chat.title = newTitle;
      saveStateToStorage();
    }
    renderChatsArchiveList();
  };

  input.addEventListener('blur', saveRename);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveRename();
  });
}

function switchChat(chatId) {
  state.currentChatId = chatId;
  syncActiveChatToState();
  saveStateToStorage();
  renderStoryFeed();
  renderInventory();
  showView('view-chat');
}

function deleteChatSession(chatId) {
  state.chats = state.chats.filter(c => c.id !== chatId);
  if (state.currentChatId === chatId) {
    if (state.chats.length > 0) {
      state.currentChatId = state.chats[0].id;
      syncActiveChatToState();
    } else {
      loadScenario('fantasy');
      return;
    }
  }
  saveStateToStorage();
  renderStoryFeed();
  renderInventory();
  renderChatsArchiveList();
}

// Отрисовка инвентаря
function renderInventory() {
  elements.inventoryList.innerHTML = '';
  state.inventory.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'inventory-item';
    li.innerHTML = `
      <span class="inventory-item-name">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--accent-gold);"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        ${escapeHTML(item)}
      </span>
      <button class="delete-btn" title="Удалить предмет" onclick="removeInventoryItem(${index})">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;
    elements.inventoryList.appendChild(li);
  });

  const count = state.inventory.length;
  if (elements.inventoryBadgeCount) elements.inventoryBadgeCount.textContent = `Инвентарь (${count})`;
  if (elements.itemCountLabel) elements.itemCountLabel.textContent = `${count} ${getItemWordForm(count)}`;
}

function getItemWordForm(count) {
  const lang = state.language || 'en';
  if (lang === 'ru' || lang === 'uk') {
    if (count % 10 === 1 && count % 100 !== 11) return lang === 'uk' ? 'предмет' : 'предмет';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return lang === 'uk' ? 'предмети' : 'предмета';
    return lang === 'uk' ? 'предметів' : 'предметов';
  }
  if (lang === 'es') return count === 1 ? 'objeto' : 'objetos';
  return count === 1 ? 'item' : 'items';
}

function addInventoryItemFromInput() {
  const val = elements.newItemInput.value.trim();
  if (val) {
    state.inventory.push(val);
    elements.newItemInput.value = '';
    renderInventory();
    saveStateToStorage();
  }
}

window.removeInventoryItem = function(index) {
  state.inventory.splice(index, 1);
  renderInventory();
  saveStateToStorage();
};

// Отрисовка ленты истории — Chat Bubbles с аватарами

// Анимация эффекта печатной машинки для появления сообщений ИИ
function animateTypewriter(containerEl, fullText, speedMs = 10) {
  let currentCharIndex = 0;
  containerEl.classList.add('typewriter-active');

  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'typing-cursor';

  containerEl.textContent = '';
  containerEl.appendChild(cursorSpan);

  let isSkipped = false;
  let timer;
  const skipHandler = (e) => {
    if (!isSkipped) {
      isSkipped = true;
      clearInterval(timer);
      containerEl.textContent = fullText;
      containerEl.classList.remove('typewriter-active');
      if (elements.storyFeed) {
        elements.storyFeed.scrollTop = elements.storyFeed.scrollHeight;
      }
    }
  };

  containerEl.addEventListener('click', skipHandler, { once: true });

  timer = setInterval(() => {
    if (isSkipped) return;

    // Выводим по 2 символа за такт для плавной и быстрой печати
    currentCharIndex = Math.min(currentCharIndex + 2, fullText.length);
    containerEl.textContent = fullText.slice(0, currentCharIndex);
    containerEl.appendChild(cursorSpan);

    if (elements.storyFeed) {
      elements.storyFeed.scrollTop = elements.storyFeed.scrollHeight;
    }

    if (currentCharIndex >= fullText.length) {
      clearInterval(timer);
      cursorSpan.remove();
      containerEl.classList.remove('typewriter-active');
    }
  }, speedMs);
}

function renderStoryFeed() {
  elements.storyFeed.innerHTML = '';
  
  state.history.forEach((block, index) => {
    if (block.type === 'dice') return;

    const isPlayer = (block.type === 'do' || block.type === 'say' || block.type === 'story');
    const isSystem = block.type === 'system';
    const isAI = block.type === 'ai';

    // Create chat message wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-message';
    wrapper.dataset.index = index;

    if (isAI) {
      wrapper.classList.add('ai-message');
    } else if (isPlayer) {
      wrapper.classList.add('player-message', `mode-${block.type}`);
    } else if (isSystem) {
      wrapper.classList.add('system-message');
    }

    // Stagger animation delay for initial load
    wrapper.style.animationDelay = `${Math.min(index * 0.05, 0.5)}s`;

    // Avatar (skip for system messages)
    if (!isSystem) {
      const avatar = document.createElement('div');
      avatar.className = 'chat-avatar';
      if (isAI) {
        const activeSession = getCurrentChatSession();
        const rawTitle = activeSession && activeSession.title ? (typeof activeSession.title === 'object' ? (activeSession.title[state.language || 'en'] || activeSession.title.en || activeSession.title.ru) : activeSession.title) : 'AI'; avatar.textContent = rawTitle.charAt(0).toUpperCase();
        avatar.style.background = 'var(--accent-gradient)';
        avatar.style.border = 'none';
        avatar.style.color = '#fff';
      } else {
        avatar.innerHTML = '👤';
      }
      wrapper.appendChild(avatar);
    }

    // Bubble body
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';

    // Sender name + timestamp row (top)
    if (!isSystem) {
      const meta = document.createElement('div');
      meta.className = 'chat-bubble-meta';
      const senderName = document.createElement('span');
      senderName.className = 'chat-sender-name';
      senderName.textContent = isAI ? 'Мастер Игры' : 'Вы';
      meta.appendChild(senderName);

      if (block.timestamp) {
        const ts = document.createElement('span');
        ts.className = 'chat-bubble-timestamp';
        ts.textContent = block.timestamp;
        meta.appendChild(ts);
      }
      bubble.appendChild(meta);
    }

    // Bubble content
    const content = document.createElement('div');
    content.className = 'chat-bubble-content';

    const swipes = block.swipes || [block.text];
    const swipeIndex = block.swipeIndex || 0;
    const currentText = swipes[swipeIndex] || block.text;

    if (block.diceVal && block.diceLabel) {
      content.innerHTML = DOMPurify.sanitize(`${escapeHTML(currentText)}<br><span class="dice-badge ${block.diceCategory || ''}">🎲 d20: ${block.diceVal} — ${escapeHTML(block.diceLabel)}</span>`);
    } else {
      if (isAI && block.animateTypewriter) {
        delete block.animateTypewriter;
        setTimeout(() => animateTypewriter(content, currentText), 50);
      } else {
        content.innerHTML = DOMPurify.sanitize(marked.parse(currentText));
      }
    }

    content.addEventListener('dblclick', () => enableInlineEdit(content, index));
    bubble.appendChild(content);

    // Character.AI Action Toolbar for AI Messages
    if (isAI) {
      const toolbar = document.createElement('div');
      toolbar.className = 'msg-action-toolbar';

      // Copy text button
      const copyBtn = document.createElement('button');
      copyBtn.className = 'msg-action-btn';
      copyBtn.title = 'Скопировать';
      copyBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
      copyBtn.onclick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(currentText);
        copyBtn.style.color = '#4ade80';
        setTimeout(() => copyBtn.style.color = '', 1000);
      };
      toolbar.appendChild(copyBtn);

      // Edit button (✏️) for touch/mobile
      const editBtn = document.createElement('button');
      editBtn.className = 'msg-action-btn';
      editBtn.title = 'Редактировать';
      editBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`;
      editBtn.onclick = (e) => { e.stopPropagation(); enableInlineEdit(content, index); };
      toolbar.appendChild(editBtn);
      if (swipes.length > 1) {
        const swipeNav = document.createElement('div');
        swipeNav.className = 'msg-swipe-nav';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'msg-swipe-btn';
        prevBtn.textContent = '‹';
        prevBtn.onclick = (e) => {
          e.stopPropagation();
          block.swipeIndex = (swipeIndex - 1 + swipes.length) % swipes.length;
          block.text = swipes[block.swipeIndex];
          saveStateToStorage();
          renderStoryFeed();
        };

        const counter = document.createElement('span');
        counter.className = 'msg-swipe-counter';
        counter.textContent = `${swipeIndex + 1}/${swipes.length}`;

        const nextBtn = document.createElement('button');
        nextBtn.className = 'msg-swipe-btn';
        nextBtn.textContent = '›';
        nextBtn.onclick = (e) => {
          e.stopPropagation();
          block.swipeIndex = (swipeIndex + 1) % swipes.length;
          block.text = swipes[block.swipeIndex];
          saveStateToStorage();
          renderStoryFeed();
        };

        swipeNav.appendChild(prevBtn);
        swipeNav.appendChild(counter);
        swipeNav.appendChild(nextBtn);
        toolbar.appendChild(swipeNav);
      }

      // Regenerate Swipe Button (🔄)
      const regenBtn = document.createElement('button');
      regenBtn.className = 'msg-action-btn';
      regenBtn.title = 'Сгенерировать другой вариант (Swipe)';
      regenBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`;
      regenBtn.onclick = (e) => { e.stopPropagation(); generateNewSwipeVariant(index); };
      toolbar.appendChild(regenBtn);

      bubble.appendChild(toolbar);
    }

    wrapper.appendChild(bubble);
    elements.storyFeed.appendChild(wrapper);
  });

  elements.storyFeed.scrollTop = elements.storyFeed.scrollHeight;
}

// Снайпинг вариаций (Swipes)
async function generateNewSwipeVariant(msgIndex) {
  if (state.isGenerating) return;
  state.isGenerating = true; updateUIState();
  updateUIState();
  elements.typingIndicator.style.display = 'flex';
  const labelEl = elements.typingStatusText || elements.typingIndicator;
  if (labelEl) labelEl.textContent = "Генерирует вариант (Swipe)...";

  try {
    const newText = await fetchUniversalAIContinuation();

    const block = state.history[msgIndex];
    if (block) {
      if (!block.swipes) block.swipes = [block.text];
      block.swipes.push(newText);
      block.swipeIndex = block.swipes.length - 1;
      block.text = newText;
      saveStateToStorage();
      renderStoryFeed();
    }

  } catch(err) {
    alert("Ошибка генерации варианта: " + err.message);
  } finally {
    state.isGenerating = false; updateUIState();
    updateUIState();
    elements.typingIndicator.style.display = 'none';
  }
}

// Экспорт и Импорт бэкапов
function setupExportImportBackup() {
  const jsonBtn = document.getElementById('export-json-btn');
  const txtBtn = document.getElementById('export-txt-btn');
  const importBtn = document.getElementById('import-backup-btn');
  const importFile = document.getElementById('import-backup-file');

  if (jsonBtn) {
    jsonBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.chats, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `odai_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  if (txtBtn) {
    txtBtn.addEventListener('click', () => {
      let txt = `=== OdAI История Чата ===\n\n`;
      state.history.forEach(b => {
        const sender = b.type === 'ai' ? 'ИИ' : 'Игрок';
        txt += `[${sender} ${b.timestamp || ''}]: ${b.text}\n\n`;
      });
      const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(txt);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `odai_chat_${Date.now()}.txt`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  if (importBtn && importFile) {
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedChats = JSON.parse(event.target.result);
          if (Array.isArray(importedChats) && importedChats.length > 0) {
            state.chats = importedChats;
            state.currentChatId = state.chats[0].id;
            syncActiveChatToState();
            saveStateToStorage();
            renderStoryFeed();
            renderInventory();
            renderChatsArchiveList();
            alert("История сессий успешно импортирована!");
          }
        } catch(err) {
          alert("Ошибка импорта бэкапа: " + err.message);
        }
      };
      reader.readAsText(file);
    });
  }
}

function getBlockClass(type) {
  if (type === 'do') return 'player-do';
  if (type === 'say') return 'player-say';
  if (type === 'story') return 'player-story';
  if (type === 'system') return 'system-warning';
  return 'ai-text';
}

// Прямое редактирование любого абзаца
function enableInlineEdit(blockEl, index) {
  const currentText = state.history[index].text;
  const textarea = document.createElement('textarea');
  textarea.className = 'inline-edit-input';
  textarea.value = currentText;

  blockEl.replaceWith(textarea);
  textarea.focus();

  const saveEdit = () => {
    const updated = textarea.value.trim();
    if (updated) {
      state.history[index].text = updated;
      saveStateToStorage();
    }
    renderStoryFeed();
  };

  textarea.addEventListener('blur', saveEdit);
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      saveEdit();
    }
  });
}

// 100% ИИ Защита Реализма (С тайм-аутом 2.2с и мгновенным визуальным статусом!)
async function validatePlayerAction(actionText, mode) {
  if (state.casualMode || !state.realismMode) return { allowed: true };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2200); // 2.2s cap for smooth UX

  try {
    const endpoint = getApiEndpoint('/api/validate-realism');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: actionText,
        scenario: state.currentScenarioKey,
        inventory: state.inventory
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const result = await response.json();
      if (result && result.allowed === false) {
        return {
          allowed: false,
          reason: `[ИИ Защита Реализма]: ${result.reason || "Действие невозможно в данном мире или предмета нет в инвентаре."}`
        };
      }
    }
  } catch (err) {
    console.warn("AI Realism Guard fast check timeout or network notice, auto-allowing:", err);
  }

  return { allowed: true };
}

// Автоматический поиск предметов в тексте ИИ
function parseItemsFromAIText(text) {
  const acquisitionPatterns = [
    /(?:вы\s+(?:находитесь|находите|нашли|получаете|берете|забираете))\s+([а-яА-Яa-zA-Z0-9\s]{3,25})/gi
  ];

  acquisitionPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const rawItem = match[1].trim();
      if (rawItem && !rawItem.includes('.') && !rawItem.includes(',') && rawItem.length < 30) {
        const capitalized = rawItem.charAt(0).toUpperCase() + rawItem.slice(1);
        if (!state.inventory.includes(capitalized)) {
          state.inventory.push(capitalized);
          renderInventory();
        }
      }
    }
  });
}

// Обработка кнопки "Продолжить" (Промолчал / Ожидание ответа)
async function handleContinueAction() {
  if (state.isGenerating) return;

  const lang = state.language || 'en';
  let silenceText = "*You remain silent, watching and waiting to see what happens next...*";
  if (lang === 'ru') silenceText = "*Вы молчите, ожидая развития событий...*";
  else if (lang === 'uk') silenceText = "*Ви мовчите, очікуючи розвитку подій...*";
  else if (lang === 'es') silenceText = "*Te quedas en silencio, esperando a ver qué sucede...*";

  state.isGenerating = true;
  updateUIState();
  elements.typingIndicator.style.display = 'flex';
  const labelEl = elements.typingStatusText || elements.typingIndicator;
  if (labelEl) labelEl.textContent = getLocalizedText(I18N[lang]?.aiGenerating) || "ИИ создает продолжение...";
  elements.storyFeed.scrollTop = elements.storyFeed.scrollHeight;

  state.history.push({
    id: Date.now(),
    type: state.currentMode || 'do',
    text: `> ${silenceText}`,
    timestamp: new Date().toLocaleTimeString()
  });
  renderStoryFeed();
  saveStateToStorage();

  await generateAIResponse();
}

// Обработка действия игрока ПОСЛЕ нажатия Отправить
async function handleSendAction() {
  const rawInput = elements.promptInput.value.trim();
  if (!rawInput || state.isGenerating) return;
  
  if (elements.promptInput) {
    elements.promptInput.style.height = 'auto';
  }

  // 1. Мгновенная индикация загрузки, чтобы интерфейс НЕ выглядел залоггавшим
  state.isGenerating = true; updateUIState();
  updateUIState();
  elements.typingIndicator.style.display = 'flex';
  const labelEl = elements.typingStatusText || elements.typingIndicator;
  if (labelEl) labelEl.textContent = "Арбитр проверяет реализм...";
  elements.storyFeed.scrollTop = elements.storyFeed.scrollHeight;

  // Текст игрока остается в стандартном Roleplay формате (*действие*, (уточнение), прямая речь)
  let formattedText = rawInput;

  // 2. ИИ Проверка Реализма перед отправкой
  const validation = await validatePlayerAction(rawInput, state.currentMode);
  if (!validation.allowed) {
    state.isGenerating = false; updateUIState();
    elements.typingIndicator.style.display = 'none';
    state.history.push({
      id: Date.now(),
      type: 'system',
      text: validation.reason,
      timestamp: new Date().toLocaleTimeString()
    });
    // Do NOT clear the input — the user's text is preserved so they can edit and retry
    renderStoryFeed();
    saveStateToStorage();
    return;
  }

  // Смена статуса на генерацию истории
  if (labelEl) labelEl.textContent = "Создает продолжение...";

  // Детектор сложных/рискованных действий или флаг принудительного броска
  const isRiskyAction = state.forceD20 || /(?:перепрыгнуть|взломать|украсть|атаковать|ударить|выстрелить|запугать|убедить|красться|выбить|обыскать|сразиться|парить|трюк|сальто|выпрыгнуть)/i.test(rawInput);
  
  // Сброс принудительного флага
  if (state.forceD20) {
    state.forceD20 = false;
    elements.rollD20Btn.style.borderColor = '';
    elements.rollD20Btn.style.color = '';
    if (elements.d20BtnLabel) elements.d20BtnLabel.textContent = "d20: Авто";
  }

  elements.promptInput.value = '';

  // Lock UI immediately before d20 animation to prevent double-submit
  state.isGenerating = true; updateUIState();

  if (isRiskyAction) {
    // Анимация броска происходит ПОСЛЕ нажатия кнопки Отправить!
    animateD20Roll("Проверка сложного действия", async (diceResult) => {
      state.history.push({
        id: Date.now(),
        type: state.currentMode,
        text: `> ${formattedText}`,
        diceVal: diceResult.val,
        diceLabel: diceResult.label,
        diceCategory: diceResult.category,
        timestamp: new Date().toLocaleTimeString()
      });
      renderStoryFeed();
      saveStateToStorage();
      await generateAIResponse();
    });
  } else {
    state.history.push({
      id: Date.now(),
      type: state.currentMode,
      text: `> ${formattedText}`,
      timestamp: new Date().toLocaleTimeString()
    });
    renderStoryFeed();
    saveStateToStorage();
    await generateAIResponse();
  }
}

// Генерация ответа ИИ
// Генерация ответа ИИ (БЕЗ офлайн-генератора! Если API недоступен — выводится только ошибка)
async function generateAIResponse() {
  state.isGenerating = true; 
  updateUIState();
  elements.typingIndicator.style.display = 'flex';
  const labelEl = elements.typingStatusText || elements.typingIndicator;
  if (labelEl) labelEl.textContent = state.language === 'ru' ? "ИИ генерирует ответ..." : (state.language === 'uk' ? "ШІ генерує відповідь..." : (state.language === 'es' ? "La IA está generando respuesta..." : "AI is generating response..."));
  elements.storyFeed.scrollTop = elements.storyFeed.scrollHeight;

  try {
    let aiResponseText = await fetchUniversalAIContinuation();

    aiResponseText = sanitizeAIResponseText(aiResponseText);
    parseItemsFromAIText(aiResponseText);
    processAIDndResponse(aiResponseText);

    state.history.push({
      id: Date.now(),
      type: 'ai',
      text: aiResponseText,
      animateTypewriter: true,
      timestamp: new Date().toLocaleTimeString()
    });

  } catch (err) {
    console.error("[OdAI Error]:", err);
    const errPrefix = state.language === 'ru' ? '[Ошибка подключения к ИИ]' : (state.language === 'uk' ? '[Помилка з’єднання з ШІ]' : (state.language === 'es' ? '[Error de conexión con IA]' : '[AI Connection Error]'));
    state.history.push({
      id: Date.now(),
      type: 'system',
      text: `${errPrefix}: ${err.message || err}`,
      timestamp: new Date().toLocaleTimeString()
    });
  } finally {
    state.isGenerating = false; 
    updateUIState();
    elements.typingIndicator.style.display = 'none';
    renderStoryFeed();
    saveStateToStorage();
  }
}

// Запрос к g4f Серверу Backend (/api/generate)
async function fetchG4FContinuation() {
  const lastAction = [...state.history].reverse().find(b => b.type === 'do' || b.type === 'say' || b.type === 'story');
  
  let promptText = lastAction ? lastAction.text : '';
  if (lastAction && lastAction.diceVal && lastAction.diceLabel) {
    promptText += ` (🎲 [Результат кубика d20: ${lastAction.diceVal} из 20 — ${lastAction.diceLabel.toUpperCase()}])`;
  }

  const endpoint = getApiEndpoint('/api/generate');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        prompt: promptText,
        scenario: state.currentScenarioKey,
        memory: state.memory,
        authorNote: state.authorNote,
        history: state.history,
        lang: state.language || 'en'
      })
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("G4F Server error: " + response.statusText);
    }

    const data = await response.json();
    if (data.response) {
      return data.response.trim();
    }
    throw new Error(data.error || "G4F empty response");
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}




// =============================================================================
// GEMINI MODEL RANKING & DYNAMIC DISCOVERY ENGINE (Adapted from LarpHelper)
// =============================================================================

function rankGeminiModel(modelName) {
  const name = modelName.toLowerCase();
  const match = name.match(/gemini-(\d+)(?:\.(\d+))?/);
  const major = match ? parseInt(match[1]) : 0;
  const minor = (match && match[2]) ? parseInt(match[2]) : 0;

  const isPreview = (name.includes('preview') || name.includes('exp')) ? 1 : 0;
  const tier = name.includes('flash') ? 0 : (name.includes('pro') ? 1 : 2);

  return (1 - isPreview) * 100000 + major * 1000 + minor * 10 - tier;
}

async function getValidGeminiModelsFromAPI(apiKey) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const resp = await fetch(url);
    if (resp.ok) {
      const data = await resp.json();
      const valid = [];
      for (const m of (data.models || [])) {
        const name = (m.name || '').replace('models/', '');
        const methods = m.supportedGenerationMethods || [];
        const bad = ['-tts', 'embedding', 'imagen', 'bison', 'aqa', 'realtime', 'interactions', 'audio', 'live', 'gemma', 'veo', 'lyria', 'nano', 'robotics', 'deep-research', 'antigravity', 'computer-use', 'image', 'omni'];
        if (methods.includes('generateContent') && !bad.some(b => name.toLowerCase().includes(b))) {
          valid.push(name);
        }
      }
      return valid;
    }
  } catch (e) {
    console.warn("Failed to discover Gemini models from API:", e);
  }
  return [];
}

// Запрос к Gemini API с динамическим подбором модели и fallback-цепочкой
async function fetchGeminiContinuation() {
  const apiKey = (state.engineConfig.geminiKey || state.engineConfig.apiKey || '').trim();
  if (!apiKey) throw new Error("Укажите API Ключ Google Gemini в Настройках.");

  const userModel = (state.engineConfig.geminiModel || 'auto').trim();
  const promptContext = constructAIPrompt();

  // 1. Динамическое обнаружение моделей через API
  const discoveredModels = await getValidGeminiModelsFromAPI(apiKey);
  if (discoveredModels.length > 0) {
    discoveredModels.sort((a, b) => rankGeminiModel(b) - rankGeminiModel(a));
  }

  // 2. Формирование цепочки моделей (Пользовательская -> Динамические -> Резервные)
  const candidateModels = [];
  if (userModel && userModel !== 'auto' && !['-tts', 'embedding', 'imagen', 'interactions', 'realtime', 'image', 'omni'].some(bad => userModel.toLowerCase().includes(bad))) {
    candidateModels.push(userModel);
  }

  if (discoveredModels.length > 0) {
    candidateModels.push(...discoveredModels);
  }

  const fallbackDefaults = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.7-flash',
    'gemini-flash-latest'
  ];
  candidateModels.push(...fallbackDefaults);

  // Дедупликация списка кандидатов
  const uniqueCandidates = [...new Set(candidateModels)];

  // 3. Последовательная попытка генерации через каждую модель
  let lastError = null;
  let fatalError = null;

  for (const model of uniqueCandidates) {
    if (fatalError) break;
    try {
      const encodedKey = encodeURIComponent(apiKey);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodedKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptContext }] }],
          generationConfig: { temperature: state.engineConfig.temperature || 0.8, maxOutputTokens: 2048 }
        })
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
          const cand = data.candidates[0];
          if (cand.content && cand.content.parts) {
            const textParts = cand.content.parts.map(p => p.text || '').join('').trim();
            if (textParts) {
              const cleanText = sanitizeAIResponseText(textParts);
              if (cleanText) {
                console.log(`[Gemini API Success] Model: ${model}`);
                return cleanText;
              }
            }
          }
          if (cand.finishReason && cand.finishReason !== 'STOP') {
            lastError = `Generation stopped by Gemini (${cand.finishReason})`;
          }
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        lastError = errData.error?.message || response.statusText;
        
        const isKeyErr = lastError && (
          lastError.includes('API key not valid') ||
          lastError.includes('API_KEY_INVALID') ||
          lastError.includes('API_KEY_SERVICE_BLOCKED') ||
          (lastError.toLowerCase().includes('api key') && (response.status === 400 || response.status === 403))
        );

        if (isKeyErr) {
          fatalError = new Error(state.language === 'ru' 
            ? `Недействительный API Ключ Gemini (${lastError}). Проверьте или получите новый ключ на aistudio.google.com` 
            : `Invalid Gemini API Key (${lastError}). Please check your key at aistudio.google.com`);
          break;
        }
        
        console.warn(`[Gemini API Warning] Model ${model} returned ${response.status}: ${lastError}`);
      }
    } catch (e) {
      if (e.name === 'AbortError') {
        lastError = "Timeout (15s)";
      } else {
        lastError = e.message;
      }
      console.warn(`[Gemini API Warning] Model ${model} failed with exception:`, e);
    }
  }

  if (fatalError) throw fatalError;
  
  if (lastError && (lastError.includes('Quota exceeded') || lastError.includes('quota') || lastError.includes('429'))) {
    throw new Error(state.language === 'ru' 
      ? `Превышен лимит запросов Gemini API (429 Rate Limit). Подождите ~30 секунд или смените ключ в Настройках.` 
      : `Gemini API quota exceeded (429 Rate Limit). Please wait 30 seconds or change your API key.`);
  }

  throw new Error(`Gemini API: ${lastError}`);
}
 function getBehaviorPresetDirective(preset, lang) {
  const p = preset || 'classic';
  const l = lang || 'en';

  const directives = {
    ru: {
      classic: "- [МОДЕЛЬ ПОВЕДЕНИЯ: КЛАССИЧЕСКИЙ МАСТЕР]: Баланс атмосферы, кинематографичности, тактики, глубоких диалогов и сюжета.",
      concise: "- [МОДЕЛЬ ПОВЕДЕНИЯ: ЛАКОНИЧНЫЙ И БЕЗ ВОДЫ]: Выдавай максимально краткий, емкий и сжатый ответ (1-2 предложения). Никакой лишней эпичности, поэтики, филлеров и пересказа действий игрока. Только факты, действия и прямой результат.",
      strict: "- [МОДЕЛЬ ПОВЕДЕНИЯ: СТРОГИЙ И СУРОВЫЙ]: Бескомпромиссная реалистичность, тяжелые тактические последствия, ранения, травмы, физика, никакого сюсюканья.",
      romantic: "- [МОДЕЛЬ ПОВЕДЕНИЯ: РОМАНТИЧНЫЙ И ЧУВСТВЕННЫЙ]: Глубокий акцент на чувствах, взглядах, эмоциях, романтическом притяжении, химии персонажей и чувственных диалогах.",
      dark: "- [МОДЕЛЬ ПОВЕДЕНИЯ: МРАЧНОЕ ФЭНТЕЗИ / ГОТИКА]: Похмурый гримдарк, готическая безысходность, кровь, древние проклятия, психоз и атмосфера кошмара.",
      chaotic: "- [МОДЕЛЬ ПОВЕДЕНИЯ: ХАОТИЧНЫЙ И БЕЗУМНЫЙ]: Непредсказуемые сюжетные повороты, безумный юмор, дикие магические аномалии и эксцентричные персонажи.",
      noir: "- [МОДЕЛЬ ПОВЕДЕНИЯ: ЦИНИЧНЫЙ НУАР]: Циничный внутренний монолог, промокшие от дождя улицы, детективные тайны, обман и моральная неоднозначность."
    },
    en: {
      classic: "- [BEHAVIOR PRESET: CLASSIC DUNGEON MASTER]: Balanced atmosphere, tactical depth, dialogue, and compelling narrative.",
      concise: "- [BEHAVIOR PRESET: CONCISE & NO-FLUFF]: Ultra-concise, punchy storytelling (1-2 sentences max). Zero prose fluff, flowery description, or repeated actions. Only concrete facts, immediate actions, and crisp outcomes.",
      strict: "- [BEHAVIOR PRESET: STRICT & HARDCORE]: Gritty realism, punishing tactical consequences, severe injury logic, zero plot armor.",
      romantic: "- [BEHAVIOR PRESET: ROMANTIC & EMOTIONAL]: Deep focus on romantic chemistry, sensual tension, character emotions, intimate dialogue, and relationship drama.",
      dark: "- [BEHAVIOR PRESET: DARK & GRIMDARK]: Visceral horror, grimdark dread, gothic atmosphere, blood, ancient curses, and psychological horror.",
      chaotic: "- [BEHAVIOR PRESET: CHAOTIC & WILD]: Unpredictable plot twists, wild humor, magical anomalies, bizarre NPCs, and high chaos.",
      noir: "- [BEHAVIOR PRESET: CYNICAL NOIR]: Cynical hard-boiled tone, rain-soaked streets, mystery, moral ambiguity, secrets and lies."
    },
    uk: {
      classic: "- [МОДЕЛЬ ПОВЕДЕНКИ: КЛАСИЧНИЙ МАЙСТЕР]: Збалансована атмосфера, тактика, діалоги та захопливий сюжет.",
      concise: "- [МОДЕЛЬ ПОВЕДЕНКИ: ЛАКОНІЧНИЙ ТА БЕЗ ВОДИ]: Пиши максимально стисло та чітко (1-2 речення). Жодної зайвої поетики, описового шуму та повторів дій гравця. Лише гострі факти та прямий результат.",
      strict: "- [МОДЕЛЬ ПОВЕДЕНКИ: СТРОГИЙ ТА СУРОВИЙ]: Безкомпромісний реалізм, важкі тактичні наслідки, травми, відсутність поблажок.",
      romantic: "- [МОДЕЛЬ ПОВЕДЕНКИ: РОМАНТИЧНИЙ ТА ЧУТТЄВИЙ]: Глибокий акцент на почуттях, поглядах, романтичній хімії, емоційній глибині діалогів.",
      dark: "- [МОДЕЛЬ ПОВЕДЕНКИ: ПОХМУРЕ ФЕНТЕЗІ / ГОТИКА]: Гримдарк, готична безвихідь, кров, давні прокляття та атмосфера жаху.",
      chaotic: "- [МОДЕЛЬ ПОВЕДЕНКИ: ХАОТИЧНИЙ ТА БЕЗУМНИЙ]: Непередбачувані сюжетні повороти, божевільний гумор, магічні аномалії.",
      noir: "- [МОДЕЛЬ ПОВЕДЕНКИ: ЦИНІЧНИЙ НУАР]: Цинічний внутрішній монолог, промоклі від дощу вулиці, детективні таємниці та обман."
    },
    es: {
      classic: "- [MODO DE COMPORTAMIENTO: DUNGEON MASTER CLÁSICO]: Equilibrio de atmósfera, táctica, diálogo y narrativa.",
      concise: "- [MODO DE COMPORTAMIENTO: CONCISO Y DIRECTO]: Respuestas extremadamente cortas y directas (1-2 oraciones). Sin relleno narrativo ni repeticiones. Solo hechos concretos y consecuencias inmediatas.",
      strict: "- [MODO DE COMPORTAMIENTO: ESTRICTO Y HARDCORE]: Realismo crudo, consecuencias tácticas severas, lesiones y cero favores.",
      romantic: "- [MODO DE COMPORTAMIENTO: ROMÁNTICO Y EMOCIONAL]: Enfoque profundo en la química romántica, tensión sensual, emociones y diálogos íntimos.",
      dark: "- [MODO DE COMPORTAMIENTO: FANTASÍA OSCURA]: Horror visceral, atmósfera sombría, sangre, maldiciones antiguas y tensión psicológica.",
      chaotic: "- [MODO DE COMPORTAMIENTO: CAÓTICO Y SALVAJE]: Giros argumentales impredecibles, humor salvaje, anomalías mágicas y caos.",
      noir: "- [MODO DE COMPORTAMIENTO: NOIR CÍNICO]: Monólogo interior cínico, calles empapadas por la lluvia, misterio y ambigüedad moral."
    }
  };

  const langDict = directives[l] || directives.en;
  return langDict[p] || langDict.classic;
}

function getDndModeDirective(lang) {
  if (!state.dndMode) return '';
  const stats = state.dndStats;
  const hasEnemy = stats.combatActive && stats.enemyHp > 0 && stats.enemyName;
  const enemyStatus = hasEnemy
    ? `HP врага (${stats.enemyName}): ${stats.enemyHp}/${stats.maxEnemyHp}, AC: ${stats.enemyAC}`
    : `Активного врага нет. Как только игрок встречает противника — сразу вводи его в формате тега.`;

  if (lang === 'ru') {
    return `
- [РЕЖИМ D&D 5E | МАСТЕР ПОДЗЕМЕЛИЙ]:
  * D&D — это прежде всего история, диалоги, исследование мира. Бой — лишь один из инструментов.
  * НЕ навязывай бой искусственно. Врагов вводи только если этого органически требует сюжет. Большая часть времени — нарратив, взаимодействия, атмосфера.
  * HP Игрока: ${stats.playerHp}/${stats.maxPlayerHp} | AC: ${stats.playerAC} | ${enemyStatus}
  * КОГДА вводить врага: если игрок вступает в бой или если по сюжету появляется опасность. Тег: (Враг: [ИМЯ], HP: [X], AC: [Y])
    Пример: (Враг: Орк-воин, HP: 15, AC: 13). После победы можно ввести нового если сюжет этого требует.
  * Боевые механики D&D 5e: атака d20 против AC, урон d4–d12, спасброски. Когда враг попадает: (Враг наносит урон: X HP)
  * HP = 0 → без сознания (игрок) / повержен (враг). Не говори от лица игрока.`;
  }
  if (lang === 'uk') {
    const enemyStatusUk = hasEnemy
      ? `HP ворога (${stats.enemyName}): ${stats.enemyHp}/${stats.maxEnemyHp}, AC: ${stats.enemyAC}`
      : `Активного ворога немає. Коли гравець зустрічає противника — введи його в форматі тегу.`;
    return `
- [РЕЖИМ D&D 5E | МАЙСТЕР ПІДЗЕМЕЛЬ]:
  * D&D — це перед усім історія, діалоги, дослідження. Бій — лише один з елементів.
  * НЕ нав'язуй бій штучно. Ворогів вводи лише коли цього органічно потребує сюжет.
  * HP Гравця: ${stats.playerHp}/${stats.maxPlayerHp} | AC: ${stats.playerAC} | ${enemyStatusUk}
  * Коли вводиш ворога: тег на початку: (Ворог: [ІМ'Я], HP: [X], AC: [Y])
    Приклад: (Ворог: Орк, HP: 15, AC: 13). Після перемоги можна ввести нового якщо сюжет вимагає.
  * Механіки D&D 5e: d20 проти AC, урон d4–d12. Коли ворог влучає: (Ворог завдає урон: X HP)
  * HP = 0 → непритомний (гравець) / переможений (ворог). Не говори від особи гравця.`;
  }
  if (lang === 'es') {
    const enemyStatusEs = hasEnemy
      ? `HP del enemigo (${stats.enemyName}): ${stats.enemyHp}/${stats.maxEnemyHp}, AC: ${stats.enemyAC}`
      : `Sin enemigo activo. Cuando el jugador encuentre uno, introdúcelo con la etiqueta de formato.`;
    return `
- [MODO D&D 5E | DUNGEON MASTER]:
  * D&D es ante todo historia, diálogo y exploración. El combate es solo un elemento más.
  * NO forces el combate artificialmente. Introduce enemigos solo cuando el relato lo requiera.
  * HP: ${stats.playerHp}/${stats.maxPlayerHp} | CA: ${stats.playerAC} | ${enemyStatusEs}
  * Al introducir un enemigo (cuando sea narrativamente apropiado): (enemy: [NOMBRE], HP: [X], AC: [Y])
    Ej: (enemy: Orco, HP: 15, AC: 13). Puedes introducir otro tras derrotar al anterior si el relato lo pide.
  * Mecánicas 5e: d20 vs CA, dados de daño d4–d12. Si el enemigo impacta: (El enemigo inflige: X HP)
  * HP 0 = inconsciente (jugador) / derrotado (enemigo). No hables por el jugador.`;
  }
  // English (default)
  const enemyStatusEn = hasEnemy
    ? `Active enemy — ${stats.enemyName}: HP ${stats.enemyHp}/${stats.maxEnemyHp}, AC ${stats.enemyAC}`
    : `No active enemy yet. When combat begins, introduce the enemy with the required tag.`;
  return `
- [D&D 5E MODE | DUNGEON MASTER]:
  * D&D is first and foremost about story, roleplay, and exploration. Combat is just one tool among many.
  * DO NOT force combat artificially. Let the narrative breathe. Most of the time should be roleplay, not fighting.
  * Player HP: ${stats.playerHp}/${stats.maxPlayerHp} | AC: ${stats.playerAC} | ${enemyStatusEn}
  * ENEMIES: Introduce them only when the story naturally calls for it — a threat emerges, the player picks a fight, or the plot demands tension.
    Tag at the start of your response: (enemy: [NAME], HP: [NUMBER], AC: [NUMBER])
    Examples: (enemy: Orc Guard, HP: 15, AC: 13) | (enemy: Shadow Wraith, HP: 45, AC: 14) | (enemy: Elder Dragon, HP: 195, AC: 19)
    You may introduce a NEW enemy after the previous one is defeated — if the story calls for it (waves, ambush, boss reveal).
    You do NOT have to introduce an enemy every scene. Dialogue, exploration, intrigue are just as valid.
  * D&D 5e combat mechanics: d20 attack vs AC, damage dice d4–d12, saving throws. When enemy hits: (Enemy deals X HP damage)
  * HP 0 = unconscious (player) / defeated (enemy). Narrate both dramatically. NEVER speak as the player.`;
}

function constructAIPrompt() {
  const lang = state.language || 'en';
  let prompt = "";

  if (lang === 'es') {
    prompt = `Eres un profesional Dungeon Master (Director de Juego) y narrador inmersivo para un juego interactivo de rol (TTRPG) en español.

REGLAS DE ROL Y ESTILO:
- Interpreta el mundo, los personajes secundarios (PNJ) y las amenazas con prosa vívida, atmosférica y sensorial.
- Responde directamente a las acciones del jugador, considerando el entorno, las consecuencias y los objetos de su inventario.
- Nunca escribas ni fuerces los pensamientos internos o acciones del personaje del jugador ("Muestra, no cuentes").
- ESTRICTAMENTE PROHIBIDO escribir meta-razonamientos o preámbulos OOC ("Ok, jugamos...", "Entendido, continuando..."). ¡Escribe EXCLUSIVAMENTE el texto del juego de rol!
- Mantén tu respuesta entre 2 y 4 oraciones ricas e intensas. Termina siempre con una pausa narrativa natural o una reacción del mundo que invite al jugador a actuar.

INTERPRETACIONAL DE DADOS D20 (CUANDO ESTÉ PRESENTE):
- 20 (ÉXITO CRÍTICO): ¡Triunfo brillante y espectacular! Logra el objetivo con ventajas adicionales o momentos épicos.
- 15-19 (ÉXITO): Éxito limpio y efectivo. La acción se cumple hábilmente.
- 10-14 (ÉXITO PARCIAL): Éxito con una complicación menor, costo o retraso.
- 2-9 (FALLO): La acción no resulta o encuentra resistencia; la situación se complica.
- 1 (FALLO CRÍTICO): ¡Desastre completo! Un error catastrófico o dramático con consecuencias inmediatas.

MODO Y PERSONALIDAD DEL MASTER:
${state.casualMode ? '- [MODO CASUAL / FANTASÍA DE PODER]: ¡El jugador es el héroe indiscutible! Proporciona victorias gloriosas y momentos cinemáticos sin castigos severos.' : '- [MODO REALISMO]: Aplica física realista, escasez de recursos y consecuencias reales para las decisiones.'}
${getBehaviorPresetDirective(state.behaviorPreset, 'es')}
${getDndModeDirective('es')}

Escenario del Mundo: ${state.currentScenarioKey}
${state.memory ? `Memoria del Mundo (Recordar): ${state.memory}\n` : ''}${state.authorNote ? `Estilo de Escritura: ${state.authorNote}\n` : ''}Inventario del Jugador: ${state.inventory.length > 0 ? state.inventory.join(', ') : 'Vacío'}

Historia de la aventura hasta ahora:
`;

    const recentHistory = state.history.slice(-10);
    recentHistory.forEach(b => {
      if (b.diceVal && b.diceLabel) {
        prompt += `${b.text} (🎲 [Resultado d20: ${b.diceVal} de 20 — ${b.diceLabel.toUpperCase()}])\n`;
      } else {
        prompt += `${b.text}\n`;
      }
    });

    prompt += `\nSINTAXIS DEL JUGADOR:\n- *texto en asteriscos* — acción del jugador y narración.\n- (texto en paréntesis) — aclaración OOC.\n- texto plano / "entre comillas" — diálogo del personaje.\n\nIMPORTANTE: Continúa la historia naturalmente en español con 2-4 oraciones completas. ¡Termina siempre las oraciones con puntuación!`;

  } else if (lang === 'uk') {
    prompt = `Ви — професійний Майстер Гри (Dungeon Master) та атмосферний оповідач для настільної рольової гри (НРИ) українською мовою.

ПРАВИЛА РОЛЬОВОГО ОТЫГРАШУ ТА СТИЛЬ:
- Описуйте світ, навколишніх персонажів (NPC) та небезпеки яскраво, емоційно та детально.
- Реагуйте безпосередньо на дії гравця, враховуючи логіку локації, наслідки та предмети з інвентаря.
- Заборонено писати думки гравця або вирішувати за його персонажа ("Показуй, а не розказуй").
- КАТЕГОРИЧНО ЗАБОРОНЕНО писати мета-роздуми, службові вступи ("Ок, ми граємо...", "Зрозумів, продовжую..."), думки моделі чи коментарі Майстра. Пишіть ВИКЛЮЧНО сам рольовий текст та отыгрыш!
- Відповідь повинна складатися з 2-4 насичених речень. Завжди завершуйте відповідь природною павзою або подією світу, на яку гравець може відповісти.

МЕХАНІКА КУБИКА D20 (ЯКЩО ВКАЗАНА В ДІЇ):
- 20 (КРИТИЧНИЙ УСПІХ): Вражаючий, триумфальний успіх! Дія вдається найкращим чином і дає додаткову перевагу.
- 15-19 (УСПІХ): Упевнений успіх. Гравець чітко досягає бажаного.
- 10-14 (ЧАСТКОВИЙ УСПІХ): Успіх із застереженням або незначною ціною (ускладнення, шум, затримка).
- 2-9 (НЕВДАЧА): Дія не вдається або виникає перешкода; ситуація погіршується.
- 1 (КРИТИЧНА НЕВДАЧА): Повний провал! Стається несподівана неприємність або втрата переваги.

РЕЖИМ ТА ОСОБИСТІСТЬ МАЙСТРА:
${state.casualMode ? '- [РЕЖИМ КАЗУАЛЬНИЙ / POWER FANTASY]: Гравець — головний герой! Даруйте йому епічні перемоги та драйв без жорстких покарань.' : '- [РЕЖИМ РЕАЛІЗМУ]: Дотримуйтесь фізики, логіки світу, обмеженості ресурсів та реальних наслідків помилок.'}
${getBehaviorPresetDirective(state.behaviorPreset, 'uk')}
${getDndModeDirective('uk')}

Сценарій Світу: ${state.currentScenarioKey}
${state.memory ? `Пам'ять Світу (Пам'ятати): ${state.memory}\n` : ''}${state.authorNote ? `Стиль Написання: ${state.authorNote}\n` : ''}Інвентар Гравця: ${state.inventory.length > 0 ? state.inventory.join(', ') : 'Порожньо'}

Історія пригоди до цього моменту:
`;

    const recentHistory = state.history.slice(-10);
    recentHistory.forEach(b => {
      if (b.diceVal && b.diceLabel) {
        prompt += `${b.text} (🎲 [Результат кубика d20: ${b.diceVal} з 20 — ${b.diceLabel.toUpperCase()}])\n`;
      } else {
        prompt += `${b.text}\n`;
      }
    });

    prompt += `\nСИНТАКСИС ГРАВЦЯ:\n- *текст у зірочках* — дія гравця та опис.\n- (текст у дужках) — позарольове (OOC) уточнення.\n- звичайний текст / "у лапках" — репліка персонажа.\n\nВАЖЛИВО: Продовжуйте історію природно українською мовою у 2-4 закінчених реченнях. Обов'язково ставте крапку в кінці!`;

  } else if (lang === 'ru') {
    prompt = `Вы — профессиональный Ведущий Мастер (Dungeon Master) и атмосферный нарратор для настольной ролевой игры (НРИ / Tabletop RPG) на русском языке.

ТВОЯ РОЛЬ И СТИЛЬ:
- Отыгрывай мир, окружающих персонажей (NPC) и опасности живо, атмосферно и кинематографично.
- Реагируй строго на действия игрока, учитывай обстановку, физику локации и предметы в его инвентаре.
- Запрещено писать внутренние мысли игрока или принимать решения за его персонажа ("Show, Don't Tell").
- КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО писать мета-рассуждения, служебные вступления ("Ок, мы отыгрываем...", "Вступаем в роль...", "Понял, продолжаю сценарий..."), мысли модели или комментарии Мастера. Пиши ИСКЛЮЧИТЕЛЬНО сам ролевой текст и отыгрыш!
- Ответ должен состоять из 2-4 глубоких, захватывающих предложений. Завершай ответ логической паузой или событием мира, на которое игрок может отреагировать.

МЕХАНИКА КУБИКА d20 (ЕСЛИ ПРИСУТСТВУЕТ В ДЕЙСТВИИ):
- 20 (КРИТИЧЕСКИЙ УСПЕХ): Невероятная, триумфальная победа! Действие удаётся наилучшим образом, даёт эпический эффект или неожиданное преимущество.
- 15-19 (УСПЕХ): Уверенный успех. Игрок четко добивается желаемого без негативных последствий.
- 10-14 (ЧАСТИЧНЫЙ УСПЕХ): Успех с оговоркой или небольшой ценой (лёгкое усложнение, шум, задержка).
- 2-9 (НЕУДАЧА): Действие не удаётся или встречает сопротивление. Обстановка усложняется.
- 1 (КРИТИЧЕСКИЙ ПРОВАЛ): Катастрофический или комичный провал! Происходит неожиданная неприятность или потеря преимущества.

РЕЖИМ И МОДЕЛЬ ПОВЕДЕНИЯ МАСТЕРА:
${state.casualMode ? '- [РЕЖИМ КАЗУАЛ / POWER FANTASY]: Игрок — главный герой! Описывай яркие победы, кинематографичный драйв и давай ему чувствовать себя сильным.' : '- [РЕЖИМ РЕАЛИЗМА]: Соблюдай физику, логику мира, ограниченность ресурсов и реальную угрозу от ошибок.'}
${getBehaviorPresetDirective(state.behaviorPreset, 'ru')}
${getDndModeDirective('ru')}

Сценарий мира: ${state.currentScenarioKey}
${state.memory ? `Память мира (Remember): ${state.memory}\n` : ''}${state.authorNote ? `Стиль написания: ${state.authorNote}\n` : ''}Инвенварь игрока: ${state.inventory.length > 0 ? state.inventory.join(', ') : 'Пусто'}

История приключения до этого момента:
`;

    const recentHistory = state.history.slice(-10);
    recentHistory.forEach(b => {
      if (b.diceVal && b.diceLabel) {
        prompt += `${b.text} (🎲 [Результат кубика d20: ${b.diceVal} из 20 — ${b.diceLabel.toUpperCase()}])\n`;
      } else {
        prompt += `${b.text}\n`;
      }
    });

    prompt += `\nФОРМАТИРОВАНИЕ СООБЩЕНИЙ ИГРОКА:\n- *текст в звездочках* — действия и описание персонажа игрока.\n- (текст в скобках) — внеролевое (OOC) уточнение.\n- обычный текст или "текст в кавычках" — реплика персонажа.\n\nВАЖНО: Продолжите историю естественно на русском языке в 2-4 законченных предложениях. Обязательно ставьте точку в конце!`;

  } else {
    prompt = `You are a world-class Dungeon Master (Game Master) and narrative storyteller for an immersive Tabletop RPG in English.

ROLE & STYLE GUIDELINES:
- Roleplay the world, non-player characters (NPCs), and hazards with vivid, sensory-rich prose and convincing dialogue.
- Respond directly to player actions, taking into account the environment, consequences, and items in the player's inventory.
- Never write internal thoughts or force decisions for the player's character ("Show, Don't Tell").
- STRICTLY PROHIBITED to write meta-reasoning, OOC preambles ("Okay, we are roleplaying...", "Understood, continuing scenario..."), model thoughts, or Master commentary. Output ONLY the roleplay prose itself!
- Keep your response to 2-4 atmospheric, captivating sentences. Always end with a natural narrative hook or environmental reaction that invites the player's next move.

D20 DICE MECHANICS INTERPRETATION (WHEN PRESENT):
- 20 (CRITICAL SUCCESS): Spectacular, triumphant outcome! Grants cinematic flair and unexpected tactical advantage or bonus.
- 15-19 (SUCCESS): Clean, effective success. The action achieves its goal skillfully.
- 10-14 (PARTIAL SUCCESS): Success with a minor complication, tradeoff, or noise/delay.
- 2-9 (FAILURE): The action fails or hits resistance; the situational danger escalates.
- 1 (CRITICAL FAILURE): Complete disaster! Catastrophic or humorous blunder with immediate repercussions.

GAMEPLAY MODE & MASTER PERSONA:
${state.casualMode ? '- [CASUAL MODE / POWER FANTASY]: The player is the epic protagonist! Provide glorious victories, cinematic flair, and heroic fun without harsh punishment.' : '- [REALISM MODE]: Enforce realistic physics, resource limitations, and genuine consequences for mistakes.'}
${getBehaviorPresetDirective(state.behaviorPreset, 'en')}
${getDndModeDirective('en')}

Setting Scenario: ${state.currentScenarioKey}
${state.memory ? `World Memory (Remember): ${state.memory}\n` : ''}${state.authorNote ? `Writing Style: ${state.authorNote}\n` : ''}Player Inventory: ${state.inventory.length > 0 ? state.inventory.join(', ') : 'Empty'}

Adventure history so far:
`;

    const recentHistory = state.history.slice(-10);
    recentHistory.forEach(b => {
      if (b.diceVal && b.diceLabel) {
        prompt += `${b.text} (🎲 [d20 Roll Result: ${b.diceVal} of 20 — ${b.diceLabel.toUpperCase()}])\n`;
      } else {
        prompt += `${b.text}\n`;
      }
    });

    prompt += `\nPLAYER SYNTAX:\n- *text in asterisks* — player action and character narration.\n- (text in parentheses) — OOC clarification or instruction.\n- plain text / "in quotes" — character dialogue and speech.\n\nIMPORTANT: Continue the story naturally in English with 2-4 complete sentences. Always end sentences with punctuation!`;
  }

  return prompt;
}

// Запрос к OpenRouter API с авто-фоллбэком по бесплатным моделям
async function fetchOpenRouterContinuation() {
  const apiKey = state.engineConfig.openrouterKey;
  if (!apiKey) throw new Error("Укажите API Ключ OpenRouter в Настройках.");

  const userModel = state.engineConfig.openrouterModel || "openrouter/free";
  const promptContext = constructAIPrompt();

  const candidates = [
    userModel,
    "openrouter/free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "meta-llama/llama-3.1-8b-instruct:free",
    "qwen/qwen-2.5-72b-instruct:free",
    "google/gemma-2-9b-it:free",
    "mistralai/mistral-small-24b-instruct-2501:free"
  ];

  const candidateChain = [...new Set(candidates.filter(Boolean))];
  let lastError = null;

  for (const modelCandidate of candidateChain) {
    try {
      console.log(`[OpenRouter API] Trying model: ${modelCandidate}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://github.com/dotdok132/OdAI',
          'X-Title': 'OdAI RPG App'
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: modelCandidate,
          messages: [{ role: "user", content: promptContext }],
          temperature: state.engineConfig.temperature || 0.8,
          max_tokens: 2048
        })
      });
      clearTimeout(timeoutId);

      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        data = {};
      }

      if (response.ok && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        const rawContent = data.choices[0].message.content.trim();
        const cleanText = sanitizeAIResponseText(rawContent);
        if (cleanText) {
          console.log(`[OpenRouter API Success] Model: ${modelCandidate}`);
          return cleanText;
        }
      }

      if (data.error) {
        const msg = data.error.message || JSON.stringify(data.error);
        console.warn(`[OpenRouter Fallback] Model ${modelCandidate} failed: ${msg}`);
        if (response.status === 401 || msg.includes("API key") || msg.includes("Invalid key")) {
          throw new Error(`API Ключ OpenRouter недействителен: ${msg}`);
        }
        lastError = msg;
      } else {
        lastError = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        lastError = "Timeout (15s)";
      } else if (err.message && err.message.includes("API Ключ")) {
        throw err;
      } else {
        lastError = err.message || String(err);
      }
    }
  }

  throw new Error(`OpenRouter: ${lastError || "Выбранная модель недоступна. Попробуйте выбрать 'openrouter/free' в Настройках."}`);
}

// Запрос к OpenAI / Custom API (Ollama, LM Studio)
async function fetchOpenAIContinuation() {
  const apiKey = state.engineConfig.apiKey || 'lm-studio';
  const baseUrl = state.engineConfig.openaiBaseUrl ? state.engineConfig.openaiBaseUrl.replace(/\/$/, '') : 'https://api.openai.com/v1';
  const model = state.engineConfig.openaiModel || 'gpt-4o';
  const url = `${baseUrl}/chat/completions`;
  const promptContext = constructAIPrompt();

  const headers = { 'Content-Type': 'application/json' };
  if (apiKey && apiKey !== 'lm-studio') headers['Authorization'] = `Bearer ${apiKey}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      signal: controller.signal,
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: promptContext }],
        temperature: state.engineConfig.temperature || 0.8,
        max_tokens: 2048
      })
    });
    clearTimeout(timeoutId);

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return sanitizeAIResponseText(data.choices[0].message.content);
    }
    if (data.error) throw new Error(`API Error: ${data.error.message || JSON.stringify(data.error)}`);
    throw new Error("Неверный ответ от API сервера");
  } catch (err) {
    if (err.name === 'AbortError') throw new Error("OpenAI API Timeout (15s)");
    throw err;
  }
}

// Запрос к Groq API
async function fetchGroqContinuation() {
  const apiKey = state.engineConfig.groqKey;
  if (!apiKey) throw new Error("Укажите API Ключ Groq в Настройках.");

  const model = state.engineConfig.groqModel || "llama-3.3-70b-versatile";
  const promptContext = constructAIPrompt();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: promptContext }],
        temperature: state.engineConfig.temperature || 0.8,
        max_tokens: 2048
      })
    });
    clearTimeout(timeoutId);

    const data = await response.json();
    if (response.ok && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return sanitizeAIResponseText(data.choices[0].message.content);
    }
    if (data.error) throw new Error(`Groq API: ${data.error.message || JSON.stringify(data.error)}`);
    throw new Error("Неверный ответ от Groq API");
  } catch (err) {
    if (err.name === 'AbortError') throw new Error("Groq API Timeout (15s)");
    throw err;
  }
}

// Запрос к Anthropic Claude API
async function fetchAnthropicContinuation() {
  const apiKey = state.engineConfig.anthropicKey;
  if (!apiKey) throw new Error("Укажите API Ключ Anthropic Claude в Настройках.");

  const model = state.engineConfig.anthropicModel || "claude-3-5-sonnet-20241022";
  const promptContext = constructAIPrompt();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true'
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: model,
        max_tokens: 2048,
        temperature: state.engineConfig.temperature || 0.8,
        messages: [{ role: "user", content: promptContext }]
      })
    });
    clearTimeout(timeoutId);

    const data = await response.json();
    if (response.ok && data.content && data.content[0] && data.content[0].text) {
      return sanitizeAIResponseText(data.content[0].text);
    }
    if (data.error) throw new Error(`Anthropic Claude: ${data.error.message || JSON.stringify(data.error)}`);
    throw new Error("Неверный ответ от Anthropic Claude API");
  } catch (err) {
    if (err.name === 'AbortError') throw new Error("Anthropic API Timeout (15s)");
    throw err;
  }
}

// Сквозной движок с авто-переключением (Cross-Provider Fallback Engine)
async function fetchUniversalAIContinuation() {
  const primaryProvider = state.engineConfig.mode || 'gemini';
  const providerOrder = [primaryProvider, 'gemini', 'openrouter', 'groq', 'anthropic', 'openai', 'g4f', 'built-in'];
  const candidates = [...new Set(providerOrder)];

  let lastError = null;

  for (const provider of candidates) {
    try {
      if (provider === 'gemini') {
        const key = state.engineConfig.geminiKey || state.engineConfig.apiKey;
        if (!key && primaryProvider !== 'gemini') continue;
        console.log("[Universal AI Engine] Attempting Gemini...");
        return await fetchGeminiContinuation();
      } else if (provider === 'openrouter') {
        const key = state.engineConfig.openrouterKey;
        if (!key && primaryProvider !== 'openrouter') continue;
        console.log("[Universal AI Engine] Attempting OpenRouter...");
        return await fetchOpenRouterContinuation();
      } else if (provider === 'groq') {
        const key = state.engineConfig.groqKey;
        if (!key && primaryProvider !== 'groq') continue;
        console.log("[Universal AI Engine] Attempting Groq...");
        return await fetchGroqContinuation();
      } else if (provider === 'anthropic') {
        const key = state.engineConfig.anthropicKey;
        if (!key && primaryProvider !== 'anthropic') continue;
        console.log("[Universal AI Engine] Attempting Anthropic...");
        return await fetchAnthropicContinuation();
      } else if (provider === 'openai') {
        const key = state.engineConfig.apiKey;
        if (!key && primaryProvider !== 'openai') continue;
        console.log("[Universal AI Engine] Attempting OpenAI...");
        return await fetchOpenAIContinuation();
      } else if (provider === 'g4f' || provider === 'built-in') {
        console.log("[Universal AI Engine] Attempting G4F / Offline fallback...");
        return await fetchG4FContinuation();
      }
    } catch (err) {
      console.warn(`[Universal AI Engine] Failover from ${provider}:`, err.message);
      lastError = err.message || String(err);
      if (provider === primaryProvider && (err.message.includes("API Ключ") || err.message.includes("Укажите API Ключ"))) {
        throw err;
      }
    }
  }

  throw new Error(lastError || "Все ИИ-провайдеры недоступны. Проверьте подключение и ключи API в Настройках.");
}

async function callAIPromptDirect(promptText) {
  const origHistory = state.chatHistory;
  const origScenario = state.currentScenario;

  try {
    state.chatHistory = [{ sender: 'user', text: promptText }];
    state.currentScenario = null;
    const response = await fetchUniversalAIContinuation();
    return sanitizeAIResponseText(response);
  } finally {
    state.chatHistory = origHistory;
    state.currentScenario = origScenario;
  }
}

async function handleAICreatorSubmit() {
  const title = (elements.aiCreatorTitle?.value || '').trim();
  const name = (elements.aiCreatorName?.value || '').trim();
  const situation = (elements.aiCreatorSituation?.value || '').trim();
  const statusEl = elements.aiCreatorStatus;
  const submitBtn = elements.aiCreatorSubmitBtn;

  if (!title || !name) {
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.style.color = '#ef4444';
      statusEl.textContent = getI18nText('aiCreatorError', 'Укажите название тайтла и имя персонажа!');
    }
    return;
  }

  if (submitBtn) submitBtn.disabled = true;
  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.style.color = 'var(--accent-color)';
    statusEl.textContent = getI18nText('aiCreatorGenerating', '⚡ ИИ изучает лор тайтла и генерирует личность персонажа...');
  }

  const prompt = `Ты — экспертный генератор ролевых карточек персонажей для интерактивных RPG историй.
Создай глубокую, каноничную ролевую карточку бота на основе:
- Франшиза / Тайтл: "${title}"
- Имя Персонажа: "${name}"
- Стартовая Сцена / Ситуация: "${situation || 'Первая встреча в их мире'}"

Выдай ответ СТРОГО в формате валидного JSON объекта без любого лишнего текста и без тройных обратных кавычек:
{
  "name": "${name}",
  "title": "${title}",
  "personality": "Подробное описание характера персонажа, его речи, манеры общения, важных воспоминаний и ключевых черт.",
  "worldLore": "Краткий сюжет тайтла ${title}, правила мира, фракции, текущая хронология и контекст.",
  "scenario": "Обстановка сцены, дислокация, атмосфера и точка входа для игрока.",
  "greeting": "Первое приветственное сообщение ОТ ЛИЦА ПЕРСОНАЖА (от первого лица), задающее завязку сцены, с мыслями и действиями в *звездочках*."
}`;

  try {
    const rawResponse = await callAIPromptDirect(prompt);
    let cleaned = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();

    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    let parsed = null;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.warn("JSON parse failed for bot generator, constructing fallback:", e);
      parsed = {
        name: name,
        title: title,
        personality: `Персонаж ${name} из тайтла "${title}". Владеет всеми ключевыми навыками и каноничным характером своего мира.`,
        worldLore: `Сюжет и лор мира "${title}".`,
        scenario: situation || `Первая встреча с ${name} в мире ${title}.`,
        greeting: `*Смотрит на вас, делая шаг навстречу в мире ${title}.*\n\n— Приветствую. Я ${name}. Что приводит тебя ко мне?`
      };
    }

    const charName = parsed.name || name;
    const charTitle = parsed.title || title;

    const newChat = {
      id: 'chat_' + Date.now(),
      name: `${charName} (${charTitle})`,
      title: charTitle,
      characterName: charName,
      avatarText: charName ? charName.charAt(0).toUpperCase() : '🤖',
      scenarioKey: 'custom',
      systemPrompt: `Ты играешь роль ${charName} из тайтла "${charTitle}".\n\nЛИЧНОСТЬ И ХАРАКТЕР:\n${parsed.personality || ''}\n\nСЮЖЕТ И ЛОР МИРА:\n${parsed.worldLore || ''}\n\nСИТУАЦИЯ И СЦЕНА:\n${parsed.scenario || ''}\n\nПРАВИЛА ИГРЫ:\n- Будь строго в образе ${charName}.\n- Форматируй действия в *звездочках*, а диалоги от первого лица.\n- Реагируй на реплики игрока живыми эмоциями.`,
      history: [
        { sender: 'ai', text: parsed.greeting || `*Приветствует вас в мире ${charTitle}.*\n\n— Я ${charName}. Рад встрече.` }
      ],
      created: new Date().toISOString()
    };

    state.chats.unshift(newChat);
    saveStateToStorage();
    renderChatsArchiveList();

    if (statusEl) statusEl.style.display = 'none';
    if (elements.scenarioModal) closeModal(elements.scenarioModal);

    openChat(newChat.id);

  } catch (err) {
    console.error("Error generating bot:", err);
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.style.color = '#ef4444';
      statusEl.textContent = `Ошибка генерации: ${err.message || 'Проверьте подключение и API ключ'}`;
    }
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

// Формирование промпта для внешних ИИ

// Очистка ответа ИИ от служебного мусора (User safety: safe, метеданных) и незавершенных предложений
function sanitizeAIResponseText(text) {
  if (!text) return "";
  let cleaned = text.trim();

  // 1. Очистка от системных флагов безопасности и статусных строчек бесплатниых провайдеров/зеркал
  cleaned = cleaned.replace(/^(?:user\s*safety\s*:?\s*safe|safety\s*rating\s*:?\s*safe|safety\s*status\s*:?\s*safe|safety\s*:?\s*safe|status\s*:?\s*200\s*ok|\[safety\s*check\s*passed\])\s*/gi, '');
  cleaned = cleaned.replace(/\n\s*(?:user\s*safety\s*:?\s*safe|safety\s*rating\s*:?\s*safe|safety\s*status\s*:?\s*safe)\s*$/gi, '');

  // 1b. Авто-удаление мета-вступлений ("Ок, мы отыгрываем...", "Понял, вступаю в роль...", "Understood, roleplaying...") и блоков <think>...</think>
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  cleaned = cleaned.replace(/^(?:ок|хорошо|понял|принято|понятно|подтверждаю|okay|ok|understood|got it|sure)\s*[,.:!\-—]?\s*(?:мы|я|отрегулируем|отыгрываем|продолжаем|вступаем|начинаем|ролевая|сценарий|roleplaying|starting|continuing)[\s\S]*?(?:\n+|\:\s*)/gi, '').trim();
  cleaned = cleaned.replace(/^(?:\[(?:мысли|размышления|мета|meta|note|ooc|thinking)\]|\((?:мысли|размышления|мета|meta|note|ooc)\))[\s\S]*?\n+/gi, '').trim();

  cleaned = cleaned.trim();

  // 2. Если ответ состоял ТОЛЬКО из системного статуса безопасности — генерируем ошибку для авто-переключения провайдера
  if (!cleaned || /^(?:safe|user safety|user safety: safe|safety pass|ok)$/i.test(cleaned)) {
    throw new Error("Провайдер вернул служебный статус безопасности вместо ответа. Переключение провайдера...");
  }

  // 3. Находим последнюю законченную пунктуацию (обрезаем оборванные фразы)
  const lastDot = Math.max(
    cleaned.lastIndexOf('.'),
    cleaned.lastIndexOf('!'),
    cleaned.lastIndexOf('?'),
    cleaned.lastIndexOf('»'),
    cleaned.lastIndexOf('"'),
    cleaned.lastIndexOf('*')
  );

  if (lastDot > 0 && lastDot < cleaned.length - 1) {
    const trailingFragment = cleaned.slice(lastDot + 1).trim();
    if (trailingFragment && !/[.!?»"*]$/.test(trailingFragment)) {
      console.log(`[Sanitizer] Trimming trailing incomplete sentence fragment: "${trailingFragment}"`);
      cleaned = cleaned.slice(0, lastDot + 1);
    }
  }

  return cleaned.trim();
}


// Обработчики инструментов истории (Отмена, Повтор, Стереть)
function handleUndo() {
  if (state.history.length <= 1) return;
  
  const lastBlock = state.history[state.history.length - 1];
  if (lastBlock.type === 'ai' || lastBlock.type === 'system') {
    state.history.pop();
    if (state.history.length > 0 && (state.history[state.history.length - 1].type !== 'ai')) {
      state.history.pop();
    }
  } else {
    state.history.pop();
  }

  saveStateToStorage();
  renderStoryFeed();
}

async function handleRetry() {
  if (state.history.length === 0) return;
  
  const lastBlock = state.history[state.history.length - 1];
  if (lastBlock.type === 'ai' || lastBlock.type === 'system') {
    state.history.pop();
    renderStoryFeed();
    await generateAIResponse();
  }
}

function handleErase() {
  if (state.history.length > 0) {
    state.history.pop();
    saveStateToStorage();
    renderStoryFeed();
  }
}

function updateUIState() {
  const provider = state.engineConfig.mode || 'gemini';
  
  const accordionItems = document.querySelectorAll('.accordion-item[data-provider]');
  accordionItems.forEach(c => {
    c.classList.toggle('active', c.dataset.provider === provider);
  });

  if (elements.geminiKeyInput) elements.geminiKeyInput.value = state.engineConfig.geminiKey || state.engineConfig.apiKey || '';
  if (elements.geminiModelSelect) elements.geminiModelSelect.value = state.engineConfig.geminiModel || 'auto';
  if (elements.openrouterKeyInput) elements.openrouterKeyInput.value = state.engineConfig.openrouterKey || '';
  if (elements.openrouterModelInput) elements.openrouterModelInput.value = state.engineConfig.openrouterModel || 'meta-llama/llama-3.3-70b-instruct:free';
  if (elements.openrouterPresetSelect && elements.openrouterModelInput) {
    elements.openrouterPresetSelect.value = state.engineConfig.openrouterModel || 'meta-llama/llama-3.3-70b-instruct:free';
    if (!elements.openrouterPresetSelect.value) elements.openrouterPresetSelect.value = 'custom';
  }
  if (elements.serverUrlInput) elements.serverUrlInput.value = state.engineConfig.serverUrl || '';
  if (elements.openaiBaseUrlInput) elements.openaiBaseUrlInput.value = state.engineConfig.openaiBaseUrl || 'https://api.openai.com/v1';
  if (elements.apiKeyInput) elements.apiKeyInput.value = state.engineConfig.apiKey || '';
  if (elements.openaiModelInput) elements.openaiModelInput.value = state.engineConfig.openaiModel || 'gpt-4o';
  if (elements.groqKeyInput) elements.groqKeyInput.value = state.engineConfig.groqKey || '';
  if (elements.groqModelSelect) elements.groqModelSelect.value = state.engineConfig.groqModel || 'llama-3.3-70b-versatile';
  if (elements.anthropicKeyInput) elements.anthropicKeyInput.value = state.engineConfig.anthropicKey || '';
  if (elements.anthropicModelSelect) elements.anthropicModelSelect.value = state.engineConfig.anthropicModel || 'claude-3-5-sonnet-20241022';

  if (elements.tempSlider) {
    elements.tempSlider.value = state.engineConfig.temperature || 0.8;
    if (elements.tempVal) elements.tempVal.textContent = state.engineConfig.temperature || 0.8;
  }
  if (elements.contextSlider) {
    elements.contextSlider.value = state.engineConfig.contextLength || 10;
    const dict = I18N[state.language] || I18N.en;
    if (elements.contextVal) elements.contextVal.textContent = `${state.engineConfig.contextLength || 10} ${dict.messagesCount || 'msgs'}`;
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

  // Синхронизируем D&D HUD (чтобы заблокировать/разблокировать кнопки)
  if (state.dndMode) {
    renderDndHud();
  }
}

// Проверка подключения к ИИ
async function testAIConnection() {
  if (!elements.connectionStatusBadge) return;

  if (elements.geminiKeyInput) state.engineConfig.geminiKey = elements.geminiKeyInput.value.trim();
  if (elements.geminiModelSelect) state.engineConfig.geminiModel = elements.geminiModelSelect.value;
  if (elements.openrouterKeyInput) state.engineConfig.openrouterKey = elements.openrouterKeyInput.value.trim();
  if (elements.openrouterModelInput) state.engineConfig.openrouterModel = elements.openrouterModelInput.value.trim();
  if (elements.serverUrlInput) state.engineConfig.serverUrl = elements.serverUrlInput.value.trim();
  if (elements.openaiBaseUrlInput) state.engineConfig.openaiBaseUrl = elements.openaiBaseUrlInput.value.trim();
  if (elements.apiKeyInput) state.engineConfig.apiKey = elements.apiKeyInput.value.trim();
  if (elements.openaiModelInput) state.engineConfig.openaiModel = elements.openaiModelInput.value.trim();
  if (elements.groqKeyInput) state.engineConfig.groqKey = elements.groqKeyInput.value.trim();
  if (elements.groqModelSelect) state.engineConfig.groqModel = elements.groqModelSelect.value;
  if (elements.anthropicKeyInput) state.engineConfig.anthropicKey = elements.anthropicKeyInput.value.trim();
  if (elements.anthropicModelSelect) state.engineConfig.anthropicModel = elements.anthropicModelSelect.value;

  elements.connectionStatusBadge.style.display = 'inline-flex';
  elements.connectionStatusBadge.className = 'connection-status-badge loading';
  elements.connectionStatusBadge.textContent = '⏳ Проверка соединения...';

  const startTime = Date.now();

  try {
    const resText = await fetchUniversalAIContinuation();
    const elapsed = Date.now() - startTime;
    elements.connectionStatusBadge.className = 'connection-status-badge success';
    elements.connectionStatusBadge.textContent = `✅ Успешно (${elapsed}ms)`;

  } catch (err) {
    elements.connectionStatusBadge.className = 'connection-status-badge error';
    elements.connectionStatusBadge.textContent = `❌ Ошибка: ${err.message}`;
  }
}

function escapeHTML(str) {
  if (typeof str !== 'string') {
    if (str === null || str === undefined) return '';
    if (typeof str === 'object') {
      const lang = state.language || 'en';
      str = str[lang] || str.en || str.ru || JSON.stringify(str);
    } else {
      str = String(str);
    }
  }
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// PWA Service Worker & Install Prompt Integration
let deferredPwaPrompt = null;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[PWA] ServiceWorker registered with scope:', reg.scope))
      .catch(err => console.warn('[PWA] ServiceWorker registration failed:', err));
  });
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPwaPrompt = e;
  if (elements.pwaInstallBtn) {
    elements.pwaInstallBtn.style.display = 'flex';
  }
});

if (elements.pwaInstallBtn) {
  elements.pwaInstallBtn.addEventListener('click', async () => {
    if (!deferredPwaPrompt) return;
    deferredPwaPrompt.prompt();
    const { outcome } = await deferredPwaPrompt.userChoice;
    console.log(`[PWA] User response to install prompt: ${outcome}`);
    deferredPwaPrompt = null;
    if (elements.pwaInstallBtn) {
      elements.pwaInstallBtn.style.display = 'none';
    }
  });
}

// Запуск приложения
// Прямой запуск инициализации
init();
