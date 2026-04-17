/* ==========================================
   DASHBOARD / PO.JS
   PO Type Performance Table
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

export function renderPoTypeTable() {
  const el =
    byId(
      "dashboardPoSummary"
    );

  if (!el) return;

  const rows =
    applyGlobalFilters(
      getDataset("sales")
    );

  if (!rows.length) {
    el.innerHTML =
      emptyState();

    return;
  }

  const map = {};

  rows.forEach((row) => {
    const type =
      row.po_type ||
      "Unknown";

    if (!map[type]) {
      map[type] = {
        gmv: 0,
        units: 0
      };
    }

    map[type].gmv +=
      num(
        row.final_amount
      );

    map[
      type
    ].units +=
      num(row.qty);
  });

  const ordered =
    [
      "SJIT",
      "PPMP",
      "SOR"
    ];

  const data =
    ordered
      .filter(
        (key) =>
          map[key]
      )
      .map(
        (key) => ({
          po_type:
            key,
          gmv:
            map[key]
              .gmv,
          units:
            map[key]
              .units,
          asp:
            map[key]
              .units
              ? map[
                  key
                ].gmv /
                map[
                  key
                ].units
              : 0
        })
      );

  el.innerHTML =
    buildTable(
      [
        "PO Type",
        "GMV",
        "Units",
        "ASP"
      ],
      data.map(
        (row) => [
          row.po_type,
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
      No PO type data
    </div>
  `;
}