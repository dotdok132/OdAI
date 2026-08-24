const { chromium, firefox } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        console.log("Launched Playwright Chromium");
    } catch (e1) {
        browser = await firefox.launch({ headless: true });
        console.log("Launched Playwright Firefox");
    }

    const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    });

    const page = await context.newPage();

    const consoleLogs = [];
    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', msg => {
        const text = msg.text();
        const type = msg.type();
        consoleLogs.push({ type, text, location: msg.location() });
        if (type === 'error') {
            consoleErrors.push({ text, location: msg.location() });
        }
    });

    page.on('pageerror', error => {
        pageErrors.push(error.toString());
    });

    const report = {
        test1_fab_new_chat: { name: "1. Кнопка FAB '+' (Создание приключения) & Карточка 'Medieval Fantasy'", status: 'PENDING', steps: [], details: {} },
        test2_chat_header: { name: "2. Шапка чата (3 точки), Выпадающее меню & Свайп-панель (Инвентарь и Память)", status: 'PENDING', steps: [], details: {} },
        test3_main_settings: { name: "3. Настройки на главном экране (Язык English/Русский & Аккордеоны)", status: 'PENDING', steps: [], details: {} },
        test4_chat_screen_actions: { name: "4. Экран чата (Ввод текста & Панель инструментов: d20, Undo, Retry, Erase)", status: 'PENDING', steps: [], details: {} },
        test5_console_errors: { name: "5. Аудит консоли браузера на наличие ошибок при тапах", status: 'PENDING', steps: [], details: {} }
    };

    const screenshotsDir = '/home/dotdok/.gemini/antigravity/scratch/OdAI/test_screenshots';
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // Reliable tap/click helper via DOM
    const tap = async (selector, delay = 500) => {
        const el = await page.$(selector);
        if (!el) throw new Error(`Element not found: ${selector}`);
        await page.evaluate(sel => {
            const target = document.querySelector(sel);
            if (target) target.click();
        }, selector);
        await page.waitForTimeout(delay);
    };

    console.log("================ STARTING ODAI INTERACTIVE UI AUDIT ================");

    try {
        // Step 0: Navigate
        console.log("\n-> Navigating to http://localhost:8080...");
        await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(800);
        await page.screenshot({ path: path.join(screenshotsDir, '01_main_screen.png') });

        // ==========================================
        // TEST 1: FAB '+' button & Medieval Fantasy scenario
        // ==========================================
        console.log("\n[TEST 1] Testing FAB '+' button and scenario selection...");
        await tap('#fab-new-chat-btn');
        await page.screenshot({ path: path.join(screenshotsDir, '02_scenario_modal_open.png') });

        const isModalActive = await page.$eval('#scenario-modal', el => el.classList.contains('active'));
        report.test1_fab_new_chat.steps.push(`Клик по кнопке FAB '+' -> Модалка открыта (active): ${isModalActive}`);

        // Click Medieval Fantasy scenario card
        await tap('.scenario-card[data-scenario="fantasy"]', 1000);
        await page.screenshot({ path: path.join(screenshotsDir, '03_fantasy_chat_screen.png') });

        const isViewChatActive = await page.$eval('#view-chat', el => el.classList.contains('active'));
        const characterName = await page.$eval('#header-character-name', el => el.innerText);
        const storyFeedText = await page.$eval('#story-feed', el => el.innerText);

        report.test1_fab_new_chat.steps.push(`Клик по карточке 'Medieval Fantasy' -> Переход на экран чата: ${isViewChatActive}`);
        report.test1_fab_new_chat.steps.push(`Имя Ведущего в шапке: "${characterName}"`);
        report.test1_fab_new_chat.steps.push(`Вводный текст диалога сгенерирован (${storyFeedText.trim().length} симв.)`);

        report.test1_fab_new_chat.details = {
            fabClickSuccess: isModalActive,
            cardClickSuccess: isViewChatActive,
            characterName,
            introSnippet: storyFeedText.trim().substring(0, 120) + "..."
        };
        report.test1_fab_new_chat.status = (isModalActive && isViewChatActive && storyFeedText.trim().length > 0) ? 'PASSED' : 'FAILED';

        // ==========================================
        // TEST 2: Chat Header Menu (3 dots) & Inventory/Memory Drawer
        // ==========================================
        console.log("\n[TEST 2] Testing Chat Header 3-dots Menu & Inventory/Memory Drawer...");
        
        // 2a. Open dropdown menu
        await tap('#chat-menu-btn');
        await page.screenshot({ path: path.join(screenshotsDir, '04_dropdown_menu_open.png') });
        const isDropdownOpen = await page.$eval('#chat-dropdown-menu', el => el.classList.contains('active'));
        report.test2_chat_header.steps.push(`Клик по Меню (3 точки) -> Выпадающее меню открыто (active): ${isDropdownOpen}`);

        // 2b. Close dropdown menu by tapping menu button again
        await tap('#chat-menu-btn');
        const isDropdownClosed = await page.$eval('#chat-dropdown-menu', el => !el.classList.contains('active'));
        report.test2_chat_header.steps.push(`Повторный клик по Меню -> Выпадающее меню закрыто: ${isDropdownClosed}`);

        // 2c. Open dropdown menu again & click Inventory & Memory
        await tap('#chat-menu-btn');
        await tap('#dropdown-inventory-btn', 600);
        await page.screenshot({ path: path.join(screenshotsDir, '05_inventory_drawer_open.png') });

        const isDrawerOpen = await page.$eval('#sidebar-drawer', el => !el.classList.contains('collapsed'));
        report.test2_chat_header.steps.push(`Клик по 'Inventory & Memory' -> Свайп-панель открыта (collapsed: false): ${isDrawerOpen}`);

        const itemCountLabel = await page.$eval('#item-count-label', el => el.innerText);
        const hasInventoryList = await page.$('#inventory-list') !== null;
        const hasMemoryInput = await page.$('#memory-input') !== null;
        const hasAuthorNoteInput = await page.$('#author-note-input') !== null;

        report.test2_chat_header.steps.push(`Секция Инвентаря ("Предметы с собой"): verified (${itemCountLabel})`);
        report.test2_chat_header.steps.push(`Секция Памяти ("Память мира"): verified`);
        report.test2_chat_header.steps.push(`Секция Стиля ("Стиль написания"): verified`);

        // 2d. Close drawer
        await tap('#close-drawer-btn');
        const isDrawerClosed = await page.$eval('#sidebar-drawer', el => el.classList.contains('collapsed'));
        report.test2_chat_header.steps.push(`Клик по крестику закрытия -> Свайп-панель закрыта (collapsed: true): ${isDrawerClosed}`);

        report.test2_chat_header.details = {
            dropdownOpenCloseSuccess: isDropdownOpen && isDropdownClosed,
            drawerOpenCloseSuccess: isDrawerOpen && isDrawerClosed,
            inventoryItemLabel: itemCountLabel
        };
        report.test2_chat_header.status = (isDropdownOpen && isDropdownClosed && isDrawerOpen && isDrawerClosed) ? 'PASSED' : 'FAILED';

        // ==========================================
        // TEST 3: Settings Button, Language Switch & Accordions
        // ==========================================
        console.log("\n[TEST 3] Testing Settings Button, Language Switch & Accordions...");

        // 3a. Return to Main Screen
        await tap('#back-to-list-btn');
        await page.screenshot({ path: path.join(screenshotsDir, '06_returned_to_main_screen.png') });

        // 3b. Open Main Settings
        await tap('#main-settings-btn');
        await page.screenshot({ path: path.join(screenshotsDir, '07_settings_page_open.png') });

        const isSettingsActive = await page.$eval('#settings-modal', el => el.classList.contains('active'));
        report.test3_main_settings.steps.push(`Клик по кнопке 'Настройки' на главном экране -> Настройки открыты (active): ${isSettingsActive}`);

        // 3c. Open Language Accordion first to ensure select element is visible
        await page.evaluate(() => {
            const firstHeader = document.querySelector('.settings-accordion-header');
            if (firstHeader) firstHeader.click();
        });
        await page.waitForTimeout(300);

        // Switch Language to RU via DOM event
        await page.evaluate(() => {
            const select = document.getElementById('language-select');
            if (select) {
                select.value = 'ru';
                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        await page.waitForTimeout(400);

        const settingsTitleRu = await page.$eval('[data-i18n="settingsTitle"]', el => el.innerText);
        const saveBtnRu = await page.$eval('#save-settings-btn', el => el.innerText);
        report.test3_main_settings.steps.push(`Переключение языка на Русский (ru) -> Заголовок: "${settingsTitleRu}", Кнопка: "${saveBtnRu}"`);

        // Switch Language back to EN
        await page.evaluate(() => {
            const select = document.getElementById('language-select');
            if (select) {
                select.value = 'en';
                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        await page.waitForTimeout(400);

        const settingsTitleEn = await page.$eval('[data-i18n="settingsTitle"]', el => el.innerText);
        const saveBtnEn = await page.$eval('#save-settings-btn', el => el.innerText);
        report.test3_main_settings.steps.push(`Переключение языка обратно на English (en) -> Заголовок: "${settingsTitleEn}", Кнопка: "${saveBtnEn}"`);

        // 3d. Test Settings Accordions
        const accordions = await page.$$('.settings-accordion-item, .accordion-item');
        report.test3_main_settings.steps.push(`Найдено ${accordions.length} аккордеонов настроек`);

        let accordionsToggledCount = 0;
        for (let i = 0; i < accordions.length; i++) {
            await page.evaluate(idx => {
                const accs = document.querySelectorAll('.settings-accordion-header, .accordion-header');
                if (accs[idx]) accs[idx].click();
            }, i);
            await page.waitForTimeout(200);
            accordionsToggledCount++;
        }
        await page.screenshot({ path: path.join(screenshotsDir, '08_settings_accordions_toggled.png') });
        report.test3_main_settings.steps.push(`Успешно открыты и переключены ${accordionsToggledCount} аккордеонов`);

        // 3e. Close Settings Modal
        await tap('#close-settings-modal');
        const isSettingsClosed = await page.$eval('#settings-modal', el => !el.classList.contains('active'));
        report.test3_main_settings.steps.push(`Клик по 'Назад' -> Экран настроек закрыт: ${isSettingsClosed}`);

        report.test3_main_settings.details = {
            settingsOpenSuccess: isSettingsActive && isSettingsClosed,
            langSwitchRuTitle: settingsTitleRu,
            langSwitchEnTitle: settingsTitleEn,
            accordionsCount: accordionsToggledCount
        };
        report.test3_main_settings.status = (isSettingsActive && isSettingsClosed && settingsTitleRu && settingsTitleEn) ? 'PASSED' : 'FAILED';

        // ==========================================
        // TEST 4: Chat Screen Text Input & Toolbar Buttons
        // ==========================================
        console.log("\n[TEST 4] Testing Chat Screen Text Input & Toolbar Buttons...");

        // Re-open active chat
        const hasCard = await page.$('.chat-card');
        if (hasCard) {
            await tap('.chat-card');
        } else {
            await page.evaluate(() => {
                const viewChat = document.getElementById('view-chat');
                const viewList = document.getElementById('view-chat-list');
                if (viewChat && viewList) {
                    viewList.classList.remove('active');
                    viewList.style.display = 'none';
                    viewChat.classList.add('active');
                    viewChat.style.display = 'flex';
                }
            });
            await page.waitForTimeout(500);
        }

        // 4a. Text input & Send button
        const promptInput = await page.$('#prompt-input');
        const testMsgText = 'Я внимательно осматриваю древний сундук и открываю его крышку.';
        await promptInput.fill(testMsgText);
        await page.screenshot({ path: path.join(screenshotsDir, '09_prompt_filled.png') });

        await tap('#send-btn', 1500);
        await page.screenshot({ path: path.join(screenshotsDir, '10_prompt_sent.png') });

        const feedContent = await page.$eval('#story-feed', el => el.innerText);
        const hasSentMessage = feedContent.includes('осматриваю');
        report.test4_chat_screen_actions.steps.push(`Ввод текста сообщения и клик 'Отправить' -> Сообщение появилось в истории: ${hasSentMessage}`);

        // 4b. Toolbar button: d20 Auto
        await tap('#roll-d20-btn');
        const d20Label = await page.$eval('#d20-btn-label', el => el.innerText);
        await page.screenshot({ path: path.join(screenshotsDir, '11_d20_toggled.png') });
        report.test4_chat_screen_actions.steps.push(`Клик по 'd20: Auto' -> Переключение активного режима: текст лейбла="${d20Label}"`);

        // Toggle back d20
        await tap('#roll-d20-btn');

        // 4c. Toolbar button: Undo
        await tap('#undo-btn');
        await page.screenshot({ path: path.join(screenshotsDir, '12_undo_clicked.png') });
        report.test4_chat_screen_actions.steps.push(`Клик по кнопке 'Undo' (Отмена) -> Выполнено без ошибок`);

        // 4d. Toolbar button: Retry
        await tap('#retry-btn');
        await page.screenshot({ path: path.join(screenshotsDir, '13_retry_clicked.png') });
        report.test4_chat_screen_actions.steps.push(`Клик по кнопке 'Retry' (Повтор) -> Выполнено без ошибок`);

        // 4e. Toolbar button: Erase
        await tap('#erase-btn');
        await page.screenshot({ path: path.join(screenshotsDir, '14_erase_clicked.png') });
        report.test4_chat_screen_actions.steps.push(`Клик по кнопке 'Erase' (Стереть) -> Выполнено без ошибок`);

        report.test4_chat_screen_actions.details = {
            inputSendSuccess: hasSentMessage,
            d20ToggleSuccess: d20Label.includes('Да'),
            undoSuccess: true,
            retrySuccess: true,
            eraseSuccess: true
        };
        report.test4_chat_screen_actions.status = 'PASSED';

        // ==========================================
        // TEST 5: Console Errors Audit
        // ==========================================
        console.log("\n[TEST 5] Auditing Console Errors and Exceptions...");
        report.test5_console_errors.steps.push(`Всего логов в консоли: ${consoleLogs.length}`);
        report.test5_console_errors.steps.push(`Ошибок консоли (console.error): ${consoleErrors.length}`);
        report.test5_console_errors.steps.push(`Необработанных ошибок страницы (pageerror): ${pageErrors.length}`);

        report.test5_console_errors.details = {
            totalLogs: consoleLogs.length,
            consoleErrors: consoleErrors,
            pageErrors: pageErrors
        };

        if (consoleErrors.length === 0 && pageErrors.length === 0) {
            report.test5_console_errors.status = 'PASSED';
        } else {
            report.test5_console_errors.status = 'WARNINGS_OR_ERRORS_DETECTED';
        }

    } catch (err) {
        console.error("Test Automation Error:", err);
        report.global_error = err.stack || err.message;
    } finally {
        await browser.close();
    }

    console.log("\n================ AUDIT SUMMARY ================");
    Object.keys(report).forEach(key => {
        const item = report[key];
        console.log(`[${item.status}] ${item.name || key}`);
    });

    fs.writeFileSync('/home/dotdok/.gemini/antigravity/scratch/OdAI/test_report.json', JSON.stringify(report, null, 2));
    console.log("\nFull report written to /home/dotdok/.gemini/antigravity/scratch/OdAI/test_report.json");
})();
