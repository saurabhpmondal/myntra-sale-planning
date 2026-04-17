/* ==========================================
   DASHBOARD.JS
   Dashboard Report Engine
   KPI + Charts + Summary blocks
========================================== */

import { getDataset } from "../core/state.js";
import { applyGlobalFilters } from "../filters/filter-engine.js";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatGrowthStatus,
  growthClass
} from "../core/formatters.js";
import { sumBy } from "../normalize/numbers.js";

/* ==========================================
   PUBLIC API
========================================== */

export function renderDashboard() {
  renderKpis();
  renderDailySalesPlaceholder();
  renderBrandSummary();
  renderPoTypeSummary();
}

/* ==========================================
   KPI CARDS
========================================== */

function renderKpis() {
  const sales = applyGlobalFilters(
    getDataset("sales")
  );

  const returns = getDataset("returns");

  const revenue = sumBy(
    sales,
    "final_amount"
  );

  const units = sumBy(
    sales,
    "qty"
  );

  const returnPercent =
    calculateReturnPercent(
      sales,
      returns
    );

  const sjitStock = sumBy(
    getDataset("sjitStock"),
    "sellable_inventory_count"
  );

  const sorStock = sumBy(
    getDataset("sorStock"),
    "units"
  );

  const growth = 0;

  setKpi(
    "kpiRevenue",
    formatCurrency(
      revenue
    )
  );

  setKpi(
    "kpiUnits",
    formatNumber(
      units
    )
  );

  setKpi(
    "kpiReturn",
    formatPercent(
      returnPercent
    )
  );

  setKpi(
    "kpiSjit",
    formatNumber(
      sjitStock
    )
  );

  setKpi(
    "kpiSor",
    formatNumber(
      sorStock
    )
  );

  setKpi(
    "kpiGrowth",
    formatGrowthStatus(
      growth
    ),
    growthClass(
      growth
    )
  );
}

function setKpi(
  id,
  value,
  extraClass = ""
) {
  const el =
    document.getElementById(
      id
    );

  if (!el) return;

  el.classList.remove(
    "up",
    "down",
    "flat"
  );

  if (extraClass) {
    el.classList.add(
      extraClass
    );
  }

  el.textContent =
    value;
}

/* ==========================================
   RETURN %
========================================== */

function calculateReturnPercent(
  sales,
  returns
) {
  if (!sales.length)
    return 0;

  const lineIds =
    new Set(
      sales.map(
        (row) =>
          row.order_line_id
      )
    );

  const matched =
    returns.filter(
      (row) =>
        lineIds.has(
          row.order_line_id
        )
    ).length;

  return (
    (matched /
      sales.length) *
    100
  );
}

/* ==========================================
   DAILY SALES CHART
========================================== */

function renderDailySalesPlaceholder() {
  const el =
    document.getElementById(
      "dashboardDailyChart"
    );

  if (!el) return;

  el.innerHTML = `
    <div class="placeholder-box large">
      Date wise Units Chart
      <br><small>Chart engine in next phase</small>
    </div>
  `;
}

/* ==========================================
   BRAND SUMMARY
========================================== */

function renderBrandSummary() {
  const el =
    document.getElementById(
      "dashboardBrandSummary"
    );

  if (!el) return;

  const sales = applyGlobalFilters(
    getDataset("sales")
  );

  const map = {};

  sales.forEach((row) => {
    const brand =
      row.brand ||
      "Unknown";

    map[brand] =
      (map[brand] || 0) +
      Number(
        row.qty || 0
      );
  });

  const rows =
    Object.entries(map)
      .sort(
        (a, b) =>
          b[1] - a[1]
      )
      .slice(0, 8);

  el.innerHTML =
    rows.length
      ? rows
          .map(
            ([brand, qty]) => `
      <div class="dashboard-brand-row">
        <div class="dashboard-brand-name">${brand}</div>
        <div class="dashboard-brand-metric">${formatNumber(qty)}</div>
      </div>
    `
          )
          .join("")
      : `<div class="placeholder-box small">No Data</div>`;
}

/* ==========================================
   PO TYPE SUMMARY
========================================== */

function renderPoTypeSummary() {
  const el =
    document.getElementById(
      "dashboardPoSummary"
    );

  if (!el) return;

  const sales = applyGlobalFilters(
    getDataset("sales")
  );

  const map = {
    SJIT: 0,
    PPMP: 0,
    SOR: 0
  };

  sales.forEach((row) => {
    const key =
      row.po_type;

    if (
      map[key] !==
      undefined
    ) {
      map[key] += Number(
        row.qty || 0
      );
    }
  });

  el.innerHTML =
    Object.entries(map)
      .map(
        ([key, qty]) => `
      <div class="dashboard-po-card ${key.toLowerCase()}">
        <div class="dashboard-po-name">${key}</div>
        <div class="dashboard-po-value">${formatNumber(qty)}</div>
      </div>
    `
      )
      .join("");
}