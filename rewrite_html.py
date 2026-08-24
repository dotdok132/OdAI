import re

with open('index.html', 'r') as f:
    content = f.read()

# Replace header part
header_start = content.find('  <!-- Top App Header')
app_container_end = content.find('  <!-- Scenario Selector Modal -->') - 6 # roughly before this

# We need to be careful. I will use regex or find/replace for specific chunks.

chunk1_target = """  <!-- Top App Header — Character.AI Style with Character Avatar & Status -->
  <header class="app-header">
    <div class="cai-header-left">
      <button class="btn-icon" id="chats-archive-btn" title="История и Персонажи">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>

      <div class="cai-character-profile" id="header-character-profile">
        <div class="cai-avatar-wrapper">
          <div class="cai-avatar-img" id="header-avatar-img">AI</div>
          <div class="cai-avatar-status"></div>
        </div>
        <div class="cai-character-info">
          <div class="cai-character-name" id="header-character-name">OdAI Master</div>
          <div class="cai-character-sub" id="header-character-sub">Интерактивный D&D Ведущий</div>
        </div>
      </div>
    </div>

    <div class="header-actions">
      <!-- Realism Guard Toggle -->
      <div class="toggle-wrapper active" id="realism-toggle" title="Блокирует невозможные действия">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span class="header-btn-text">Защита</span>
        <div class="toggle-switch"></div>
      </div>

      <button class="btn-icon" id="toggle-inventory-btn" title="Инвентарь и Память">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <span class="header-btn-text" id="inventory-badge-count">Инвентарь</span>
      </button>

      <button class="btn-icon" id="scenarios-btn" title="Сменить мир / Персонажа">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <span class="header-btn-text">Миры</span>
      </button>

      <button class="btn-icon" id="settings-btn" title="Настройки ИИ Движка">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        <span class="header-btn-text">Настройки</span>
      </button>

      <button class="btn-primary" id="new-story-btn" title="Новый чат">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span class="header-btn-text">Новый</span>
      </button>
    </div>
  </header>"""

chunk1_replacement = """  <!-- View: Chat List (Main Screen) -->
  <div id="view-chat-list" class="view-screen active">
    <header class="app-header">
      <div class="logo-container">
        <span class="logo-title">OdAI</span>
      </div>
      <div class="header-actions">
        <button class="btn-icon" id="main-settings-btn" title="Настройки">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </button>
      </div>
    </header>
    
    <div class="chats-archive-list" id="main-chats-list" style="padding: 1rem; overflow-y: auto; flex: 1;">
      <!-- Rendered dynamically -->
    </div>
    
    <button class="fab-new-chat" id="fab-new-chat-btn">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    </button>
    
    <div style="display: flex; gap: 0.5rem; padding: 0.75rem 1.25rem; border-top: 1px solid var(--border-subtle); background: var(--bg-surface);">
      <button class="btn-tool" id="export-json-btn" style="flex: 1; font-size: 0.78rem; justify-content: center;">📥 Экспорт JSON</button>
      <button class="btn-tool" id="export-txt-btn" style="flex: 1; font-size: 0.78rem; justify-content: center;">📄 Экспорт Текст</button>
      <input type="file" id="import-backup-file" accept=".json" style="display: none;">
      <button class="btn-tool" id="import-backup-btn" style="flex: 1; font-size: 0.78rem; justify-content: center;">📤 Импорт Бэкапа</button>
    </div>
  </div>

  <!-- View: Active Chat Screen -->
  <div id="view-chat" class="view-screen" style="display: none;">
    <!-- Top App Header — Chat Screen -->
    <header class="app-header">
      <div class="cai-header-left">
        <button class="btn-icon" id="back-to-list-btn" title="Назад к чатам" style="margin-right: 0.25rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>

        <div class="cai-character-profile" id="header-character-profile">
          <div class="cai-avatar-wrapper">
            <div class="cai-avatar-img" id="header-avatar-img">AI</div>
            <div class="cai-avatar-status"></div>
          </div>
          <div class="cai-character-info">
            <div class="cai-character-name" id="header-character-name">OdAI Master</div>
            <div class="cai-character-sub" id="header-character-sub">Интерактивный D&D Ведущий</div>
          </div>
        </div>
      </div>

      <div class="header-actions">
        <!-- 3-Dots Menu Button -->
        <button class="btn-icon" id="chat-menu-btn" title="Меню чата">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></svg>
        </button>
        
        <!-- Chat Dropdown Menu (hidden by default) -->
        <div class="chat-dropdown-menu" id="chat-dropdown-menu">
          <button class="dropdown-item" id="dropdown-inventory-btn">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
             Инвентарь и Память
          </button>
          <div class="dropdown-item" id="dropdown-realism-toggle" style="justify-content: space-between;">
            <span style="display:flex; align-items:center; gap:0.5rem;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Защита</span>
            <div class="toggle-wrapper active" id="realism-toggle" style="padding:0; border:none; background:transparent;"><div class="toggle-switch"></div></div>
          </div>
          <button class="dropdown-item" id="dropdown-scenarios-btn">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
             Сменить мир
          </button>
        </div>
      </div>
    </header>"""

content = content.replace(chunk1_target, chunk1_replacement)

# End of view-chat
chunk2_target = """        </div>
      </div>
    </main>

  </div>

  <!-- Scenario Selector Modal -->"""

chunk2_replacement = """        </div>
      </div>
    </main>

  </div>
  </div> <!-- end of view-chat -->

  <!-- Scenario Selector Modal -->"""

content = content.replace(chunk2_target, chunk2_replacement)

# Remove Archive modal
archive_modal_regex = re.compile(r'  <!-- Chat History Archive Modal \(Character\.AI Style\) -->.*?</div>\s*</div>\s*</div>', re.DOTALL)
content = archive_modal_regex.sub('  <!-- Archive modal replaced by view-chat-list -->', content)

with open('index.html', 'w') as f:
    f.write(content)

