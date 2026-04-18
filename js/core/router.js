/* ==========================================
   File: js/core/router.js
   FULL REPLACE CODE
   SALES TRAFFIC LAZY LOAD
========================================== */

import { renderDashboard } from "../reports/dashboard/index.js";
import { renderSalesReport } from "../reports/sales/index.js";
import { renderSjitReport } from "../reports/sjit/index.js";

import {
  getDataset,
  setDataset
} from "./state.js";

import {
  fetchMany
} from "../data/fetch-csv.js";

import {
  getSource
} from "../data/sources.js";

/* ==========================================
   PUBLIC
========================================== */

export async function navigate(
  tab = "dashboard"
) {
  setActiveTab(tab);
  await renderTab(tab);
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

async function renderTab(tab) {
  switch (tab) {
    case "dashboard":
      renderDashboard();
      break;

    case "sales":
      await ensureTraffic();

      renderSalesReport();
      break;

    case "sjit":
      await ensureTraffic();

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
   TRAFFIC LAZY LOAD
========================================== */

async function ensureTraffic() {
  const rows =
    getDataset(
      "traffic"
    );

  if (
    rows &&
    rows.length
  ) {
    return;
  }

  const src =
    getSource(
      "traffic"
    );

  if (!src)
    return;

  const result =
    await fetchMany(
      [src]
    );

  if (
    result &&
    result[0]
  ) {
    setDataset(
      "traffic",
      result[0].rows ||
        []
    );
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
    document.getElementById(
      id
    );

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