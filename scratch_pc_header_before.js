const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 800 } });

  await page.goto('http://localhost:8080');
  await page.waitForTimeout(1000);

  // Click on fantasy scenario if visible or create chat
  const fantasyCard = page.locator('.scenario-card[data-scenario="fantasy"]');
  if (await fantasyCard.isVisible()) {
    await fantasyCard.click();
    await page.waitForTimeout(500);
  } else {
    // Click on first chat in list
    const firstChat = page.locator('.chat-card-item').first();
    if (await firstChat.isVisible()) {
      await firstChat.click();
      await page.waitForTimeout(500);
    }
  }

  await page.screenshot({ path: '/home/dotdok/.gemini/antigravity/brain/2568b0a2-a4d8-43fa-81d4-736a343d03df/scratch/pc_header_before.png' });

  // Get info about header
  const headerInfo = await page.evaluate(() => {
    const header = document.querySelector('#view-chat .app-header');
    const nameEl = document.querySelector('#header-character-name');
    const subEl = document.querySelector('#header-character-sub');
    if (!header) return null;
    const style = window.getComputedStyle(header);
    const nameStyle = window.getComputedStyle(nameEl);
    return {
      headerBg: style.backgroundColor,
      headerWidth: style.width,
      nameText: nameEl ? nameEl.textContent : '',
      nameMaxWidth: nameStyle.maxWidth,
      nameScrollWidth: nameEl ? nameEl.scrollWidth : 0,
      nameClientWidth: nameEl ? nameEl.clientWidth : 0
    };
  });

  console.log('Header audit before fix:', headerInfo);
  await browser.close();
})();
