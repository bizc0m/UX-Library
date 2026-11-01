/**
 * Skill Manager - Extensible app/service loader
 * Supports built-in apps and external GitHub-based skills
 */

class SkillManager {
  constructor() {
    this.skills = {};
    this.externalSkills = [];
    this.isElectron = typeof window !== 'undefined' && window.process?.type === 'renderer';
  }

  /**
   * Load skills from local skills.json or fetch from GitHub
   */
  async loadSkills() {
    try {
      console.log('🎯 SkillManager: Loading skills...');

      // Load built-in skills from skills.json
      const response = await fetch('skills.json');
      const skillsData = await response.json();

      // Register built-in skills
      Object.entries(skillsData.builtIn).forEach(([id, skill]) => {
        this.skills[id] = {
          id,
          ...skill,
          type: 'builtin',
          unreadCount: 0
        };
      });

      console.log(`  ✅ Loaded ${Object.keys(this.skills).length} built-in skills`);

      // Load enabled external skills
      this.externalSkills = skillsData.external || [];
      const enabledExternal = this.externalSkills.filter(s => s.enabled);

      for (const skill of enabledExternal) {
        await this.loadExternalSkill(skill);
      }

      console.log(`  ✅ Loaded ${enabledExternal.length} external skills`);
      return this.skills;
    } catch (error) {
      console.error('❌ SkillManager error:', error);
      return this.skills;
    }
  }

  /**
   * Load external skill from GitHub
   */
  async loadExternalSkill(skillConfig) {
    try {
      console.log(`\n📦 Loading external skill: ${skillConfig.id}`);
      console.log(`  GitHub: ${skillConfig.github}`);

      // Fetch config from GitHub
      const configUrl = `https://raw.githubusercontent.com/${skillConfig.github}/main/skill-config.json`;
      const response = await fetch(configUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${skillConfig.github} not found`);
      }

      const config = await response.json();

      // Merge with local config
      const mergedSkill = {
        ...skillConfig,
        ...config,
        type: 'external',
        unreadCount: 0
      };

      this.skills[skillConfig.id] = mergedSkill;
      console.log(`  ✅ External skill loaded: ${config.name}`);

      return mergedSkill;
    } catch (error) {
      console.error(`  ❌ Failed to load ${skillConfig.id}:`, error.message);
      return null;
    }
  }

  /**
   * Add a new external skill from GitHub
   */
  async addExternalSkill(github, enableNow = false) {
    try {
      console.log(`\n➕ Adding external skill from GitHub: ${github}`);

      // Fetch skill config
      const configUrl = `https://raw.githubusercontent.com/${github}/main/skill-config.json`;
      const response = await fetch(configUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch from ${github}`);
      }

      const config = await response.json();

      // Create skill entry
      const skillEntry = {
        id: config.id || github.split('/')[1],
        name: config.name,
        icon: config.icon,
        url: config.url,
        group: config.group || 'External',
        github: github,
        enabled: enableNow,
        type: 'external',
        unreadCount: 0,
        ...config
      };

      // Add to external skills list
      this.externalSkills.push(skillEntry);

      // Load if enabled
      if (enableNow) {
        this.skills[skillEntry.id] = skillEntry;
        console.log(`  ✅ Skill added and enabled: ${skillEntry.name}`);
      } else {
        console.log(`  ✅ Skill added (disabled): ${skillEntry.name}`);
      }

      // Save to localStorage
      this.saveSkillsToStorage();

      return skillEntry;
    } catch (error) {
      console.error('❌ Error adding external skill:', error.message);
      throw error;
    }
  }

  /**
   * Remove external skill
   */
  removeSkill(skillId) {
    console.log(`\n🗑️ Removing skill: ${skillId}`);

    if (this.skills[skillId]) {
      delete this.skills[skillId];
    }

    this.externalSkills = this.externalSkills.filter(s => s.id !== skillId);
    this.saveSkillsToStorage();

    console.log(`  ✅ Skill removed: ${skillId}`);
  }

  /**
   * Update badge/unread count for a skill
   */
  setUnreadCount(skillId, count) {
    if (this.skills[skillId]) {
      this.skills[skillId].unreadCount = count;
      console.log(`📌 ${skillId}: unread=${count}`);
    }
  }

  /**
   * Get all skills grouped by group
   */
  getGroupedSkills() {
    const grouped = {};

    Object.values(this.skills).forEach(skill => {
      const group = skill.group || 'Other';
      if (!grouped[group]) {
        grouped[group] = [];
      }
      grouped[group].push(skill);
    });

    return grouped;
  }

  /**
   * Persist skills to localStorage
   */
  saveSkillsToStorage() {
    try {
      const data = {
        skills: this.skills,
        externalSkills: this.externalSkills,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('llm-rox-skills', JSON.stringify(data));
      console.log('💾 Skills saved to localStorage');
    } catch (error) {
      console.error('❌ Error saving skills:', error);
    }
  }

  /**
   * Load skills from localStorage
   */
  loadSkillsFromStorage() {
    try {
      const data = localStorage.getItem('llm-rox-skills');
      if (data) {
        const parsed = JSON.parse(data);
        this.skills = parsed.skills || {};
        this.externalSkills = parsed.externalSkills || [];
        console.log('✅ Skills loaded from localStorage');
        return parsed;
      }
    } catch (error) {
      console.error('❌ Error loading from localStorage:', error);
    }
    return null;
  }

  /**
   * Feature 5: Get skill by ID with unread badge
   */
  getSkillWithBadge(skillId) {
    const skill = this.skills[skillId];
    if (skill) {
      return {
        ...skill,
        badge: skill.unreadCount > 0 ? skill.unreadCount : null
      };
    }
    return null;
  }

  /**
   * Feature 6: Export skills state for persistence
   */
  exportState() {
    return {
      skills: this.skills,
      externalSkills: this.externalSkills,
      version: '0.2',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Feature 6: Import skills state from persistence
   */
  importState(state) {
    try {
      this.skills = state.skills || {};
      this.externalSkills = state.externalSkills || [];
      console.log('✅ Skills state imported');
      return true;
    } catch (error) {
      console.error('❌ Error importing state:', error);
      return false;
    }
  }
}

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SkillManager;
}
