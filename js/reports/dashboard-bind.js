/* ==========================================
   DASHBOARD-BIND.JS
   Safe Dashboard Binding Layer
========================================== */

import { renderKpis } from "./dashboard/kpi.js";
import { renderChart } from "./dashboard/chart.js";
import { renderBrandTable } from "./dashboard/brand.js";
import { renderPoTypeTable } from "./dashboard/po.js";
import { renderPriceRangeTable } from "./dashboard/price.js";
import { renderErpStatusTable } from "./dashboard/erp.js";
import { renderStockCoverTable } from "./dashboard/cover.js";

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
   SAFE RUNNER
========================================== */

function run(
  fn,
  name
) {
  try {
    fn();
  } catch (error) {
    console.error(
      "Dashboard failed:",
      name,
      error
    );
  }
}