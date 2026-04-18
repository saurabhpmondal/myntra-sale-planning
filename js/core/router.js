/* ==========================================
   File: js/core/router.js
   FULL REPLACE CODE
   SAFE MERGED ROUTER
   Dashboard + Sales + Traffic + SJIT
========================================== */

import { renderDashboard } from "../reports/dashboard/index.js";
import { renderSalesReport } from "../reports/sales/index.js";
import { renderTrafficReport } from "../reports/traffic/index.js";
import { renderSjitReport } from "../reports/sjit/index.js";

/* ==========================================
   PUBLIC
========================================== */

export function navigate(tab = "dashboard") {
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
   RENDER TAB
========================================== */

function renderTab(tab) {
  switch (tab) {
    case "dashboard":
      renderDashboard();
      break;

    case "sales":
      renderSalesReport();
      break;

    case "traffic":
      renderTrafficReport();
      break;

    case "sjit":
      renderSjitReport();
      break;

    case "products":
    case "inventory":
    case "sor":
    case "export":
      renderPlaceholder(tab);
      break;

    default:
      renderDashboard();
      break;
  }
}

/* ==========================================
   PLACEHOLDER
========================================== */

function renderPlaceholder(id) {
  const el =
    document.getElementById(id);

  if (!el) return;

  if (
    el.innerHTML.trim() !== ""
  )
    return;

  el.innerHTML = `
    <div class="panel-card">
      <div class="placeholder-box large">
        Coming Soon
      </div>
    </div>
  `;
}