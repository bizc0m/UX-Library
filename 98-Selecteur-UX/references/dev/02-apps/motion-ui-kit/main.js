/**
 * Motion UI Kit — Premium Component Generator
 * Vanilla JS, zero dependency, zero build tool.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const state = {
    theme: 'dark',
    accent: '#8b5cf6',
    canvas: [],
    selectedId: null,
    activeLibrary: 'components',
    libraryQuery: '',
    kitVersion: '2.0.0'
  };

  // ---------------------------------------------------------------------------
  // Library definitions
  // ---------------------------------------------------------------------------
  const effectsLibrary = {
    fade: { name: 'Fade In', key: 'fade', desc: 'Apparition en fondu' },
    slide: { name: 'Slide Up', key: 'slide', desc: 'Glissement vers le haut' },
    scale: { name: 'Scale In', key: 'scale', desc: 'Zoom d’apparition' },
    blur: { name: 'Blur Reveal', key: 'blur', desc: 'Révélation par netteté' },
    stagger: { name: 'Stagger', key: 'stagger', desc: 'Apparition en cascade' },
    float: { name: 'Float', key: 'float', desc: 'Flottement continu' },
    pulse: { name: 'Pulse', key: 'pulse', desc: 'Pulsation douce' },
    glow: { name: 'Glow', key: 'glow', desc: 'Halo accent' },
    shimmer: { name: 'Border Shimmer', key: 'shimmer', desc: 'Lumière balayante' },
    tilt: { name: '3D Tilt', key: 'tilt', desc: 'Inclinaison au survol' }
  };

  const categories = {
    components: [
      { id: 'button-primary', name: 'Button Primary', group: 'Actions', icon: 'square', desc: 'Bouton principal en dégradé' },
      { id: 'button-secondary', name: 'Button Secondary', group: 'Actions', icon: 'square', desc: 'Bouton secondaire' },
      { id: 'button-ghost', name: 'Button Ghost', group: 'Actions', icon: 'square', desc: 'Bouton fantôme' },
      { id: 'input', name: 'Input Field', group: 'Forms', icon: 'type', desc: 'Champ de saisie premium' },
      { id: 'card', name: 'Card', group: 'Data', icon: 'layout', desc: 'Carte avec média' },
      { id: 'badge', name: 'Badge', group: 'Data', icon: 'tag', desc: 'Puce d’état' },
      { id: 'toggle', name: 'Toggle', group: 'Forms', icon: 'toggle', desc: 'Interrupteur' },
      { id: 'tabs', name: 'Tabs', group: 'Navigation', icon: 'columns', desc: 'Onglets segmentés' },
      { id: 'dropdown', name: 'Dropdown', group: 'Overlay', icon: 'chevron', desc: 'Menu déroulant' },
      { id: 'modal', name: 'Modal', group: 'Overlay', icon: 'maximize', desc: 'Fenêtre modale' },
      { id: 'toast', name: 'Toast', group: 'Feedback', icon: 'bell', desc: 'Notification' },
      { id: 'tooltip', name: 'Tooltip', group: 'Overlay', icon: 'help', desc: 'Info-bulle' },
      { id: 'avatar', name: 'Avatar', group: 'Data', icon: 'user', desc: 'Avatar rond' },
      { id: 'skeleton', name: 'Skeleton', group: 'Feedback', icon: 'loader', desc: 'Chargeur squelette' }
    ],
    sections: [
      { id: 'hero', name: 'Hero', group: 'Heroes', icon: 'image', desc: 'Bloc d’accroche' },
      { id: 'features-grid', name: 'Features Grid', group: 'Features', icon: 'grid', desc: 'Grille de fonctionnalités' },
      { id: 'pricing', name: 'Pricing', group: 'Pricing', icon: 'dollar', desc: 'Tableau de tarifs' },
      { id: 'testimonials', name: 'Testimonials', group: 'Social', icon: 'message', desc: 'Témoignages clients' },
      { id: 'cta', name: 'CTA Banner', group: 'CTA', icon: 'flag', desc: 'Appel à l’action' },
      { id: 'faq', name: 'FAQ Accordion', group: 'Content', icon: 'help-circle', desc: 'Questions fréquentes' },
      { id: 'stats', name: 'Stats Strip', group: 'Social', icon: 'bar-chart', desc: 'Chiffres clés' },
      { id: 'newsletter', name: 'Newsletter', group: 'Engagement', icon: 'mail', desc: 'Inscription newsletter' },
      { id: 'footer', name: 'Footer', group: 'Layout', icon: 'layers', desc: 'Pied de page' },
      { id: 'logo-cloud', name: 'Logo Cloud', group: 'Social', icon: 'cloud', desc: 'Nuage de logos' }
    ],
    effects: Object.entries(effectsLibrary).map(([key, e]) => ({
      id: key, name: e.name, group: 'Effects', icon: 'sparkles', desc: e.desc
    }))
  };

  // ---------------------------------------------------------------------------
  // Icons (inline SVGs)
  // ---------------------------------------------------------------------------
  const icons = {
    square: '<rect x="3" y="3" width="18" height="18" rx="4"/>',
    type: '<path d="M4 7h16M12 7v10M9 17h6"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M3 9h18"/>',
    tag: '<path d="M12 2H2v10l10 10 10-10L12 2Z"/><circle cx="7" cy="7" r="1"/>',
    toggle: '<rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="8" cy="12" r="3"/>',
    columns: '<rect x="3" y="3" width="7" height="18" rx="2"/><rect x="14" y="3" width="7" height="18" rx="2"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>',
    loader: '<path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 16.24 2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="m16.24 7.76 2.83-2.83"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
    dollar: '<circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M8 10h8a4 4 0 0 1 0 8H8"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1Z"/><path d="M4 22v-7"/>',
    'help-circle': '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5"/>',
    'bar-chart': '<path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    sparkles: '<path d="m12 3-1.5 4.5L6 9l4.5 1.5L12 15l1.5-4.5L18 9l-4.5-1.5Z"/><path d="M19 19l-1.5-1.5"/><path d="M5 19l1.5-1.5"/><path d="M19 5l-1.5 1.5"/><path d="M5 5l1.5 1.5"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    move: '<path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3 3-3"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'
  };

  function svgIcon(name, size = 16) {
    const path = icons[name] || icons.square;
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
  }

  // ---------------------------------------------------------------------------
  // Design tokens for generated code
  // ---------------------------------------------------------------------------
  function cssVarBlock() {
    return `:root {
  --m-accent: ${state.accent};
  --m-accent-rgb: ${hexToRgb(state.accent)};
  --m-accent-2: ${secondaryAccent(state.accent)};
  --m-bg: #09090b;
  --m-surface: #101014;
  --m-surface-raised: #18181c;
  --m-surface-elevated: #202025;
  --m-border: #27272e;
  --m-text: #f4f4f5;
  --m-text-muted: #71717a;
  --m-radius: 10px;
  --m-radius-lg: 14px;
  --m-radius-xl: 20px;
  --m-shadow: 0 8px 24px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.18);
  --m-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --m-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
}

[data-theme="light"] {
  --m-bg: #fafafa;
  --m-surface: #ffffff;
  --m-surface-raised: #f4f4f5;
  --m-surface-elevated: #e4e4e7;
  --m-border: #e4e4e7;
  --m-text: #18181b;
  --m-text-muted: #a1a1aa;
  --m-shadow: 0 8px 24px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04);
}`;
  }

  function hexToRgb(hex) {
    const n = hex.replace('#', '');
    const bigint = parseInt(n, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  }

  function secondaryAccent(hex) {
    // Rotate hue by ~35° on the hex — simple approximation via HSL would be better,
    // but for generated snippets we use a fixed cyan-ish companion.
    return '#22d3ee';
  }

  function effectCSS() {
    return `[data-kit-effect="fade"] { animation: m-fade 600ms var(--m-ease) both; }
[data-kit-effect="slide"] { animation: m-slide 600ms var(--m-ease) both; }
[data-kit-effect="scale"] { animation: m-scale 500ms var(--m-ease) both; }
[data-kit-effect="blur"] { animation: m-blur 700ms var(--m-ease) both; }
[data-kit-effect="float"] { animation: m-float 5s ease-in-out infinite; }
[data-kit-effect="pulse"] { animation: m-pulse 2s ease-in-out infinite; }
[data-kit-effect="glow"] { animation: m-glow 2.5s ease-in-out infinite alternate; }
[data-kit-effect="shimmer"] { position: relative; overflow: hidden; }
[data-kit-effect="shimmer"]::after { content: ''; position: absolute; inset: 0; background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%); transform: translateX(-100%); animation: m-shimmer 2.2s infinite; }
[data-kit-effect="tilt"] { transform-style: preserve-3d; transition: transform 200ms var(--m-ease); }
[data-kit-effect="stagger"] > * { opacity: 0; animation: m-slide 500ms var(--m-ease) forwards; }
[data-kit-effect="stagger"] > *:nth-child(1) { animation-delay: 0ms; }
[data-kit-effect="stagger"] > *:nth-child(2) { animation-delay: 80ms; }
[data-kit-effect="stagger"] > *:nth-child(3) { animation-delay: 160ms; }
[data-kit-effect="stagger"] > *:nth-child(4) { animation-delay: 240ms; }
[data-kit-effect="stagger"] > *:nth-child(5) { animation-delay: 320ms; }
[data-kit-effect="stagger"] > *:nth-child(6) { animation-delay: 400ms; }
@keyframes m-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes m-slide { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes m-scale { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
@keyframes m-blur { from { opacity: 0; filter: blur(8px); } to { opacity: 1; filter: blur(0); } }
@keyframes m-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes m-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(0.98); } }
@keyframes m-glow { from { box-shadow: 0 0 0 rgba(var(--m-accent-rgb), 0); } to { box-shadow: 0 0 24px rgba(var(--m-accent-rgb), 0.35); } }
@keyframes m-shimmer { 100% { transform: translateX(100%); } }`;
  }

  // ---------------------------------------------------------------------------
  // Component factories
  // ---------------------------------------------------------------------------
  const componentFactory = {
    'button-primary': {
      defaults: { label: 'Get started', effect: '' },
      render(props) {
        const b = document.createElement('button');
        b.className = 'kit-btn kit-btn-primary';
        b.textContent = props.label;
        return b;
      },
      html(props) {
        return `<button class="kit-btn kit-btn-primary">${escapeHtml(props.label)}</button>`;
      },
      css() {
        return `.kit-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:10px 18px; border-radius:var(--m-radius); font-family:var(--m-sans); font-size:14px; font-weight:600; cursor:pointer; border:1px solid transparent; transition:transform 200ms var(--m-ease), box-shadow 200ms; }
.kit-btn:hover { transform:translateY(-2px); }
.kit-btn-primary { background:linear-gradient(135deg, var(--m-accent), color-mix(in srgb, var(--m-accent) 65%, var(--m-accent-2))); color:#fff; box-shadow:0 6px 20px rgba(var(--m-accent-rgb),0.3); }`;
      },
      js() { return ''; }
    },
    'button-secondary': {
      defaults: { label: 'Learn more', effect: '' },
      render(props) {
        const b = document.createElement('button');
        b.className = 'kit-btn kit-btn-secondary';
        b.textContent = props.label;
        return b;
      },
      html(props) {
        return `<button class="kit-btn kit-btn-secondary">${escapeHtml(props.label)}</button>`;
      },
      css() {
        return `.kit-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:10px 18px; border-radius:var(--m-radius); font-family:var(--m-sans); font-size:14px; font-weight:600; cursor:pointer; border:1px solid transparent; transition:transform 200ms var(--m-ease), background 200ms; }
.kit-btn:hover { transform:translateY(-2px); }
.kit-btn-secondary { background:var(--m-surface-raised); border-color:var(--m-border); color:var(--m-text); }
.kit-btn-secondary:hover { background:var(--m-surface-elevated); }`;
      },
      js() { return ''; }
    },
    'button-ghost': {
      defaults: { label: 'Cancel', effect: '' },
      render(props) {
        const b = document.createElement('button');
        b.className = 'kit-btn kit-btn-ghost';
        b.textContent = props.label;
        return b;
      },
      html(props) {
        return `<button class="kit-btn kit-btn-ghost">${escapeHtml(props.label)}</button>`;
      },
      css() {
        return `.kit-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:10px 18px; border-radius:var(--m-radius); font-family:var(--m-sans); font-size:14px; font-weight:600; cursor:pointer; border:1px solid transparent; transition:transform 200ms var(--m-ease), background 200ms; }
.kit-btn:hover { transform:translateY(-2px); }
.kit-btn-ghost { background:transparent; border-color:var(--m-border); color:var(--m-text-muted); }
.kit-btn-ghost:hover { background:var(--m-surface-raised); color:var(--m-text); }`;
      },
      js() { return ''; }
    },
    'input': {
      defaults: { placeholder: 'Enter your email', effect: '' },
      render(props) {
        const i = document.createElement('input');
        i.className = 'kit-input';
        i.type = 'text';
        i.placeholder = props.placeholder;
        return i;
      },
      html(props) {
        return `<input type="text" class="kit-input" placeholder="${escapeHtml(props.placeholder)}">`;
      },
      css() {
        return `.kit-input { width:100%; max-width:260px; padding:10px 14px; background:var(--m-surface-raised); border:1px solid var(--m-border); border-radius:var(--m-radius); color:var(--m-text); font-family:var(--m-sans); font-size:14px; outline:none; transition:border-color 200ms, box-shadow 200ms; }
.kit-input:focus { border-color:var(--m-accent); box-shadow:0 0 0 3px rgba(var(--m-accent-rgb),0.16); }`;
      },
      js() { return ''; }
    },
    'card': {
      defaults: { title: 'Premium card', text: 'A refined surface with crisp borders and subtle depth.', effect: '' },
      render(props) {
        const d = document.createElement('div');
        d.className = 'kit-card';
        d.style.maxWidth = '280px';
        d.innerHTML = `<div class="kit-card-media"></div><div class="kit-card-content"><div class="kit-card-title">${escapeHtml(props.title)}</div><div class="kit-card-text">${escapeHtml(props.text)}</div></div>`;
        return d;
      },
      html(props) {
        return `<div class="kit-card">\n  <div class="kit-card-media"></div>\n  <div class="kit-card-content">\n    <div class="kit-card-title">${escapeHtml(props.title)}</div>\n    <div class="kit-card-text">${escapeHtml(props.text)}</div>\n  </div>\n</div>`;
      },
      css() {
        return `.kit-card { background:var(--m-surface); border:1px solid var(--m-border); border-radius:var(--m-radius-lg); overflow:hidden; max-width:280px; transition:transform 200ms, box-shadow 200ms; }
.kit-card:hover { transform:translateY(-3px); box-shadow:var(--m-shadow); }
.kit-card-media { height:120px; background:linear-gradient(135deg, var(--m-accent), var(--m-accent-2)); opacity:0.9; }
.kit-card-content { padding:18px; }
.kit-card-title { font-size:15px; font-weight:700; margin-bottom:6px; }
.kit-card-text { font-size:13px; color:var(--m-text-muted); line-height:1.55; }`;
      },
      js() { return ''; }
    },
    'badge': {
      defaults: { label: 'New release', effect: '' },
      render(props) {
        const s = document.createElement('span');
        s.className = 'kit-badge';
        s.textContent = props.label;
        return s;
      },
      html(props) {
        return `<span class="kit-badge">${escapeHtml(props.label)}</span>`;
      },
      css() {
        return `.kit-badge { display:inline-flex; align-items:center; padding:4px 10px; border-radius:999px; font-size:11px; font-weight:700; letter-spacing:0.02em; background:rgba(var(--m-accent-rgb),0.12); border:1px solid rgba(var(--m-accent-rgb),0.2); color:var(--m-accent); }`;
      },
      js() { return ''; }
    },
    'toggle': {
      defaults: { label: 'Enable notifications', effect: '' },
      render(props) {
        const l = document.createElement('label');
        l.className = 'kit-toggle';
        l.innerHTML = `<input type="checkbox" checked><span class="kit-toggle-track"></span><span>${escapeHtml(props.label)}</span>`;
        return l;
      },
      html(props) {
        return `<label class="kit-toggle">\n  <input type="checkbox" checked>\n  <span class="kit-toggle-track"></span>\n  <span>${escapeHtml(props.label)}</span>\n</label>`;
      },
      css() {
        return `.kit-toggle { display:inline-flex; align-items:center; gap:10px; cursor:pointer; font-size:14px; }
.kit-toggle input { display:none; }
.kit-toggle-track { width:42px; height:24px; background:var(--m-border); border-radius:999px; position:relative; transition:background 200ms; }
.kit-toggle-track::after { content:''; position:absolute; top:2px; left:2px; width:20px; height:20px; background:#fff; border-radius:50%; box-shadow:0 1px 2px rgba(0,0,0,0.25); transition:transform 200ms var(--m-ease); }
.kit-toggle input:checked + .kit-toggle-track { background:var(--m-accent); }
.kit-toggle input:checked + .kit-toggle-track::after { transform:translateX(18px); }`;
      },
      js() { return ''; }
    },
    'tabs': {
      defaults: { labels: 'Overview,Pricing,Settings', effect: '' },
      render(props) {
        const labels = props.labels.split(',').map(s => s.trim()).filter(Boolean);
        const d = document.createElement('div');
        d.className = 'kit-tabs';
        labels.forEach((label, i) => {
          const b = document.createElement('button');
          b.className = 'kit-tab' + (i === 0 ? ' is-active' : '');
          b.textContent = label;
          b.addEventListener('click', () => {
            d.querySelectorAll('.kit-tab').forEach(t => t.classList.remove('is-active'));
            b.classList.add('is-active');
          });
          d.appendChild(b);
        });
        return d;
      },
      html(props) {
        const labels = props.labels.split(',').map(s => s.trim()).filter(Boolean);
        return `<div class="kit-tabs">\n${labels.map((l, i) => `  <button class="kit-tab${i === 0 ? ' is-active' : ''}">${escapeHtml(l)}</button>`).join('\n')}\n</div>`;
      },
      css() {
        return `.kit-tabs { display:inline-flex; gap:4px; padding:4px; background:var(--m-surface-raised); border:1px solid var(--m-border); border-radius:var(--m-radius); }
.kit-tab { padding:7px 14px; border-radius:var(--m-radius-sm); border:none; background:transparent; color:var(--m-text-muted); font-family:var(--m-sans); font-size:13px; font-weight:600; cursor:pointer; transition:color 200ms, background 200ms; }
.kit-tab:hover { color:var(--m-text); }
.kit-tab.is-active { background:var(--m-surface); color:var(--m-accent); box-shadow:0 1px 2px rgba(0,0,0,0.25); }`;
      },
      js() {
        return `document.querySelectorAll('.kit-tabs').forEach(tabs => {\n  tabs.querySelectorAll('.kit-tab').forEach(tab => {\n    tab.addEventListener('click', () => {\n      tabs.querySelectorAll('.kit-tab').forEach(t => t.classList.remove('is-active'));\n      tab.classList.add('is-active');\n    });\n  });\n});`;
      }
    },
    'dropdown': {
      defaults: { label: 'Options', items: 'Edit,Duplicate,Delete', effect: '' },
      render(props) {
        const items = props.items.split(',').map(s => s.trim()).filter(Boolean);
        const d = document.createElement('div');
        d.className = 'kit-dropdown';
        d.innerHTML = `<button class="kit-btn kit-btn-secondary kit-dropdown-trigger">${escapeHtml(props.label)} <span style="margin-left:4px">▾</span></button><div class="kit-dropdown-menu">${items.map(it => `<div class="kit-dropdown-item">${escapeHtml(it)}</div>`).join('')}</div>`;
        const trigger = d.querySelector('.kit-dropdown-trigger');
        trigger.addEventListener('click', (e) => { e.stopPropagation(); d.classList.toggle('is-open'); });
        document.addEventListener('click', (e) => { if (!d.contains(e.target)) d.classList.remove('is-open'); });
        return d;
      },
      html(props) {
        const items = props.items.split(',').map(s => s.trim()).filter(Boolean);
        return `<div class="kit-dropdown">\n  <button class="kit-btn kit-btn-secondary kit-dropdown-trigger">${escapeHtml(props.label)} ▾</button>\n  <div class="kit-dropdown-menu">\n${items.map(it => `    <div class="kit-dropdown-item">${escapeHtml(it)}</div>`).join('\n')}\n  </div>\n</div>`;
      },
      css() {
        return `.kit-btn { display:inline-flex; align-items:center; justify-content:center; padding:10px 18px; border-radius:var(--m-radius); font-family:var(--m-sans); font-size:14px; font-weight:600; cursor:pointer; border:1px solid transparent; }
.kit-btn-secondary { background:var(--m-surface-raised); border-color:var(--m-border); color:var(--m-text); }
.kit-dropdown { position:relative; display:inline-block; }
.kit-dropdown-menu { position:absolute; top:calc(100% + 8px); right:0; min-width:160px; background:var(--m-surface-elevated); border:1px solid var(--m-border); border-radius:var(--m-radius); box-shadow:var(--m-shadow); opacity:0; transform:translateY(-6px); pointer-events:none; transition:opacity 200ms, transform 200ms; z-index:20; }
.kit-dropdown.is-open .kit-dropdown-menu { opacity:1; transform:translateY(0); pointer-events:auto; }
.kit-dropdown-item { padding:9px 14px; font-size:13px; cursor:pointer; border-radius:var(--m-radius-sm); margin:4px; }
.kit-dropdown-item:hover { background:var(--m-surface-raised); }`;
      },
      js() {
        return `document.querySelectorAll('.kit-dropdown').forEach(dd => {\n  const trigger = dd.querySelector('.kit-dropdown-trigger');\n  trigger.addEventListener('click', e => { e.stopPropagation(); dd.classList.toggle('is-open'); });\n});\ndocument.addEventListener('click', e => {\n  document.querySelectorAll('.kit-dropdown.is-open').forEach(dd => { if (!dd.contains(e.target)) dd.classList.remove('is-open'); });\n});`;
      }
    },
    'modal': {
      defaults: { title: 'Confirm action', body: 'Are you sure you want to continue? This cannot be undone.', effect: 'scale' },
      render(props) {
        const wrapper = document.createElement('div');
        const btn = document.createElement('button');
        btn.className = 'kit-btn kit-btn-primary';
        btn.textContent = 'Open modal';
        const back = document.createElement('div');
        back.className = 'kit-modal-backdrop';
        back.innerHTML = `<div class="kit-modal"><h3>${escapeHtml(props.title)}</h3><p>${escapeHtml(props.body)}</p><button class="kit-btn kit-btn-secondary kit-close">Cancel</button></div>`;
        document.body.appendChild(back);
        btn.addEventListener('click', () => back.classList.add('is-open'));
        back.querySelector('.kit-close').addEventListener('click', () => back.classList.remove('is-open'));
        back.addEventListener('click', e => { if (e.target === back) back.classList.remove('is-open'); });
        wrapper.appendChild(btn);
        return wrapper;
      },
      html(props) {
        return `<button class="kit-btn kit-btn-primary kit-modal-open">Open modal</button>\n<div class="kit-modal-backdrop">\n  <div class="kit-modal">\n    <h3>${escapeHtml(props.title)}</h3>\n    <p>${escapeHtml(props.body)}</p>\n    <button class="kit-btn kit-btn-secondary kit-close">Cancel</button>\n  </div>\n</div>`;
      },
      css() {
        return `.kit-btn { display:inline-flex; align-items:center; justify-content:center; padding:10px 18px; border-radius:var(--m-radius); font-family:var(--m-sans); font-size:14px; font-weight:600; cursor:pointer; border:1px solid transparent; }
.kit-btn-primary { background:linear-gradient(135deg, var(--m-accent), color-mix(in srgb, var(--m-accent) 65%, var(--m-accent-2))); color:#fff; }
.kit-btn-secondary { background:var(--m-surface-raised); border-color:var(--m-border); color:var(--m-text); }
.kit-modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.55); backdrop-filter:blur(4px); display:grid; place-items:center; opacity:0; pointer-events:none; transition:opacity 200ms; z-index:200; }
.kit-modal-backdrop.is-open { opacity:1; pointer-events:auto; }
.kit-modal { background:var(--m-surface); border:1px solid var(--m-border); border-radius:var(--m-radius-lg); padding:24px; max-width:400px; width:90%; box-shadow:var(--m-shadow); transform:scale(0.96); transition:transform 200ms var(--m-ease); }
.kit-modal-backdrop.is-open .kit-modal { transform:scale(1); }
.kit-modal h3 { font-size:17px; font-weight:700; margin-bottom:8px; }
.kit-modal p { font-size:13px; color:var(--m-text-muted); margin-bottom:18px; }`;
      },
      js() {
        return `document.querySelectorAll('.kit-modal-open').forEach(btn => {\n  const backdrop = btn.nextElementSibling;\n  const close = backdrop.querySelector('.kit-close');\n  btn.addEventListener('click', () => backdrop.classList.add('is-open'));\n  close.addEventListener('click', () => backdrop.classList.remove('is-open'));\n  backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.classList.remove('is-open'); });\n});`;
      }
    },
    'toast': {
      defaults: { message: 'Changes saved successfully', effect: 'slide' },
      render(props) {
        const d = document.createElement('div');
        d.className = 'kit-toast';
        d.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--m-success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span>${escapeHtml(props.message)}</span>`;
        return d;
      },
      html(props) {
        return `<div class="kit-toast">\n  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>\n  <span>${escapeHtml(props.message)}</span>\n</div>`;
      },
      css() {
        return `.kit-toast { display:inline-flex; align-items:center; gap:10px; padding:12px 16px; background:var(--m-surface-elevated); border:1px solid var(--m-border); border-radius:var(--m-radius); box-shadow:var(--m-shadow); color:var(--m-text); font-size:13px; }
.kit-toast svg { color:var(--m-success); }`;
      },
      js() { return ''; }
    },
    'tooltip': {
      defaults: { text: 'Hover me', tip: 'This is a helpful tooltip', effect: '' },
      render(props) {
        const s = document.createElement('span');
        s.className = 'kit-tooltip';
        s.dataset.tip = props.tip;
        s.textContent = props.text;
        return s;
      },
      html(props) {
        return `<span class="kit-tooltip" data-tip="${escapeHtml(props.tip)}">${escapeHtml(props.text)}</span>`;
      },
      css() {
        return `.kit-tooltip { position:relative; display:inline-block; cursor:help; border-bottom:1px dashed var(--m-border); }
.kit-tooltip::after { content:attr(data-tip); position:absolute; bottom:130%; left:50%; transform:translateX(-50%) scale(0.96); background:var(--m-text); color:var(--m-bg); padding:6px 10px; border-radius:var(--m-radius-sm); font-size:12px; white-space:nowrap; opacity:0; pointer-events:none; transition:opacity 200ms, transform 200ms; }
.kit-tooltip:hover::after { opacity:1; transform:translateX(-50%) scale(1); }`;
      },
      js() { return ''; }
    },
    'avatar': {
      defaults: { initials: 'JD', effect: '' },
      render(props) {
        const d = document.createElement('div');
        d.className = 'kit-avatar';
        d.textContent = props.initials;
        return d;
      },
      html(props) {
        return `<div class="kit-avatar">${escapeHtml(props.initials)}</div>`;
      },
      css() {
        return `.kit-avatar { width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg, var(--m-accent), var(--m-accent-2)); display:grid; place-items:center; color:#fff; font-weight:700; font-size:13px; }`;
      },
      js() { return ''; }
    },
    'skeleton': {
      defaults: { rows: '3', effect: 'shimmer' },
      render(props) {
        const d = document.createElement('div');
        d.style.width = '100%';
        d.style.maxWidth = '260px';
        const rows = Math.min(Math.max(parseInt(props.rows, 10) || 3, 1), 6);
        for (let i = 0; i < rows; i++) {
          const s = document.createElement('div');
          s.className = 'kit-skeleton';
          s.style.width = i === rows - 1 ? '60%' : '100%';
          s.style.marginBottom = i < rows - 1 ? '10px' : '0';
          d.appendChild(s);
        }
        return d;
      },
      html(props) {
        const rows = Math.min(Math.max(parseInt(props.rows, 10) || 3, 1), 6);
        return `<div style="width:100%;max-width:260px">\n${Array.from({ length: rows }, (_, i) => `  <div class="kit-skeleton" style="width:${i === rows - 1 ? '60%' : '100%'};margin-bottom:${i < rows - 1 ? '10px' : '0'}"></div>`).join('\n')}\n</div>`;
      },
      css() {
        return `.kit-skeleton { height:10px; border-radius:999px; background:var(--m-border); overflow:hidden; position:relative; }
.kit-skeleton::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); transform:translateX(-100%); animation:kit-shimmer 1.6s infinite; }
@keyframes kit-shimmer { 100% { transform:translateX(100%); } }`;
      },
      js() { return ''; }
    }
  };

  // ---------------------------------------------------------------------------
  // Section factories
  // ---------------------------------------------------------------------------
  const sectionFactory = {
    'hero': {
      defaults: { headline: 'Build faster with Motion UI Kit', subhead: 'A premium set of components, sections and motion effects you can drop into any project.', effect: 'fade' },
      render(props) {
        const s = document.createElement('section');
        s.className = 'kit-section-hero';
        s.innerHTML = `<h2>${escapeHtml(props.headline)}</h2><p>${escapeHtml(props.subhead)}</p><div class="actions"><button class="kit-btn kit-btn-primary">Start building</button><button class="kit-btn kit-btn-ghost">View documentation</button></div>`;
        return s;
      },
      html(props) {
        return `<section class="kit-section-hero">\n  <h2>${escapeHtml(props.headline)}</h2>\n  <p>${escapeHtml(props.subhead)}</p>\n  <div class="actions">\n    <button class="kit-btn kit-btn-primary">Start building</button>\n    <button class="kit-btn kit-btn-ghost">View documentation</button>\n  </div>\n</section>`;
      },
      css() {
        return `.kit-section-hero { padding:64px 24px; text-align:center; border:1px solid var(--m-border); border-radius:var(--m-radius-xl); background:radial-gradient(ellipse at top, rgba(var(--m-accent-rgb),0.08), transparent 60%), var(--m-surface); }
.kit-section-hero h2 { font-size:clamp(28px, 5vw, 48px); font-weight:800; letter-spacing:-0.03em; margin-bottom:14px; }
.kit-section-hero p { font-size:16px; color:var(--m-text-muted); max-width:520px; margin:0 auto 24px; }
.kit-section-hero .actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
.kit-btn { display:inline-flex; align-items:center; justify-content:center; padding:10px 18px; border-radius:var(--m-radius); font-family:var(--m-sans); font-size:14px; font-weight:600; cursor:pointer; border:1px solid transparent; transition:transform 200ms; }
.kit-btn:hover { transform:translateY(-2px); }
.kit-btn-primary { background:linear-gradient(135deg, var(--m-accent), color-mix(in srgb, var(--m-accent) 65%, var(--m-accent-2))); color:#fff; }
.kit-btn-ghost { background:transparent; border-color:var(--m-border); color:var(--m-text-muted); }
.kit-btn-ghost:hover { background:var(--m-surface-raised); color:var(--m-text); }`;
      },
      js() { return ''; }
    },
    'features-grid': {
      defaults: { title: 'Everything you need', effect: 'stagger' },
      render(props) {
        const s = document.createElement('section');
        s.className = 'kit-section-features';
        s.innerHTML = `<h3>${escapeHtml(props.title)}</h3><div class="kit-features-grid">${[['Lightning fast','Ship in hours, not weeks.'],['Accessible','Keyboard and screen-reader friendly.'],['Zero deps','No framework lock-in.'],['Customizable','Tokens, colors and motion.']].map(([t,p]) => `<div class="kit-feature"><div class="kit-feature-icon">${svgIcon('sparkles', 18)}</div><h4>${escapeHtml(t)}</h4><p>${escapeHtml(p)}</p></div>`).join('')}</div>`;
        return s;
      },
      html(props) {
        return `<section class="kit-section-features">\n  <h3>${escapeHtml(props.title)}</h3>\n  <div class="kit-features-grid">\n    <div class="kit-feature"><div class="kit-feature-icon">✦</div><h4>Lightning fast</h4><p>Ship in hours, not weeks.</p></div>\n    <div class="kit-feature"><div class="kit-feature-icon">✦</div><h4>Accessible</h4><p>Keyboard and screen-reader friendly.</p></div>\n    <div class="kit-feature"><div class="kit-feature-icon">✦</div><h4>Zero deps</h4><p>No framework lock-in.</p></div>\n    <div class="kit-feature"><div class="kit-feature-icon">✦</div><h4>Customizable</h4><p>Tokens, colors and motion.</p></div>\n  </div>\n</section>`;
      },
      css() {
        return `.kit-section-features { padding:40px 24px; border:1px solid var(--m-border); border-radius:var(--m-radius-xl); background:var(--m-surface); }
.kit-section-features h3 { font-size:22px; font-weight:700; margin-bottom:24px; text-align:center; }
.kit-features-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:16px; }
.kit-feature { padding:18px; background:var(--m-surface-raised); border:1px solid var(--m-border); border-radius:var(--m-radius-lg); }
.kit-feature-icon { width:36px; height:36px; border-radius:var(--m-radius); background:rgba(var(--m-accent-rgb),0.1); display:grid; place-items:center; color:var(--m-accent); margin-bottom:12px; }
.kit-feature h4 { font-size:14px; font-weight:700; margin-bottom:6px; }
.kit-feature p { font-size:12px; color:var(--m-text-muted); line-height:1.5; }`;
      },
      js() { return ''; }
    },
    'pricing': {
      defaults: { title: 'Simple pricing', effect: 'stagger' },
      render(props) {
        const s = document.createElement('section');
        s.className = 'kit-section-pricing';
        s.innerHTML = `<h3>${escapeHtml(props.title)}</h3><div class="kit-pricing-grid"><div class="kit-price-card"><h4>Starter</h4><div class="kit-price">$0</div><ul><li>10 components</li><li>Community support</li><li>MIT license</li></ul><button class="kit-btn kit-btn-ghost">Get started</button></div><div class="kit-price-card featured"><h4>Pro</h4><div class="kit-price">$29</div><ul><li>Unlimited components</li><li>Priority support</li><li>Commercial use</li></ul><button class="kit-btn kit-btn-primary">Buy now</button></div><div class="kit-price-card"><h4>Team</h4><div class="kit-price">$99</div><ul><li>Everything in Pro</li><li>SSO</li><li>Custom billing</li></ul><button class="kit-btn kit-btn-ghost">Contact sales</button></div></div>`;
        return s;
      },
      html(props) {
        return `<section class="kit-section-pricing">\n  <h3>${escapeHtml(props.title)}</h3>\n  <div class="kit-pricing-grid">\n    <div class="kit-price-card"><h4>Starter</h4><div class="kit-price">$0</div><ul><li>10 components</li><li>Community support</li><li>MIT license</li></ul><button class="kit-btn kit-btn-ghost">Get started</button></div>\n    <div class="kit-price-card featured"><h4>Pro</h4><div class="kit-price">$29</div><ul><li>Unlimited components</li><li>Priority support</li><li>Commercial use</li></ul><button class="kit-btn kit-btn-primary">Buy now</button></div>\n    <div class="kit-price-card"><h4>Team</h4><div class="kit-price">$99</div><ul><li>Everything in Pro</li><li>SSO</li><li>Custom billing</li></ul><button class="kit-btn kit-btn-ghost">Contact sales</button></div>\n  </div>\n</section>`;
      },
      css() {
        return `.kit-section-pricing { padding:40px 24px; border:1px solid var(--m-border); border-radius:var(--m-radius-xl); background:var(--m-surface); }
.kit-section-pricing h3 { font-size:22px; font-weight:700; margin-bottom:24px; text-align:center; }
.kit-pricing-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:16px; }
.kit-price-card { padding:22px; background:var(--m-surface-raised); border:1px solid var(--m-border); border-radius:var(--m-radius-lg); }
.kit-price-card.featured { border-color:var(--m-accent); background:rgba(var(--m-accent-rgb),0.06); }
.kit-price-card h4 { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--m-text-muted); margin-bottom:10px; }
.kit-price { font-size:32px; font-weight:800; letter-spacing:-0.02em; margin-bottom:16px; }
.kit-price-card ul { list-style:none; font-size:12px; color:var(--m-text-muted); line-height:1.8; margin-bottom:18px; padding:0; }
.kit-btn { display:inline-flex; align-items:center; justify-content:center; padding:10px 18px; border-radius:var(--m-radius); font-family:var(--m-sans); font-size:14px; font-weight:600; cursor:pointer; border:1px solid transparent; }
.kit-btn-primary { background:linear-gradient(135deg, var(--m-accent), color-mix(in srgb, var(--m-accent) 65%, var(--m-accent-2))); color:#fff; }
.kit-btn-ghost { background:transparent; border-color:var(--m-border); color:var(--m-text-muted); }`;
      },
      js() { return ''; }
    },
    'testimonials': {
      defaults: { title: 'Loved by builders', effect: 'stagger' },
      render(props) {
        const s = document.createElement('section');
        s.className = 'kit-section-testimonials';
        s.innerHTML = `<h3>${escapeHtml(props.title)}</h3><div class="kit-testimonials-grid">${[['“The polish is incredible.”','Sarah L.','Product Designer'],['“We shipped our landing page in a day.”','Marc D.','Founder'],['“Finally a kit without bloat.”','Aiko T.','Engineer']].map(([q,n,r]) => `<div class="kit-testimonial"><blockquote>${escapeHtml(q)}</blockquote><footer><div class="kit-avatar">${n.split(' ').map(x => x[0]).join('')}</div><div><div class="name">${escapeHtml(n)}</div><div class="role">${escapeHtml(r)}</div></div></footer></div>`).join('')}</div>`;
        return s;
      },
      html(props) {
        return `<section class="kit-section-testimonials">\n  <h3>${escapeHtml(props.title)}</h3>\n  <div class="kit-testimonials-grid">\n    <div class="kit-testimonial"><blockquote>“The polish is incredible.”</blockquote><footer><div class="kit-avatar">SL</div><div><div class="name">Sarah L.</div><div class="role">Product Designer</div></div></footer></div>\n    <div class="kit-testimonial"><blockquote>“We shipped our landing page in a day.”</blockquote><footer><div class="kit-avatar">MD</div><div><div class="name">Marc D.</div><div class="role">Founder</div></div></footer></div>\n    <div class="kit-testimonial"><blockquote>“Finally a kit without bloat.”</blockquote><footer><div class="kit-avatar">AT</div><div><div class="name">Aiko T.</div><div class="role">Engineer</div></div></footer></div>\n  </div>\n</section>`;
      },
      css() {
        return `.kit-section-testimonials { padding:40px 24px; border:1px solid var(--m-border); border-radius:var(--m-radius-xl); background:var(--m-surface); }
.kit-section-testimonials h3 { font-size:22px; font-weight:700; margin-bottom:24px; text-align:center; }
.kit-testimonials-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; }
.kit-testimonial { padding:18px; background:var(--m-surface-raised); border:1px solid var(--m-border); border-radius:var(--m-radius-lg); }
.kit-testimonial blockquote { font-size:14px; line-height:1.55; margin:0 0 14px; }
.kit-testimonial footer { display:flex; align-items:center; gap:10px; font-size:12px; }
.kit-testimonial .name { font-weight:700; color:var(--m-text); }
.kit-testimonial .role { color:var(--m-text-muted); }
.kit-avatar { width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg, var(--m-accent), var(--m-accent-2)); display:grid; place-items:center; color:#fff; font-weight:700; font-size:13px; }`;
      },
      js() { return ''; }
    },
    'cta': {
      defaults: { title: 'Ready to start building?', subhead: 'Copy, paste, ship. No build step required.', effect: 'scale' },
      render(props) {
        const s = document.createElement('section');
        s.className = 'kit-section-cta';
        s.innerHTML = `<h3>${escapeHtml(props.title)}</h3><p>${escapeHtml(props.subhead)}</p><button class="kit-btn kit-btn-primary">Get the kit</button>`;
        return s;
      },
      html(props) {
        return `<section class="kit-section-cta">\n  <h3>${escapeHtml(props.title)}</h3>\n  <p>${escapeHtml(props.subhead)}</p>\n  <button class="kit-btn kit-btn-primary">Get the kit</button>\n</section>`;
      },
      css() {
        return `.kit-section-cta { padding:56px 24px; text-align:center; border:1px solid var(--m-border); border-radius:var(--m-radius-xl); background:linear-gradient(135deg, rgba(var(--m-accent-rgb),0.08), rgba(var(--m-accent-rgb),0.02)); }
.kit-section-cta h3 { font-size:26px; font-weight:700; margin-bottom:10px; }
.kit-section-cta p { color:var(--m-text-muted); margin-bottom:20px; }
.kit-btn { display:inline-flex; align-items:center; justify-content:center; padding:10px 18px; border-radius:var(--m-radius); font-family:var(--m-sans); font-size:14px; font-weight:600; cursor:pointer; border:1px solid transparent; }
.kit-btn-primary { background:linear-gradient(135deg, var(--m-accent), color-mix(in srgb, var(--m-accent) 65%, var(--m-accent-2))); color:#fff; }`;
      },
      js() { return ''; }
    },
    'faq': {
      defaults: { title: 'Questions fréquentes', effect: 'stagger' },
      render(props) {
        const s = document.createElement('section');
        s.className = 'kit-section-faq';
        const items = [['Can I use this commercially?', 'Yes. All generated code is yours to use in personal and commercial projects.'],['Do I need a framework?', 'No. Every snippet is vanilla HTML/CSS/JS.'],['Can I customize colors?', 'Absolutely. The CSS custom properties make theming trivial.']];
        s.innerHTML = `<h3>${escapeHtml(props.title)}</h3>${items.map(([q,a]) => `<div class="kit-faq-item"><button class="kit-faq-trigger">${escapeHtml(q)} <span>+</span></button><div class="kit-faq-panel">${escapeHtml(a)}</div></div>`).join('')}`;
        s.querySelectorAll('.kit-faq-trigger').forEach(btn => {
          btn.addEventListener('click', () => {
            const item = btn.parentElement;
            item.classList.toggle('is-open');
            btn.querySelector('span').textContent = item.classList.contains('is-open') ? '−' : '+';
          });
        });
        return s;
      },
      html(props) {
        return `<section class="kit-section-faq">\n  <h3>${escapeHtml(props.title)}</h3>\n  <div class="kit-faq-item">\n    <button class="kit-faq-trigger">Can I use this commercially? <span>+</span></button>\n    <div class="kit-faq-panel">Yes. All generated code is yours to use in personal and commercial projects.</div>\n  </div>\n  <div class="kit-faq-item">\n    <button class="kit-faq-trigger">Do I need a framework? <span>+</span></button>\n    <div class="kit-faq-panel">No. Every snippet is vanilla HTML/CSS/JS.</div>\n  </div>\n  <div class="kit-faq-item">\n    <button class="kit-faq-trigger">Can I customize colors? <span>+</span></button>\n    <div class="kit-faq-panel">Absolutely. The CSS custom properties make theming trivial.</div>\n  </div>\n</section>`;
      },
      css() {
        return `.kit-section-faq { padding:40px 24px; border:1px solid var(--m-border); border-radius:var(--m-radius-xl); background:var(--m-surface); }
.kit-section-faq h3 { font-size:22px; font-weight:700; margin-bottom:24px; text-align:center; }
.kit-faq-item { border-bottom:1px solid var(--m-border); }
.kit-faq-trigger { width:100%; text-align:left; background:transparent; border:none; color:var(--m-text); font-family:var(--m-sans); font-size:14px; font-weight:600; padding:14px 0; cursor:pointer; display:flex; justify-content:space-between; }
.kit-faq-panel { max-height:0; overflow:hidden; color:var(--m-text-muted); font-size:13px; transition:max-height 200ms var(--m-ease), padding 200ms; }
.kit-faq-item.is-open .kit-faq-panel { max-height:200px; padding-bottom:14px; }`;
      },
      js() {
        return `document.querySelectorAll('.kit-faq-trigger').forEach(btn => {\n  btn.addEventListener('click', () => {\n    const item = btn.parentElement;\n    item.classList.toggle('is-open');\n    btn.querySelector('span').textContent = item.classList.contains('is-open') ? '−' : '+';\n  });\n});`;
      }
    },
    'stats': {
      defaults: { title: 'Numbers that matter', effect: 'stagger' },
      render(props) {
        const s = document.createElement('section');
        s.className = 'kit-section-stats';
        s.innerHTML = `<h3 style="text-align:center;margin-bottom:24px;font-size:22px;font-weight:700">${escapeHtml(props.title)}</h3><div class="kit-stats-grid">${[['12k+','Downloads'],['99.9%','Uptime'],['4.9','Rating'],['24h','Support']].map(([n,l]) => `<div class="kit-stat"><strong>${escapeHtml(n)}</strong><span>${escapeHtml(l)}</span></div>`).join('')}</div>`;
        return s;
      },
      html(props) {
        return `<section class="kit-section-stats">\n  <h3 style="text-align:center;margin-bottom:24px;font-size:22px;font-weight:700">${escapeHtml(props.title)}</h3>\n  <div class="kit-stats-grid">\n    <div class="kit-stat"><strong>12k+</strong><span>Downloads</span></div>\n    <div class="kit-stat"><strong>99.9%</strong><span>Uptime</span></div>\n    <div class="kit-stat"><strong>4.9</strong><span>Rating</span></div>\n    <div class="kit-stat"><strong>24h</strong><span>Support</span></div>\n  </div>\n</section>`;
      },
      css() {
        return `.kit-section-stats { padding:32px 24px; border:1px solid var(--m-border); border-radius:var(--m-radius-xl); background:var(--m-surface); }
.kit-stats-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(120px, 1fr)); gap:16px; }
.kit-stat { text-align:center; }
.kit-stat strong { display:block; font-size:28px; font-weight:800; background:linear-gradient(135deg, var(--m-accent), var(--m-accent-2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.kit-stat span { font-size:12px; color:var(--m-text-muted); }`;
      },
      js() { return ''; }
    },
    'newsletter': {
      defaults: { title: 'Stay in the loop', effect: 'fade' },
      render(props) {
        const s = document.createElement('section');
        s.className = 'kit-section-newsletter';
        s.innerHTML = `<h3 style="text-align:center;font-size:22px;font-weight:700;margin-bottom:8px">${escapeHtml(props.title)}</h3><p style="text-align:center;color:var(--m-text-muted);font-size:14px">Get weekly UI tips and new component drops.</p><form class="kit-newsletter-form" onsubmit="event.preventDefault()"><input type="email" class="kit-input" placeholder="you@company.com" required><button class="kit-btn kit-btn-primary" type="submit">Subscribe</button></form>`;
        return s;
      },
      html(props) {
        return `<section class="kit-section-newsletter">\n  <h3 style="text-align:center;font-size:22px;font-weight:700;margin-bottom:8px">${escapeHtml(props.title)}</h3>\n  <p style="text-align:center;color:var(--m-text-muted);font-size:14px">Get weekly UI tips and new component drops.</p>\n  <form class="kit-newsletter-form">\n    <input type="email" class="kit-input" placeholder="you@company.com" required>\n    <button class="kit-btn kit-btn-primary" type="submit">Subscribe</button>\n  </form>\n</section>`;
      },
      css() {
        return `.kit-section-newsletter { padding:40px 24px; border:1px solid var(--m-border); border-radius:var(--m-radius-xl); background:var(--m-surface); }
.kit-newsletter-form { display:flex; gap:10px; max-width:420px; margin:20px auto 0; }
.kit-newsletter-form input { flex:1; }
.kit-input { width:100%; padding:10px 14px; background:var(--m-surface-raised); border:1px solid var(--m-border); border-radius:var(--m-radius); color:var(--m-text); font-family:var(--m-sans); font-size:14px; outline:none; }
.kit-input:focus { border-color:var(--m-accent); }
.kit-btn { display:inline-flex; align-items:center; justify-content:center; padding:10px 18px; border-radius:var(--m-radius); font-family:var(--m-sans); font-size:14px; font-weight:600; cursor:pointer; border:1px solid transparent; }
.kit-btn-primary { background:linear-gradient(135deg, var(--m-accent), color-mix(in srgb, var(--m-accent) 65%, var(--m-accent-2))); color:#fff; }`;
      },
      js() { return ''; }
    },
    'footer': {
      defaults: { title: 'Motion UI Kit', effect: '' },
      render(props) {
        const s = document.createElement('footer');
        s.className = 'kit-section-footer';
        s.innerHTML = `<div class="kit-footer-grid"><div class="kit-footer-col"><h5>Product</h5><ul><li>Components</li><li>Sections</li><li>Effects</li></ul></div><div class="kit-footer-col"><h5>Resources</h5><ul><li>Documentation</li><li>Changelog</li><li>Roadmap</li></ul></div><div class="kit-footer-col"><h5>Company</h5><ul><li>About</li><li>Blog</li><li>Contact</li></ul></div></div><div class="kit-footer-bottom"><span>© ${new Date().getFullYear()} ${escapeHtml(props.title)}</span><span>Made with care</span></div>`;
        return s;
      },
      html(props) {
        return `<footer class="kit-section-footer">\n  <div class="kit-footer-grid">\n    <div class="kit-footer-col"><h5>Product</h5><ul><li>Components</li><li>Sections</li><li>Effects</li></ul></div>\n    <div class="kit-footer-col"><h5>Resources</h5><ul><li>Documentation</li><li>Changelog</li><li>Roadmap</li></ul></div>\n    <div class="kit-footer-col"><h5>Company</h5><ul><li>About</li><li>Blog</li><li>Contact</li></ul></div>\n  </div>\n  <div class="kit-footer-bottom"><span>© ${new Date().getFullYear()} ${escapeHtml(props.title)}</span><span>Made with care</span></div>\n</footer>`;
      },
      css() {
        return `.kit-section-footer { padding:40px 24px; border:1px solid var(--m-border); border-radius:var(--m-radius-xl); background:var(--m-surface); }
.kit-footer-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:24px; margin-bottom:28px; }
.kit-footer-col h5 { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:12px; }
.kit-footer-col ul { list-style:none; font-size:12px; color:var(--m-text-muted); line-height:2; margin:0; padding:0; }
.kit-footer-bottom { display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--m-border); padding-top:20px; font-size:12px; color:var(--m-text-muted); }`;
      },
      js() { return ''; }
    },
    'logo-cloud': {
      defaults: { title: 'Trusted by great teams', effect: '' },
      render(props) {
        const s = document.createElement('section');
        s.className = 'kit-section-logos';
        s.innerHTML = `<h3 style="font-size:14px;font-weight:600;color:var(--m-text-muted)">${escapeHtml(props.title)}</h3><div class="kit-logos-grid">${Array(5).fill('<div class="kit-logo-shape"></div>').join('')}</div>`;
        return s;
      },
      html(props) {
        return `<section class="kit-section-logos">\n  <h3 style="font-size:14px;font-weight:600;color:var(--m-text-muted)">${escapeHtml(props.title)}</h3>\n  <div class="kit-logos-grid">\n    <div class="kit-logo-shape"></div>\n    <div class="kit-logo-shape"></div>\n    <div class="kit-logo-shape"></div>\n    <div class="kit-logo-shape"></div>\n    <div class="kit-logo-shape"></div>\n  </div>\n</section>`;
      },
      css() {
        return `.kit-section-logos { padding:32px 24px; border:1px solid var(--m-border); border-radius:var(--m-radius-xl); background:var(--m-surface); text-align:center; }
.kit-logos-grid { display:flex; justify-content:center; align-items:center; gap:28px; flex-wrap:wrap; margin-top:18px; opacity:0.6; }
.kit-logo-shape { width:84px; height:28px; border-radius:999px; background:var(--m-border); }`;
      },
      js() { return ''; }
    }
  };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function uid() {
    return Math.random().toString(36).slice(2, 9);
  }

  function getFactory(item) {
    if (item.type === 'component') return componentFactory[item.key];
    if (item.type === 'section') return sectionFactory[item.key];
    return null;
  }

  function createItem(type, key) {
    const def = type === 'component' ? componentFactory[key] : sectionFactory[key];
    const categoryKey = type === 'component' ? 'components' : type === 'section' ? 'sections' : type;
    const item = {
      id: uid(),
      type,
      key,
      name: categories[categoryKey].find(c => c.id === key).name,
      props: { ...def.defaults }
    };
    return item;
  }

  function getItemCode(item) {
    const factory = getFactory(item);
    if (!factory) return { html: '', css: '', js: '' };
    return {
      html: factory.html(item.props),
      css: factory.css(),
      js: factory.js()
    };
  }

  function generateManifest() {
    const items = state.canvas.map(item => {
      const code = getItemCode(item);
      return {
        id: item.id,
        type: item.type,
        name: item.name,
        key: item.key,
        props: item.props,
        html: code.html,
        css: code.css,
        js: code.js
      };
    });
    return {
      kitVersion: state.kitVersion,
      theme: state.theme,
      accent: state.accent,
      generatedAt: new Date().toISOString(),
      sharedCSS: cssVarBlock() + '\n\n/* Effects */\n' + effectCSS(),
      items
    };
  }

  function fullPageHTML() {
    const manifest = generateManifest();
    const allCSS = manifest.items.map(i => i.css).join('\n\n');
    const dedupeCSS = [...new Set(allCSS.split('\n'))].join('\n');
    const allJS = manifest.items.map(i => i.js).filter(Boolean).join('\n\n');
    const allHTML = manifest.items.map(i => i.html).join('\n\n');
    return `<!DOCTYPE html>\n<html lang="fr" data-theme="${state.theme === 'system' ? 'dark' : state.theme}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Motion UI Kit — Export</title>\n<style>\n${cssVarBlock()}\n\n${effectCSS()}\n\n${dedupeCSS}\n</style>\n</head>\n<body>\n${allHTML}\n<script>\n${allJS}\n<\/script>\n</body>\n</html>`;
  }

  // ---------------------------------------------------------------------------
  // DOM rendering
  // ---------------------------------------------------------------------------
  const els = {
    libraryContent: document.getElementById('library-content'),
    canvasList: document.getElementById('canvas-list'),
    canvasEmpty: document.getElementById('canvas-empty'),
    canvasCount: document.getElementById('canvas-count'),
    selectionProperties: document.getElementById('selection-properties'),
    codeSnippet: document.getElementById('code-snippet'),
    sharedCSS: document.getElementById('shared-css'),
    manifestOutput: document.getElementById('manifest-output'),
    toastContainer: document.getElementById('toast-container')
  };

  // Global drag-and-drop handlers on the canvas list container
  els.canvasList.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const target = e.target.closest('.canvas-item');
    document.querySelectorAll('.canvas-item').forEach(el => el.classList.remove('is-drop-target'));
    if (target) target.classList.add('is-drop-target');
  });

  els.canvasList.addEventListener('dragleave', e => {
    if (e.target === els.canvasList) {
      document.querySelectorAll('.canvas-item').forEach(el => el.classList.remove('is-drop-target'));
    }
  });

  els.canvasList.addEventListener('drop', e => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const target = e.target.closest('.canvas-item');
    document.querySelectorAll('.canvas-item').forEach(el => el.classList.remove('is-drop-target', 'is-dragging'));
    if (!draggedId || !target) return;
    const targetId = target.dataset.id;
    if (draggedId === targetId) return;
    const from = state.canvas.findIndex(i => i.id === draggedId);
    const to = state.canvas.findIndex(i => i.id === targetId);
    if (from > -1 && to > -1) {
      const [moved] = state.canvas.splice(from, 1);
      state.canvas.splice(to, 0, moved);
      state.selectedId = draggedId;
      renderCanvas();
    }
  });

  function renderLibrary() {
    const items = categories[state.activeLibrary].filter(item => {
      const q = state.libraryQuery.toLowerCase();
      return !q || item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
    });

    els.libraryContent.innerHTML = '';

    if (state.activeLibrary === 'effects') {
      const grid = document.createElement('div');
      grid.className = 'library-effect-grid';
      items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'library-effect-card';
        card.innerHTML = `
          <div class="library-effect-preview"><div class="library-effect-dot" data-preview-effect="${item.id}"></div></div>
          <h4>${escapeHtml(item.name)}</h4>
          <p>${escapeHtml(item.desc)}</p>
          <div class="library-effect-actions">
            <button class="primary" title="Appliquer à l’élément sélectionné">Appliquer</button>
            <button title="Ajouter au canvas">+</button>
            <button title="Copier le code">Code</button>
          </div>
        `;
        const [applyBtn, addBtn, codeBtn] = card.querySelectorAll('button');
        applyBtn.addEventListener('click', e => {
          e.stopPropagation();
          if (state.selectedId) {
            applyEffectToSelected(item.id);
          } else {
            showToast('Sélectionne un élément du canvas pour appliquer l’effet');
          }
        });
        addBtn.addEventListener('click', e => {
          e.stopPropagation();
          addToCanvas('effect', item.id);
        });
        codeBtn.addEventListener('click', e => {
          e.stopPropagation();
          copyEffectSnippet(item.id);
        });
        grid.appendChild(card);
      });
      els.libraryContent.appendChild(grid);
      return;
    }

    const groups = {};
    items.forEach(item => {
      groups[item.group] = groups[item.group] || [];
      groups[item.group].push(item);
    });

    Object.entries(groups).forEach(([group, groupItems]) => {
      const g = document.createElement('div');
      g.className = 'library-group';
      g.innerHTML = `<div class="library-group-title">${escapeHtml(group)}</div>`;
      groupItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'library-item';
        div.innerHTML = `<div class="library-item-icon">${svgIcon(item.icon)}</div><div class="library-item-info"><div class="library-item-name">${escapeHtml(item.name)}</div><div class="library-item-desc">${escapeHtml(item.desc)}</div></div>`;
        div.addEventListener('click', () => addToCanvas(state.activeLibrary, item.id));
        g.appendChild(div);
      });
      els.libraryContent.appendChild(g);
    });
  }

  function getEffectSnippet(key) {
    const rule = effectCSS().split('\n').find(line => line.includes(`[data-kit-effect="${key}"]`));
    return `/* ${effectsLibrary[key].name} */\n${rule || ''}\n\n/* N’oublie pas les keyframes dans effectCSS() */`;
  }

  function copyEffectSnippet(key) {
    const snippet = getEffectSnippet(key);
    navigator.clipboard.writeText(snippet).then(() => showToast('Code de l’effet copié')).catch(() => showToast('Copie impossible'));
  }

  function addToCanvas(type, key) {
    // Normalize library category names to item types.
    const itemType = type === 'components' ? 'component' : type === 'sections' ? 'section' : type;
    if (itemType === 'effect') {
      const item = {
        id: uid(),
        type: 'effect',
        key,
        name: effectsLibrary[key].name,
        props: {}
      };
      state.canvas.push(item);
    } else {
      state.canvas.push(createItem(itemType, key));
    }
    renderCanvas();
    selectItem(state.canvas[state.canvas.length - 1].id);
    const label = itemType === 'effect' ? 'Effet' : itemType === 'component' ? 'Composant' : 'Section';
    showToast(`${label} ajouté`);
  }

  function applyEffectToSelected(effectKey) {
    const item = state.canvas.find(i => i.id === state.selectedId);
    if (!item) return;
    if (item.type === 'effect') return;
    item.props.effect = effectKey;
    renderCanvas();
    renderProperties();
    showToast(`Effet « ${effectsLibrary[effectKey].name} » appliqué`);
  }

  function removeItem(id) {
    state.canvas = state.canvas.filter(i => i.id !== id);
    if (state.selectedId === id) state.selectedId = null;
    renderCanvas();
    renderProperties();
    renderCode();
  }

  function moveItem(id, direction) {
    const idx = state.canvas.findIndex(i => i.id === id);
    if (idx < 0) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= state.canvas.length) return;
    const temp = state.canvas[idx];
    state.canvas[idx] = state.canvas[newIdx];
    state.canvas[newIdx] = temp;
    renderCanvas();
  }

  function selectItem(id) {
    state.selectedId = id;
    document.querySelectorAll('.canvas-item').forEach(el => el.classList.toggle('is-selected', el.dataset.id === id));
    renderProperties();
    renderCode();
  }

  function renderCanvas() {
    const hasItems = state.canvas.length > 0;
    els.canvasEmpty.hidden = hasItems;
    els.canvasList.hidden = !hasItems;
    els.canvasCount.textContent = `${state.canvas.length} élément${state.canvas.length > 1 ? 's' : ''}`;

    els.canvasList.innerHTML = '';
    state.canvas.forEach((item, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = `canvas-item canvas-item-${item.type}${state.selectedId === item.id ? ' is-selected' : ''}`;
      wrapper.dataset.id = item.id;
      wrapper.draggable = true;

      const header = document.createElement('div');
      header.className = 'canvas-item-header';
      header.innerHTML = `<div class="canvas-item-meta"><span class="canvas-item-type">${item.type}</span><span class="canvas-item-name">${escapeHtml(item.name)}</span>${item.props.effect ? `<span class="kit-badge">${escapeHtml(effectsLibrary[item.props.effect]?.name || item.props.effect)}</span>` : ''}</div><div class="canvas-item-actions"><button class="canvas-item-btn" data-action="up" title="Monter">${svgIcon('chevron', 12)}</button><button class="canvas-item-btn" data-action="down" title="Descendre" style="transform:rotate(180deg)">${svgIcon('chevron', 12)}</button><button class="canvas-item-btn danger" data-action="remove" title="Supprimer">${svgIcon('trash', 12)}</button></div>`;

      const body = document.createElement('div');
      body.className = 'canvas-item-body';

      if (item.type === 'effect') {
        wrapper.classList.add('canvas-item-effect');
        body.innerHTML = `<div class="effect-preview" data-kit-effect="${item.key}"></div><div><div style="font-weight:600">${escapeHtml(item.name)}</div><div style="font-size:12px;color:var(--m-text-muted)">${escapeHtml(effectsLibrary[item.key].desc)}</div></div>`;
      } else {
        const factory = getFactory(item);
        const el = factory.render(item.props);
        if (item.props.effect) el.setAttribute('data-kit-effect', item.props.effect);
        if (item.props.effect === 'tilt') setupTilt(el);
        body.appendChild(el);
      }

      wrapper.appendChild(header);
      wrapper.appendChild(body);

      header.addEventListener('click', () => selectItem(item.id));
      wrapper.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', item.id);
        e.dataTransfer.effectAllowed = 'move';
        wrapper.classList.add('is-dragging');
      });
      wrapper.addEventListener('dragend', () => {
        wrapper.classList.remove('is-dragging');
        document.querySelectorAll('.canvas-item').forEach(el => el.classList.remove('is-drop-target'));
      });

      header.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const action = btn.dataset.action;
          if (action === 'up') moveItem(item.id, -1);
          if (action === 'down') moveItem(item.id, 1);
          if (action === 'remove') removeItem(item.id);
        });
      });

      els.canvasList.appendChild(wrapper);
    });
  }

  function setupTilt(el) {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(600px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  }

  // ---------------------------------------------------------------------------
  // Properties panel
  // ---------------------------------------------------------------------------
  function renderProperties() {
    const container = els.selectionProperties;
    if (!state.selectedId) {
      container.innerHTML = '<h3 class="panel-title">Élément sélectionné</h3><p class="panel-empty">Aucun élément sélectionné.</p>';
      return;
    }
    const item = state.canvas.find(i => i.id === state.selectedId);
    if (!item) {
      state.selectedId = null;
      renderProperties();
      return;
    }

    let html = `<h3 class="panel-title">${escapeHtml(item.name)}</h3>`;

    // Effect selector (not for standalone effect items)
    if (item.type !== 'effect') {
      html += `<div class="field"><label>Effet appliqué</label><select id="prop-effect"><option value="">— Aucun —</option>${Object.entries(effectsLibrary).map(([k, e]) => `<option value="${k}"${item.props.effect === k ? ' selected' : ''}>${escapeHtml(e.name)}</option>`).join('')}</select></div>`;
    }

    // Per-item prop editors
    const fields = propFields(item);
    html += fields;

    container.innerHTML = html;

    // Bind effect selector
    const effectSelect = container.querySelector('#prop-effect');
    if (effectSelect) {
      effectSelect.addEventListener('change', () => {
        item.props.effect = effectSelect.value;
        renderCanvas();
        renderProperties();
      });
    }

    // Bind text inputs
    container.querySelectorAll('[data-prop]').forEach(input => {
      input.addEventListener('input', () => {
        const key = input.dataset.prop;
        item.props[key] = input.value;
        renderCanvas();
        renderCode();
      });
    });
  }

  function propFields(item) {
    const inputs = [];
    const factory = getFactory(item);
    const defaults = factory ? factory.defaults : {};
    Object.keys(defaults).forEach(key => {
      if (key === 'effect') return;
      const val = item.props[key];
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      if (String(val).length > 30 || key === 'body' || key === 'text' || key === 'subhead') {
        inputs.push(`<div class="field"><label for="prop-${key}">${escapeHtml(label)}</label><textarea id="prop-${key}" data-prop="${key}">${escapeHtml(val)}</textarea></div>`);
      } else {
        inputs.push(`<div class="field"><label for="prop-${key}">${escapeHtml(label)}</label><input type="text" id="prop-${key}" data-prop="${key}" value="${escapeHtml(val)}"></div>`);
      }
    });
    return inputs.join('');
  }

  // ---------------------------------------------------------------------------
  // Code panel
  // ---------------------------------------------------------------------------
  function renderCode() {
    const selected = state.canvas.find(i => i.id === state.selectedId);
    if (selected && selected.type !== 'effect') {
      const code = getItemCode(selected);
      els.codeSnippet.querySelector('code').textContent = `<!-- ${selected.name} -->\n${code.html}\n\n<style>\n${code.css}\n</style>${code.js ? `\n\n<script>\n${code.js}\n<\/script>` : ''}`;
    } else {
      els.codeSnippet.querySelector('code').textContent = 'Sélectionnez un composant ou une section pour voir son code.';
    }

    els.sharedCSS.querySelector('code').textContent = cssVarBlock() + '\n\n/* Effects */\n' + effectCSS();

    const manifest = generateManifest();
    els.manifestOutput.querySelector('code').textContent = JSON.stringify(manifest, null, 2);
  }

  // ---------------------------------------------------------------------------
  // Theme & accent
  // ---------------------------------------------------------------------------
  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme === 'system' ? '' : theme);
    document.querySelectorAll('#theme-options .theme-option').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.theme === theme);
    });
    renderCode();
  }

  function setAccent(color) {
    state.accent = color;
    document.documentElement.style.setProperty('--m-accent', color);
    document.documentElement.style.setProperty('--m-accent-rgb', hexToRgb(color));
    document.querySelectorAll('.accent-preset').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.color === color);
    });
    document.getElementById('accent-custom').value = color;
    renderCode();
  }

  // ---------------------------------------------------------------------------
  // Export & copy
  // ---------------------------------------------------------------------------
  function copyText(text, label) {
    navigator.clipboard.writeText(text).then(() => showToast(`${label} copié`), () => showToast('Échec de la copie'));
  }

  function downloadHTML() {
    const blob = new Blob([fullPageHTML()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'motion-ui-kit-export.html';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Export .html téléchargé');
  }

  // ---------------------------------------------------------------------------
  // Toasts
  // ---------------------------------------------------------------------------
  function showToast(message) {
    const t = document.createElement('div');
    t.className = 'kit-toast';
    t.textContent = message;
    els.toastContainer.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(12px)'; setTimeout(() => t.remove(), 200); }, 2400);
  }

  // ---------------------------------------------------------------------------
  // Event wiring
  // ---------------------------------------------------------------------------
  function init() {
    // Library tabs
    document.querySelectorAll('.library-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.library-tab').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.activeLibrary = btn.dataset.category;
        renderLibrary();
      });
    });

    // Search
    document.getElementById('library-search').addEventListener('input', e => {
      state.libraryQuery = e.target.value;
      renderLibrary();
    });

    // Canvas actions
    document.getElementById('canvas-clear').addEventListener('click', () => {
      state.canvas = [];
      state.selectedId = null;
      renderCanvas();
      renderProperties();
      renderCode();
      showToast('Canvas vidé');
    });

    document.getElementById('canvas-preview-toggle').addEventListener('click', () => {
      document.querySelectorAll('[data-kit-effect]').forEach(el => {
        const effect = el.getAttribute('data-kit-effect');
        el.removeAttribute('data-kit-effect');
        void el.offsetWidth;
        el.setAttribute('data-kit-effect', effect);
      });
      showToast('Animations relancées');
    });

    // Theme
    document.querySelectorAll('#theme-options .theme-option').forEach(btn => {
      btn.addEventListener('click', () => setTheme(btn.dataset.theme));
    });

    // Accent
    document.querySelectorAll('.accent-preset').forEach(btn => {
      btn.addEventListener('click', () => setAccent(btn.dataset.color));
    });
    document.getElementById('accent-custom').addEventListener('input', e => setAccent(e.target.value));

    // Right panel tabs
    document.querySelectorAll('.panel-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.panel-tab').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        document.querySelectorAll('.panel').forEach(p => p.hidden = true);
        document.getElementById(`panel-${btn.dataset.panel}`).hidden = false;
      });
    });

    // Copy buttons
    document.getElementById('copy-code').addEventListener('click', () => copyText(els.codeSnippet.textContent, 'Code'));
    document.getElementById('copy-shared-css').addEventListener('click', () => copyText(els.sharedCSS.textContent, 'CSS partagé'));
    document.getElementById('copy-manifest').addEventListener('click', () => copyText(els.manifestOutput.textContent, 'Manifest'));
    document.getElementById('copy-full-code').addEventListener('click', () => copyText(fullPageHTML(), 'Page complète'));
    document.getElementById('copy-fetch-snippet').addEventListener('click', () => copyText(document.getElementById('fetch-snippet').textContent, 'Snippet fetch'));

    // Export
    document.getElementById('export-html').addEventListener('click', downloadHTML);

    // Header theme toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
      setTheme(state.theme === 'light' ? 'dark' : 'light');
    });

    // Keyboard shortcut: delete
    document.addEventListener('keydown', e => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedId) {
        removeItem(state.selectedId);
      }
    });

    // Initial render
    setTheme(state.theme);
    setAccent(state.accent);
    renderLibrary();
    renderCanvas();
    renderProperties();
    renderCode();
  }

  init();
})();
