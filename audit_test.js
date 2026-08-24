const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

console.log('=== STARTING ODAI AUTOMATED AUDIT & TEST SUITE ===\n');

let html = fs.readFileSync('/home/dotdok/.gemini/antigravity/scratch/OdAI/index.html', 'utf8');
html = html.replace(/<script src="app\.js[^"]*"><\/script>/, '');

const appJs = fs.readFileSync('/home/dotdok/.gemini/antigravity/scratch/OdAI/app.js', 'utf8');

const errors = [];

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  url: "http://localhost/"
});

const { window } = dom;
const { document } = window;

// Mock localStorage
const storage = {};
window.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => storage[k] = v,
  removeItem: (k) => delete storage[k]
};

// Catch uncaught exceptions
window.addEventListener('error', (e) => {
  const errStr = e.error ? (e.error.stack || e.error.message) : e.message;
  console.error('❌ [UNCAUGHT EXCEPTION]:', errStr);
  errors.push(errStr);
});

// Inject app.js
console.log('[TEST 1] Testing app.js initialization & syntax...');
try {
  const scriptEl = document.createElement('script');
  scriptEl.textContent = appJs;
  document.body.appendChild(scriptEl);
  console.log('  ✅ app.js loaded and executed init() without throwing uncaught errors.');
} catch (e) {
  console.error('  ❌ Failure loading app.js:', e);
  errors.push(e.message);
}

// -------------------------------------------------------------
// TEST 2: Screen Navigation (view-chat-list <-> view-chat)
// -------------------------------------------------------------
console.log('\n[TEST 2] Testing Screen Navigation (view-chat-list <-> view-chat)...');

const viewChatList = document.getElementById('view-chat-list');
const viewChat = document.getElementById('view-chat');
const backToListBtn = document.getElementById('back-to-list-btn');

console.log('  Initial state:');
console.log('    view-chat-list active:', viewChatList.classList.contains('active'));
console.log('    view-chat active:', viewChat.classList.contains('active'));

if (!viewChatList.classList.contains('active')) {
  errors.push('Initial screen is not view-chat-list');
} else {
  console.log('  ✅ view-chat-list is active initially.');
}

// -------------------------------------------------------------
// TEST 3: Scenario Selector Modal & Chat Creation
// -------------------------------------------------------------
console.log('\n[TEST 3] Testing Scenario Selector Modal & New Chat Creation...');

const fabBtn = document.getElementById('fab-new-chat-btn');
const scenarioModal = document.getElementById('scenario-modal');

if (!fabBtn) {
  errors.push('FAB button #fab-new-chat-btn not found');
} else {
  console.log('  Clicking FAB button (+)...');
  fabBtn.click();
  console.log('    scenario-modal active after FAB click:', scenarioModal.classList.contains('active'));
  if (!scenarioModal.classList.contains('active')) {
    errors.push('scenario-modal did not open on FAB click');
  } else {
    console.log('  ✅ scenario-modal opened successfully.');
  }
}

// Click on scenario card 'zombie'
const zombieCard = document.querySelector('.scenario-card[data-scenario="zombie"]');
if (!zombieCard) {
  errors.push('Scenario card "zombie" not found');
} else {
  console.log('  Clicking "Зомби Апокалипсис" scenario card...');
  zombieCard.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
  
  console.log('    scenario-modal active after selection:', scenarioModal.classList.contains('active'));
  console.log('    view-chat-list active after selection:', viewChatList.classList.contains('active'));
  console.log('    view-chat active after selection:', viewChat.classList.contains('active'));

  if (scenarioModal.classList.contains('active')) {
    errors.push('scenario-modal remained active after scenario selection');
  }
  if (!viewChat.classList.contains('active')) {
    errors.push('view-chat did not activate after scenario selection');
  } else {
    console.log('  ✅ Navigated to view-chat after scenario selection.');
  }
}

// Now test navigation BACK to list
console.log('  Testing Navigation BACK to chat list...');
if (!backToListBtn) {
  errors.push('#back-to-list-btn not found');
} else {
  backToListBtn.click();
  console.log('    view-chat-list active after Back click:', viewChatList.classList.contains('active'));
  console.log('    view-chat active after Back click:', viewChat.classList.contains('active'));
  if (!viewChatList.classList.contains('active')) {
    errors.push('view-chat-list did not activate after Back click');
  } else {
    console.log('  ✅ Navigated back to view-chat-list.');
  }
}

// Re-open chat to test AI generation
const mainChatsList = document.getElementById('main-chats-list');
const firstChatCard = mainChatsList.querySelector('.chat-card');
if (firstChatCard) {
  firstChatCard.click();
  console.log('  Re-opened chat session via list click.');
}

// -------------------------------------------------------------
// TEST 4: AI Generation & Timeout Fallback
// -------------------------------------------------------------
console.log('\n[TEST 4] Testing AI Generation & Offline/Timeout Fallback...');

const promptInput = document.getElementById('prompt-input');
const sendBtn = document.getElementById('send-btn');
const storyFeed = document.getElementById('story-feed');
const typingIndicator = document.getElementById('typing-indicator');

const msgCountBefore = storyFeed.querySelectorAll('.chat-message').length;
console.log('  Story feed message count before prompt:', msgCountBefore);

promptInput.value = 'Осмотреть заброшенный магазин';
console.log('  Submitting action: "Осмотреть заброшенный магазин"...');

sendBtn.click();

console.log('  Immediately after send click:');
console.log('    isGenerating indicator visible:', typingIndicator.style.display !== 'none');
console.log('    sendBtn disabled class present:', sendBtn.classList.contains('disabled'));

// Wait for async validation & AI response generation to complete
setTimeout(() => {
  const msgCountAfter = storyFeed.querySelectorAll('.chat-message').length;
  console.log('\n  After AI generation finishes (2.2s delay):');
  console.log('    Story feed message count after AI response:', msgCountAfter);
  
  const messages = Array.from(storyFeed.querySelectorAll('.chat-message'));
  messages.forEach((m, idx) => {
    const textEl = m.querySelector('.chat-bubble-content');
    console.log(`    Msg #${idx + 1} [${m.className}]: ${textEl ? textEl.textContent.trim().slice(0, 80) : ''}...`);
  });

  console.log('    typingIndicator hidden:', typingIndicator.style.display === 'none');
  console.log('    sendBtn restored:', !sendBtn.classList.contains('disabled'));

  if (msgCountAfter <= msgCountBefore) {
    errors.push('AI response was not added to story feed');
  } else {
    console.log('  ✅ AI response successfully generated and rendered!');
  }

  // -------------------------------------------------------------
  // SUMMARY REPORT
  // -------------------------------------------------------------
  console.log('\n================ SUMMARY ================');
  if (errors.length === 0) {
    console.log('🎉 ALL AUTOMATED FRONTEND & RUNTIME TESTS PASSED SUCCESSFULLY!');
  } else {
    console.log(`❌ ENCOUNTERED ${errors.length} ERROR(S):`);
    errors.forEach((err, i) => console.log(`   ${i + 1}. ${err}`));
  }
  process.exit(errors.length > 0 ? 1 : 0);
}, 2200);
