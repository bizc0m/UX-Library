(function () {
  const DEFAULT_SERVICES = {
    claude: { key: "claude", name: "Claude", icon: "AI", url: "https://claude.ai", partition: "persist:llm-rox-claude", color: "green" },
    chatgpt: { key: "chatgpt", name: "ChatGPT", icon: "CG", url: "https://chat.openai.com", partition: "persist:llm-rox-chatgpt", color: "emerald" },
    gemini: { key: "gemini", name: "Gemini", icon: "G", url: "https://gemini.google.com", partition: "persist:llm-rox-gemini", color: "blue" },
    perplexity: { key: "perplexity", name: "Perplexity", icon: "PX", url: "https://www.perplexity.ai", partition: "persist:llm-rox-perplexity", color: "dark" },
    notion: { key: "notion", name: "Notion", icon: "N", url: "https://www.notion.so", partition: "persist:llm-rox-notion", color: "paper" },
    github: { key: "github", name: "GitHub", icon: "GH", url: "https://github.com", partition: "persist:llm-rox-github", color: "dark" },
    telegram: { key: "telegram", name: "Telegram", icon: "TG", url: "https://web.telegram.org", partition: "persist:llm-rox-telegram", color: "cyan" }
  };

  const OUTLINER_BLUEPRINT = {
    claude: [
      node("account", "Claude JOB", { meta: "compte strategie", tags: ["job"] }),
      node("folder", "Chats", { count: 12, icon: "chat", tags: ["chat"], children: [
        node("chat", "Strategie contenu #impactia", { meta: "handoff en cours", tags: ["impactia"] }),
        node("chat", "Architecture LLM-ROX", { meta: "memory a resumer", tags: ["memory"] })
      ] }),
      node("folder", "Prompts", { count: 48, icon: "prompt", tags: ["prompt"], children: [
        node("prompt", "General", { tags: ["base"] }),
        node("prompt", "Redaction", { tags: ["copy"] }),
        node("prompt", "Analyse critique", { tags: ["audit"] }),
        node("prompt", "Code", { tags: ["dev"] })
      ] }),
      node("folder", "Captures", { count: 23, icon: "capture", tags: ["capture"], children: [
        node("capture", "Aujourd'hui", { count: 6, tags: ["today"] }),
        node("capture", "Semaine", { count: 7 }),
        node("capture", "Ce mois", { count: 10 })
      ] }),
      node("folder", "Projects", { icon: "project", tags: ["project"], children: [
        node("project", "! ImpactIA", { meta: "actif", tags: ["impactia"], pulse: true }),
        node("project", "! Mirae 2026", { tags: ["mirae"] }),
        node("project", "! AlpineChain", { tags: ["chain"] }),
        node("project", "# Journalier", { tags: ["daily"] }),
        node("project", "## Perso", { tags: ["perso"] })
      ] }),
      node("memory", "Memory summary", { meta: "a regenerer", tags: ["memory"] })
    ],
    chatgpt: [
      node("account", "ChatGPT JOB", { meta: "compte principal", tags: ["job"] }),
      node("folder", "Prompts", { count: 31, icon: "prompt" }),
      node("folder", "Chats", { count: 9, icon: "chat" })
    ],
    gemini: [
      node("account", "Gemini Google", { meta: "auth Google", tags: ["google"] }),
      node("folder", "Recherche", { count: 4, icon: "capture" })
    ],
    perplexity: [
      node("account", "Perplexity Pro", { meta: "recherche web", tags: ["web"] }),
      node("folder", "Sources", { count: 5, icon: "capture" })
    ],
    notion: [node("folder", "Pages", { count: 1, icon: "note" })],
    github: [node("folder", "Repos", { count: 2, icon: "project" })],
    telegram: [node("folder", "Messages", { count: 4, icon: "chat" })]
  };

  const TERMINAL_COLORS = ["#7cde00", "#ff5f57", "#ffbd2e", "#2f80ed", "#b875e6", "#08a7b8", "#ffffff"];
  const state = {
    services: loadJson("llm-rox-services", DEFAULT_SERVICES),
    activeService: localStorage.getItem("llm-rox-active-service") || "claude",
    openTabs: loadJson("llm-rox-tabs", ["claude"]),
    expandedNodes: loadJson("llm-rox-expanded-nodes", ["service:claude", "claude:folder:Chats", "claude:folder:Prompts", "claude:folder:Captures", "claude:folder:Projects"]),
    selectedNode: localStorage.getItem("llm-rox-selected-node") || "service:claude",
    customNodes: loadJson("llm-rox-custom-nodes", {}),
    outlinerFilter: "",
    terminals: [],
    activeTerminalId: null,
    logs: [],
    prompts: loadJson("llm-rox-prompts", {}),
    chats: loadJson("llm-rox-chats", {}),
    promptFilter: "",
    chatFilter: ""
  };

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheElements();
    document.body.classList.toggle("electron", Boolean(window.llmRoxWindow));
    bindWindowControls();
    bindShellActions();
    bindInspector();
    bindContextMenu();
    bindTerminalEvents();
    renderOutliner();
    renderTabs();
    renderPrompts();
    renderChats();
    selectService(state.activeService, { silent: true });
    logEvent("LLM-ROX ready");

    // Load files from disk asynchronously
    loadPromptsFromDisk();
    refreshCapturesInOutliner();
  }

  function cacheElements() {
    [
      "serviceTree", "llmTabs", "activeIcon", "activeServiceName", "activeServiceUrl",
      "serviceWebview", "webPaneTitle", "canvas", "splitPane", "terminalDock",
      "terminalTabs", "terminalGrid", "terminalCount", "eventLog", "logCount",
      "inspector", "serviceContext", "toast", "metaService", "metaUrl", "prefName",
      "prefUrl", "prefPartition", "scratchNote", "outlinerSearch", "nodeTitle",
      "nodeType", "nodePath", "nodeTags", "promptSearch", "newPrompt", "promptsList",
      "chatSearch", "chatsList", "sendToLlmModal", "sendTargetService", "sendContent",
      "closeSendModal", "cancelSend", "confirmSend"
    ].forEach((id) => {
      els[id] = document.getElementById(id);
    });
    els.shell = document.querySelector(".app-shell");
  }

  function bindWindowControls() {
    on("#windowClose", "click", () => window.llmRoxWindow?.close());
    on("#windowMinimize", "click", () => window.llmRoxWindow?.minimize());
    on("#windowMaximize", "click", () => window.llmRoxWindow?.maximize());
  }

  function bindShellActions() {
    on("#toggleSidebar", "click", toggleSidebar);
    on("#addService", "click", addServiceFromPrompt);
    on("#addTab", "click", addServiceFromPrompt);
    on("#openCommand", "click", () => toast("Cmd+K arrive en V2"));
    on("#outlinerSearch", "input", (event) => {
      state.outlinerFilter = event.target.value.trim().toLowerCase();
      renderOutliner();
    });
    on("#expandAllNodes", "click", expandAllNodes);
    on("#collapseAllNodes", "click", collapseAllNodes);
    on("#addNode", "click", () => addNodeUnder(state.selectedNode));
    on("#renameNode", "click", () => renameOutlinerNode(state.selectedNode));
    on("#addChildNode", "click", () => addNodeUnder(state.selectedNode));
    on("#configureActive", "click", () => openPrefsForService(state.activeService));
    on("#toggleSplit", "click", toggleSplit);
    on("#closeSplit", "click", () => setSplit(false));
    on("#toggleTerminal", "click", () => setTerminalDock(!els.terminalDock.classList.contains("open")));
    on("#openTerminalDock", "click", () => setTerminalDock(true));
    on("#closeTerminalDock", "click", () => setTerminalDock(false));
    on("#toggleInspector", "click", toggleInspector);
    on("#openSettings", "click", () => activateInspectorPanel("prefs"));
    on("#saveServicePrefs", "click", saveActiveServicePrefs);
    on("#resetServicePrefs", "click", resetActiveServicePrefs);
    on("#reloadView", "click", () => els.serviceWebview?.reload?.());
    on("#openExternal", "click", () => copyText(getActiveService().url).then(() => toast("URL copiee")));
    on("#saveChat", "click", saveChatMarkdown);
    on("#sendToLlm", "click", sendToLlm);
    on("#captureSelection", "click", captureSelection);
    on("#copyScratch", "click", () => copyText(els.scratchNote.value).then(() => toast("Scratch copie")));
    on("#savePromptFromSplit", "click", savePromptFromSplit);
    on("#saveEditingPrompt", "click", saveEditingPrompt);
    on("#memorySummary", "click", insertMemorySummary);
    on("#newTerminal", "click", () => createTerminalPane());
    on("#splitTerminals", "click", () => {
      setTerminalDock(true);
      while (state.terminals.length < 4) createTerminalPane({ silent: true });
      renderTerminals();
      logEvent("Terminal grid 4 panes");
    });
    on("#newPrompt", "click", createNewPrompt);
    on("#promptSearch", "input", (event) => {
      state.promptFilter = event.target.value.trim().toLowerCase();
      renderPrompts();
    });
    on("#chatSearch", "input", (event) => {
      state.chatFilter = event.target.value.trim().toLowerCase();
      renderChats();
    });
    on("#closeSendModal", "click", () => {
      const modal = document.getElementById("sendToLlmModal");
      if (modal) modal.style.display = "none";
    });
    on("#cancelSend", "click", () => {
      const modal = document.getElementById("sendToLlmModal");
      if (modal) modal.style.display = "none";
    });
    on("#confirmSend", "click", () => {
      const target = document.getElementById("sendTargetService")?.value;
      const content = document.getElementById("sendContent")?.value;
      if (!target || target === "- Choisir -") {
        toast("Sélectionnez un LLM");
        return;
      }
      copyText(content).then(() => {
        toast(`Contenu prêt pour ${state.services[target]?.name || target}`);
        logEvent(`Handoff -> ${state.services[target]?.name}`);
        const modal = document.getElementById("sendToLlmModal");
        if (modal) modal.style.display = "none";
      }).catch((err) => {
        toast("Erreur: impossible de copier");
        console.warn("Copy failed", err);
      });
    });
  }

  function bindInspector() {
    document.querySelectorAll(".inspector-tabs button").forEach((button) => {
      button.addEventListener("click", () => activateInspectorPanel(button.dataset.panel));
    });
  }

  function bindContextMenu() {
    document.addEventListener("click", () => closeServiceContext());
    els.serviceContext.addEventListener("click", (event) => {
      const action = event.target.closest("button")?.dataset.action;
      const key = els.serviceContext.dataset.service;
      const nodeId = els.serviceContext.dataset.node;
      if (!action || !key) return;
      closeServiceContext();
      if (action === "configure") openPrefsForService(key);
      if (action === "duplicate") duplicateService(key);
      if (action === "color") rotateServiceColor(key);
      if (action === "add-child") addNodeUnder(nodeId || `service:${key}`);
      if (action === "rename-node") renameOutlinerNode(nodeId || `service:${key}`);
      if (action === "open") selectService(key);
    });
  }

  function bindTerminalEvents() {
    const api = window.llmRoxWindow?.terminal;
    api?.onOutput?.(({ terminalId, data, error }) => {
      const terminal = state.terminals.find((item) => item.id === terminalId);
      if (!terminal) return;
      terminal.output += data;
      terminal.error = Boolean(error);
      updateTerminalOutput(terminalId);
    });
    api?.onClosed?.(({ terminalId, code }) => {
      const terminal = state.terminals.find((item) => item.id === terminalId);
      if (terminal) {
        terminal.output += `\n[process exited: ${code}]\n`;
        terminal.closed = true;
        updateTerminalOutput(terminalId);
      }
    });
  }

  function renderOutliner() {
    const roots = buildOutlinerTree();
    els.serviceTree.innerHTML = roots.map((root) => renderTreeNode(root, 0)).join("");

    els.serviceTree.querySelectorAll(".tree-row").forEach((row) => {
      row.addEventListener("click", (event) => {
        const nodeId = row.dataset.nodeId;
        const node = findNode(nodeId);
        if (!node) return;
        if (event.target.closest(".disclosure")) {
          toggleNode(nodeId);
          return;
        }
        selectOutlinerNode(nodeId);
      });
      row.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        const node = findNode(row.dataset.nodeId);
        if (!node) return;
        openServiceContext(node.serviceKey || state.activeService, event.clientX, event.clientY, node.id);
      });
    });

    syncOutlinerDetail();
  }

  function buildOutlinerTree(options = {}) {
    const serviceRoots = Object.values(state.services).map((service) => {
      const baseChildren = cloneBlueprint(service.key).concat(getCustomChildren(`service:${service.key}`));
      return {
        id: `service:${service.key}`,
        title: service.name,
        type: "service",
        serviceKey: service.key,
        icon: service.icon,
        color: service.color,
        count: service.key === "claude" ? 2 : undefined,
        tags: ["llm"],
        meta: service.url,
        children: withServiceKey(baseChildren, service.key)
      };
    });

    // Build disk captures/chats as outliner nodes
    const captureChildren = (state._diskCaptures || []).map(f => ({
      id: `disk:capture:${f.name}`, title: f.name.replace(".md", ""), type: "capture",
      icon: "capture", meta: new Date(f.modified).toLocaleDateString("fr-FR"),
      tags: ["capture"], children: [], _filePath: f.path
    }));
    const chatChildren = (state._diskChats || []).map(f => ({
      id: `disk:chat:${f.name}`, title: f.name.replace(".md", ""), type: "chat",
      icon: "chat", meta: new Date(f.modified).toLocaleDateString("fr-FR"),
      tags: ["chat"], children: [], _filePath: f.path
    }));
    const promptChildren = Object.values(state.prompts).map(p => ({
      id: `disk:prompt:${p.id}`, title: p.title, type: "prompt",
      icon: "prompt", meta: p.content ? p.content.substring(0, 40) : "(vide)",
      tags: p.tags || [], children: [], _promptId: p.id
    }));

    const utilityRoots = [
      { id: "utility:captures", title: "Captures", type: "folder", icon: "capture", serviceKey: state.activeService, count: captureChildren.length, tags: ["capture"], children: captureChildren.concat(getCustomChildren("utility:captures")) },
      { id: "utility:chats", title: "Chats sauvés", type: "folder", icon: "chat", serviceKey: state.activeService, count: chatChildren.length, tags: ["chat"], children: chatChildren.concat(getCustomChildren("utility:chats")) },
      { id: "utility:prompts", title: "Prompts", type: "folder", icon: "prompt", serviceKey: state.activeService, count: promptChildren.length, tags: ["prompt"], children: promptChildren.concat(getCustomChildren("utility:prompts")) },
      { id: "utility:terminal", title: "Terminal CLI", type: "terminal", serviceKey: state.activeService, count: `${state.terminals.length}/4`, tags: ["cli"], children: getCustomChildren("utility:terminal") },
      { id: "utility:logs", title: "Logs", type: "log", serviceKey: state.activeService, count: state.logs.length, tags: ["log"], children: getCustomChildren("utility:logs") }
    ];

    const roots = serviceRoots.concat(utilityRoots);
    return options.filtered === false ? roots : filterTree(roots, state.outlinerFilter);
  }

  function renderTreeNode(node, level) {
    const hasChildren = node.children && node.children.length > 0;
    const expanded = state.expandedNodes.includes(node.id);
    const selected = state.selectedNode === node.id;
    const service = node.type === "service" ? state.services[node.serviceKey] : null;
    const iconHtml = service
      ? `<span class="service-icon ${service.color}">${escapeHtml(service.icon)}</span>`
      : `<span class="node-icon ${escapeHtml(node.icon || node.type)}">${nodeIconText(node)}</span>`;
    const tagHtml = (node.tags || []).slice(0, 2).map((tag) => `<span class="node-tag">#${escapeHtml(tag)}</span>`).join("");
    const countHtml = node.count !== undefined ? `<span class="count">${escapeHtml(node.count)}</span>` : "";
    const pulseHtml = node.pulse ? `<span class="pulse"></span>` : "";
    const rowClass = [
      "tree-row",
      `level-${Math.min(level, 4)}`,
      node.type === "service" ? "service" : "",
      node.type === "folder" || node.type === "project" ? "folder-node" : "note-node",
      selected ? "node-selected" : "",
      node.serviceKey === state.activeService && node.type === "service" ? "active" : ""
    ].filter(Boolean).join(" ");

    const childrenHtml = hasChildren && expanded
      ? node.children.map((child) => renderTreeNode(child, level + 1)).join("")
      : "";

    return `
      <div class="tree-node ${expanded ? "expanded" : ""} ${hasChildren ? "has-children" : ""}" style="--level:${level}">
        <button class="${rowClass}" data-node-id="${escapeHtml(node.id)}" data-service="${escapeHtml(node.serviceKey || "")}">
          <span class="disclosure">${hasChildren ? (expanded ? "⌄" : "›") : ""}</span>
          ${iconHtml}
          <span class="node-main">
            <span class="label">${escapeHtml(node.title)}</span>
            ${node.meta ? `<span class="meta">${escapeHtml(node.meta)}</span>` : ""}
          </span>
          ${tagHtml ? `<span class="node-tags">${tagHtml}</span>` : ""}
          ${pulseHtml}
          ${countHtml}
        </button>
        ${childrenHtml}
      </div>
    `;
  }

  async function selectOutlinerNode(nodeId) {
    const node = findNode(nodeId);
    if (!node) return;
    state.selectedNode = nodeId;
    localStorage.setItem("llm-rox-selected-node", nodeId);
    if (node.type === "service" && node.serviceKey) selectService(node.serviceKey, { fromOutliner: true });
    if (node.type === "terminal") setTerminalDock(true);
    if (node.type === "log") activateInspectorPanel("logs");

    // Open disk files in split
    if (node._filePath) {
      const api = window.llmRoxWindow?.capture;
      if (api) {
        const result = await api.read(node._filePath);
        if (result.success) {
          showDocumentInSplit(node.title, result.content);
        }
      }
    }
    // Open prompt in split
    if (node._promptId && state.prompts[node._promptId]) {
      showDocumentInSplit(node.title, state.prompts[node._promptId].content || "(vide)");
    }

    renderOutliner();
    syncOutlinerDetail();
    logEvent(`Outliner: ${node.title}`);
  }

  function toggleNode(nodeId) {
    if (state.expandedNodes.includes(nodeId)) {
      state.expandedNodes = state.expandedNodes.filter((id) => id !== nodeId);
    } else {
      state.expandedNodes.push(nodeId);
    }
    saveJson("llm-rox-expanded-nodes", state.expandedNodes);
    renderOutliner();
  }

  function syncOutlinerDetail() {
    const node = findNode(state.selectedNode) || findNode(`service:${state.activeService}`);
    if (!node) return;
    els.nodeTitle.textContent = node.title;
    els.nodeType.textContent = node.type;
    els.nodePath.textContent = getNodePath(node.id).join(" / ");
    els.nodeTags.textContent = (node.tags || []).map((tag) => `#${tag}`).join(" ") || "—";
  }

  function expandAllNodes() {
    const ids = [];
    walkNodes(buildOutlinerTree({ filtered: false }), (node) => {
      if (node.children?.length) ids.push(node.id);
    });
    state.expandedNodes = Array.from(new Set(ids));
    saveJson("llm-rox-expanded-nodes", state.expandedNodes);
    renderOutliner();
  }

  function collapseAllNodes() {
    state.expandedNodes = [`service:${state.activeService}`];
    saveJson("llm-rox-expanded-nodes", state.expandedNodes);
    renderOutliner();
  }

  function renderTabs() {
    els.llmTabs.innerHTML = "";
    state.openTabs.forEach((key) => {
      const service = state.services[key];
      if (!service) return;
      const button = document.createElement("button");
      button.className = `tab ${key === state.activeService ? "active" : ""}`;
      button.dataset.service = key;
      button.innerHTML = `<span class="service-icon ${service.color}">${service.icon}</span><span>${escapeHtml(service.name)}</span><span class="close">×</span>`;
      button.addEventListener("click", (event) => {
        if (event.target.classList.contains("close")) {
          closeTab(key);
        } else {
          selectService(key);
        }
      });
      els.llmTabs.appendChild(button);
    });
  }

  function selectService(key, options = {}) {
    const service = state.services[key];
    if (!service) return;
    if (!isValidUrl(service.url)) {
      toast(`URL invalide pour ${service.name}`);
      return;
    }
    if (!isValidPartition(service.partition)) {
      toast(`Partition invalide pour ${service.name}`);
      return;
    }
    state.activeService = key;
    try {
      localStorage.setItem("llm-rox-active-service", key);
    } catch (e) {
      console.warn("Cannot save active service", e);
    }
    if (!state.openTabs.includes(key)) state.openTabs.push(key);
    saveJson("llm-rox-tabs", state.openTabs);

    document.querySelectorAll(".tree-row.service").forEach((row) => row.classList.toggle("active", row.dataset.service === key));
    if (els.activeIcon) els.activeIcon.textContent = service.icon;
    if (els.activeIcon) els.activeIcon.className = `service-icon ${service.color}`;
    if (els.activeServiceName) els.activeServiceName.textContent = service.name;
    if (els.activeServiceUrl) els.activeServiceUrl.textContent = service.url;
    if (els.webPaneTitle) els.webPaneTitle.textContent = `${service.name} webview`;
    if (els.metaService) els.metaService.textContent = service.name;
    if (els.metaUrl) els.metaUrl.textContent = service.url;
    if (els.prefName) els.prefName.value = service.name;
    if (els.prefUrl) els.prefUrl.value = service.url;
    if (els.prefPartition) els.prefPartition.value = service.partition;

    loadServiceWebview(service);
    renderTabs();
    if (!options.fromOutliner) {
      state.selectedNode = `service:${key}`;
      try {
        localStorage.setItem("llm-rox-selected-node", state.selectedNode);
      } catch (e) {
        console.warn("Cannot save selected node", e);
      }
      renderOutliner();
    }
    if (!options.silent) logEvent(`Service actif: ${service.name}`);
  }

  function closeTab(key) {
    state.openTabs = state.openTabs.filter((item) => item !== key);
    if (state.openTabs.length === 0) state.openTabs = ["claude"];
    if (state.activeService === key) state.activeService = state.openTabs[0];
    saveJson("llm-rox-tabs", state.openTabs);
    selectService(state.activeService);
  }

  function loadServiceWebview(service) {
    if (!els.serviceWebview) return;
    const currentPartition = els.serviceWebview.getAttribute("partition");
    const currentSrc = els.serviceWebview.getAttribute("src");
    if (currentPartition === service.partition) {
      if (currentSrc !== service.url) els.serviceWebview.setAttribute("src", service.url);
      return;
    }

    const nextWebview = document.createElement("webview");
    nextWebview.id = "serviceWebview";
    nextWebview.setAttribute("allowpopups", "");
    nextWebview.setAttribute("partition", service.partition);
    nextWebview.setAttribute("src", service.url);

    // Event listeners for webview lifecycle
    nextWebview.addEventListener("did-start-loading", () => {
      if (els.webPaneTitle) els.webPaneTitle.textContent = `${service.name} webview (loading...)`;
      logEvent(`Loading: ${service.name}`);
    });

    nextWebview.addEventListener("did-finish-load", () => {
      if (els.webPaneTitle) els.webPaneTitle.textContent = `${service.name} webview`;
      logEvent(`✓ Loaded: ${service.name}`);
    });

    nextWebview.addEventListener("did-fail-load", (e) => {
      console.error("Webview load failed:", e);
      if (els.webPaneTitle) els.webPaneTitle.textContent = `${service.name} webview (error)`;
      toast(`Erreur: impossible de charger ${service.name}`);
      logEvent(`✗ Failed: ${service.name} - ${e.errorDescription}`);
    });

    els.serviceWebview.replaceWith(nextWebview);
    els.serviceWebview = nextWebview;
  }

  function addServiceFromPrompt() {
    const name = prompt("Nom du LLM / outil ?");
    if (!name || name.trim().length === 0) {
      toast("Nom requis");
      return;
    }
    let url = prompt("URL du service ?", "https://");
    if (!url || url.trim().length === 0) {
      toast("URL requise");
      return;
    }
    url = normalizeUrl(url.trim());
    if (!isValidUrl(url)) {
      toast("URL invalide (doit être HTTP ou HTTPS)");
      return;
    }
    const key = slugify(name.trim());
    if (state.services[key]) {
      toast(`Service "${name}" existe déjà`);
      return;
    }
    state.services[key] = {
      key,
      name: name.trim(),
      icon: name.slice(0, 2).toUpperCase(),
      url,
      partition: `persist:llm-rox-${key}`,
      color: "green"
    };
    saveJson("llm-rox-services", state.services);
    renderOutliner();
    selectService(key);
    logEvent(`Service ajoute: ${name.trim()}`);
  }

  function createServiceRow(key) {
    renderOutliner();
  }

  function openServiceContext(key, x, y, nodeId = `service:${key}`) {
    if (!els.serviceContext) return;
    els.serviceContext.dataset.service = key;
    els.serviceContext.dataset.node = nodeId;
    els.serviceContext.style.left = `${x}px`;
    els.serviceContext.style.top = `${y}px`;
    els.serviceContext.classList.add("open");
  }

  function closeServiceContext() {
    if (!els.serviceContext) return;
    els.serviceContext.classList.remove("open");
    els.serviceContext.dataset.node = "";
  }

  function openPrefsForService(key) {
    selectService(key);
    activateInspectorPanel("prefs");
    logEvent(`Preferences ouvertes: ${getActiveService().name}`);
  }

  function saveActiveServicePrefs() {
    const service = getActiveService();
    service.name = els.prefName.value.trim() || service.name;
    service.url = normalizeUrl(els.prefUrl.value.trim() || service.url);
    service.partition = els.prefPartition.value.trim() || service.partition;
    saveJson("llm-rox-services", state.services);
    renderOutliner();
    selectService(service.key);
    toast("Preferences LLM sauvegardees");
    logEvent(`URL configuree: ${service.name} -> ${service.url}`);
  }

  function resetActiveServicePrefs() {
    const key = state.activeService;
    if (!DEFAULT_SERVICES[key]) return toast("Pas de reset pour service custom");
    state.services[key] = { ...DEFAULT_SERVICES[key] };
    saveJson("llm-rox-services", state.services);
    renderOutliner();
    selectService(key);
    logEvent(`Service reset: ${key}`);
  }

  function duplicateService(key) {
    const source = state.services[key];
    const duplicateKey = `${key}-${Date.now().toString(36)}`;
    state.services[duplicateKey] = {
      ...source,
      key: duplicateKey,
      name: `${source.name} compte 2`,
      partition: `persist:llm-rox-${duplicateKey}`
    };
    saveJson("llm-rox-services", state.services);
    renderOutliner();
    selectService(duplicateKey);
    logEvent(`Compte duplique: ${source.name}`);
  }

  function rotateServiceColor(key) {
    const colors = ["green", "emerald", "blue", "dark", "cyan", "paper"];
    const service = state.services[key];
    const next = colors[(colors.indexOf(service.color) + 1) % colors.length];
    service.color = next;
    saveJson("llm-rox-services", state.services);
    renderOutliner();
    renderTabs();
    selectService(key);
  }

  function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("collapsed");
    els.shell.classList.toggle("sidebar-collapsed");
  }

  function toggleSplit() {
    setSplit(!els.canvas.classList.contains("split"));
  }

  function setSplit(open) {
    els.canvas.classList.toggle("split", open);
    logEvent(open ? "Split largeur ouvert" : "Split largeur ferme");
  }

  function toggleInspector() {
    els.inspector.classList.toggle("hidden");
    els.shell.classList.toggle("inspector-hidden");
  }

  function activateInspectorPanel(panel) {
    els.inspector.classList.remove("hidden");
    els.shell.classList.remove("inspector-hidden");
    document.querySelectorAll(".inspector-tabs button").forEach((button) => button.classList.toggle("active", button.dataset.panel === panel));
    document.querySelectorAll(".panel").forEach((body) => body.classList.toggle("active", body.dataset.panelBody === panel));
  }

  function setTerminalDock(open) {
    els.terminalDock.classList.toggle("open", open);
    if (open && state.terminals.length === 0) createTerminalPane();
    logEvent(open ? "Terminal dock ouvert" : "Terminal dock ferme");
  }

  async function createTerminalPane(options = {}) {
    if (state.terminals.length >= 4) {
      toast("Maximum 4 fenetres terminal");
      return;
    }
    const id = `term-${Date.now().toString(36)}-${state.terminals.length + 1}`;
    const color = TERMINAL_COLORS[state.terminals.length % TERMINAL_COLORS.length];
    const terminal = {
      id,
      name: `-zsh #${state.terminals.length + 1}`,
      color,
      output: "LLM-ROX terminal\n",
      closed: false
    };
    state.terminals.push(terminal);
    state.activeTerminalId = id;
    const created = await window.llmRoxWindow?.terminal?.create?.(id);
    if (created && !created.success) terminal.output += `[terminal api error] ${created.error}\n`;
    if (!window.llmRoxWindow?.terminal) terminal.output += "[demo] Electron terminal API indisponible dans ce contexte.\n";
    renderTerminals();
    if (!options.silent) logEvent(`Terminal cree: ${terminal.name}`);
  }

  function renderTerminals() {
    els.terminalTabs.innerHTML = "";
    els.terminalGrid.innerHTML = "";
    els.terminalGrid.className = `terminal-grid panes-${Math.max(1, state.terminals.length)}`;
    if (els.terminalCount) els.terminalCount.textContent = `${state.terminals.length}/4`;

    state.terminals.forEach((terminal) => {
      const tab = document.createElement("button");
      tab.className = `terminal-tab ${terminal.id === state.activeTerminalId ? "active" : ""}`;
      tab.style.setProperty("--tab-color", terminal.color);
      tab.textContent = terminal.name;
      tab.addEventListener("click", () => {
        state.activeTerminalId = terminal.id;
        renderTerminals();
      });
      tab.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        cycleTerminalColor(terminal.id);
      });
      els.terminalTabs.appendChild(tab);

      const pane = document.createElement("section");
      pane.className = `terminal-pane ${terminal.id === state.activeTerminalId ? "active" : ""}`;
      pane.style.setProperty("--tab-color", terminal.color);
      pane.dataset.terminal = terminal.id;
      pane.innerHTML = `
        <div class="terminal-pane-head">
          <span>${escapeHtml(terminal.name)}</span>
          <button class="icon-btn" data-close-terminal="${terminal.id}">×</button>
        </div>
        <pre class="terminal-output" data-terminal-output="${terminal.id}">${escapeHtml(terminal.output)}</pre>
        <form class="terminal-input-row" data-terminal-form="${terminal.id}">
          <input placeholder="commande..." autocomplete="off" />
          <button class="tool-btn">Run</button>
        </form>
      `;
      pane.addEventListener("click", () => {
        state.activeTerminalId = terminal.id;
        document.querySelectorAll(".terminal-pane").forEach((item) => item.classList.remove("active"));
        pane.classList.add("active");
      });
      els.terminalGrid.appendChild(pane);
    });

    document.querySelectorAll("[data-close-terminal]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        closeTerminalPane(button.dataset.closeTerminal);
      });
    });

    document.querySelectorAll("[data-terminal-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const id = form.dataset.terminalForm;
        const input = form.querySelector("input");
        const command = input.value.trim();
        if (!command) return;
        input.value = "";
        runTerminalCommand(id, command);
      });
    });
  }

  async function runTerminalCommand(id, command) {
    const terminal = state.terminals.find((item) => item.id === id);
    if (!terminal) return;
    terminal.output += `$ ${command}\n`;
    updateTerminalOutput(id);
    logEvent(`CLI ${terminal.name}: ${command}`);
    const result = await window.llmRoxWindow?.terminal?.execute?.(id, command);
    if (result && !result.success) {
      terminal.output += `[error] ${result.error}\n`;
      updateTerminalOutput(id);
    }
    if (!window.llmRoxWindow?.terminal) {
      terminal.output += `[demo] commande recue: ${command}\n`;
      updateTerminalOutput(id);
    }
  }

  function updateTerminalOutput(id) {
    const terminal = state.terminals.find((item) => item.id === id);
    const output = document.querySelector(`[data-terminal-output="${id}"]`);
    if (!terminal || !output) return;
    output.textContent = terminal.output;
    output.scrollTop = output.scrollHeight;
  }

  async function closeTerminalPane(id) {
    await window.llmRoxWindow?.terminal?.close?.(id);
    state.terminals = state.terminals.filter((terminal) => terminal.id !== id);
    state.activeTerminalId = state.terminals[0]?.id || null;
    renderTerminals();
    logEvent("Terminal ferme");
  }

  function cycleTerminalColor(id) {
    const terminal = state.terminals.find((item) => item.id === id);
    if (!terminal) return;
    const index = TERMINAL_COLORS.indexOf(terminal.color);
    terminal.color = TERMINAL_COLORS[(index + 1) % TERMINAL_COLORS.length];
    renderTerminals();
    logEvent(`Couleur terminal: ${terminal.name}`);
  }

  function node(type, title, options = {}) {
    return {
      id: options.id || `${type}:${slugify(title)}`,
      title,
      type,
      icon: options.icon || type,
      meta: options.meta || "",
      count: options.count,
      tags: options.tags || [],
      pulse: Boolean(options.pulse),
      children: options.children || []
    };
  }

  function cloneBlueprint(serviceKey) {
    const blueprint = OUTLINER_BLUEPRINT[serviceKey] || [
      node("account", `${state.services[serviceKey]?.name || serviceKey} default`, { meta: "compte local" }),
      node("folder", "Chats", { icon: "chat" }),
      node("folder", "Prompts", { icon: "prompt" }),
      node("folder", "Captures", { icon: "capture" }),
      node("folder", "Projects", { icon: "project" })
    ];

    const stamp = (item, path = serviceKey) => ({
      ...item,
      id: item.id.startsWith(`${serviceKey}:`) ? item.id : `${serviceKey}:${item.id}:${slugify(path)}`,
      serviceKey,
      children: (item.children || []).map((child) => stamp(child, `${path}/${item.title}`))
    });

    return blueprint.map((item) => stamp(item));
  }

  function withServiceKey(nodes, serviceKey) {
    return nodes.map((item) => ({
      ...item,
      serviceKey: item.serviceKey || serviceKey,
      children: withServiceKey(item.children || [], serviceKey)
    }));
  }

  function getCustomChildren(parentId) {
    return (state.customNodes[parentId] || []).map((item) => ({
      ...item,
      children: getCustomChildren(item.id)
    }));
  }

  function findNode(nodeId) {
    let found = null;
    walkNodes(buildOutlinerTree({ filtered: false }), (node) => {
      if (node.id === nodeId) found = node;
    });
    return found;
  }

  function walkNodes(nodes, visitor) {
    nodes.forEach((node) => {
      visitor(node);
      if (node.children?.length) walkNodes(node.children, visitor);
    });
  }

  function getNodePath(nodeId) {
    const roots = buildOutlinerTree({ filtered: false });
    const path = [];

    function visit(nodes, trail) {
      for (const item of nodes) {
        const next = trail.concat(item.title);
        if (item.id === nodeId) {
          path.push(...next);
          return true;
        }
        if (item.children?.length && visit(item.children, next)) return true;
      }
      return false;
    }

    visit(roots, []);
    return path.length ? path : ["LLM-ROX"];
  }

  function addNodeUnder(parentId) {
    const parent = findNode(parentId) || findNode(`service:${state.activeService}`);
    if (!parent) return;
    const title = prompt("Nom du nœud ?", "Nouvelle note #tag");
    if (!title) return;
    const type = prompt("Type ? note, folder, prompt, chat, capture, project", "note") || "note";
    const tags = Array.from(title.matchAll(/#([\p{L}\p{N}_-]+)/gu)).map((match) => match[1]);
    const child = {
      id: `custom:${Date.now().toString(36)}`,
      title,
      type,
      icon: type === "folder" ? "project" : type,
      meta: "local",
      tags,
      count: undefined,
      pulse: false,
      serviceKey: parent.serviceKey || state.activeService,
      children: []
    };
    state.customNodes[parent.id] = state.customNodes[parent.id] || [];
    state.customNodes[parent.id].push(child);
    if (!state.expandedNodes.includes(parent.id)) state.expandedNodes.push(parent.id);
    state.selectedNode = child.id;
    persistOutlinerState();
    renderOutliner();
    logEvent(`Nœud ajoute: ${title}`);
  }

  function renameOutlinerNode(nodeId) {
    const node = findNode(nodeId);
    if (!node) return;
    if (node.type === "service") {
      openPrefsForService(node.serviceKey);
      return;
    }
    const nextTitle = prompt("Renommer le nœud", node.title);
    if (!nextTitle) return;
    Object.values(state.customNodes).forEach((children) => {
      const target = children.find((item) => item.id === nodeId);
      if (target) {
        target.title = nextTitle;
        target.tags = Array.from(nextTitle.matchAll(/#([\p{L}\p{N}_-]+)/gu)).map((match) => match[1]);
      }
    });
    persistOutlinerState();
    renderOutliner();
    logEvent(`Nœud renomme: ${nextTitle}`);
  }

  function filterTree(nodes, filter) {
    if (!filter) return nodes;
    return nodes.map((item) => {
      const children = filterTree(item.children || [], filter);
      const haystack = `${item.title} ${item.type} ${(item.tags || []).join(" ")} ${item.meta || ""}`.toLowerCase();
      if (haystack.includes(filter) || children.length) {
        return { ...item, children };
      }
      return null;
    }).filter(Boolean);
  }

  function nodeIconText(item) {
    const map = {
      account: "@",
      chat: "↔",
      prompt: "P",
      capture: "C",
      project: "▣",
      folder: "▣",
      memory: "M",
      note: "N",
      terminal: ">_",
      inbox: "I",
      log: "L"
    };
    return map[item.type] || "•";
  }

  function persistOutlinerState() {
    saveJson("llm-rox-custom-nodes", state.customNodes);
    saveJson("llm-rox-expanded-nodes", state.expandedNodes);
    localStorage.setItem("llm-rox-selected-node", state.selectedNode);
  }

  async function saveChatMarkdown() {
    const service = getActiveService();
    if (!service) {
      toast("Erreur: aucun service actif");
      return;
    }

    // Extract visible text from webview
    let pageText = "";
    if (els.serviceWebview?.executeJavaScript) {
      try {
        pageText = await els.serviceWebview.executeJavaScript(
          `(function() {
            // Try to get chat messages specifically
            const msgs = document.querySelectorAll('[class*="message"], [class*="Message"], [class*="chat"], [class*="turn"], [class*="response"], [class*="reply"], article, [role="article"]');
            if (msgs.length > 0) {
              return Array.from(msgs).map(m => m.innerText).join('\\n\\n---\\n\\n');
            }
            // Fallback: get main content area
            const main = document.querySelector('main, [role="main"], .conversation, .chat-container');
            if (main) return main.innerText;
            // Last resort: body text
            return document.body.innerText.substring(0, 10000);
          })()`
        );
      } catch (e) {
        console.warn("Webview text extraction failed:", e);
      }
    }

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 5).replace(":", "h");
    const markdown = `---\ntype: chat\nservice: ${service.name}\nurl: ${service.url}\ndate: ${now.toISOString()}\ntags: [llm-rox, chat]\nmemory_status: a_resumer\n---\n\n# Chat ${service.name} — ${dateStr} ${timeStr}\n\nSource: ${service.url}\n\n${pageText || "(Contenu webview non accessible — page protégée par CSP)"}\n`;

    const filename = `chat_${slugify(service.name)}_${dateStr}_${timeStr}.md`;
    const api = window.llmRoxWindow?.capture;
    if (api) {
      const result = await api.save({ filename, content: markdown, subfolder: "chats" });
      if (result.success) {
        toast(`Chat sauvé: ${filename}`);
        logEvent(`Chat MD: ${result.path}`);
        await refreshCapturesInOutliner();
      } else {
        toast("Erreur sauvegarde fichier");
      }
    } else {
      await copyText(markdown);
      toast("Chat Markdown copié (presse-papiers)");
    }
  }

  function sendToLlm() {
    const service = getActiveService();
    const modal = document.getElementById("sendToLlmModal");
    if (!modal) return;

    // Populate select with other services
    const select = document.getElementById("sendTargetService");
    if (select) {
      select.innerHTML = '<option>- Choisir -</option>' +
        Object.values(state.services)
          .filter(s => s.key !== service.key)
          .map(s => `<option value="${s.key}">${escapeHtml(s.name)}</option>`)
          .join('');
    }

    // Set default content
    const textarea = document.getElementById("sendContent");
    if (textarea) {
      textarea.value = `Contexte depuis ${service.name}\nURL: ${service.url}\n\nInstruction: critique, resume et propose la suite.`;
    }

    modal.style.display = "flex";
  }

  async function captureSelection() {
    const service = getActiveService();
    let selection = window.getSelection()?.toString() || "";

    // Try to get selection from webview
    if (!selection && els.serviceWebview?.executeJavaScript) {
      try {
        selection = await els.serviceWebview.executeJavaScript("window.getSelection().toString()");
      } catch (e) {
        console.warn("Webview selection failed:", e);
      }
    }

    if (!selection) {
      toast("Sélectionne du texte d'abord (dans la webview ou l'app)");
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const content = `---\ntype: capture\nservice: ${service.name}\nurl: ${service.url}\ndate: ${now.toISOString()}\ntags: [capture]\n---\n\n# Capture — ${service.name}\n\n${selection}\n`;
    const filename = `capture_${slugify(service.name)}_${dateStr}_${Date.now().toString(36)}.md`;

    const api = window.llmRoxWindow?.capture;
    if (api) {
      const result = await api.save({ filename, content, subfolder: "captures" });
      if (result.success) {
        toast(`Capture sauvée: ${filename}`);
        logEvent(`Capture: ${filename}`);
        await refreshCapturesInOutliner();
        return;
      }
    }
    await copyText(content);
    toast("Capture copiée (presse-papiers)");
    logEvent("Capture selection");
  }

  function insertMemorySummary() {
    els.scratchNote.value += "\n\n## Memory summary\n- Decisions\n- Preferences utilisateur\n- Points ouverts\n- Prochaines actions\n";
    logEvent("Bloc memory ajoute");
  }

  // Show a markdown document in the split pane
  function showDocumentInSplit(title, content) {
    setSplit(true);
    delete els.scratchNote.dataset.editingPrompt;
    els.scratchNote.value = content;
    const splitTitle = document.querySelector(".split-pane .pane-title span");
    if (splitTitle) splitTitle.textContent = title;
    logEvent(`Document ouvert: ${title}`);
  }

  // Load captures from disk into the outliner
  async function refreshCapturesInOutliner() {
    const api = window.llmRoxWindow?.capture;
    if (!api) return;

    try {
      const captureFiles = await api.list("captures");
      const chatFiles = await api.list("chats");

      state._diskCaptures = (captureFiles.success ? captureFiles.files : []);
      state._diskChats = (chatFiles.success ? chatFiles.files : []);

      renderOutliner();
    } catch (e) {
      console.warn("Refresh captures failed:", e);
    }
  }

  // Load prompts from disk on startup
  async function loadPromptsFromDisk() {
    const api = window.llmRoxWindow?.prompts;
    if (!api) return;
    try {
      const result = await api.list();
      if (!result.success) return;
      for (const file of result.files) {
        // Parse frontmatter
        const match = file.content.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
        if (!match) continue;
        const id = file.name.replace(".md", "");
        if (state.prompts[id]) {
          // Update content from disk if newer
          state.prompts[id].content = match[2].trim();
        } else {
          // New prompt from disk
          const titleMatch = match[1].match(/title:\s*(.+)/);
          state.prompts[id] = {
            id,
            title: titleMatch ? titleMatch[1].trim() : file.name,
            content: match[2].trim(),
            tags: [],
            created: file.modified,
            updated: file.modified,
            service: "claude"
          };
        }
      }
      saveJson("llm-rox-prompts", state.prompts);
      renderPrompts();
    } catch (e) {
      console.warn("Load prompts from disk failed:", e);
    }
  }

  function getActiveService() {
    return state.services[state.activeService] || state.services.claude;
  }

  function logEvent(message) {
    const stamp = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    state.logs.unshift(`${stamp} - ${message}`);
    state.logs = state.logs.slice(0, 80);
    if (els.logCount) els.logCount.textContent = String(state.logs.length);
    if (els.eventLog) {
      els.eventLog.innerHTML = state.logs.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    }
  }

  function toast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      if (els.toast) els.toast.classList.remove("show");
    }, 2200);
  }
  toast.timer = null;

  function on(selector, eventName, handler) {
    document.querySelector(selector)?.addEventListener(eventName, handler);
  }

  function loadJson(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : structuredClone(fallback);
    } catch {
      return structuredClone(fallback);
    }
  }

  function saveJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`localStorage write failed: ${key}`, e);
    }
  }

  function isValidUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  function isValidPartition(partition) {
    return /^persist:[a-z0-9\-]+$/.test(partition);
  }

  function copyText(text) {
    if (navigator.clipboard) {
      return navigator.clipboard.writeText(text).catch((err) => {
        console.warn("Clipboard API failed, using fallback", err);
        return fallbackCopy(text);
      });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      area.style.pointerEvents = "none";
      document.body.appendChild(area);
      area.select();
      const success = document.execCommand("copy");
      area.remove();
      return success;
    } catch (err) {
      console.warn("Fallback copy failed", err);
      return false;
    }
  }

  function normalizeUrl(url) {
    if (!/^https?:\/\//i.test(url)) return `https://${url}`;
    return url;
  }

  function slugify(value) {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `service-${Date.now()}`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]);
  }

  // PROMPTS MANAGEMENT — file-based + localStorage
  async function createNewPrompt() {
    const title = window.prompt("Titre du prompt?");
    if (!title) return;
    const promptId = `prompt-${Date.now()}`;
    const content = window.prompt("Contenu du prompt (ou vide pour éditer après):", "") || "";
    const now = new Date().toISOString();
    const promptObj = {
      id: promptId,
      title: title.trim(),
      content,
      tags: Array.from(title.matchAll(/#([\p{L}\p{N}_-]+)/gu)).map(m => m[1]),
      project: state.activeService,
      created: now,
      updated: now,
      service: state.activeService
    };
    state.prompts[promptId] = promptObj;
    saveJson("llm-rox-prompts", state.prompts);

    // Save to file
    const md = `---\ntype: prompt\ntitle: ${title.trim()}\nservice: ${state.activeService}\ncreated: ${now}\ntags: [${promptObj.tags.join(", ")}]\n---\n\n${content}\n`;
    await window.llmRoxWindow?.prompts?.save?.({ id: promptId, content: md });

    renderPrompts();
    logEvent(`Prompt créé: ${title}`);
    toast(`Prompt sauvé: ${title.trim()}`);
  }

  function renderPrompts() {
    if (!els.promptsList) return;
    const filter = state.promptFilter.toLowerCase();
    const prompts = Object.values(state.prompts)
      .filter(p => p.title.toLowerCase().includes(filter))
      .sort((a, b) => new Date(b.updated) - new Date(a.updated));

    els.promptsList.innerHTML = prompts.length === 0
      ? '<div style="padding: 10px; text-align: center; color: #667085; font-size: 12px;">Aucun prompt — clique + Nouveau</div>'
      : prompts.map(p => `
        <div class="item-row" data-prompt-id="${escapeHtml(p.id)}">
          <div>
            <div class="item-title">${escapeHtml(p.title)}</div>
            <div class="item-meta">${escapeHtml(p.content ? p.content.substring(0, 60) + "..." : "(vide)")}</div>
          </div>
          <div class="item-actions">
            <button data-action="edit-prompt" data-id="${escapeHtml(p.id)}">Edit</button>
            <button data-action="use-prompt" data-id="${escapeHtml(p.id)}">Use</button>
            <button data-action="del-prompt" data-id="${escapeHtml(p.id)}">Del</button>
          </div>
        </div>
      `).join('');

    // Bind actions properly (no inline onclick)
    els.promptsList.querySelectorAll("[data-action]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (btn.dataset.action === "edit-prompt") editPrompt(id);
        if (btn.dataset.action === "del-prompt") deletePrompt(id);
        if (btn.dataset.action === "use-prompt") usePromptInSplit(id);
      });
    });

    // Click row to preview in split
    els.promptsList.querySelectorAll(".item-row").forEach(row => {
      row.addEventListener("click", () => {
        const id = row.dataset.promptId;
        if (id) showDocumentInSplit(state.prompts[id]?.title || "Prompt", state.prompts[id]?.content || "");
      });
    });
  }

  // CHATS MANAGEMENT
  function renderChats() {
    if (!els.chatsList) return;
    const filter = state.chatFilter.toLowerCase();
    const chats = Object.values(state.chats)
      .filter(c => c.title.toLowerCase().includes(filter))
      .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

    els.chatsList.innerHTML = chats.length === 0
      ? '<div style="padding: 10px; text-align: center; color: #667085; font-size: 12px;">Aucun chat sauvegardé</div>'
      : chats.map(c => `
        <div class="item-row">
          <div>
            <div class="item-title">${escapeHtml(c.title)}</div>
            <div class="item-meta">${c.service} • ${new Date(c.savedAt).toLocaleDateString()}</div>
          </div>
          <div class="item-actions">
            <button onclick="exportChat('${c.id}')">Export</button>
            <button onclick="deleteChat('${c.id}')">Del</button>
          </div>
        </div>
      `).join('');
  }

  function saveCurrentChatToHistory() {
    const chatId = `chat-${Date.now()}`;
    const title = prompt("Titre du chat?", `Chat ${new Date().toLocaleDateString()}`);
    if (!title) return;

    state.chats[chatId] = {
      id: chatId,
      service: state.activeService,
      account: "default",
      title: title.trim(),
      messages: [],
      metadata: {
        project: state.activeService,
        tags: [],
        savedAt: new Date().toISOString(),
        memory: ""
      }
    };
    saveJson("llm-rox-chats", state.chats);
    renderChats();
    logEvent(`Chat sauvegardé: ${title}`);
    toast("Chat sauvegardé!");
  }

  function editPrompt(id) {
    const p = state.prompts[id];
    if (!p) return toast("Prompt non trouvé");
    // Show content in split for editing
    setSplit(true);
    els.scratchNote.value = p.content || "";
    els.scratchNote.dataset.editingPrompt = id;
    toast(`Édite "${p.title}" dans le split — clique "Save Prompt" quand fini`);
    logEvent(`Édition prompt: ${p.title}`);
  }

  async function saveEditingPrompt() {
    const id = els.scratchNote.dataset.editingPrompt;
    if (!id || !state.prompts[id]) {
      toast("Aucun prompt en cours d'édition");
      return;
    }
    const p = state.prompts[id];
    p.content = els.scratchNote.value;
    p.updated = new Date().toISOString();
    saveJson("llm-rox-prompts", state.prompts);

    const md = `---\ntype: prompt\ntitle: ${p.title}\nservice: ${p.service}\ncreated: ${p.created}\nupdated: ${p.updated}\ntags: [${(p.tags || []).join(", ")}]\n---\n\n${p.content}\n`;
    await window.llmRoxWindow?.prompts?.save?.({ id, content: md });

    delete els.scratchNote.dataset.editingPrompt;
    renderPrompts();
    toast(`Prompt sauvé: ${p.title}`);
    logEvent(`Prompt sauvé: ${p.title}`);
  }

  async function deletePrompt(id) {
    const p = state.prompts[id];
    if (!p) return toast("Prompt non trouvé");
    if (!confirm(`Supprimer "${p.title}" ?`)) return;
    delete state.prompts[id];
    saveJson("llm-rox-prompts", state.prompts);
    await window.llmRoxWindow?.prompts?.delete?.(id);
    renderPrompts();
    logEvent(`Prompt supprimé: ${p.title}`);
    toast("Prompt supprimé");
  }

  async function savePromptFromSplit() {
    const content = els.scratchNote.value.trim();
    if (!content) { toast("Le split est vide"); return; }
    const title = window.prompt("Titre du prompt?");
    if (!title) return;
    const promptId = `prompt-${Date.now()}`;
    const now = new Date().toISOString();
    state.prompts[promptId] = {
      id: promptId, title: title.trim(), content,
      tags: Array.from(title.matchAll(/#([\p{L}\p{N}_-]+)/gu)).map(m => m[1]),
      project: state.activeService, created: now, updated: now, service: state.activeService
    };
    saveJson("llm-rox-prompts", state.prompts);
    const md = `---\ntype: prompt\ntitle: ${title.trim()}\nservice: ${state.activeService}\ncreated: ${now}\ntags: []\n---\n\n${content}\n`;
    await window.llmRoxWindow?.prompts?.save?.({ id: promptId, content: md });
    renderPrompts();
    renderOutliner();
    toast(`Prompt sauvé: ${title.trim()}`);
    logEvent(`Prompt créé depuis split: ${title.trim()}`);
  }

  function usePromptInSplit(id) {
    const p = state.prompts[id];
    if (!p) return;
    setSplit(true);
    els.scratchNote.value = p.content || "";
    toast(`Prompt "${p.title}" chargé dans le split`);
    logEvent(`Prompt utilisé: ${p.title}`);
  }

  function exportChat(id) {
    const chat = state.chats[id];
    if (!chat) return toast("Chat non trouvé");
    const markdown = `# ${chat.title}\n\n_${chat.metadata.savedAt}_\n\nService: **${state.services[chat.service]?.name || chat.service}**\n\n`;
    copyText(markdown).then(() => {
      toast("Chat exporté vers presse-papiers");
      logEvent(`Chat exporté: ${chat.title}`);
    }).catch((err) => {
      console.warn("Export failed", err);
      toast("Erreur d'export");
    });
  }

  function deleteChat(id) {
    const chat = state.chats[id];
    if (!chat) return toast("Chat non trouvé");
    if (!confirm(`Supprimer "${chat.title}" ?`)) return;
    delete state.chats[id];
    saveJson("llm-rox-chats", state.chats);
    renderChats();
    logEvent(`Chat supprimé: ${chat.title}`);
    toast("Chat supprimé");
  }

  // Expose functions for any remaining inline handlers
  window.exportChat = exportChat;
  window.deleteChat = deleteChat;

})();
