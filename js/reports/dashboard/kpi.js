/* ==========================================
   DASHBOARD / KPI.JS
   Precision Fix
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
   PUBLIC
========================================== */

export function renderKpis() {
  const sales =
    applyGlobalFilters(
      getDataset("sales")
    );

  const revenue =
    sales.reduce(
      (a, r) =>
        a +
        num(
          r.final_amount
        ),
      0
    );

  const units =
    sales.reduce(
      (a, r) =>
        a +
        num(r.qty),
      0
    );

  const sjitStock =
    getDataset(
      "sjitStock"
    ).reduce(
      (a, r) =>
        a +
        getSjitUnits(r),
      0
    );

  const sorStock =
    getDataset(
      "sorStock"
    ).reduce(
      (a, r) =>
        a +
        getSorUnits(r),
      0
    );

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
    "0%"
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
    "-"
  );
}

/* ==========================================
   FALLBACK FIELD MAPPING
========================================== */

function getSjitUnits(
  row = {}
) {
  return num(
    row
      .sellable_inventory_count ??
      row.stock ??
      row.units ??
      row.qty ??
      row.inventory
  );
}

function getSorUnits(
  row = {}
) {
  return num(
    row.units ??
      row.stock ??
      row.qty ??
      row.inventory
  );
}