/* ==========================================
   SALES REPORT / INDEX.JS
   Main renderer
========================================== */

import { getSalesRows } from "./metrics.js";
import { renderSalesTable } from "./table.js";

/* ==========================================
   PUBLIC
========================================== */

export function renderSalesReport() {
  const rows =
    getSalesRows();

  renderSalesTable(
    "salesReportRoot",
    rows
  );
}