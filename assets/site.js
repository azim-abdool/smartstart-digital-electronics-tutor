
"use strict";

(function initialiseSmartStartShell(globalObject) {
  const body = document.body;
  const root = body.dataset.root || "";
  const section = body.dataset.section || "home";
  const title = body.dataset.title || "SmartStart Digital Electronics Tutor";

  const modules = [
    { id: "digital-foundations", number: "1", label: "Digital Foundations", status: "available" },
    { id: "logic-fundamentals", number: "2", label: "Logic Fundamentals", status: "available" },
    { id: "boolean-design", number: "3", label: "Boolean Design", status: "available" },
    { id: "data-representation", number: "4", label: "Data Representation", status: "available" },
    { id: "combinational-circuits", number: "5", label: "Combinational Circuits", status: "available" },
    { id: "sequential-logic", number: "6", label: "Sequential Logic", status: "planned" },
    { id: "hardware-practice", number: "7", label: "Digital Hardware Practice", status: "planned" }
  ];

  const sidebar = document.getElementById("site-sidebar");
  if (sidebar) {
    const moduleLinks = modules.map(module => `
      <a class="nav-link ${section === module.id ? "active" : ""}" href="${root}modules/${module.id}/">
        <span class="nav-number">${module.number}</span>
        <span>${module.label}</span>
        <span class="nav-status ${module.status}" aria-label="${module.status}"></span>
      </a>`).join("");

    sidebar.innerHTML = `
      <a class="sidebar-brand" href="${root}">
        <span class="sidebar-kicker">IEEE EDS Trinidad and Tobago</span>
        <span class="sidebar-title">SmartStart Digital Electronics Tutor</span>
        <span class="sidebar-edition">Web reconstruction</span>
      </a>
      <nav class="site-nav" aria-label="Tutor sections">
        <a class="nav-link ${section === "home" ? "active" : ""}" href="${root}">
          <span class="nav-number">⌂</span><span>Home</span><span></span>
        </a>
        <p class="nav-heading">Learning modules</p>
        ${moduleLinks}
        <p class="nav-heading">Tutor resources</p>
        <a class="nav-link ${section === "glossary" ? "active" : ""}" href="${root}glossary/"><span class="nav-number">A–Z</span><span>Glossary</span><span></span></a>
        <a class="nav-link ${section === "references" ? "active" : ""}" href="${root}references/"><span class="nav-number">↗</span><span>References</span><span></span></a>
        <a class="nav-link ${section === "about" ? "active" : ""}" href="${root}about/"><span class="nav-number">i</span><span>About the recovery</span><span></span></a>
      </nav>`;
  }

  const toolbarTitle = document.getElementById("toolbar-title");
  if (toolbarTitle) toolbarTitle.textContent = title;

  const menuButton = document.getElementById("menu-toggle");
  const scrim = document.getElementById("sidebar-scrim");
  const closeMenu = () => {
    sidebar?.classList.remove("open");
    scrim?.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  };
  menuButton?.addEventListener("click", () => {
    const opening = !sidebar?.classList.contains("open");
    sidebar?.classList.toggle("open", opening);
    scrim?.classList.toggle("open", opening);
    menuButton.setAttribute("aria-expanded", String(opening));
  });
  scrim?.addEventListener("click", closeMenu);
  sidebar?.addEventListener("click", event => {
    if (event.target.closest("a") && window.matchMedia("(max-width: 980px)").matches) closeMenu();
  });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });

  const PROGRESS_KEY = "smartstart.tutor.progress.v1";
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
    catch { return {}; }
  }
  function saveProgress(progress) {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); }
    catch { /* Third-party iframe storage can be restricted. */ }
    document.dispatchEvent(new CustomEvent("smartstart:progress", { detail: progress }));
  }
  const Progress = {
    get(id) { return Boolean(loadProgress()[id]); },
    set(id, completed = true) { const p = loadProgress(); p[id] = Boolean(completed); saveProgress(p); },
    complete(id) { this.set(id, true); },
    all() { return loadProgress(); },
    count(ids) { const p = loadProgress(); return ids.filter(id => p[id]).length; }
  };
  globalObject.SmartStartProgress = Progress;

  function updateProgressViews() {
    const ids = ["digital-values", "logic-gates", "boolean-algebra", "boolean-truth-tables", "canonical-forms", "karnaugh-maps", "logic-hazards", "petrick-method", "number-systems", "fixed-floating", "ieee754", "bcd", "gray-code", "ascii", "decoder", "seven-segment", "decoder-applications", "encoder", "comparator", "multiplexer", "mux-synthesis", "demultiplexer"];
    const count = Progress.count(ids);
    document.querySelectorAll("[data-global-progress]").forEach(progress => {
      progress.max = ids.length;
      progress.value = count;
    });
    document.querySelectorAll("[data-global-progress-text]").forEach(node => {
      node.textContent = `${count} of ${ids.length} currently available activities completed`;
    });
    document.querySelectorAll("[data-progress-id]").forEach(node => {
      const complete = Progress.get(node.dataset.progressId);
      node.textContent = complete ? "Completed" : node.dataset.incompleteLabel || "Available";
      node.classList.toggle("available", complete);
      node.classList.toggle("partial", !complete);
    });
  }
  document.addEventListener("smartstart:progress", updateProgressViews);
  updateProgressViews();
})(globalThis);
