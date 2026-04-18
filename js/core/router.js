/* ==========================================
   ROUTER.JS
   App tab router
========================================== */

import { renderDashboard } from "../reports/dashboard/index.js";
import { renderSalesReport } from "../reports/sales/index.js";

/* ==========================================
   PUBLIC
========================================== */

export function navigate(tab = "dashboard") {
  setActiveTab(tab);
  renderTab(tab);
}

/* ==========================================
   CORE
========================================== */

function renderTab(tab) {
  const app =
    document.getElementById(
      "reportRoot"
    );

  if (!app) return;

  switch (tab) {
    case "sales":
      app.innerHTML = `
        <section
          id="salesReportRoot"
          class="report-shell"
        ></section>
      `;

      renderSalesReport();
      break;

    case "dashboard":
    default:
      app.innerHTML = `
        <section
          id="dashboardRoot"
          class="report-shell"
        ></section>
      `;

      renderDashboard();
      break;
  }
}

/* ==========================================
   UI
========================================== */

function setActiveTab(tab) {
  const buttons =
    document.querySelectorAll(
      ".tab-btn"
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
}