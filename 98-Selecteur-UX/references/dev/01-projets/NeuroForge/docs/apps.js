(() => {
  const entries = [...document.querySelectorAll('.nfo-entry')];
  const tagButtons = [...document.querySelectorAll('.nfo-tags button')];
  const label = document.querySelector('#filter-label');
  const reset = document.querySelector('#filter-reset');
  const statusButtons = [...document.querySelectorAll('[data-status-filter]')];
  const preview = document.querySelector('#app-preview');

  if (!entries.length || !tagButtons.length || !label || !reset) return;

  const clearFilter = () => {
    entries.forEach((entry) => { entry.hidden = false; });
    tagButtons.forEach((button) => { button.setAttribute('aria-pressed', 'false'); });
    statusButtons.forEach((button) => { button.setAttribute('aria-pressed', 'false'); });
    label.textContent = 'TOUTES LES PRODUCTIONS';
    reset.hidden = true;
  };

  const applyStatusFilter = (status) => {
    entries.forEach((entry) => {
      entry.hidden = !entry.querySelector(`.nfo-status.${status}`);
    });
    tagButtons.forEach((button) => { button.setAttribute('aria-pressed', 'false'); });
    statusButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.statusFilter === status));
    });
    label.textContent = `ÉTAT : ${status.toUpperCase()}`;
    reset.hidden = false;
  };

  const applyFilter = (tag) => {
    entries.forEach((entry) => {
      const tags = [...entry.querySelectorAll('.nfo-tags button')].map((button) => button.textContent.trim());
      entry.hidden = !tags.includes(tag);
    });
    tagButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.textContent.trim() === tag));
    });
    label.textContent = `FILTRE : ${tag}`;
    reset.hidden = false;
  };

  tagButtons.forEach((button) => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => applyFilter(button.textContent.trim()));
  });
  statusButtons.forEach((button) => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => applyStatusFilter(button.dataset.statusFilter));
  });
  reset.addEventListener('click', clearFilter);

  if (preview) {
    const image = preview.querySelector('img');
    const positionPreview = (trigger) => {
      const rect = trigger.getBoundingClientRect();
      const width = Math.min(520, window.innerWidth - 24);
      const left = Math.min(Math.max(12, rect.left), window.innerWidth - width - 12);
      const estimatedHeight = 370;
      const top = rect.bottom + estimatedHeight < window.innerHeight ? rect.bottom + 8 : Math.max(8, rect.top - estimatedHeight - 8);
      preview.style.left = `${left}px`;
      preview.style.top = `${top}px`;
    };
    const showPreview = (entry, trigger) => {
      image.src = entry.dataset.preview;
      image.alt = entry.dataset.previewAlt || 'Aperçu';
      preview.hidden = false;
      positionPreview(trigger);
    };
    const hidePreview = () => { preview.hidden = true; image.src = ''; };

    document.querySelectorAll('.nfo-entry[data-preview]').forEach((entry) => {
      const triggers = [entry.querySelector('.nfo-app-icon, .nfo-glyph'), entry.querySelector('h2')].filter(Boolean);
      triggers.forEach((trigger) => {
        trigger.tabIndex = 0;
        trigger.setAttribute('aria-label', `${trigger.textContent?.trim() || entry.querySelector('h2').textContent} : afficher l'aperçu`);
        trigger.addEventListener('mouseenter', () => showPreview(entry, trigger));
        trigger.addEventListener('mouseleave', hidePreview);
        trigger.addEventListener('focus', () => showPreview(entry, trigger));
        trigger.addEventListener('blur', hidePreview);
        trigger.addEventListener('click', () => showPreview(entry, trigger));
      });
    });
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.nfo-entry[data-preview] .nfo-app-icon, .nfo-entry[data-preview] .nfo-glyph, .nfo-entry[data-preview] h2')) hidePreview();
    });
  }
})();
