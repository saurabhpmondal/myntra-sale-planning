/* ==========================================
   DASHBOARD / KPI.JS
   KPI Cards Renderer
========================================== */

import { getDataset } from "../../core/state.js";
import { applyGlobalFilters } from "../../filters/filter-engine.js";

import {
  setText,
  num,
  fc,
  fn
} from "./helpers.js";

/* ==========================================
   PUBLIC API
========================================== */

export function renderKpis() {
  const sales =
    applyGlobalFilters(
      getDataset("sales")
    );

  const revenue =
    sales.reduce(
      (acc, row) =>
        acc +
        num(
          row.final_amount
        ),
      0
    );

  const units =
    sales.reduce(
      (acc, row) =>
        acc +
        num(row.qty),
      0
    );

  const sjitStock =
    getDataset(
      "sjitStock"
    ).reduce(
      (acc, row) =>
        acc +
        num(
          row.sellable_inventory_count
        ),
      0
    );

  const sorStock =
    getDataset(
      "sorStock"
    ).reduce(
      (acc, row) =>
        acc +
        num(row.units),
      0
    );

  /* Current placeholders */
  const returnPct = "0%";
  const growth = "-";

  setText(
    "kpiRevenue",
    fc(revenue)
  );

  setText(
    "kpiUnits",
    fn(units)
  );

  setText(
    "kpiReturn",
    returnPct
  );

  setText(
    "kpiSjit",
    fn(sjitStock)
  );

  setText(
    "kpiSor",
    fn(sorStock)
  );

  setText(
    "kpiGrowth",
    growth
  );
}