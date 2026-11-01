// modules/ui.js — HUD commun

export function createHUD(buttons) {
  const hud = document.createElement('div');
  hud.id = 'hud';
  hud.innerHTML = `
    <div id="brand"><div class="logo">M</div><h1>MadameGlitch <span id="mode-label">PRO</span></h1></div>
    <div id="controls"></div>
  `;
  document.body.appendChild(hud);

  const controls = hud.querySelector('#controls');
  for (const [id, label] of Object.entries(buttons)) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.id = id;
    btn.textContent = label;
    controls.appendChild(btn);
  }

  const status = document.createElement('div');
  status.id = 'status';
  status.textContent = 'Prêt';
  document.body.appendChild(status);

  return { hud, controls, status };
}

export function setStatus(text, type = '') {
  const el = document.getElementById('status');
  if (!el) return;
  el.textContent = text;
  el.className = type;
}

export function toggleActive(btn, active) {
  if (active) btn.classList.add('active');
  else btn.classList.remove('active');
}

export function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#050505;color:#eee;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,monospace;overflow:hidden;height:100vh;width:100vw}
    #canvas-container{position:fixed;inset:0;z-index:0}
    canvas{display:block}
    #hud{position:fixed;top:16px;left:16px;right:16px;z-index:10;display:flex;justify-content:space-between;align-items:center;pointer-events:none}
    #hud>*{pointer-events:auto}
    #brand{display:flex;align-items:center;gap:10px;background:rgba(0,0,0,0.6);backdrop-filter:blur(10px);padding:8px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.08)}
    #brand .logo{width:28px;height:28px;background:linear-gradient(135deg,#ff2a6d,#05d9e8);border-radius:6px;display:grid;place-items:center;font-weight:800;font-size:14px;color:#000}
    #brand h1{font-size:16px;letter-spacing:0.5px}
    #brand span{color:#ff2a6d}
    #controls{display:flex;gap:8px;background:rgba(0,0,0,0.6);backdrop-filter:blur(10px);padding:8px;border-radius:12px;border:1px solid rgba(255,255,255,0.08)}
    .btn{background:#1a1a1a;border:1px solid rgba(255,255,255,0.08);color:#eee;padding:8px 14px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;transition:all .15s}
    .btn:hover{background:#262626;border-color:rgba(255,255,255,0.18)}
    .btn.active{background:#ff2a6d;color:#fff;border-color:#ff2a6d}
    .btn:disabled{opacity:.4;cursor:not-allowed}
    #status{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.6);backdrop-filter:blur(10px);padding:6px 14px;border-radius:20px;font-size:12px;color:#888;z-index:10;border:1px solid rgba(255,255,255,0.08)}
    #status.recording{color:#ff2a6d;border-color:#ff2a6d}
    #pip{position:fixed;bottom:16px;right:16px;width:240px;height:180px;background:#000;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);z-index:10;display:none;box-shadow:0 10px 40px rgba(0,0,0,0.5)}
    #pip video{width:100%;height:100%;object-fit:cover}
    #pip.visible{display:block}
    #audio-meter{position:fixed;bottom:16px;left:16px;width:200px;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;z-index:10;display:none}
    #audio-meter.visible{display:block}
    #audio-meter .bar{height:100%;width:0%;background:linear-gradient(90deg,#05d9e8,#ff2a6d);transition:width .05s linear}
    #mode-selector{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#050505;z-index:100;gap:20px}
    #mode-selector h2{font-size:32px;letter-spacing:2px}
    #mode-selector .modes{display:flex;gap:20px}
    #mode-selector .mode-btn{padding:20px 40px;font-size:18px;background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:12px;color:#eee;cursor:pointer;transition:all .15s}
    #mode-selector .mode-btn:hover{border-color:#ff2a6d;transform:translateY(-2px)}
  `;
  document.head.appendChild(style);
}
