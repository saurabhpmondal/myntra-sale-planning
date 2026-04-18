/* ==========================================
   File: js/reports/traffic/index.js
   TRAFFIC REPORT
   Main renderer
========================================== */

import { getTrafficRows } from "./metrics.js";
import { renderTrafficTable } from "./table.js";

/* ==========================================
   PUBLIC
========================================== */

export function renderTrafficReport() {
  const root =
    document.getElementById(
      "traffic"
    );

  if (!root)
    return;

  const rows =
    getTrafficRows();

  const totals =
    getTotals(
      rows
    );

  root.innerHTML = `
    <div class="kpi-grid">

      <div class="kpi-card">
        <span>Impressions</span>
        <strong>${fmt(
          totals.impressions
        )}</strong>
      </div>

      <div class="kpi-card">
        <span>Clicks</span>
        <strong>${fmt(
          totals.clicks
        )}</strong>
      </div>

      <div class="kpi-card">
        <span>CTR</span>
        <strong>${totals.ctr.toFixed(
          1
        )}%</strong>
      </div>

      <div class="kpi-card">
        <span>Purchases</span>
        <strong>${fmt(
          totals.purchases
        )}</strong>
      </div>

    </div>

    <div class="panel-card">
      <h3 class="panel-title">
        Last 7 Days Traffic Report
      </h3>

      <div id="trafficTableWrap"></div>
    </div>
  `;

  renderTrafficTable(
    "trafficTableWrap",
    rows
  );
}

/* ==========================================
   TOTALS
========================================== */

function getTotals(
  rows
) {
  const obj = {
    impressions: 0,
    clicks: 0,
    purchases: 0,
    ctr: 0
  };

  rows.forEach((r) => {
    obj.impressions +=
      r.impressions;

    obj.clicks +=
      r.clicks;

    obj.purchases +=
      r.purchases;
  });

  obj.ctr =
    obj.impressions > 0
      ? (obj.clicks /
          obj.impressions) *
        100
      : 0;

  return obj;
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