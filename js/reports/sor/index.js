/* ==========================================
   File: js/reports/sor/index.js
   NEW FILE
   SOR Planning Report
========================================== */

import { getSorRows } from "./metrics.js";
import { renderSorTable } from "./table.js";

/* ==========================================
   PUBLIC
========================================== */

export function renderSorReport() {
  const root =
    document.getElementById(
      "sor"
    );

  if (!root)
    return;

  const rows =
    getSorRows();

  const totals =
    getTotals(
      rows
    );

  root.innerHTML = `
    <div class="kpi-grid">

      <div class="kpi-card">
        <span>Shipment Qty</span>
        <strong>${fmt(
          totals.ship
        )}</strong>
      </div>

      <div class="kpi-card">
        <span>Recall Qty</span>
        <strong>${fmt(
          totals.recall
        )}</strong>
      </div>

      <div class="kpi-card">
        <span>Ship Styles</span>
        <strong>${fmt(
          totals.shipStyles
        )}</strong>
      </div>

      <div class="kpi-card">
        <span>Recall Styles</span>
        <strong>${fmt(
          totals.recallStyles
        )}</strong>
      </div>

    </div>

    <div class="panel-card">
      <h3 class="panel-title">
        SOR Planning Engine
      </h3>

      <div id="sorTableWrap"></div>
    </div>
  `;

  renderSorTable(
    "sorTableWrap",
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
    ship: 0,
    recall: 0,
    shipStyles: 0,
    recallStyles: 0
  };

  rows.forEach((r) => {
    x.ship +=
      r.shipQty;

    x.recall +=
      r.recallQty;

    if (
      r.shipQty > 0
    ) {
      x.shipStyles++;
    }

    if (
      r.recallQty > 0
    ) {
      x.recallStyles++;
    }
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