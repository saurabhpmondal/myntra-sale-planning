/* ==========================================
   File: js/reports/export/index.js
   NEW FILE
   Export Center UI
========================================== */

import {
  getExportCounts,
  exportSalesCsv,
  exportSjitCsv,
  exportSorCsv
} from "./actions.js";

/* ==========================================
   PUBLIC
========================================== */

export function renderExportCenter() {
  const root =
    document.getElementById(
      "export"
    );

  if (!root)
    return;

  const counts =
    getExportCounts();

  root.innerHTML = `
    <div class="panel-card">

      <h3 class="panel-title">
        Export Center
      </h3>

      <div class="export-grid">

        <button
          class="export-btn"
          id="expSales"
        >
          Export Sales CSV
          (${counts.sales})
        </button>

        <button
          class="export-btn"
          id="expSjit"
        >
          Export SJIT CSV
          (${counts.sjit})
        </button>

        <button
          class="export-btn"
          id="expSor"
        >
          Export SOR CSV
          (${counts.sor})
        </button>

      </div>

    </div>
  `;

  bindActions();
}

/* ==========================================
   EVENTS
========================================== */

function bindActions() {
  const sales =
    document.getElementById(
      "expSales"
    );

  const sjit =
    document.getElementById(
      "expSjit"
    );

  const sor =
    document.getElementById(
      "expSor"
    );

  if (sales) {
    sales.onclick =
      () =>
        exportSalesCsv();
  }

  if (sjit) {
    sjit.onclick =
      () =>
        exportSjitCsv();
  }

  if (sor) {
    sor.onclick =
      () =>
        exportSorCsv();
  }
}