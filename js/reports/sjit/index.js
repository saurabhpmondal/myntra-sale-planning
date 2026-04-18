/* ==========================================
   File: js/reports/sjit/index.js
   SJIT PLANNING REPORT
   FULL REPLACE CODE
========================================== */

import { getSjitRows } from "./metrics.js";
import { renderSjitTable } from "./table.js";

/* ==========================================
   PUBLIC
========================================== */

export function renderSjitReport() {
  const root =
    document.getElementById(
      "sjit"
    );

  if (!root)
    return;

  const rows =
    getSjitRows();

  const totals =
    getTotals(
      rows
    );

  root.innerHTML = `
    <div class="kpi-grid">

      <div class="kpi-card">
        <span>North Qty</span>
        <strong>${fmt(
          totals.north
        )}</strong>
      </div>

      <div class="kpi-card">
        <span>South Qty</span>
        <strong>${fmt(
          totals.south
        )}</strong>
      </div>

      <div class="kpi-card">
        <span>Total Qty</span>
        <strong>${fmt(
          totals.total
        )}</strong>
      </div>

      <div class="kpi-card">
        <span>Recall Qty</span>
        <strong>${fmt(
          totals.recall
        )}</strong>
      </div>

    </div>

    <div class="panel-card">
      <h3 class="panel-title">
        SJIT Planning Engine
      </h3>

      <div id="sjitTableWrap"></div>
    </div>
  `;

  renderSjitTable(
    "sjitTableWrap",
    rows
  );
}

/* ==========================================
   TOTALS
========================================== */

function getTotals(
  rows
) {
  const x = {
    north: 0,
    south: 0,
    total: 0,
    recall: 0
  };

  rows.forEach((r) => {
    x.north +=
      r.northQty;

    x.south +=
      r.southQty;

    x.total +=
      r.totalQty;

    x.recall +=
      r.recallQty;
  });

  return x;
}

/* ==========================================
   FORMAT
========================================== */

function fmt(v) {
  return Number(
    v || 0
  ).toLocaleString(
    "en-IN"
  );
}