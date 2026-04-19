/* ==========================================
   File: js/reports/daily-pulse/metrics.js
   FULL REPLACE CODE
   SAFE USING EXISTING SALES ENGINE
   No raw schema assumptions
========================================== */

import { getSalesRows } from "../sales/metrics.js";

export function getDailyPulseRows(
  sortBy = "MTD",
  order = "HIGH",
  limit = 50
) {
  const rows =
    getSalesRows() || [];

  const safe =
    rows.map((r) => ({
      styleId:
        r.styleId || "",
      erp:
        r.erp || "",
      brand:
        r.brand || "",
      mtd:
        num(r.units),
      drr:
        num(r.units) / 30,
      trend: "→",
      days: {}
    }));

  sortRows(
    safe,
    sortBy,
    order
  );

  return {
    rows:
      safe.slice(
        0,
        limit
      ),
    total:
      safe.length,
    dates: []
  };
}

/* ========================================== */

function sortRows(
  rows,
  sortBy,
  order
) {
  const key =
    sortBy ===
    "DRR"
      ? "drr"
      : "mtd";

  rows.sort(
    (a, b) =>
      b[key] -
      a[key]
  );

  if (
    order ===
    "LOW"
  ) {
    rows.reverse();
  }
}

function num(v) {
  return Number(v) || 0;
}