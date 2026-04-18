/* ==========================================
   File: js/core/router.js
   FULL REPLACE CODE
   CLEAN CORE ROUTER
   Dashboard + Sales + SJIT + SOR + Export
========================================== */

import { renderDashboard } from "../reports/dashboard/index.js";
import { renderSalesReport } from "../reports/sales/index.js";
import { renderSjitReport } from "../reports/sjit/index.js";

/* ==========================================
   PUBLIC
========================================== */

export function navigate(
  tab = "dashboard"
) {
  setActiveTab(tab);
  renderTab(tab);
}

/* ==========================================
   ACTIVE UI
========================================== */

function setActiveTab(tab) {
  const buttons =
    document.querySelectorAll(
      ".tab-btn"
    );

  const panels =
    document.querySelectorAll(
      ".tab-panel"
    );

  buttons.forEach((btn) => {
    btn.classList.toggle(
      "active",
      btn.dataset.tab === tab
    );
  });

  panels.forEach((panel) => {
    panel.classList.toggle(
      "active",
      panel.id === tab
    );
  });
}

/* ==========================================
   TAB RENDER
========================================== */

function renderTab(tab) {
  switch (tab) {
    case "dashboard":
      renderDashboard();
      break;

    case "sales":
      renderSalesReport();
      break;

    case "sjit":
      renderSjitReport();
      break;

    case "sor":
      renderPlaceholder(
        "sor",
        "SOR Planning"
      );
      break;

    case "export":
      renderPlaceholder(
        "export",
        "Export Center"
      );
      break;

    default:
      renderDashboard();
      break;
  }
}

/* ==========================================
   PLACEHOLDER
========================================== */

function renderPlaceholder(
  id,
  title
) {
  const el =
    document.getElementById(id);

  if (!el) return;

  el.innerHTML = `
    <div class="panel-card">
      <h3 class="panel-title">
        ${title}
      </h3>

      <div class="placeholder-box large">
        Coming Soon
      </div>
    </div>
  `;
}