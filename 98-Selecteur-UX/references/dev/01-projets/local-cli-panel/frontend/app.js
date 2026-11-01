const API = "http://127.0.0.1:8787";
const TOKEN = "";
const statusEl = document.querySelector("#status");
const gridEl = document.querySelector("#task-grid");
const outputEl = document.querySelector("#output");
const historyEl = document.querySelector("#history-list");

let meta = null;

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (TOKEN) headers["X-Auth-Token"] = TOKEN;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (res.status === 428) {
    return { needConfirm: true, ...(await res.json()) };
  }
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function init() {
  try {
    meta = await api("/api/tasks");
    statusEl.textContent = "en ligne";
    statusEl.classList.add("online");
    renderTasks();
  } catch (e) {
    statusEl.textContent = "hors ligne — agent lancé ?";
    statusEl.classList.add("offline");
    gridEl.innerHTML = `<p>Impossible de contacter ${API}. Lance l'agent :
    <code>./agent/start.sh</code></p>`;
  }
  loadHistory();
}

function renderTasks() {
  gridEl.innerHTML = "";
  const tasks = meta.tasks;
  if (!Object.keys(tasks).length) {
    gridEl.innerHTML = "<p>Aucune tâche configurée.</p>";
    return;
  }
  for (const [name, cfg] of Object.entries(tasks)) {
    const btn = document.createElement("button");
    btn.className = "task-card" + (cfg.confirm ? " danger" : "");
    btn.innerHTML = `
      <div class="label">${escapeHtml(cfg.label)}</div>
      ${cfg.description ? `<div class="desc">${escapeHtml(cfg.description)}</div>` : ""}
      <div class="meta">${escapeHtml(name)} · ${cfg.timeout}s</div>`;
    btn.addEventListener("click", () => runTask(name, cfg));
    gridEl.appendChild(btn);
  }
}

async function runTask(name, cfg) {
  if (cfg.confirm) {
    const ok = confirm(
      `⚠ Tâche destructrice « ${cfg.label} ».\n\nVoulez-vous vraiment l'exécuter ?`
    );
    if (!ok) return;
  }

  setRunning(true);
  outputEl.textContent = `$ exécution de ${name}…`;
  outputEl.classList.remove("stderr");

  try {
    const body = { task: name };
    if (cfg.confirm) body.confirm = true;
    const res = await api("/api/run-stream", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (res.error) {
      printError(res.error);
      return;
    }

    const source = new EventSource(`${API}/api/stream/${res.run_id}`);
    const chunks = { stdout: "", stderr: "" };

    source.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.type === "line") {
        chunks[data.stream] += data.line + "\n";
        outputEl.textContent = `$ ${data.stream}\n` + chunks[data.stream];
        outputEl.scrollTop = outputEl.scrollHeight;
      } else if (data.type === "done") {
        source.close();
        setRunning(false);
        renderDone(data, chunks);
        loadHistory();
      } else if (data.type === "error") {
        source.close();
        setRunning(false);
        printError(data.error);
      }
    };
    source.onerror = () => {
      source.close();
      setRunning(false);
      printError("Connexion de flux interrompue");
    };
  } catch (e) {
    setRunning(false);
    printError(e.message);
  }
}

function renderDone(data, chunks) {
  let out = "";
  if (chunks.stdout) out += chunks.stdout;
  if (chunks.stderr) {
    out += "\n[stderr]\n" + chunks.stderr;
  }
  if (data.error) {
    out += `\n${data.error}\n`;
  }
  out += `\n── sortie terminée · code ${data.returncode}${data.duration ? ` · ${data.duration}s` : ""}\n`;
  outputEl.textContent = out;
  if (data.returncode === 0 && !data.error) {
    outputEl.classList.add("done-ok");
  } else {
    outputEl.classList.add("done-err");
  }
}

function printError(msg) {
  outputEl.textContent = `✗ ${msg}\n\nVérifie que l'agent tourne : ./agent/start.sh`;
  outputEl.classList.add("done-err");
}

function setRunning(on) {
  document.querySelectorAll(".task-card").forEach((b) => {
    b.classList.toggle("running", on);
  });
}

async function loadHistory() {
  try {
    const { history } = await api("/api/history");
    historyEl.innerHTML = "";
    for (const h of history) {
      const li = document.createElement("li");
      li.className = "history-item";
      li.innerHTML = `
        <span class="time">${escapeHtml(h.ts)}</span>
        <span class="rc-${h.returncode === 0 ? "ok" : "err"}">code ${h.returncode}</span> ·
        <span class="cmd">${escapeHtml(h.cmd)}</span>
        ${h.duration ? `<br><span class="time">${h.duration}s</span>` : ""}`;
      li.addEventListener("click", () => showHistoryDetail(h));
      historyEl.appendChild(li);
    }
  } catch {
    historyEl.innerHTML = "<li>Historique indisponible</li>";
  }
}

function showHistoryDetail(h) {
  outputEl.classList.remove("done-ok", "done-err");
  outputEl.textContent =
    `$ ${h.cmd}\n` +
    `(cwd: ${h.cwd})\n\n` +
    (h.stdout || "") +
    (h.stderr ? `\n[stderr]\n${h.stderr}` : "") +
    `\n── code ${h.returncode} · ${h.duration}s · ${h.ts}\n`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

init();
