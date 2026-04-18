/* ==========================================
   SALES REPORT / TABLE.JS
   Final renderer
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

  if (!el)
    return;

  if (!rows.length) {
    el.innerHTML = `
      <div class="placeholder-box large">
        No sales data found
      </div>
    `;
    return;
  }

  el.innerHTML = `
    <div class="sales-scroll">
      <table class="sales-table">

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
                rowHtml(
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

function rowHtml(
  row
) {
  const growth =
    classGrowth(
      row.growthPct
    );

  const ret =
    classReturn(
      row.returnPct
    );

  return `
    <tr>

      <td class="sticky-col">
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

      <td class="${ret}">
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

      <td class="${growth}">
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

function classGrowth(
  v
) {
  if (v > 0)
    return "pos";

  if (v < 0)
    return "neg";

  return "";
}

function classReturn(
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