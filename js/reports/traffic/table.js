/* ==========================================
   File: js/reports/traffic/table.js
   TRAFFIC REPORT
   Table renderer
========================================== */

import {
  count,
  pct
} from "../sales/helpers.js";

/* ==========================================
   PUBLIC
========================================== */

export function renderTrafficTable(
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
        No traffic data found
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
            <th>Impressions</th>
            <th>Clicks</th>
            <th>CTR %</th>
            <th>ATC</th>
            <th>CVR %</th>
            <th>Purchases</th>
            <th>PPC</th>
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
        ${count(
          row.impressions
        )}
      </td>

      <td>
        ${count(
          row.clicks
        )}
      </td>

      <td>
        ${pct(
          row.ctr
        )}
      </td>

      <td>
        ${count(
          row.atc
        )}
      </td>

      <td>
        ${pct(
          row.cvr
        )}
      </td>

      <td>
        ${count(
          row.purchases
        )}
      </td>

      <td>
        ${row.ppc.toFixed(
          2
        )}
      </td>

      <td>
        ${pct(
          row.weight
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
   SAFE
========================================== */

function safe(v) {
  return String(
    v || ""
  );
}