/**
 * OdAI - Интерактивный AI Движок Приключений (AI Dungeon Clone)
 * Интеграция с g4f (GPT4Free), 100% ИИ Защита Реализма (быстрый арбитр с анимированным статусом), 3D d20 Dice Mechanics, Инвентарь, Память Мира.
 */

// Сценарии по умолчанию (Multilingual: English, Spanish, Ukrainian, Russian)
const SCENARIOS = {
  fantasy: {
    title: { en: "Medieval Fantasy", es: "Fantasía Medieval", uk: "Середньовічне Фентезі", ru: "Средневековое Фэнтези" },
    era: "medieval fantasy",
    inventory: {
      en: ["Iron Longsword", "Leather Armor", "Healing Salve (x2)"],
      es: ["Espada Larga de Hierro", "Armadura de Cuero", "Bálsamo Curativo (x2)"],
      uk: ["Залізний довгий меч", "Шкіряний обладунок", "Цілющий бальзам (x2)"],
      ru: ["Железный длинный меч", "Кожаный доспех", "Целебный бальзам (x2)"]
    },
    intro: {
      en: "You stand at the ancient stone gates of Oak Keep, lost in the mists of the Whispering Peaks. The wind carries the scent of damp pine and old rain. The sword in your hand feels heavy. Legend says a dark artifact is hidden beneath the citadel.",
      es: "Te encuentras ante las antiguas puertas de piedra de Fortaleza del Roble, perdida en las brumas de los Picos Susurrantes. El viento trae el olor a pino húmedo y lluvia vieja. La espada en tu mano se siente pesada. La leyenda dice que un oscuro artefacto se oculta bajo la ciudadela.",
      uk: "Ви стоїте біля стародавніх кам'яних воріт Дубової Фортеці, загубленої у туманах Шепочущих Піків. Вітер доносить запах сирої сосни та старого дощу. Меч у вашій руці здається важким. Легенда говорить, що під цитаделлю схований темний артефакт.",
      ru: "Вы стоите у древних каменных ворот Дубовой Крепости, затерянной в туманах Шепчущих Пиков. Ветер доносит запах сырой сосны и старого дождя. Меч в вашей руке кажется тяжелым. Легенда гласит, что под цитаделью скрыт темный артефакт."
    }
  },
  cyberpunk: {
    title: { en: "Cyberpunk Netrunner", es: "Netrunner Cyberpunk", uk: "Кіберпанк Нетраннер", ru: "Киберпанк Нетраннер" },
    era: "cyberpunk",
    inventory: {
      en: ["Cyberdeck (MK-IV)", "Monofilament Whip", "Encrypted Datapad", "Stimpack"],
      es: ["Cibercubierta (MK-IV)", "Látigo de Monofilamento", "Datapad Cifrado", "Estimulante"],
      uk: ["Кібердека (MK-IV)", "Моноволоконний батіг", "Зашифрований датапад", "Стимулятор"],
      ru: ["Кибердека (MK-IV)", "Моноволоконный хлыст", "Зашифрованный датапад", "Стимулятор"]
    },
    intro: {
      en: "Neon rain shimmers on the wet asphalt of Sector 7, while holographic ads flicker overhead. You pull up your collar against the chemical smog. Your cyberdeck chimed 5 minutes ago — an anonymous client uploaded a contract to hack a corporate database.",
      es: "La lluvia de neón brilla en el asfalto mojado del Sector 7, mientras los anuncios holográficos parpadean. Subes tu cuello para protegerte del smog químico. Tu cibercubierta sonó hace 5 minutos: un cliente anónimo subió un contrato para hackear una base de datos corporativa.",
      uk: "Неоновий дощ блищить на мокрому асфальті Сектора 7, а над головою мерехтять голографічні вивіски. Ви піднімаєте комір, захищаючись від хімічного смогу. Ваша кібердека дзенкнула 5 хвилин тому — анонімний замовник завантажив контракт на злам корпоративної бази.",
      ru: "Неоновый дождь блестит на мокром асфальте Сектора 7, а над головой мерцают голографические вывески. Вы поднимаете воротник, защищаясь от химозного смога. Ваша кибердека звякнула 5 минут назад — анонимный заказчик загрузил контракт на взлом корпоративной базы."
    }
  },
  zombie: {
    title: { en: "Zombie Apocalypse", es: "Apocalipsis Zombie", uk: "Зомбі Апокаліпсис", ru: "Зомби Апокалипсис" },
    era: "modern post-apocalypse",
    inventory: {
      en: ["Machete", "Water Canteen", "Flashlight (low battery)", "Bandages"],
      es: ["Machete", "Cantimplora de Agua", "Linterna (batería baja)", "Vendas"],
      uk: ["Мачете", "Фляга з водою", "Ліхтарик (сідає батарея)", "Бинти"],
      ru: ["Мачете", "Фляга с водой", "Фонарик (садится батарея)", "Бинты"]
    },
    intro: {
      en: "The sirens fell silent months ago. You crouch behind a rusted minivan on 5th Avenue, peering into broken shop windows. Two walkers wander near an abandoned grocery store across the street. Supplies are running low.",
      es: "Las sirenas se силиaron hace meses. Te agachas detrás de una minivan oxidada en la Quinta Avenida, mirando a través de escaparates rotos. Dos caminantes vagan cerca de una tienda abandonada al otro lado de la calle. Los suministros se agotan.",
      uk: "Сирени затихли кілька місяців тому. Ви сидите на карточках за заржавілим мінівеном на 5-й авеню, вдивляючись у розбиті вітрини. Два ходока блукають біля покинутого гастроному через дорогу. Припаси на межі.",
      ru: "Сирены затихли несколько месяцев назад. Вы сидите на корточках за заржавевшим минивэном на 5-й авеню, всматриваясь в выбитые витрины. Два ходока бродят возле заброшенного гастронома через дорогу. Припасы на исходе."
    }
  },
  detective: {
    title: { en: "Noir Detective", es: "Detective Noir", uk: "Нуарний Детектив", ru: "Нуарный Детектив" },
    era: "1940s-noir detective",
    inventory: {
      en: [".38 Revolver", "Notepad & Pen", "Silver Lighter", "Trenchcoat"],
      es: ["Revólver .38", "Cuaderno y Bolígrafo", "Encendedor de Plata", "Gabardina"],
      uk: ["Револьвер .38", "Блокнот і ручка", "Срібна запальничка", "Плащ"],
      ru: ["Револьвер .38", "Блокнот и ручка", "Серебряная зажигалка", "Плащ"]
    },
    intro: {
      en: "Rain beats a steady rhythm against your office window. The wall clock shows two in the morning. You pour a glass of cheap bourbon when the silhouette of a man in a fedora appears on the frosted glass door.",
      es: "La lluvia golpea un ritmo constante contra la ventana de tu oficina. El reloj marca las dos de la mañana. Sirves un vaso de bourbon barato cuando la silueta de un hombre con sombrero aparece en la puerta de cristal esmerilado.",
      uk: "Дощ відбиває чіткий ритм по склу вашого кабінету. Годинник на стіні показує другу годину ночі. Ви наливаєте склянку дешевого бурбону, коли на матовому склі дверей з'являється силует чоловіка в капелюсі.",
      ru: "Дождь отбивает четкий ритм по стеклу вашего кабинета. Часы на стене показывают два часа ночи. Вы наливаете стакан дешевого бурбона, когда на матовом стекле двери появляется силуэт человека в шляпе."
    }
  }
};

// Словарь локализации на 4 языка (en, es, uk, ru)
const I18N = {
  en: {
    appTitle: "OdAI",
    chatsTitle: "Your Adventures",
    newChatBtn: "New Adventure",
    settingsTitle: "AI & Connection Settings",
    saveBtn: "Save",
    backBtn: "Back",
    languageLabel: "Language / Idioma",
    selectLanguageLabel: "Choose Interface & Story Language:",
    aiProvidersTitle: "AI Providers (Select Active)",
    inventoryTitle: "Inventory & World Memory",
    inventoryLabel: "Inventory Items",
    addItemPlaceholder: "Add item (e.g., Torch)...",
    addBtn: "Add",
    memoryLabel: "World Memory (Remember)",
    memoryPlaceholder: "Key facts for AI to remember...",
    authorNoteLabel: "Author's Note (Style & Tone)",
    authorNotePlaceholder: "e.g., Dark fantasy, immersive prose...",
    inputPlaceholder: "Type a message... *action* or (OOC note)",
    sendBtn: "Send",
    d20Btn: "d20: Auto",
    undoBtn: "Undo",
    retryBtn: "Retry",
    eraseBtn: "Erase",
    realismGuard: "Realism Guard",
    casualModeLabel: "Casual Mode (Always Succeed)",
    changeScenario: "Change World",
    masterName: "Dungeon Master",
    youName: "You",
    exportJson: "📥 Export JSON",
    exportTxt: "📄 Export Text",
    importBackup: "📤 Import Backup",
    backupTitle: "Backup & Export",
    backupSub: "Save and restore game data",
    caiTitle: "Import Character from Character.AI / Card",
    caiPlaceholder: "Paste c.ai link (https://character.ai/chat/...)",
    caiBtn: "Import",
    caiFileBtn: "📁 Load card file (.json)",
    scenarioModalTitle: "Choose Your World",
    startCustomBtn: "Start Custom World",
    customPromptPlaceholder: "You wake up in a quiet tavern with no memory of how you got here...",
    aiGenerating: "AI is creating continuation...",
    realismChecking: "Arbiter checking realism...",
    testConnection: "Test Connection",
    noMessages: "No chats yet. Tap + to start a new adventure!",
    messagesCount: "msgs",
    lastMsg: "Last:"
  },
  es: {
    appTitle: "OdAI",
    chatsTitle: "Tus Aventuras",
    newChatBtn: "Nueva Aventura",
    settingsTitle: "Ajustes de IA y Conexión",
    saveBtn: "Guardar",
    backBtn: "Volver",
    languageLabel: "Idioma / Language",
    selectLanguageLabel: "Elige el idioma de la interfaz e historia:",
    aiProvidersTitle: "Proveedores de IA (Seleccionar Activo)",
    inventoryTitle: "Inventario y Memoria",
    inventoryLabel: "Objetos del Inventario",
    addItemPlaceholder: "Añadir objeto (ej. Antorcha)...",
    addBtn: "Añadir",
    memoryLabel: "Memoria del Mundo (Recordar)",
    memoryPlaceholder: "Hechos clave que la IA debe recordar...",
    authorNoteLabel: "Nota del Autor (Estilo y Tono)",
    authorNotePlaceholder: "ej. Fantasía oscura, prosa inmersiva...",
    inputPlaceholder: "Escribe un mensaje... *acción* o (nota OOC)",
    sendBtn: "Enviar",
    d20Btn: "d20: Auto",
    undoBtn: "Deshacer",
    retryBtn: "Reintentar",
    eraseBtn: "Borrar",
    realismGuard: "Guardia Realismo",
    casualModeLabel: "Modo Casual (Siempre Éxito)",
    changeScenario: "Cambiar Mundo",
    masterName: "Dungeon Master",
    youName: "Tú",
    exportJson: "📥 Exportar JSON",
    exportTxt: "📄 Exportar Texto",
    importBackup: "📤 Importar Copia",
    backupTitle: "Copia de Seguridad y Exportación",
    backupSub: "Guardar y restaurar datos del juego",
    caiTitle: "Importar Personaje de Character.AI / Tarjeta",
    caiPlaceholder: "Pega enlace c.ai (https://character.ai/chat/...)",
    caiBtn: "Importar",
    caiFileBtn: "📁 Cargar archivo de tarjeta (.json)",
    scenarioModalTitle: "Elige Tu Mundo",
    startCustomBtn: "Iniciar Mundo Personalizado",
    customPromptPlaceholder: "Te despiertas en una taberna tranquila sin recordar cómo llegaste...",
    aiGenerating: "La IA está creando la continuación...",
    realismChecking: "El Árbitro está verificando el realismo...",
    testConnection: "Probar Conexión",
    noMessages: "¡No hay chats aún. Toca + para empezar!",
    messagesCount: "mensajes",
    lastMsg: "Último:"
  },
  uk: {
    appTitle: "OdAI",
    chatsTitle: "Ваші Пригоди",
    newChatBtn: "Нова Пригода",
    settingsTitle: "Налаштування ШІ та З'єднань",
    saveBtn: "Зберегти",
    backBtn: "Назад",
    languageLabel: "Мова / Language",
    selectLanguageLabel: "Оберіть мову інтерфейсу та історії:",
    aiProvidersTitle: "Провайдери ШІ (Оберіть активний)",
    inventoryTitle: "Інвентар та Пам'ять",
    inventoryLabel: "Предмети в інвентарі",
    addItemPlaceholder: "Додати предмет (напр. Смолоскип)...",
    addBtn: "Додати",
    memoryLabel: "Пам'ять світу (Remember)",
    memoryPlaceholder: "Ключові факти, які ШІ повинен пам'ятати...",
    authorNoteLabel: "Замітка автора (Стиль)",
    authorNotePlaceholder: "напр. Похмуре фентезі, атмосферний стиль...",
    inputPlaceholder: "Напишіть повідомлення... *дія* або (уточнення)",
    sendBtn: "Надіслати",
    d20Btn: "d20: Авто",
    undoBtn: "Скасувати",
    retryBtn: "Повторити",
    eraseBtn: "Стерти",
    realismGuard: "Захист Реалізму",
    casualModeLabel: "Казуальний Режим (Завжди Успіх)",
    changeScenario: "Змінити Світ",
    masterName: "Майстер Гри",
    youName: "Ви",
    exportJson: "📥 Експорт JSON",
    exportTxt: "📄 Експорт Текст",
    importBackup: "📤 Імпорт Бэкапу",
    backupTitle: "Резервне копіювання та Експорт",
    backupSub: "Збереження та відновлення даних",
    caiTitle: "Імпорт персонажа з Character.AI / Картки",
    caiPlaceholder: "Вставте посилання c.ai (https://character.ai/chat/...)",
    caiBtn: "Імпорт",
    caiFileBtn: "📁 Завантажити файл картки (.json)",
    scenarioModalTitle: "Оберіть ваш світ",
    startCustomBtn: "Почати свій світ",
    customPromptPlaceholder: "Ви прокидаєтеся у тихій таверні і не пам'ятаєте, як тут опинилися...",
    aiGenerating: "ШІ створює продовження...",
    realismChecking: "Арбітр перевіряє реалізм...",
    testConnection: "Перевірити з'єднання",
    noMessages: "Чатів поки немає. Натисніть +, щоб почати!",
    messagesCount: "повідомл.",
    lastMsg: "Ост:"
  },
  ru: {
    appTitle: "OdAI",
    chatsTitle: "Ваши приключения",
    newChatBtn: "Новое приключение",
    settingsTitle: "Настройки ИИ и Подключений",
    saveBtn: "Сохранить",
    backBtn: "Назад",
    languageLabel: "Язык / Language",
    selectLanguageLabel: "Выберите язык интерфейса и истории:",
    aiProvidersTitle: "Провайдеры ИИ (Выберите активный)",
    inventoryTitle: "Инвентарь и Память",
    inventoryLabel: "Предметы в инвентаре",
    addItemPlaceholder: "Добавить предмет (напр. Факел)...",
    addBtn: "Добавить",
    memoryLabel: "Память мира (Remember)",
    memoryPlaceholder: "Ключевые факты, которые ИИ должен помнить...",
    authorNoteLabel: "Заметка автора (Стиль)",
    authorNotePlaceholder: "напр., Мрачное фэнтези, глубокая атмосфера...",
    inputPlaceholder: "Напишите сообщение... *действие* или (уточнение)",
    sendBtn: "Отправить",
    d20Btn: "d20: Авто",
    undoBtn: "Отмена",
    retryBtn: "Повтор",
    eraseBtn: "Стереть",
    realismGuard: "Защита",
    changeScenario: "Сменить мир",
    masterName: "Мастер Игры",
    youName: "Вы",
    exportJson: "📥 Экспорт JSON",
    exportTxt: "📄 Экспорт Текст",
    importBackup: "📤 Импорт Бэкапа",
    backupTitle: "Резервное копирование и Экспорт",
    backupSub: "Сохранение и восстановление данных",
    caiTitle: "Импорт персонажа из Character.AI / Карточки",
    caiPlaceholder: "Вставьте ссылку c.ai (https://character.ai/chat/...)",
    caiBtn: "Импорт",
    caiFileBtn: "📁 Загрузить файл карточки (.json)",
    scenarioModalTitle: "Выберите ваш мир",
    startCustomBtn: "Начать свой мир",
    customPromptPlaceholder: "Вы просыпаетесь в тихой таверне и не помните, как здесь оказались...",
    aiGenerating: "ИИ создает продолжение...",
    realismChecking: "Арбитр проверяет реализм...",
    testConnection: "Проверить соединение",
    noMessages: "Чатов пока нет. Нажмите +, чтобы начать!",
    messagesCount: "сообщ.",
    lastMsg: "Посл:"
  }
};

// Начальное состояние приложения
// Начальное состояние приложения
const state = {
  language: 'en', // Default English language ('en' | 'ru')
  chats: [], // Массив сессий { id, title, scenarioKey, history, inventory, memory, authorNote, updatedAt }
  currentChatId: null,
  currentScenarioKey: 'fantasy',
  history: [], // Текущая активная история
  inventory: ["Железный длинный меч", "Кожаный доспех", "Целебный бальзам (x2)"],
  memory: "Вы — искатель приключений, исследующий древние руины в поисках артефактов.",
  authorNote: "Мрачное фэнтези, глубокая атмосфера, подробные описания мира.",
  realismMode: true,
  casualMode: false, // Casual Mode (Always Succeed on d20 rolls)
  forceD20: false, // Флаг принудительного броска d20 на следующее действие
  currentMode: 'do', // 'do' | 'say' | 'story'
  isGenerating: false,
  engineConfig: {
    mode: 'g4f', // 'g4f' | 'built-in' | 'gemini' | 'openai'
    apiKey: '',
    temperature: 0.8
  }
};

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

  storyFeed: document.getElementById('story-feed'),
  promptInput: document.getElementById('prompt-input'),
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

  // Настройки ИИ и подключений
  settingsBtn: document.getElementById('settings-btn'),
  settingsModal: document.getElementById('settings-modal'),
  closeSettingsModal: document.getElementById('close-settings-modal'),
  providerCards: document.querySelectorAll('.provider-card'),
  providerPanels: document.querySelectorAll('.provider-panel'),
  geminiKeyInput: document.getElementById('gemini-key-input'),
  geminiModelSelect: document.getElementById('gemini-model-select'),
  openrouterKeyInput: document.getElementById('openrouter-key-input'),
  openrouterModelInput: document.getElementById('openrouter-model-input'),
  serverUrlInput: document.getElementById('server-url-input'),
  openaiBaseUrlInput: document.getElementById('openai-baseurl-input'),
  apiKeyInput: document.getElementById('api-key-input'),
  openaiModelInput: document.getElementById('openai-model-input'),
  tempSlider: document.getElementById('temp-slider'),
  tempVal: document.getElementById('temp-val'),
  contextSlider: document.getElementById('context-slider'),
  contextVal: document.getElementById('context-val'),
  testConnectionBtn: document.getElementById('test-connection-btn'),
  connectionStatusBadge: document.getElementById('connection-status-badge'),
  saveSettingsBtn: document.getElementById('save-settings-btn')
};

// Вспомогательная функция для формирования URL эндпоинтов
function getApiEndpoint(path) {
  const customUrl = (state.engineConfig && state.engineConfig.serverUrl) ? state.engineConfig.serverUrl.trim() : '';
  if (customUrl) {
    return `${customUrl.replace(/\/$/, '')}${path}`;
  }
  // В мобильном приложении Android (Capacitor/file:)
  if (window.location.protocol === 'file:' || window.location.protocol === 'capacitor:') {
    return `http://127.0.0.1:8080${path}`;
  }
  return path;
}


// Функция переключения экранов

function applyI18nLanguage(lang) {
  state.language = lang || 'en';
  const dict = I18N[state.language] || I18N.en;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  if (elements.promptInput) {
    elements.promptInput.placeholder = dict.inputPlaceholder;
  }

  const langSelect = document.getElementById('language-select');
  if (langSelect) langSelect.value = state.language;

  renderChatsArchiveList();
  renderStoryFeed();
  saveStateToStorage();
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
  const isTabletSplit = window.innerWidth >= 960 && window.innerHeight >= 600;

  if (isTabletSplit) {
    elements.viewChatList.classList.add('active');
    elements.viewChatList.style.display = 'flex';
    elements.viewChat.classList.add('active');
    elements.viewChat.style.display = 'flex';
    renderChatsArchiveList();
    return;
  }

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





function setupTextareaAutoResize(el) {
  if (!el) return;
  el.addEventListener('input', function() {
    this.style.height = 'auto';
    const newHeight = Math.min(this.scrollHeight, 150); // max 150px
    this.style.height = newHeight + 'px';
  });
}

// Инициализация
function init() {

  loadStateFromStorage();
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
    if (nameEl) nameEl.textContent = activeSession.title || 'OdAI Master';
    if (subEl) {
      const scenTitle = SCENARIOS[activeSession.scenarioKey]?.title || 'Интерактивный ИИ';
      subEl.textContent = `@${scenTitle}`;
    }
    if (avatarEl) {
      const initial = (activeSession.title || 'AI').charAt(0).toUpperCase();
      avatarEl.textContent = initial;
    }
  }
}

// Обновление сессии данными из текущего состояния
function updateActiveChatSession() {
  let activeSession = getCurrentChatSession();
  if (!activeSession) {
    activeSession = {
      id: 'chat_' + Date.now(),
      title: SCENARIOS[state.currentScenarioKey]?.title || "Новое приключение",
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
    activeSession.scenarioKey = state.currentScenarioKey;
    activeSession.updatedAt = new Date().toISOString();
  }
}

// Загрузка состояния из LocalStorage (с поддержкой автомиграции)
function loadStateFromStorage() {
  const saved = localStorage.getItem('odai_app_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.realismMode = parsed.realismMode !== undefined ? parsed.realismMode : true;
      state.engineConfig = parsed.engineConfig || state.engineConfig;

      if (parsed.chats && Array.isArray(parsed.chats) && parsed.chats.length > 0) {
        state.chats = parsed.chats;
        state.currentChatId = parsed.currentChatId || parsed.chats[0].id;
      } else if (parsed.history && parsed.history.length > 0) {
        // Миграция из старого формата одиночной истории
        const legacyChat = {
          id: 'chat_' + Date.now(),
          title: SCENARIOS[parsed.currentScenarioKey || 'fantasy']?.title || "Сохраненный чат",
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
    const lang = state.language || 'ru';
    const titleText = typeof scen.title === 'object' ? (scen.title[lang] || scen.title.ru || scen.title.en) : scen.title;
    const introText = typeof scen.intro === 'object' ? (scen.intro[lang] || scen.intro.ru || scen.intro.en) : scen.intro;
    const invList = Array.isArray(scen.inventory) ? scen.inventory : (typeof scen.inventory === 'object' ? (scen.inventory[lang] || scen.inventory.ru || scen.inventory.en || []) : []);
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
  elements.realismToggle.classList.toggle('active', state.realismMode);
}

// Сохранение состояния в LocalStorage
function saveStateToStorage() {
  updateActiveChatSession();
  const dataToSave = {
    chats: state.chats,
    currentChatId: state.currentChatId,
    realismMode: state.realismMode,
    engineConfig: state.engineConfig
  };
  localStorage.setItem('odai_app_state', JSON.stringify(dataToSave));
}

// Настройка слушателей событий
function setupEventListeners() {
  // Навигация и экраны
  setupTextareaAutoResize(elements.promptInput);
  setupTextareaAutoResize(elements.memoryInput);
  setupTextareaAutoResize(elements.authorNoteInput);

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
    });
  }
  if (elements.dropdownRealismToggle) {
    elements.dropdownRealismToggle?.addEventListener('click', (e) => {
      if (e.target.closest('.toggle-switch')) return; // handled by realismToggle listener
      elements.realismToggle.click();
    });
  }
  if (elements.dropdownScenariosBtn) {
    elements.dropdownScenariosBtn?.addEventListener('click', () => {
      elements.chatDropdownMenu.classList.remove('active');
      openModal(elements.scenarioModal);
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

  // Переключатель Защиты Реализма
  elements.realismToggle?.addEventListener('click', () => {
    state.realismMode = !state.realismMode;
    elements.realismToggle.classList.toggle('active', state.realismMode);
    saveStateToStorage();
  });

  // Управление боковой панелью
  elements.toggleInventoryBtn?.addEventListener('click', () => {
    elements.sidebarDrawer.classList.toggle('collapsed');
  });
  elements.closeDrawerBtn?.addEventListener('click', () => {
    elements.sidebarDrawer.classList.add('collapsed');
  });

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

  // Настройки
  elements.settingsBtn?.addEventListener('click', () => openModal(elements.settingsModal));
  elements.closeSettingsModal?.addEventListener('click', () => closeModal(elements.settingsModal));
  
  // Accordion Items in Fullscreen Settings
  const accordionItems = document.querySelectorAll('.accordion-item[data-provider]');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (header) {
      header.addEventListener('click', () => {
        accordionItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const provider = item.dataset.provider;
        state.engineConfig.mode = provider;
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
      if (elements.contextVal) elements.contextVal.textContent = `${e.target.value} сообщ.`;
    });
  }

  elements.saveSettingsBtn?.addEventListener('click', () => {
    if (elements.geminiKeyInput) state.engineConfig.geminiKey = elements.geminiKeyInput.value.trim();
    if (elements.geminiModelSelect) state.engineConfig.geminiModel = elements.geminiModelSelect.value;
    if (elements.openrouterKeyInput) state.engineConfig.openrouterKey = elements.openrouterKeyInput.value.trim();
    if (elements.openrouterModelInput) state.engineConfig.openrouterModel = elements.openrouterModelInput.value.trim();
    if (elements.serverUrlInput) state.engineConfig.serverUrl = elements.serverUrlInput.value.trim();
    if (elements.openaiBaseUrlInput) state.engineConfig.openaiBaseUrl = elements.openaiBaseUrlInput.value.trim();
    if (elements.apiKeyInput) state.engineConfig.apiKey = elements.apiKeyInput.value.trim();
    if (elements.openaiModelInput) state.engineConfig.openaiModel = elements.openaiModelInput.value.trim();
    if (elements.tempSlider) state.engineConfig.temperature = parseFloat(elements.tempSlider.value);
    if (elements.contextSlider) state.engineConfig.contextLength = parseInt(elements.contextSlider.value);

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
    const finalVal = Math.floor(Math.random() * 20) + 1;
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
  const lang = state.language || 'ru';
  const titleText = typeof scen.title === 'object' ? (scen.title[lang] || scen.title.ru || scen.title.en) : scen.title;
  const introText = typeof scen.intro === 'object' ? (scen.intro[lang] || scen.intro.ru || scen.intro.en) : scen.intro;
  const invList = Array.isArray(scen.inventory) ? scen.inventory : (typeof scen.inventory === 'object' ? (scen.inventory[lang] || scen.inventory.ru || scen.inventory.en || []) : []);
  
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
    memory: state.memory || "Вы — искатель приключений, исследующий древние руины в поисках артефактов.",
    authorNote: state.authorNote || "Мрачное фэнтези, глубокая атмосфера, подробные описания мира.",
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
      const name = parsed.name || parsed.char_name || "Импортированный персонаж";
      const greeting = parsed.greeting || parsed.first_mes || `Вы встречаете ${name}.`;
      const description = parsed.description || parsed.char_persona || "";
      const personality = parsed.personality || parsed.mes_example || "";

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
    const scenTitle = SCENARIOS[chat.scenarioKey]?.title || (chat.scenarioKey === 'custom' ? 'Пользовательский' : chat.scenarioKey);

    card.innerHTML = `
      <div class="chat-card-header">
        <div class="chat-card-title-row">
          <span class="chat-card-title" title="${escapeHTML(chat.title)}">${escapeHTML(chat.title)}</span>
          <span class="chat-card-badge">${msgCount} сообщ.</span>
        </div>
        <div class="chat-card-actions">
          <button class="chat-card-btn rename-btn" title="Переименовать сессию">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button class="chat-card-btn delete-btn" title="Удалить сессию">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
      <div class="chat-card-preview">${escapeHTML(lastPreview)}</div>
      <div class="chat-card-footer">
        <span>Мир: ${escapeHTML(scenTitle)}</span>
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
  if (count % 10 === 1 && count % 100 !== 11) return 'предмет';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'предмета';
  return 'предметов';
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

  const timer = setInterval(() => {
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
      content.innerHTML = `${escapeHTML(currentText)}<br><span class="dice-badge ${block.diceCategory || ''}">🎲 d20: ${block.diceVal} — ${escapeHTML(block.diceLabel)}</span>`;
    } else {
      if (isAI && block.animateTypewriter) {
        delete block.animateTypewriter;
        setTimeout(() => animateTypewriter(content, currentText), 50);
      } else {
        content.textContent = currentText;
      }
    }

    content.addEventListener('dblclick', () => enableInlineEdit(content, index));
    bubble.appendChild(content);

    // Character.AI Action Toolbar for AI Messages
    if (isAI) {
      const toolbar = document.createElement('div');
      toolbar.className = 'msg-action-toolbar';

      // TTS Sound Speaker button
      const ttsBtn = document.createElement('button');
      ttsBtn.className = 'msg-action-btn';
      ttsBtn.title = 'Озвучить';
      ttsBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
      ttsBtn.onclick = (e) => { e.stopPropagation(); speakAIText(currentText); };
      toolbar.appendChild(ttsBtn);

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

      // Swipes Counter & Navigation (‹ 1/3 ›)
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

// Озвучивание речи (TTS)
function speakAIText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const clean = text.replace(/[*#_`>]/g, '').trim();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = 'ru-RU';
  u.rate = 1.0;
  window.speechSynthesis.speak(u);
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
    let newText = "";
    if (state.engineConfig.mode === 'gemini') {
      newText = await fetchGeminiContinuation();
    } else if (state.engineConfig.mode === 'openrouter') {
      newText = await fetchOpenRouterContinuation();
    } else if (state.engineConfig.mode === 'openai') {
      newText = await fetchOpenAIContinuation();
    } else {
      throw new Error(state.language === 'ru' ? 'Ошибка генерации варианта. Проверьте API ключ.' : 'Swipe generation error. Check API configuration.');
    }

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
    updateUIState();
    elements.typingIndicator.style.display = 'none';
    state.history.push({
      id: Date.now(),
      type: 'system',
      text: validation.reason,
      timestamp: new Date().toLocaleTimeString()
    });
    elements.promptInput.value = '';
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
    let aiResponseText = "";

    if (state.engineConfig.mode === 'gemini') {
      aiResponseText = await fetchGeminiContinuation();
    } else if (state.engineConfig.mode === 'openrouter') {
      aiResponseText = await fetchOpenRouterContinuation();
    } else if (state.engineConfig.mode === 'openai') {
      aiResponseText = await fetchOpenAIContinuation();
    } else {
      // Default to g4f Backend API
      aiResponseText = await fetchG4FContinuation();
    }

    aiResponseText = sanitizeAIResponseText(aiResponseText);
    parseItemsFromAIText(aiResponseText);

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
        const bad = ['-tts', 'embedding', 'imagen', 'bison', 'aqa'];
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
  if (userModel && userModel !== 'auto' && !['-tts', 'embedding', 'imagen'].some(bad => userModel.toLowerCase().includes(bad))) {
    candidateModels.push(userModel);
  }

  if (discoveredModels.length > 0) {
    candidateModels.push(...discoveredModels);
  }

  const fallbackDefaults = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-2.0-flash-exp',
    'gemini-2.0-flash',
    'gemini-1.5-pro',
    'gemini-1.5-pro-latest',
    'gemini-1.0-pro',
    'gemini-pro'
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
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text) {
          console.log(`[Gemini API Success] Model: ${model}`);
          return data.candidates[0].content.parts[0].text.trim();
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        lastError = errData.error?.message || response.statusText;
        
        // Если ошибка говорит о невалидном API ключе — прерываем цикл немедленно!
        if (response.status === 400 || response.status === 403 || (lastError && (lastError.includes('API key') || lastError.includes('INVALID_ARGUMENT') || lastError.includes('PERMISSION_DENIED')))) {
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
  throw new Error(`Gemini API: ${lastError}`);
}


// Запрос к OpenRouter API
async function fetchOpenRouterContinuation() {
  const apiKey = state.engineConfig.openrouterKey;
  if (!apiKey) throw new Error("Укажите API Ключ OpenRouter в Настройках.");

  const model = state.engineConfig.openrouterModel || "meta-llama/llama-3-70b-instruct";
  const promptContext = constructAIPrompt();

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://odai.app',
      'X-Title': 'OdAI RPG App'
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: "user", content: promptContext }],
      temperature: state.engineConfig.temperature || 0.8,
      max_tokens: 2048
    })
  });

  const data = await response.json();
  if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
    return data.choices[0].message.content.trim();
  }
  if (data.error) throw new Error(`OpenRouter: ${data.error.message || JSON.stringify(data.error)}`);
  throw new Error("Неверный ответ от OpenRouter API");
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

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      model: model,
      messages: [{ role: "user", content: promptContext }],
      temperature: state.engineConfig.temperature || 0.8,
      max_tokens: 2048
    })
  });

  const data = await response.json();
  if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
    return data.choices[0].message.content.trim();
  }
  if (data.error) throw new Error(`API Error: ${data.error.message || JSON.stringify(data.error)}`);
  throw new Error("Неверный ответ от API сервера");
}

// Формирование промпта для внешних ИИ

// Гарантия законченности текста ответа ИИ (без обрывов на полуслове)
function sanitizeAIResponseText(text) {
  if (!text) return "";
  let cleaned = text.trim();

  // Находим последнюю законченную пунктуацию
  const lastDot = Math.max(
    cleaned.lastIndexOf('.'),
    cleaned.lastIndexOf('!'),
    cleaned.lastIndexOf('?'),
    cleaned.lastIndexOf('»'),
    cleaned.lastIndexOf('"')
  );

  if (lastDot > 0 && lastDot < cleaned.length - 1) {
    const trailingFragment = cleaned.slice(lastDot + 1).trim();
    if (trailingFragment && !/[.!?»"]$/.test(trailingFragment)) {
      console.log(`[Sanitizer] Trimming trailing incomplete sentence fragment: "${trailingFragment}"`);
      cleaned = cleaned.slice(0, lastDot + 1);
    }
  }

  return cleaned.trim();
}

function constructAIPrompt() {
  const lang = state.language || 'en';
  let prompt = "";

  if (lang === 'es') {
    prompt = `Eres un Dungeon Master y narrador para un juego interactivo de rol en español.
`;
    prompt += `Escenario del Mundo: ${state.currentScenarioKey}
`;
    if (state.memory) prompt += `Memoria del Mundo (Recordar): ${state.memory}
`;
    if (state.authorNote) prompt += `Estilo de Escritura: ${state.authorNote}
`;
    prompt += `Inventario del Jugador: ${state.inventory.join(', ')}

`;
    prompt += `Historia hasta ahora:
`;

    const recentHistory = state.history.slice(-10);
    recentHistory.forEach(b => {
      if (b.diceVal && b.diceLabel) {
        prompt += `${b.text} (🎲 [Resultado d20: ${b.diceVal} de 20 — ${b.diceLabel.toUpperCase()}])
`;
      } else {
        prompt += `${b.text}
`;
      }
    });

    prompt += `
SINTAXIS DEL JUGADOR:
- *texto en asteriscos* — acción del jugador y narración.
- (texto en paréntesis) — aclaración OOC.
- texto plano / "entre comillas" — diálogo del personaje.
`;
    prompt += `
IMPORTANTE: Continúa la historia naturalmente en español con 2-4 oraciones completas. ¡Termina siempre las oraciones con puntuación!`;
  } else if (lang === 'uk') {
    prompt = `Ви — ведучий майстер (Dungeon Master) та оповідач для інтерактивної рольової гри українською мовою.
`;
    prompt += `Сценарій Світу: ${state.currentScenarioKey}
`;
    if (state.memory) prompt += `Пам'ять Світу (Пам'ятати): ${state.memory}
`;
    if (state.authorNote) prompt += `Стиль Написання: ${state.authorNote}
`;
    prompt += `Інвентар Гравця: ${state.inventory.join(', ')}

`;
    prompt += `Історія до цього моменту:
`;

    const recentHistory = state.history.slice(-10);
    recentHistory.forEach(b => {
      if (b.diceVal && b.diceLabel) {
        prompt += `${b.text} (🎲 [Результат кубика d20: ${b.diceVal} з 20 — ${b.diceLabel.toUpperCase()}])
`;
      } else {
        prompt += `${b.text}
`;
      }
    });

    prompt += `
СИНТАКСИС ГРАВЦЯ:
- *текст у зірочках* — дія гравця та опис.
- (текст у дужках) — позарольове (OOC) уточнення.
- звичайний текст / "у лапках" — репліка персонажа.
`;
    prompt += `
ВАЖЛИВО: Продовжуйте історію природно українською мовою у 2-4 закінчених реченнях. Обов'язково ставте крапку в кінці!`;
  } else if (lang === 'ru') {
    prompt = `Вы — ведущий мастер (Dungeon Master) и персонаж для интерактивного ролевого отыгрыша (Roleplay) на русском языке.
`;
    prompt += `Сценарий мира: ${state.currentScenarioKey}
`;
    if (state.memory) prompt += `Память мира (Remember): ${state.memory}
`;
    if (state.authorNote) prompt += `Стиль написания: ${state.authorNote}
`;
    prompt += `Инвентарь игрока: ${state.inventory.join(', ')}

`;
    prompt += `История до этого момента:
`;

    const recentHistory = state.history.slice(-10);
    recentHistory.forEach(b => {
      if (b.diceVal && b.diceLabel) {
        prompt += `${b.text} (🎲 [Результат кубика d20: ${b.diceVal} из 20 — ${b.diceLabel.toUpperCase()}])
`;
      } else {
        prompt += `${b.text}
`;
      }
    });

    prompt += `
ФОРМАТИРОВАНИЕ СООБЩЕНИЙ ИГРОКА:
- *текст в звездочках* — действия и описание персонажа игрока.
- (текст в скобках) — внеролевое (OOC) уточнение.
- обычный текст или "текст в кавычках" — реплика персонажа.
`;
    prompt += `
ВАЖНО: Продолжите историю естественно на русском языке в 2-4 законченных предложениях. Обязательно ставьте точку в конце!`;
  } else {
    prompt = `You are a Dungeon Master and storyteller for an interactive roleplay game in English.
`;
    prompt += `Setting Scenario: ${state.currentScenarioKey}
`;
    if (state.memory) prompt += `World Memory (Remember): ${state.memory}
`;
    if (state.authorNote) prompt += `Writing Style: ${state.authorNote}
`;
    prompt += `Player Inventory: ${state.inventory.join(', ')}

`;
    prompt += `Story History so far:
`;

    const recentHistory = state.history.slice(-10);
    recentHistory.forEach(b => {
      if (b.diceVal && b.diceLabel) {
        prompt += `${b.text} (🎲 [d20 Roll Result: ${b.diceVal} of 20 — ${b.diceLabel.toUpperCase()}])
`;
      } else {
        prompt += `${b.text}
`;
      }
    });

    prompt += `
PLAYER SYNTAX:
- *text in asterisks* — player action and character narration.
- (text in parentheses) — OOC clarification or instruction.
- plain text / "in quotes" — character dialogue and speech.
`;
    prompt += `
IMPORTANT: Continue the story naturally in English with 2-4 complete sentences. Always end sentences with punctuation!`;
  }

  return prompt;
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
  if (elements.geminiModelSelect) elements.geminiModelSelect.value = state.engineConfig.geminiModel || 'gemini-1.5-flash';
  if (elements.openrouterKeyInput) elements.openrouterKeyInput.value = state.engineConfig.openrouterKey || '';
  if (elements.openrouterModelInput) elements.openrouterModelInput.value = state.engineConfig.openrouterModel || 'meta-llama/llama-3-70b-instruct';
  if (elements.serverUrlInput) elements.serverUrlInput.value = state.engineConfig.serverUrl || '';
  if (elements.openaiBaseUrlInput) elements.openaiBaseUrlInput.value = state.engineConfig.openaiBaseUrl || 'https://api.openai.com/v1';
  if (elements.apiKeyInput) elements.apiKeyInput.value = state.engineConfig.apiKey || '';
  if (elements.openaiModelInput) elements.openaiModelInput.value = state.engineConfig.openaiModel || 'gpt-4o';
  
  if (elements.tempSlider) {
    elements.tempSlider.value = state.engineConfig.temperature || 0.8;
    if (elements.tempVal) elements.tempVal.textContent = state.engineConfig.temperature || 0.8;
  }
  if (elements.contextSlider) {
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
}

// Проверка подключения к ИИ
async function testAIConnection() {
  if (!elements.connectionStatusBadge) return;

  elements.connectionStatusBadge.style.display = 'inline-flex';
  elements.connectionStatusBadge.className = 'connection-status-badge loading';
  elements.connectionStatusBadge.textContent = '⏳ Проверка соединения...';

  const startTime = Date.now();

  try {
    const provider = state.engineConfig.mode || 'gemini';
    let resText = '';

    if (provider === 'gemini') {
      resText = await fetchGeminiContinuation();
    } else if (provider === 'openrouter') {
      resText = await fetchOpenRouterContinuation();
    } else if (provider === 'openai') {
      resText = await fetchOpenAIContinuation();
    } else if (provider === 'g4f') {
      resText = await fetchG4FContinuation();
    } else {
      resText = "Встроенный офлайн-движок готов к работе.";
    }

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
      const lang = state.language || 'ru';
      str = str[lang] || str.ru || str.en || JSON.stringify(str);
    } else {
      str = String(str);
    }
  }
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Запуск приложения
// Прямой запуск инициализации
init();
