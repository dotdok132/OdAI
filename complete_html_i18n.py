with open('index.html', 'r') as f:
    html = f.read()

replacements = {
    '<span style="display:flex; align-items:center; gap:0.5rem;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Защита</span>': '<span style="display:flex; align-items:center; gap:0.5rem;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> <span data-i18n="realismGuard">Realism Guard</span></span>',
    'Сменить мир\n          </button>': '<span data-i18n="changeScenario">Change World</span>\n          </button>',
    'Инвентарь и Память\n        </span>': '<span data-i18n="inventoryTitle">Inventory & Memory</span>\n        </span>',
    'Инвентарь и Память\n          </button>': '<span data-i18n="inventoryTitle">Inventory & Memory</span>\n          </button>',
    'Предметы в инвентаре</div>': 'Предметы в инвентаре</div>' if 'data-i18n=' in html else '<div class="drawer-section-title" data-i18n="inventoryLabel">Inventory Items</div>',
    'id="add-item-btn">Добавить</button>': 'id="add-item-btn" data-i18n="addBtn">Add</button>',
    'Память мира (Remember)</div>': '<div class="drawer-section-title" data-i18n="memoryLabel">World Memory (Remember)</div>',
    'Заметка автора (Стиль)</div>': '<div class="drawer-section-title" data-i18n="authorNoteLabel">Author\'s Note (Style & Tone)</div>',
    'id="tool-undo-btn">Отмена</button>': 'id="tool-undo-btn" data-i18n="undoBtn">Undo</button>',
    'id="tool-retry-btn">Повтор</button>': 'id="tool-retry-btn" data-i18n="retryBtn">Retry</button>',
    'id="tool-erase-btn">Стереть</button>': 'id="tool-erase-btn" data-i18n="eraseBtn">Erase</button>',
    '<h2>Выберите ваш мир</h2>': '<h2 data-i18n="scenarioModalTitle">Choose Your World</h2>',
    'id="start-custom-scenario-btn">Начать свой мир</button>': 'id="start-custom-scenario-btn" data-i18n="startCustomBtn">Start Custom World</button>',
    '<h2>Импорт персонажа из Character.AI / Карточки</h2>': '<h2 data-i18n="caiTitle">Import Character from Character.AI / Card</h2>',
    'id="do-cai-import-btn">Импорт</button>': 'id="do-cai-import-btn" data-i18n="caiBtn">Import</button>'
}

for old_str, new_str in replacements.items():
    if old_str in html:
        html = html.replace(old_str, new_str)

with open('index.html', 'w') as f:
    f.write(html)

print("Full HTML data-i18n attributes updated.")
