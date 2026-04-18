/* ==========================================
   File: js/reports/sales/table.js
   FULL REPLACE CODE
   Added Final SOR Stock Column
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
  const root =
    document.getElementById(
      targetId
    );

  if (!root)
    return;

  if (!rows.length) {
    root.innerHTML = `
      <div class="placeholder-box large">
        No sales data found
      </div>
    `;
    return;
  }

  root.innerHTML = `
    <div class="sales-scroll">
      <table class="sales-table">

        <thead>
          <tr>
            <th>#</th>
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
              (
                row,
                i
              ) =>
                renderRow(
                  row,
                  i + 1
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
  row,
  rank
) {
  return `
    <tr>

      <td class="sticky-col rank-col">
        ${rank}
      </td>

      <td class="sticky-col second-col">
        ${safe(
          row.styleId
        )}
      </td>

      <td>
        ${safe(
          row.erp
        )}
      </td>

      <td>
        ${safe(
          row.brand
        )}
      </td>

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

      <td class="${returnClass(
        row.returnPct
      )}">
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

      <td class="${growthClass(
        row.growthPct
      )}">
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

/* ==========================================
   STATES
========================================== */

function growthClass(
  v
) {
  if (v > 0)
    return "pos";

  if (v < 0)
    return "neg";

  return "";
}

function returnClass(
  v
) {
  if (v >= 20)
    return "neg";

  if (v >= 10)
    return "warn";

  return "";
}

/* ==========================================
   SAFE
========================================== */

function safe(
  v
) {
  return String(
    v || ""
  );
}