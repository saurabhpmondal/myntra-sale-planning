/* ==========================================
   ROUTER.JS
   Central tab router
========================================== */

import { renderDashboard } from "../reports/dashboard/index.js";
import { renderSalesReport } from "../reports/sales/index.js";

/* ==========================================
   PUBLIC
========================================== */

export function navigate(
  tab = "dashboard"
) {
  activateTab(tab);
  renderTab(tab);
}

/* ==========================================
   RENDER
========================================== */

function renderTab(tab) {
  switch (tab) {
    case "sales":
      renderSalesReport();
      break;

    case "dashboard":
      renderDashboard();
      break;

    default:
      break;
  }
}

/* ==========================================
   UI ACTIVE STATES
========================================== */

function activateTab(tab) {
  const buttons =
    document.querySelectorAll(
      ".tab-btn"
    );

  const panels =
    document.querySelectorAll(
      ".tab-panel"
    );

  buttons.forEach(
    (btn) => {
      const active =
        btn.dataset.tab ===
        tab;

      btn.classList.toggle(
        "active",
        active
      );
    }
  );

  panels.forEach(
    (panel) => {
      const active =
        panel.id ===
        tab;

      panel.classList.toggle(
        "active",
        active
      );
    }
  );
}