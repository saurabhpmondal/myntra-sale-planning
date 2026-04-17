/* ==========================================
   DASHBOARD / INDEX.JS
   Ultra Safe Modular Controller
========================================== */

import { renderKpis } from "./kpi.js";
import { renderChart } from "./chart.js";
import { renderBrandTable } from "./brand.js";
import { renderPoTypeTable } from "./po.js";
import { renderPriceRangeTable } from "./price.js";
import { renderErpStatusTable } from "./erp.js";
import { renderStockCoverTable } from "./cover.js";

/* ==========================================
   PUBLIC
========================================== */

export function renderDashboard() {
  run(
    renderKpis,
    "kpi"
  );

  run(
    renderChart,
    "chart"
  );

  run(
    renderBrandTable,
    "brand"
  );

  run(
    renderPoTypeTable,
    "po"
  );

  run(
    renderPriceRangeTable,
    "price"
  );

  run(
    renderErpStatusTable,
    "erp"
  );

  run(
    renderStockCoverTable,
    "cover"
  );
}

/* ==========================================
   SAFE EXEC
========================================== */

function run(
  fn,
  name
) {
  try {
    fn();
  } catch (error) {
    console.error(
      "Dashboard block failed:",
      name,
      error
    );
  }
}