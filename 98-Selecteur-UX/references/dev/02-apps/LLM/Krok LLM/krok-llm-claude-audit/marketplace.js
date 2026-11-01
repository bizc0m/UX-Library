/**
 * Marketplace Controller
 * Handles UI interactions for skill marketplace
 */

const registry = new SkillRegistry();
let currentTab = 'browse';
let currentSkills = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Marketplace initialized');

  // Load registry
  await registry.fetchPublicRegistry();
  registry.loadFavorites();
  registry.loadSubmissions();

  // Update stats
  updateStats();

  // Render initial skills
  renderSkills('browse');

  // Setup event listeners
  setupEventListeners();
});

/**
 * Update stats display
 */
function updateStats() {
  const stats = registry.getStats();
  document.getElementById('stat-skills').textContent = stats.totalSkills;
  document.getElementById('stat-downloads').textContent = (stats.totalDownloads / 1000).toFixed(1) + 'K';
  document.getElementById('stat-favorites').textContent = stats.favorited;
  document.getElementById('stat-rating').textContent = stats.averageRating;
}

/**
 * Render skills based on tab
 */
async function renderSkills(tab) {
  currentTab = tab;
  const grid = document.getElementById('skillsGrid');
  grid.innerHTML = '';

  let skills = [];

  if (tab === 'browse') {
    skills = registry.localRegistry;
  } else if (tab === 'trending') {
    skills = registry.getTrending();
  } else if (tab === 'favorites') {
    skills = registry.localRegistry.filter(s => registry.favorites.includes(s.id));
  } else if (tab === 'submitted') {
    skills = registry.submitted;
  }

  if (skills.length === 0) {
    grid.innerHTML = '<div style="padding: 40px; text-align: center; color: #999;">No skills found</div>';
    return;
  }

  skills.forEach(skill => {
    const card = createSkillCard(skill);
    grid.appendChild(card);
  });

  console.log(`✅ Rendered ${skills.length} skills for tab: ${tab}`);
}

/**
 * Create a skill card element
 */
function createSkillCard(skill) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-header">
      <div class="card-icon">${skill.icon}</div>
      <div>
        <div class="card-title">${skill.name}</div>
        <div class="card-author">by ${skill.author}</div>
      </div>
    </div>

    <div class="card-description">${skill.description}</div>

    <div class="card-tags">
      ${skill.tags?.map(tag => `<span class="tag">${tag}</span>`).join('') || ''}
    </div>

    <div class="card-meta">
      <span>📥 ${skill.downloads || 0} downloads</span>
      <span class="card-rating">⭐ ${skill.rating || 0}</span>
      <span>💬 ${skill.reviews || 0} reviews</span>
    </div>

    <div class="card-actions">
      <button class="btn" onclick="installSkill('${skill.id}')">📥 Install</button>
      <button class="btn" onclick="starSkill('${skill.id}')" id="star-${skill.id}">
        ${registry.favorites.includes(skill.id) ? '⭐' : '☆'}
      </button>
      <button class="btn" onclick="shareSkill('${skill.id}')">🔗 Share</button>
    </div>
  `;

  return card;
}

/**
 * Install a skill
 */
async function installSkill(skillId) {
  try {
    console.log(`\n📥 Installing skill: ${skillId}`);
    const skill = registry.localRegistry.find(s => s.id === skillId);

    if (!skill) {
      alert('Skill not found');
      return;
    }

    // In production, this would call the SkillManager to actually install
    // For now, just show the GitHub URL
    const confirmed = confirm(
      `Install "${skill.name}" from:\n${skill.github}\n\nThis will add it to your LLM-ROX instance.`
    );

    if (confirmed) {
      // Open in new window or trigger installation
      window.open(`https://github.com/${skill.github}`, '_blank');
      console.log(`  ✅ Opening GitHub: ${skill.github}`);
    }
  } catch (error) {
    console.error('❌ Install error:', error);
    alert('Error installing skill');
  }
}

/**
 * Star/favorite a skill
 */
function starSkill(skillId) {
  registry.starSkill(skillId);

  const btn = document.getElementById(`star-${skillId}`);
  const isFavorited = registry.favorites.includes(skillId);
  btn.textContent = isFavorited ? '⭐' : '☆';

  console.log(`${isFavorited ? '⭐' : '☆'} ${skillId}`);
  updateStats();
}

/**
 * Share a skill
 */
function shareSkill(skillId) {
  try {
    const shareUrl = registry.shareSkill(skillId);
    alert(`Share this link:\n\n${shareUrl}`);
  } catch (error) {
    console.error('❌ Share error:', error);
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      renderSkills(e.target.dataset.tab);
    });
  });

  // Search
  document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length > 0) {
      currentSkills = registry.search(query);
      renderSearchResults(currentSkills);
    } else {
      renderSkills(currentTab);
    }
  });

  // Category filter
  document.getElementById('categoryFilter').addEventListener('change', (e) => {
    const category = e.target.value;
    if (category) {
      const filtered = registry.getByCategory(category);
      renderSearchResults(filtered);
    } else {
      renderSkills(currentTab);
    }
  });

  // Sort filter
  document.getElementById('sortFilter').addEventListener('change', (e) => {
    const sortBy = e.target.value;
    registry.fetchPublicRegistry({ sortBy }).then(() => {
      renderSkills(currentTab);
    });
  });

  // Submit button
  document.getElementById('submitBtn').addEventListener('click', () => {
    openModal();
  });

  // Submit form
  document.getElementById('submitForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const skillData = {
      name: formData.get('name'),
      github: formData.get('github'),
      icon: formData.get('icon'),
      description: formData.get('description'),
      tags: formData.get('tags').split(',').map(t => t.trim()),
      category: formData.get('category'),
      author: formData.get('author'),
      url: `https://github.com/${formData.get('github')}`
    };

    try {
      await registry.submitSkill(skillData);

      showMessage('✅ Skill submitted successfully! 🎉', 'success');
      setTimeout(() => {
        closeModal();
        e.target.reset();
      }, 2000);
    } catch (error) {
      showMessage(`❌ Error: ${error.message}`, 'error');
    }
  });
}

/**
 * Render search results
 */
function renderSearchResults(skills) {
  const grid = document.getElementById('skillsGrid');
  grid.innerHTML = '';

  if (skills.length === 0) {
    grid.innerHTML = '<div style="padding: 40px; text-align: center; color: #999;">No skills found matching your search</div>';
    return;
  }

  skills.forEach(skill => {
    const card = createSkillCard(skill);
    grid.appendChild(card);
  });
}

/**
 * Open submit modal
 */
function openModal() {
  document.getElementById('submitModal').classList.add('active');
}

/**
 * Close submit modal
 */
function closeModal() {
  document.getElementById('submitModal').classList.remove('active');
  document.getElementById('submitMessage').innerHTML = '';
}

/**
 * Show message in modal
 */
function showMessage(text, type) {
  const messageDiv = document.getElementById('submitMessage');
  messageDiv.className = type;
  messageDiv.textContent = text;
}

// Close modal on outside click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('submitModal');
  if (e.target === modal) {
    closeModal();
  }
});

console.log('✅ Marketplace controls loaded');
