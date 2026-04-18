/* ==========================================
   SALES REPORT / INDEX.JS
   Main sales report renderer
========================================== */

import { getSalesRows } from "./metrics.js";
import { renderSalesTable } from "./table.js";

/* ==========================================
   PUBLIC
========================================== */

export function renderSalesReport() {
  const root =
    document.getElementById(
      "salesReportRoot"
    );

  if (!root)
    return;

  showLoading(root);

  try {
    const rows =
      getSalesRows();

    renderSalesTable(
      "salesReportRoot",
      rows
    );
  } catch (error) {
    console.error(
      "Sales report failed",
      error
    );

    root.innerHTML = `
      <div class="placeholder-box large">
        Failed to load sales report
      </div>
    `;
  }
}

/* ==========================================
   HELPERS
========================================== */

function showLoading(
  el
) {
  el.innerHTML = `
    <div class="placeholder-box large">
      Loading sales report...
    </div>
  `;
}