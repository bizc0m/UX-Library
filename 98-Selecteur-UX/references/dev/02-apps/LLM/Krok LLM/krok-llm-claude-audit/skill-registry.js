/**
 * Skill Registry & Marketplace
 * Community-driven skill sharing platform
 */

class SkillRegistry {
  constructor() {
    // Registry URL (can be local or remote)
    this.registryUrl = 'https://llm-rox-registry.dev/api';
    this.localRegistry = [];
    this.favorites = [];
    this.submitted = [];
  }

  /**
   * Fetch public skill registry from community
   */
  async fetchPublicRegistry(filters = {}) {
    try {
      console.log('🌐 Fetching public skill registry...');

      // Mock data - in production, fetch from remote
      const mockRegistry = [
        {
          id: 'notion',
          name: 'Notion',
          icon: '📝',
          url: 'https://notion.so',
          github: 'user/llm-rox-skill-notion',
          author: 'John Doe',
          description: 'Notion workspace integration with full sync',
          tags: ['productivity', 'notes', 'database'],
          version: '1.2.0',
          downloads: 1250,
          stars: 89,
          rating: 4.8,
          reviews: 34,
          createdAt: '2025-01-15',
          updatedAt: '2026-06-08',
          category: 'Productivity'
        },
        {
          id: 'figma',
          name: 'Figma',
          icon: '🎨',
          url: 'https://figma.com',
          github: 'user/llm-rox-skill-figma',
          author: 'Jane Smith',
          description: 'Design collaboration with live cursors and comments',
          tags: ['design', 'collaboration', 'prototyping'],
          version: '2.0.1',
          downloads: 892,
          stars: 76,
          rating: 4.6,
          reviews: 28,
          createdAt: '2025-02-20',
          updatedAt: '2026-06-07',
          category: 'Design'
        },
        {
          id: 'linear',
          name: 'Linear',
          icon: '📋',
          url: 'https://linear.app',
          github: 'user/llm-rox-skill-linear',
          author: 'Alice Johnson',
          description: 'Issue tracking and project management',
          tags: ['project-management', 'tracking', 'agile'],
          version: '1.5.0',
          downloads: 645,
          stars: 52,
          rating: 4.7,
          reviews: 21,
          createdAt: '2025-03-10',
          updatedAt: '2026-06-06',
          category: 'Productivity'
        },
        {
          id: 'github-cli',
          name: 'GitHub CLI',
          icon: '🐙',
          url: 'https://github.com',
          github: 'user/llm-rox-skill-github',
          author: 'Dev Team',
          description: 'GitHub integration with PR tracking and notifications',
          tags: ['development', 'git', 'collaboration'],
          version: '3.1.0',
          downloads: 2100,
          stars: 145,
          rating: 4.9,
          reviews: 67,
          createdAt: '2025-01-05',
          updatedAt: '2026-06-08',
          category: 'Development'
        }
      ];

      // Apply filters
      let result = mockRegistry;

      if (filters.category) {
        result = result.filter(s => s.category === filters.category);
      }

      if (filters.search) {
        const query = filters.search.toLowerCase();
        result = result.filter(s =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.tags.some(t => t.includes(query))
        );
      }

      if (filters.sortBy === 'trending') {
        result.sort((a, b) => b.downloads - a.downloads);
      } else if (filters.sortBy === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      } else if (filters.sortBy === 'newest') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      this.localRegistry = result;
      console.log(`  ✅ Loaded ${result.length} skills from registry`);
      return result;
    } catch (error) {
      console.error('❌ Error fetching registry:', error);
      return [];
    }
  }

  /**
   * Submit a skill to the community registry
   */
  async submitSkill(skillData) {
    try {
      console.log('\n📤 Submitting skill to community...');

      // Validate skill data
      const required = ['name', 'github', 'icon', 'description', 'tags'];
      const missing = required.filter(field => !skillData[field]);

      if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
      }

      // Create submission
      const submission = {
        id: `skill-${Date.now()}`,
        ...skillData,
        submittedAt: new Date().toISOString(),
        status: 'pending', // pending, approved, rejected
        author: skillData.author || 'Anonymous',
        downloads: 0,
        stars: 0,
        rating: 0,
        reviews: 0
      };

      this.submitted.push(submission);

      // Save to localStorage
      this.saveSubmissions();

      console.log(`  ✅ Skill submitted: ${skillData.name}`);
      console.log(`    • ID: ${submission.id}`);
      console.log(`    • Status: ${submission.status}`);
      console.log(`    • GitHub: ${skillData.github}`);

      return submission;
    } catch (error) {
      console.error('❌ Submission error:', error.message);
      throw error;
    }
  }

  /**
   * Share a skill via link (for community)
   */
  shareSkill(skillId) {
    console.log(`\n🔗 Generating share link for: ${skillId}`);

    const shareCode = Buffer ? Buffer.from(`${skillId}:${Date.now()}`).toString('base64') : btoa(`${skillId}:${Date.now()}`);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://llm-rox.dev';
    const shareUrl = `${origin}?install=${shareCode}`;

    console.log(`  ✅ Share URL: ${shareUrl}`);
    console.log(`  ${shareUrl}`);

    // Copy to clipboard if available (browser only)
    if (typeof navigator !== 'undefined' && navigator?.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      console.log(`  ✅ Copied to clipboard!`);
    }

    return shareUrl;
  }

  /**
   * Export a skill (for sharing as file)
   */
  async exportSkill(skillId) {
    try {
      console.log(`\n💾 Exporting skill: ${skillId}`);

      const skill = this.localRegistry.find(s => s.id === skillId);
      if (!skill) {
        throw new Error(`Skill not found: ${skillId}`);
      }

      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        skill: skill
      };

      const json = JSON.stringify(exportData, null, 2);
      console.log(`  ✅ Exported ${skill.name} (${json.length} bytes)`);

      return json;
    } catch (error) {
      console.error('❌ Export error:', error.message);
      throw error;
    }
  }

  /**
   * Import a shared skill
   */
  async importSkill(skillJson) {
    try {
      console.log('\n📥 Importing skill...');

      const data = JSON.parse(skillJson);
      const skill = data.skill;

      if (!skill.id || !skill.name) {
        throw new Error('Invalid skill format');
      }

      console.log(`  ✅ Imported: ${skill.name}`);
      console.log(`    • Author: ${skill.author}`);
      console.log(`    • Tags: ${skill.tags?.join(', ')}`);

      return skill;
    } catch (error) {
      console.error('❌ Import error:', error.message);
      throw error;
    }
  }

  /**
   * Star/favorite a skill
   */
  starSkill(skillId) {
    console.log(`⭐ Starring skill: ${skillId}`);

    if (!this.favorites.includes(skillId)) {
      this.favorites.push(skillId);
      console.log(`  ✅ Added to favorites`);
    } else {
      this.favorites = this.favorites.filter(id => id !== skillId);
      console.log(`  ✅ Removed from favorites`);
    }

    this.saveFavorites();
    return this.favorites;
  }

  /**
   * Leave a review for a skill
   */
  async reviewSkill(skillId, rating, comment) {
    try {
      console.log(`\n📝 Reviewing skill: ${skillId}`);

      const review = {
        id: `review-${Date.now()}`,
        skillId,
        rating: Math.min(5, Math.max(1, rating)),
        comment: comment || '',
        author: 'User',
        createdAt: new Date().toISOString()
      };

      console.log(`  ✅ Review submitted`);
      console.log(`    • Rating: ${review.rating}/5`);
      console.log(`    • Comment: "${review.comment.substring(0, 50)}..."`);

      return review;
    } catch (error) {
      console.error('❌ Review error:', error);
      throw error;
    }
  }

  /**
   * Get trending skills (by downloads)
   */
  getTrending(limit = 10) {
    return this.localRegistry
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, limit);
  }

  /**
   * Get top rated skills
   */
  getTopRated(limit = 10) {
    return this.localRegistry
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  /**
   * Get skills by category
   */
  getByCategory(category) {
    return this.localRegistry.filter(s => s.category === category);
  }

  /**
   * Get unique categories
   */
  getCategories() {
    return [...new Set(this.localRegistry.map(s => s.category))].sort();
  }

  /**
   * Search skills
   */
  search(query) {
    const q = query.toLowerCase();
    return this.localRegistry.filter(skill =>
      skill.name.toLowerCase().includes(q) ||
      skill.description.toLowerCase().includes(q) ||
      skill.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  /**
   * Check if localStorage is available
   */
  hasLocalStorage() {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Save favorites to localStorage
   */
  saveFavorites() {
    if (this.hasLocalStorage()) {
      localStorage.setItem('llm-rox-favorites', JSON.stringify(this.favorites));
    }
  }

  /**
   * Load favorites from localStorage
   */
  loadFavorites() {
    try {
      if (this.hasLocalStorage()) {
        const saved = localStorage.getItem('llm-rox-favorites');
        if (saved) {
          this.favorites = JSON.parse(saved);
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  /**
   * Save submissions to localStorage
   */
  saveSubmissions() {
    if (this.hasLocalStorage()) {
      localStorage.setItem('llm-rox-submissions', JSON.stringify(this.submitted));
    }
  }

  /**
   * Load submissions from localStorage
   */
  loadSubmissions() {
    try {
      if (this.hasLocalStorage()) {
        const saved = localStorage.getItem('llm-rox-submissions');
        if (saved) {
          this.submitted = JSON.parse(saved);
        }
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  }

  /**
   * Get stats (for dashboard)
   */
  getStats() {
    return {
      totalSkills: this.localRegistry.length,
      totalDownloads: this.localRegistry.reduce((sum, s) => sum + s.downloads, 0),
      totalStars: this.localRegistry.reduce((sum, s) => sum + s.stars, 0),
      favorited: this.favorites.length,
      submitted: this.submitted.length,
      categories: this.getCategories().length,
      averageRating: (
        this.localRegistry.reduce((sum, s) => sum + s.rating, 0) /
        this.localRegistry.length
      ).toFixed(2)
    };
  }
}

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SkillRegistry;
}
