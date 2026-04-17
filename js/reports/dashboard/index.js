/* ==========================================
   DASHBOARD / INDEX.JS
   Safe Modular Dashboard Controller
========================================== */

import { renderKpis } from "./kpi.js";
import { renderChart } from "./chart.js";
import { renderBrandTable } from "./brand.js";
import { renderPoTypeTable } from "./po.js";
import { renderPriceRangeTable } from "./price.js";
import { renderErpStatusTable } from "./erp.js";
import { renderStockCoverTable } from "./cover.js";

export function renderDashboard() {
  safe(renderKpis);
  safe(renderChart);

  safe(renderBrandTable);
  safe(renderPoTypeTable);

  safe(renderPriceRangeTable);
  safe(renderErpStatusTable);

  safe(renderStockCoverTable);
}

/* ==========================================
   SAFE RUNNER
========================================== */

function safe(fn) {
  try {
    fn();
  } catch (error) {
    console.error(
      "Dashboard module failed:",
      fn.name,
      error
    );
  }
}