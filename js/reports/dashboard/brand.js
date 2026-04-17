/* ==========================================
   DASHBOARD / BRAND.JS
   Brand Performance Table
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

export function renderBrandTable() {
  const el =
    byId(
      "dashboardBrandSummary"
    );

  if (!el) return;

  const rows =
    applyGlobalFilters(
      getDataset("sales")
    );

  if (!rows.length) {
    el.innerHTML = emptyState();
    return;
  }

  const map = {};

  rows.forEach((row) => {
    const brand =
      row.brand ||
      "Unknown";

    if (!map[brand]) {
      map[brand] = {
        gmv: 0,
        units: 0
      };
    }

    map[brand].gmv +=
      num(
        row.final_amount
      );

    map[
      brand
    ].units +=
      num(row.qty);
  });

  const data =
    Object.entries(map)
      .map(
        ([brand, v]) => ({
          brand,
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
      )
      .slice(0, 15);

  el.innerHTML =
    buildTable(
      [
        "Brand",
        "GMV",
        "Units",
        "ASP"
      ],
      data.map(
        (row) => [
          row.brand,
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
      No brand data
    </div>
  `;
}