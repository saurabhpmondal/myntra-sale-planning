/* ==========================================
   SALES REPORT / TABLE.JS
   Master style table renderer
========================================== */

import {
  money,
  count,
  pct
} from "./helpers.js";

/* ==========================================
   PUBLIC
========================================== */

export function renderSalesTable(
  targetId,
  rows = []
) {
  const el =
    document.getElementById(
      targetId
    );

  if (!el) return;

  if (!rows.length) {
    el.innerHTML = `
      <div class="placeholder-box large">
        No sales data found
      </div>
    `;
    return;
  }

  el.innerHTML = `
    <div class="table-wrap sales-scroll">
      <table class="data-table zebra sales-table">
        <thead>
          <tr>
            <th>Style ID</th>
            <th>ERP SKU</th>
            <th>Brand</th>
            <th>Rating</th>
            <th>GMV</th>
            <th>Units</th>
            <th>ASP</th>
            <th>Return %</th>
            <th>PPMP %</th>
            <th>SJIT %</th>
            <th>SOR %</th>
            <th>Growth %</th>
            <th>Demand %</th>
            <th>SJIT Stock</th>
            <th>SOR Stock</th>
          </tr>
        </thead>

        <tbody>
          ${rows
            .map(
              (row) =>
                renderRow(
                  row
                )
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

/* ==========================================
   ROW
========================================== */

function renderRow(
  row
) {
  const growthClass =
    row.growthPct > 0
      ? "pos"
      : row.growthPct < 0
      ? "neg"
      : "";

  return `
    <tr>
      <td class="sticky-col">
        ${row.styleId}
      </td>

      <td>${row.erp}</td>

      <td>${row.brand}</td>

      <td>
        ${Number(
          row.rating || 0
        ).toFixed(1)}
      </td>

      <td>
        ${money(
          row.gmv
        )}
      </td>

      <td>
        ${count(
          row.units
        )}
      </td>

      <td>
        ${money(
          row.asp
        )}
      </td>

      <td>
        ${pct(
          row.returnPct
        )}
      </td>

      <td>
        ${pct(
          row.ppmpPct
        )}
      </td>

      <td>
        ${pct(
          row.sjitPct
        )}
      </td>

      <td>
        ${pct(
          row.sorPct
        )}
      </td>

      <td class="${growthClass}">
        ${pct(
          row.growthPct
        )}
      </td>

      <td>
        ${pct(
          row.sharePct
        )}
      </td>

      <td>
        ${count(
          row.sjitStock
        )}
      </td>

      <td>
        ${count(
          row.sorStock
        )}
      </td>
    </tr>
  `;
}