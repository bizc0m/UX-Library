const prefsDialog = document.querySelector("#prefsDialog");
const openPrefsButtons = [document.querySelector("#openPrefs"), document.querySelector("#openPrefsFooter")];
const sendButton = document.querySelector("#sendToLlm");
const sendPopover = document.querySelector("#sendPopover");
const handoffLog = document.querySelector("#handoffLog");
const saveChatButton = document.querySelector("#saveChat");
const exportMdButton = document.querySelector("#exportMd");
const exportPdfButton = document.querySelector("#exportPdf");
const expandMacroButton = document.querySelector("#expandMacro");
const composerInput = document.querySelector("#composerInput");
const toast = document.querySelector("#toast");
const providerName = document.querySelector(".provider-title h2");
const answerTitle = document.querySelector(".answer h3");
const activeInspectorPanel = document.querySelector("#activeInspectorPanel");

function on(element, eventName, handler) {
  element?.addEventListener(eventName, handler);
}

const macroValues = {
  "..d": "2026-06-06",
  "..dh": "2026-06-06 18:00",
  "#Date": "2026-06-06",
  "#DateHeure": "2026-06-06 18:00",
  "#Projet": "LLM-ROX",
  "#LLM": "Claude",
  "#Compte": "Claude JOB",
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function renderMarkdownExport() {
  return `---
type: chat
projet: LLM-ROX
source: Claude
compte: Claude JOB
date: 2026-06-06 18:00
tags: [strategie, contenu, impactia]
memory_status: a_resumer
handoff:
  - Claude -> ChatGPT
---

# Strategie contenu #impactia #marketing

## Prompt
Peux-tu m'aider a structurer une strategie de contenu pour ImpactIA sur les 3 prochains mois ?

## Reponse Claude
Positionner ImpactIA comme une reference francophone sur l'IA appliquee, en apportant de la valeur concrete, pedagogique et actionnable.

## Memory a generer
- decisions
- points ouverts
- preferences utilisateur
- prompts reutilisables
`;
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
  return Promise.resolve();
}

openPrefsButtons.forEach((button) => {
  button?.addEventListener("click", () => {
    if (typeof prefsDialog.showModal === "function") {
      prefsDialog.showModal();
    } else {
      showToast("Preferences ouvertes");
    }
  });
});

document.querySelector(".dot.red")?.addEventListener("click", () => {
  window.llmRoxWindow?.close();
});

document.querySelector(".dot.yellow")?.addEventListener("click", () => {
  window.llmRoxWindow?.minimize();
});

document.querySelector(".dot.green")?.addEventListener("click", () => {
  window.llmRoxWindow?.maximize();
});

on(sendButton, "click", (event) => {
  event.stopPropagation();
  sendPopover.classList.toggle("open");
  sendPopover.setAttribute("aria-hidden", String(!sendPopover.classList.contains("open")));
});

on(sendPopover, "click", async (event) => {
  const target = event.target.closest("button")?.dataset.target;
  if (!target) return;

  const payload = [
    "Contexte depuis Claude / LLM-ROX",
    "",
    "Projet: ImpactIA",
    "Instruction: critique et ameliore cette strategie.",
    "",
    renderMarkdownExport(),
  ].join("\n");

  await copyToClipboard(payload);
  sendPopover.classList.remove("open");
  sendPopover.setAttribute("aria-hidden", "true");
  handoffLog.innerHTML = `
    <h3>Suivi LLM</h3>
    <p><strong>Claude -> ${target}</strong></p>
    <p>Payload compose et copie. Route recommandee : clipboard + focus, validation humaine.</p>
  `;
  showToast(`Pret a partager vers ${target}`);
});

on(saveChatButton, "click", async () => {
  await copyToClipboard(renderMarkdownExport());
  handoffLog.innerHTML = `
    <h3>Suivi LLM</h3>
    <p><strong>Chat sauvegarde en Markdown</strong></p>
    <p>Cartouche YAML, tags et statut memory inclus.</p>
  `;
  showToast("Export Markdown copie");
});

on(exportMdButton, "click", async () => {
  await copyToClipboard(renderMarkdownExport());
  showToast(".MD copie dans le presse-papier");
});

on(exportPdfButton, "click", () => {
  showToast("Simulation export PDF");
  window.setTimeout(() => window.print(), 250);
});

on(expandMacroButton, "click", () => {
  let value = composerInput.value;
  Object.entries(macroValues).forEach(([key, replacement]) => {
    value = value.split(key).join(replacement);
  });
  composerInput.value = value;
  showToast("Macros expandues");
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".send-menu")) {
    sendPopover.classList.remove("open");
    sendPopover.setAttribute("aria-hidden", "true");
  }
});

document.querySelectorAll(".tree-row.root").forEach((row) => {
  row.addEventListener("click", () => {
    document.querySelectorAll(".tree-row.root").forEach((item) => item.classList.remove("active"));
    row.classList.add("active");
    const service = row.dataset.service || row.textContent.trim();
    if (providerName) providerName.textContent = service;
    if (answerTitle) answerTitle.textContent = service;
    showToast(`${service} selectionne`);
  });
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    if (tab.classList.contains("add")) {
      showToast("Nouvel onglet a connecter");
      return;
    }
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    const service = tab.textContent.replace("×", "").trim();
    if (providerName) providerName.textContent = service;
    if (answerTitle) answerTitle.textContent = service;
    showToast(`${service} actif`);
  });
});

document.querySelectorAll(".inspector-tabs button").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".inspector-tabs button").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    const label = tab.textContent.trim();
    if (activeInspectorPanel) {
      activeInspectorPanel.innerHTML = `<h3>${label}</h3><p>Panneau ${label} actif. Les cartes restent en demo mais le clic est bien branche.</p>`;
    }
    showToast(`${label} actif`);
  });
});

document.querySelectorAll(".prefs-nav button").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".prefs-nav button").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    showToast(`Preferences: ${tab.textContent.trim()}`);
  });
});
