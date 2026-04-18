/* ==========================================
   File: js/reports/sor/table.js
   NEW FILE
   SOR Planning Table
========================================== */

import {
  count,
  pct
} from "../sales/helpers.js";

/* ==========================================
   PUBLIC
========================================== */

export function renderSorTable(
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
        No planning data found
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
            <th>ERP Status</th>
            <th>Brand</th>
            <th>Rating</th>
            <th>Gross</th>
            <th>Return</th>
            <th>Net</th>
            <th>Return %</th>
            <th>DRR</th>
            <th>SOR Stock</th>
            <th>SC</th>
            <th>Shipment Qty</th>
            <th>Recall Qty</th>
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
          row.status
        )}
      </td>

      <td>
        ${safe(
          row.brand
        )}
      </td>

      <td>
        ${row.rating.toFixed(
          1
        )}
      </td>

      <td>
        ${count(
          row.gross
        )}
      </td>

      <td>
        ${count(
          row.returns
        )}
      </td>

      <td>
        ${count(
          row.net
        )}
      </td>

      <td>
        ${pct(
          row.returnPct
        )}
      </td>

      <td>
        ${row.drr.toFixed(
          2
        )}
      </td>

      <td>
        ${count(
          row.stock
        )}
      </td>

      <td>
        ${row.sc.toFixed(
          1
        )}
      </td>

      <td class="pos">
        ${count(
          row.shipQty
        )}
      </td>

      <td class="neg">
        ${count(
          row.recallQty
        )}
      </td>

    </tr>
  `;
}

/* ==========================================
   SAFE
========================================== */

function safe(v) {
  return String(
    v || ""
  );
}