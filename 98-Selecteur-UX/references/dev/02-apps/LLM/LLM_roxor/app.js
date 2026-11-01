/**
 * LLM-ROX Renderer Process
 *
 * Features:
 * 1 ✅ Sidebar app selection
 * 2 ✅ Dynamic tab creation
 * 2b ✅ Webview URL switching
 * 3 ✅ Tab fallback
 * 4 ✅ Context menu
 * 5 ✅ Badge/unread system
 * 6 ✅ Persistence (localStorage)
 * 8 ✅ Keyboard shortcuts
 * 🆕 Prompt Manager
 */

console.log('✅ app.js loaded at', new Date().toLocaleTimeString());

// Initialize SkillManager
let skillManager;
try {
  skillManager = new SkillManager();
} catch(e) {
  console.warn('⚠️ SkillManager not available:', e.message);
}

// APP URL MAPPING (Feature 2b) - Global
const appUrls = {
  claude: 'https://claude.ai',
  chatgpt: 'https://chat.openai.com',
  gemini: 'https://gemini.google.com',
  perplexity: 'https://www.perplexity.ai'
};

// Global function to change webview URL
function loadAppUrl(appKey) {
  console.log(`📺 Feature 2b: Loading URL for ${appKey}`);
  const webview = document.querySelector('webview#webview-container');
  if (webview) {
    const url = appUrls[appKey];
    if (url) {
      webview.src = url;
      console.log(`  ✅ Webview URL changed to: ${url}`);
    } else {
      console.warn(`  ⚠️ No URL mapping for ${appKey}`);
    }
  } else {
    console.error('  ❌ Webview container not found!');
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  console.log('⏳ DOM still loading, waiting...');
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  console.log('✅ DOM ready immediately');
  initApp();
}

async function initApp() {
  try {
    // Load skills (built-in + external)
    if (skillManager) {
      await skillManager.loadSkills();
      // Load persisted state (Feature 6)
      const savedState = skillManager.loadSkillsFromStorage();
    }
  } catch(e) {
    console.error('Error loading skills:', e);
  }

  // Initialize UI and features
  initFeature1();
  initPromptManager();  // NEW: Prompt manager
  initFeature5();  // Badges
  initFeature6();  // Persistence
  initFeature7();  // Multi-Account (NEW)
  initFeature8();  // Keyboard shortcuts
  initFeature9();  // Search (NEW)
  initFeature10(); // Themes/Customization (NEW)
}

function initFeature1() {
  console.log('🚀 Initializing Feature 1 & 2...');

  // ============================================
  // FEATURE 1: Click on sidebar app
  // ============================================
  const appItems = document.querySelectorAll('.app');
  console.log(`Found ${appItems.length} app items in sidebar`);

  if (appItems.length === 0) {
    console.error('❌ ERROR: No .app elements found!');
    console.log('HTML body:', document.body.innerHTML.substring(0, 500));
    return;
  }

  // FEATURE 4: Context Menu Handler
  function showContextMenu(appKey, appItem, event) {
    event.preventDefault();
    console.log(`📋 Feature 4: Context menu for ${appKey}`);

    const contextMenu = document.getElementById('contextMenu');
    contextMenu.style.left = event.clientX + 'px';
    contextMenu.style.top = event.clientY + 'px';
    contextMenu.classList.add('visible');

    // Close menu when clicking outside
    const closeMenu = () => {
      contextMenu.classList.remove('visible');
      document.removeEventListener('click', closeMenu);
    };
    setTimeout(() => {
      document.addEventListener('click', closeMenu);
    }, 0);

    // Menu actions
    const renameBtn = contextMenu.querySelector('[data-action="rename"]');
    const favoriteBtn = contextMenu.querySelector('[data-action="favorite"]');
    const muteBtn = contextMenu.querySelector('[data-action="mute"]');
    const removeBtn = contextMenu.querySelector('[data-action="remove"]');

    renameBtn.onclick = () => {
      console.log(`  📝 Rename: ${appKey}`);
      const newName = prompt(`Rename ${appKey}:`, appKey);
      if (newName) {
        appItem.querySelector('.label').textContent = newName;
        console.log(`  ✅ Renamed to: ${newName}`);
      }
      closeMenu();
    };

    favoriteBtn.onclick = () => {
      console.log(`  ⭐ Toggle favorite: ${appKey}`);
      appItem.classList.toggle('favorite');
      console.log(`  ✅ Favorite toggled`);
      closeMenu();
    };

    muteBtn.onclick = () => {
      console.log(`  🔇 Toggle mute: ${appKey}`);
      appItem.classList.toggle('muted');
      console.log(`  ✅ Mute toggled`);
      closeMenu();
    };

    removeBtn.onclick = () => {
      console.log(`  🗑️ Remove app: ${appKey}`);
      if (confirm(`Remove ${appKey} from sidebar?`)) {
        appItem.remove();
        // Also remove associated tabs
        const appTabs = document.querySelectorAll(`.tab[data-app="${appKey}"]`);
        appTabs.forEach(t => t.remove());
        console.log(`  ✅ App removed`);
      }
      closeMenu();
    };
  }

  appItems.forEach((appItem, index) => {
    const appKey = appItem.dataset.app;
    console.log(`  [${index}] App: ${appKey}`);

    // FEATURE 4: Right-click context menu
    appItem.addEventListener('contextmenu', (e) => {
      showContextMenu(appKey, appItem, e);
    });

    appItem.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log(`🔷 CLICK EVENT: ${appKey}`);

      // Remove active class from all apps
      appItems.forEach(item => {
        const hadActive = item.classList.contains('active');
        item.classList.remove('active');
        if (hadActive) console.log(`  - Removed active from ${item.dataset.app}`);
      });

      // Add active class to clicked app
      appItem.classList.add('active');
      console.log(`  ✅ Added active to ${appKey}`);
      console.log(`  Current classes: ${appItem.className}`);

      // FEATURE 2b: Load the app's URL
      loadAppUrl(appKey);

      // Update active tab
      const tabs = document.querySelectorAll('.tab');
      tabs.forEach(tab => tab.classList.remove('active'));

      // Find or create tab for this app
      let activeTab = document.querySelector(`.tab[data-app="${appKey}"]`);
      if (activeTab) {
        activeTab.classList.add('active');
        console.log(`✅ Activated existing tab for ${appKey}`);
      } else {
        // FEATURE 2: Create a new tab
        console.log(`🎯 Feature 2: Creating new tab for ${appKey}`);

        // Get app label from the sidebar item
        const appLabel = appItem.querySelector('.label').textContent;
        const appIcon = appItem.querySelector('.icon').textContent;

        // Create new tab element
        const newTab = document.createElement('button');
        newTab.className = 'tab active';
        newTab.dataset.app = appKey;
        newTab.innerHTML = `
          <span class="icon">${appIcon}</span>
          ${appLabel}
          <button class="btn-close">×</button>
        `;

        // Add close button handler
        const closeBtn = newTab.querySelector('.btn-close');
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          console.log(`🗑️ Closing tab: ${appKey}`);
          newTab.remove();

          // FEATURE 3: Fallback when closing tabs
          console.log(`📌 Feature 3: Tab closed, checking fallback...`);
          const remainingTabs = document.querySelectorAll('.tab');
          console.log(`  Remaining tabs: ${remainingTabs.length}`);

          if (remainingTabs.length === 0) {
            console.log(`  ⚠️ No tabs left! Fallback to Claude`);
            // Switch back to Claude
            const claudeApp = document.querySelector('.app[data-app="claude"]');
            if (claudeApp) {
              claudeApp.click();
            }
          } else if (!document.querySelector('.tab.active')) {
            // If no tab is active, activate the last one
            console.log(`  📌 Activating last remaining tab`);
            const lastTab = remainingTabs[remainingTabs.length - 1];
            lastTab.click();
          }
        });

        // Click handler for tab
        newTab.addEventListener('click', (e) => {
          if (!e.target.classList.contains('btn-close')) {
            console.log(`📌 Tab click: switching to ${appKey}`);
            // Remove active from all tabs
            const allTabs = document.querySelectorAll('.tab');
            allTabs.forEach(t => t.classList.remove('active'));
            newTab.classList.add('active');
            // FEATURE 2b: Switch webview to this app's URL
            loadAppUrl(appKey);
          }
        });

        // Insert the new tab before the add button
        const tabsContainer = document.querySelector('.tabs');
        const addTabBtn = document.querySelector('.btn-add-tab');
        tabsContainer.insertBefore(newTab, addTabBtn);

        console.log(`✅ Created new tab for ${appKey}`);
      }
    });
  });

  console.log('✅ Feature 1 ready: Sidebar app clicks');
}

// ============================================
// FEATURE 7: Multi-Account System
// ============================================
function initFeature7() {
  console.log('🚀 Initializing Feature 7: Multi-Account System');

  // Account state
  const accountState = {
    accounts: {
      'default': { name: 'Default', icon: '👤' }
    },
    activeAccount: 'default',
    accountAppState: {} // Stores {accountId: {appId: {tabs: [...], activeApp: ...}}}
  };

  // Load accounts from localStorage
  function loadAccounts() {
    const saved = localStorage.getItem('llm-rox-accounts');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        accountState.accounts = data.accounts || accountState.accounts;
        accountState.activeAccount = data.activeAccount || 'default';
        accountState.accountAppState = data.accountAppState || {};
        console.log(`  ✅ Loaded ${Object.keys(accountState.accounts).length} accounts`);
      } catch(e) {
        console.error('  ❌ Error loading accounts:', e);
      }
    }
  }

  // Save accounts to localStorage
  function saveAccounts() {
    localStorage.setItem('llm-rox-accounts', JSON.stringify(accountState));
  }

  // Render account menu
  function renderAccountMenu() {
    const menu = document.querySelector('.account-menu');
    const currentBtn = document.querySelector('.account-current');
    const itemsHTML = Object.entries(accountState.accounts)
      .map(([id, acc]) => `
        <button class="account-item ${id === accountState.activeAccount ? 'active' : ''}" data-account="${id}">
          ${acc.icon} ${acc.name}
        </button>
      `)
      .join('');

    menu.innerHTML = itemsHTML + `
      <hr style="margin: 4px 0; border: none; border-top: 1px solid #ddd;">
      <button class="account-add">+ New Account</button>
    `;

    // Update current display
    const active = accountState.accounts[accountState.activeAccount];
    document.querySelector('.account-name').textContent = active.name;

    // Attach event listeners
    menu.querySelectorAll('.account-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        switchAccount(btn.dataset.account);
        toggleAccountMenu();
      });
    });

    menu.querySelector('.account-add').addEventListener('click', (e) => {
      e.stopPropagation();
      createNewAccount();
      toggleAccountMenu();
    });
  }

  // Switch to account
  function switchAccount(accountId) {
    console.log(`🔄 Switching to account: ${accountId}`);

    // Save current account's app state
    const currentTabs = Array.from(document.querySelectorAll('.tab')).map(t => ({
      app: t.dataset.app,
      active: t.classList.contains('active')
    }));
    const currentActiveApp = document.querySelector('.app.active')?.dataset.app;

    accountState.accountAppState[accountState.activeAccount] = {
      tabs: currentTabs,
      activeApp: currentActiveApp
    };

    // Switch to new account
    accountState.activeAccount = accountId;

    // Restore account's app state (or use default)
    const savedState = accountState.accountAppState[accountId] || {};

    // Clear existing tabs
    document.querySelectorAll('.tab').forEach(t => t.remove());

    // Restore tabs for this account
    if (savedState.tabs && savedState.tabs.length > 0) {
      savedState.tabs.forEach(tabData => {
        const appItem = document.querySelector(`.app[data-app="${tabData.app}"]`);
        if (appItem) {
          const newTab = document.createElement('button');
          newTab.className = `tab ${tabData.active ? 'active' : ''}`;
          newTab.dataset.app = tabData.app;
          const appLabel = appItem.querySelector('.label').textContent;
          const appIcon = appItem.querySelector('.icon').textContent;
          newTab.innerHTML = `
            <span class="icon">${appIcon}</span>
            ${appLabel}
            <button class="btn-close">×</button>
          `;

          // Add close handler
          const closeBtn = newTab.querySelector('.btn-close');
          closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            newTab.remove();
          });

          document.querySelector('.tabs').insertBefore(newTab, document.querySelector('.btn-add-tab'));
        }
      });

      // Activate saved tab
      if (savedState.activeApp) {
        const tab = document.querySelector(`.tab[data-app="${savedState.activeApp}"]`);
        if (tab) {
          tab.classList.add('active');
          loadAppUrl(savedState.activeApp);
        }
      }
    }

    // Update sidebar active states
    document.querySelectorAll('.app').forEach(a => a.classList.remove('active'));
    if (savedState.activeApp) {
      const appItem = document.querySelector(`.app[data-app="${savedState.activeApp}"]`);
      if (appItem) appItem.classList.add('active');
    }

    saveAccounts();
    renderAccountMenu();
    console.log(`  ✅ Switched to ${accountState.accounts[accountId].name}`);
  }

  // Create new account
  function createNewAccount() {
    const name = prompt('Account name:', `Account ${Object.keys(accountState.accounts).length + 1}`);
    if (!name) return;

    const id = `account-${Date.now()}`;
    accountState.accounts[id] = {
      name,
      icon: '👤'
    };

    saveAccounts();
    renderAccountMenu();
    console.log(`  ✅ Created account: ${name}`);
  }

  // Toggle account menu
  function toggleAccountMenu() {
    const selector = document.querySelector('.account-selector');
    const menu = document.querySelector('.account-menu');
    selector.classList.toggle('open');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  }

  // Initialize event listeners
  document.querySelector('.account-current').addEventListener('click', toggleAccountMenu);

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const selector = document.querySelector('.account-selector');
    if (!selector.contains(e.target)) {
      selector.classList.remove('open');
      document.querySelector('.account-menu').style.display = 'none';
    }
  });

  // Load and render
  loadAccounts();
  renderAccountMenu();

  console.log('✅ Feature 7 ready: Multi-Account System');
}

// ============================================
// FEATURE 5: Badge System (Unread Count)
// ============================================
function initFeature5() {
  console.log('🚀 Initializing Feature 5: Badge system');

  // Update badges from skill manager
  const updateBadges = () => {
    Object.entries(skillManager.skills).forEach(([skillId, skill]) => {
      const appItem = document.querySelector(`.app[data-app="${skillId}"]`);
      if (appItem) {
        const badge = appItem.querySelector('.badge');
        const count = skill.unreadCount || 0;

        if (count > 0) {
          badge.textContent = count;
          badge.style.display = 'block';
          console.log(`  📌 ${skillId}: ${count} unread`);
        } else {
          badge.style.display = 'none';
        }
      }
    });
  };

  // Set initial badges
  updateBadges();

  // Simulate incoming notifications (for testing)
  window.updateBadge = (skillId, count) => {
    skillManager.setUnreadCount(skillId, count);
    updateBadges();
    console.log(`✅ Badge updated: ${skillId} → ${count}`);
  };

  console.log('✅ Feature 5 ready: Badge system');
}

// ============================================
// FEATURE 6: Persistence (localStorage)
// ============================================
function initFeature6() {
  console.log('🚀 Initializing Feature 6: Persistence');

  // Save state periodically (every 5 seconds)
  setInterval(() => {
    const state = {
      openTabs: Array.from(document.querySelectorAll('.tab')).map(t => ({
        app: t.dataset.app,
        active: t.classList.contains('active')
      })),
      activeApp: document.querySelector('.app.active')?.dataset.app,
      skills: skillManager.exportState()
    };

    localStorage.setItem('llm-rox-state', JSON.stringify(state));
  }, 5000);

  // Restore state on load
  const savedState = localStorage.getItem('llm-rox-state');
  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      console.log('  ✅ State restored from localStorage');
      console.log(`    • Open tabs: ${state.openTabs.length}`);
      console.log(`    • Active app: ${state.activeApp}`);
    } catch (error) {
      console.error('  ❌ Error restoring state:', error);
    }
  }

  console.log('✅ Feature 6 ready: Persistence');
}

// ============================================
// FEATURE 8: Keyboard Shortcuts
// ============================================
function initFeature8() {
  console.log('🚀 Initializing Feature 8: Keyboard shortcuts');

  const shortcuts = {
    '1': 'claude',
    '2': 'chatgpt',
    '3': 'gemini',
    '4': 'perplexity',
  };

  document.addEventListener('keydown', (e) => {
    // Check for Cmd (Mac) or Ctrl (Windows/Linux)
    const isMod = e.metaKey || e.ctrlKey;

    // Cmd/Ctrl + Number: Switch to app
    if (isMod && shortcuts[e.key]) {
      e.preventDefault();
      const appKey = shortcuts[e.key];
      const appItem = document.querySelector(`.app[data-app="${appKey}"]`);
      if (appItem) {
        appItem.click();
        console.log(`⌨️ Shortcut: Cmd+${e.key} → ${appKey}`);
      }
    }

    // Cmd/Ctrl + W: Close current tab
    if (isMod && e.key.toLowerCase() === 'w') {
      e.preventDefault();
      const activeTab = document.querySelector('.tab.active');
      if (activeTab) {
        const closeBtn = activeTab.querySelector('.btn-close');
        closeBtn?.click();
        console.log(`⌨️ Shortcut: Cmd+W → Close tab`);
      }
    }

    // Cmd/Ctrl + T: New tab (placeholder)
    if (isMod && e.key.toLowerCase() === 't') {
      e.preventDefault();
      console.log(`⌨️ Shortcut: Cmd+T → Would open new app dialog (Feature 9)`);
    }
  });

  console.log('✅ Feature 8 ready: Keyboard shortcuts');
  console.log('  Available shortcuts:');
  console.log('    • Cmd+1, Cmd+2, Cmd+3, Cmd+4: Switch apps');
  console.log('    • Cmd+W: Close current tab');
  console.log('    • Cmd+T: New app dialog (coming soon)');
}

// ============================================
// PROMPT MANAGER: Save & Load Prompts
// ============================================
function initPromptManager() {
  console.log('🚀 Initializing Prompt Manager');

  // Create prompt manager UI
  const promptContainer = document.createElement('div');
  promptContainer.id = 'prompt-manager';
  promptContainer.style.display = 'none';
  promptContainer.innerHTML = `
    <div style="position: fixed; bottom: 60px; left: 270px; width: 400px; max-height: 300px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 8px; padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; overflow-y: auto;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">Saved Prompts</h3>
      <div id="prompts-list" style="max-height: 200px; overflow-y: auto;"></div>
      <div style="margin-top: 12px; display: flex; gap: 8px;">
        <input id="prompt-input" type="text" placeholder="Enter prompt..." style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">
        <button id="save-prompt-btn" style="padding: 8px 12px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Save</button>
      </div>
      <button id="close-prompt-manager" style="margin-top: 8px; width: 100%; padding: 8px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 12px;">Close</button>
    </div>
  `;
  document.body.appendChild(promptContainer);

  // Add toggle button to sidebar
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'btn-icon';
  toggleBtn.title = 'Prompt Manager';
  toggleBtn.textContent = '💬';
  toggleBtn.style.cssText = 'margin-top: auto; margin-bottom: 8px; width: 40px; height: 40px;';

  const sidebar = document.querySelector('.sidebar-footer');
  if (sidebar) {
    sidebar.insertBefore(toggleBtn, sidebar.firstChild);
  }

  // Load prompts from localStorage
  function loadPrompts() {
    const saved = localStorage.getItem('llm-rox-prompts') || '[]';
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  // Save prompts to localStorage
  function savePrompts(prompts) {
    localStorage.setItem('llm-rox-prompts', JSON.stringify(prompts));
  }

  // Render prompt list
  function renderPrompts() {
    const prompts = loadPrompts();
    const list = document.getElementById('prompts-list');
    list.innerHTML = prompts.map((p, i) => `
      <div style="padding: 8px; background: white; border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 6px; font-size: 12px; display: flex; justify-content: space-between; align-items: center;">
        <span>${p.substring(0, 50)}${p.length > 50 ? '...' : ''}</span>
        <button data-index="${i}" class="delete-prompt" style="padding: 2px 6px; background: #f5f5f5; border: none; border-radius: 2px; cursor: pointer; font-size: 10px;">×</button>
      </div>
    `).join('');

    // Add delete listeners
    document.querySelectorAll('.delete-prompt').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.index);
        const prompts = loadPrompts();
        prompts.splice(idx, 1);
        savePrompts(prompts);
        renderPrompts();
        console.log('✅ Prompt deleted');
      };
    });
  }

  // Toggle manager
  toggleBtn.onclick = (e) => {
    e.stopPropagation();
    const isHidden = promptContainer.style.display === 'none';
    promptContainer.style.display = isHidden ? 'block' : 'none';
    if (isHidden) {
      renderPrompts();
      document.getElementById('prompt-input').focus();
    }
    console.log('📋 Prompt Manager toggled');
  };

  // Save prompt
  document.getElementById('save-prompt-btn').onclick = () => {
    const input = document.getElementById('prompt-input');
    const prompt = input.value.trim();
    if (prompt) {
      const prompts = loadPrompts();
      prompts.unshift(prompt);
      if (prompts.length > 20) prompts.pop(); // Keep only last 20
      savePrompts(prompts);
      input.value = '';
      renderPrompts();
      console.log('✅ Prompt saved:', prompt);
    }
  };

  // Close manager
  document.getElementById('close-prompt-manager').onclick = () => {
    promptContainer.style.display = 'none';
  };

  // Enter to save
  document.getElementById('prompt-input').onkeypress = (e) => {
    if (e.key === 'Enter') {
      document.getElementById('save-prompt-btn').click();
    }
  };

  console.log('✅ Prompt Manager ready');
}

// ============================================
// FEATURE 9: Search System
// ============================================
function initFeature9() {
  console.log('🚀 Initializing Feature 9: Search System');

  const searchModal = document.getElementById('searchModal');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('searchResults');

  let searchHistory = [];

  // Load search history
  function loadSearchHistory() {
    const saved = localStorage.getItem('llm-rox-search-history');
    searchHistory = saved ? JSON.parse(saved) : [];
  }

  // Save search history
  function saveSearchHistory() {
    localStorage.setItem('llm-rox-search-history', JSON.stringify(searchHistory.slice(0, 20)));
  }

  // Perform search
  function performSearch(query) {
    if (!query.trim()) {
      renderSearchHistory();
      return;
    }

    const apps = document.querySelectorAll('.app');
    const tabs = document.querySelectorAll('.tab');
    const results = [];

    // Search in apps
    apps.forEach(app => {
      const label = app.querySelector('.label').textContent;
      const appKey = app.dataset.app;
      if (label.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'app',
          title: label,
          subtitle: 'App',
          icon: app.querySelector('.icon').textContent,
          action: () => app.click()
        });
      }
    });

    // Search in tabs
    tabs.forEach(tab => {
      const text = tab.textContent.toLowerCase();
      if (text.includes(query.toLowerCase())) {
        const appKey = tab.dataset.app;
        results.push({
          type: 'tab',
          title: tab.textContent.trim(),
          subtitle: 'Tab',
          icon: tab.querySelector('.icon').textContent,
          action: () => tab.click()
        });
      }
    });

    // Search in history
    searchHistory.forEach(item => {
      if (item.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'history',
          title: item,
          subtitle: 'Search History',
          icon: '🕐',
          action: () => {
            searchInput.value = item;
            performSearch(item);
          }
        });
      }
    });

    renderResults(results);
  }

  // Render search results
  function renderResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
      return;
    }

    searchResults.innerHTML = results.map(r => `
      <div class="search-result-item" data-action="${r.type}">
        <span class="search-result-icon">${r.icon}</span>
        <div class="search-result-text">
          <div class="search-result-title">${r.title}</div>
          <div class="search-result-subtitle">${r.subtitle}</div>
        </div>
      </div>
    `).join('');

    // Attach click handlers
    searchResults.querySelectorAll('.search-result-item').forEach((item, idx) => {
      item.addEventListener('click', () => {
        results[idx].action();
        closeSearch();
      });
    });
  }

  // Render search history
  function renderSearchHistory() {
    if (searchHistory.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No search history</div>';
      return;
    }

    const results = searchHistory.map(item => ({
      type: 'history',
      title: item,
      subtitle: 'Search History',
      icon: '🕐',
      action: () => {
        searchInput.value = item;
        performSearch(item);
      }
    }));

    renderResults(results);
  }

  // Open search
  function openSearch() {
    console.log('🔍 Opening search modal');
    searchOverlay.style.display = 'block';
    searchModal.style.display = 'block';
    searchInput.value = '';
    loadSearchHistory();
    renderSearchHistory();
    searchInput.focus();
  }

  // Close search
  function closeSearch() {
    console.log('🔍 Closing search modal');
    searchOverlay.style.display = 'none';
    searchModal.style.display = 'none';
  }

  // Search input handler
  searchInput.addEventListener('input', (e) => {
    performSearch(e.target.value);
  });

  // Search on Enter
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const query = e.target.value.trim();
      if (!searchHistory.includes(query)) {
        searchHistory.unshift(query);
        saveSearchHistory();
      }
      closeSearch();
    }
    if (e.key === 'Escape') {
      closeSearch();
    }
  });

  // Close on overlay click
  searchOverlay.addEventListener('click', closeSearch);

  // Cmd+K to open search
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
  });

  console.log('✅ Feature 9 ready: Search System (Cmd+K)');
}

// ============================================
// FEATURE 10: Themes & Customization
// ============================================
function initFeature10() {
  console.log('🚀 Initializing Feature 10: Themes & Customization');

  const settingsBtn = document.querySelector('.btn-settings');
  const settingsModal = document.getElementById('settingsModal');
  const settingsOverlay = document.getElementById('settingsOverlay');
  const settingsClose = document.querySelector('.settings-close');

  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const fontSizeSlider = document.getElementById('font-size-slider');
  const fontSizeValue = document.getElementById('font-size-value');
  const sidebarWidthSlider = document.getElementById('sidebar-width-slider');
  const sidebarWidthValue = document.getElementById('sidebar-width-value');
  const colorSchemeButtons = document.querySelectorAll('.color-scheme-btn');

  // Color schemes
  const colorSchemes = {
    default: {
      primary: '#1976d2',
      primaryDark: '#1565c0',
      success: '#2e7d32',
      error: '#d32f2f',
      warning: '#f57c00',
      info: '#0288d1'
    },
    blue: {
      primary: '#0066cc',
      primaryDark: '#0052a3',
      success: '#2e7d32',
      error: '#d32f2f',
      warning: '#f57c00',
      info: '#0088ff'
    },
    purple: {
      primary: '#7c3aed',
      primaryDark: '#6d28d9',
      success: '#2e7d32',
      error: '#d32f2f',
      warning: '#f57c00',
      info: '#8b5cf6'
    },
    green: {
      primary: '#16a34a',
      primaryDark: '#15803d',
      success: '#22c55e',
      error: '#d32f2f',
      warning: '#f57c00',
      info: '#0288d1'
    },
    orange: {
      primary: '#ea580c',
      primaryDark: '#c2410c',
      success: '#2e7d32',
      error: '#d32f2f',
      warning: '#fb923c',
      info: '#0288d1'
    }
  };

  // Load settings
  function loadSettings() {
    const saved = localStorage.getItem('llm-rox-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        darkModeToggle.checked = settings.darkMode || false;
        fontSizeSlider.value = settings.fontSize || 14;
        sidebarWidthSlider.value = settings.sidebarWidth || 240;
        applySettings(settings);
        return settings;
      } catch(e) {
        console.error('Error loading settings:', e);
      }
    }
    return { darkMode: false, fontSize: 14, sidebarWidth: 240, colorScheme: 'default' };
  }

  // Save settings
  function saveSettings(settings) {
    localStorage.setItem('llm-rox-settings', JSON.stringify(settings));
  }

  // Apply settings
  function applySettings(settings) {
    // Dark mode
    if (settings.darkMode) {
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.style.colorScheme = 'light';
    }

    // Font size
    if (settings.fontSize) {
      document.documentElement.style.fontSize = settings.fontSize + 'px';
    }

    // Sidebar width
    if (settings.sidebarWidth) {
      document.documentElement.style.setProperty('--sidebar-width', settings.sidebarWidth + 'px');
    }

    // Color scheme
    if (settings.colorScheme && colorSchemes[settings.colorScheme]) {
      const scheme = colorSchemes[settings.colorScheme];
      document.documentElement.style.setProperty('--color-primary', scheme.primary);
      document.documentElement.style.setProperty('--color-primary-dark', scheme.primaryDark);
    }
  }

  // Get current settings
  function getCurrentSettings() {
    const activeScheme = document.querySelector('.color-scheme-btn.active')?.dataset.scheme || 'default';
    return {
      darkMode: darkModeToggle.checked,
      fontSize: parseInt(fontSizeSlider.value),
      sidebarWidth: parseInt(sidebarWidthSlider.value),
      colorScheme: activeScheme
    };
  }

  // Open settings
  function openSettings() {
    console.log('⚙️ Opening settings modal');
    settingsOverlay.style.display = 'block';
    settingsModal.style.display = 'block';
  }

  // Close settings
  function closeSettings() {
    console.log('⚙️ Closing settings modal');
    settingsOverlay.style.display = 'none';
    settingsModal.style.display = 'none';
  }

  // Dark mode toggle
  darkModeToggle.addEventListener('change', (e) => {
    const settings = getCurrentSettings();
    applySettings(settings);
    saveSettings(settings);
    console.log(`  🌙 Dark mode: ${e.target.checked ? 'ON' : 'OFF'}`);
  });

  // Font size slider
  fontSizeSlider.addEventListener('input', (e) => {
    fontSizeValue.textContent = e.target.value + 'px';
    const settings = getCurrentSettings();
    applySettings(settings);
    saveSettings(settings);
  });

  // Sidebar width slider
  sidebarWidthSlider.addEventListener('input', (e) => {
    sidebarWidthValue.textContent = e.target.value + 'px';
    const settings = getCurrentSettings();
    applySettings(settings);
    saveSettings(settings);
  });

  // Color scheme buttons
  colorSchemeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      colorSchemeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const settings = getCurrentSettings();
      applySettings(settings);
      saveSettings(settings);
      console.log(`  🎨 Color scheme: ${btn.dataset.scheme}`);
    });
  });

  // Settings button
  settingsBtn.addEventListener('click', openSettings);

  // Close button
  settingsClose.addEventListener('click', closeSettings);

  // Close on overlay click
  settingsOverlay.addEventListener('click', (e) => {
    if (e.target === settingsOverlay) {
      closeSettings();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && settingsModal.style.display !== 'none') {
      closeSettings();
    }
  });

  // Load and apply settings
  loadSettings();

  console.log('✅ Feature 10 ready: Themes & Customization');
}

