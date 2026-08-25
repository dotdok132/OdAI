const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 800 } });

  await page.goto('http://localhost:8080');
  await page.waitForTimeout(1000);

  await page.evaluate(() => {
    if (typeof showView === 'function') {
      showView('view-chat');
    }
  });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: '/home/dotdok/.gemini/antigravity/brain/2568b0a2-a4d8-43fa-81d4-736a343d03df/scratch/pc_chat_header_fixed.png' });
  console.log('Screenshot saved to pc_chat_header_fixed.png');
  await browser.close();
})();
