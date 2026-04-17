/* ==========================================
   DASHBOARD / ERP.JS
   ERP Status Analysis
========================================== */

import { getDataset } from "../../core/state.js";
import { applyGlobalFilters } from "../../filters/filter-engine.js";

import {
  byId,
  buildTable,
  num,
  fc,
  fn
} from "./helpers.js";

/* ==========================================
   PUBLIC API
========================================== */

export function renderErpStatusTable() {
  const el =
    byId(
      "dashboardErpStatus"
    );

  if (!el) return;

  const sales =
    applyGlobalFilters(
      getDataset("sales")
    );

  if (!sales.length) {
    el.innerHTML =
      emptyState();

    return;
  }

  const productMaster =
    getDataset(
      "productMaster"
    );

  const statusByStyle =
    {};

  productMaster.forEach(
    (row) => {
      statusByStyle[
        row.style_id
      ] =
        row.status ||
        "Unknown";
    }
  );

  const map = {};

  sales.forEach((row) => {
    const status =
      statusByStyle[
        row.style_id
      ] || "Unknown";

    if (!map[status]) {
      map[status] = {
        gmv: 0,
        units: 0
      };
    }

    map[
      status
    ].gmv +=
      num(
        row.final_amount
      );

    map[
      status
    ].units +=
      num(row.qty);
  });

  const data =
    Object.entries(map)
      .map(
        ([status, v]) => ({
          status,
          gmv: v.gmv,
          units: v.units,
          asp:
            v.units
              ? v.gmv /
                v.units
              : 0
        })
      )
      .sort(
        (a, b) =>
          b.gmv -
          a.gmv
      );

  el.innerHTML =
    buildTable(
      [
        "ERP Status",
        "GMV",
        "Units",
        "ASP"
      ],
      data.map(
        (row) => [
          row.status,
          fc(
            row.gmv
          ),
          fn(
            row.units
          ),
          fc(
            row.asp
          )
        ]
      )
    );
}

/* ==========================================
   EMPTY
========================================== */

function emptyState() {
  return `
    <div class="placeholder-box small">
      No ERP status data
    </div>
  `;
}