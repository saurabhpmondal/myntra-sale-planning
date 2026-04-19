/* ==========================================
   File: js/reports/daily-pulse/metrics.js
   FULL REPLACE CODE
   FINAL SAFE VERSION
   Uses trusted Sales Engine
========================================== */

import { getSalesRows } from "../sales/metrics.js";

export function getDailyPulseRows(
  sortBy = "MTD",
  order = "HIGH",
  limit = 50
) {
  const base =
    getSalesRows() || [];

  const rows =
    base.map((r) => {
      const units =
        num(r.units);

      const drr =
        units / 30;

      return {
        styleId:
          r.styleId || "",
        erp:
          r.erp || "",
        brand:
          r.brand || "",
        status:
          r.status || "",
        mtd: units,
        drr,
        trend:
          trendFromGrowth(
            r.growthPct
          ),
        days: {}
      };
    });

  sortRows(
    rows,
    sortBy,
    order
  );

  return {
    rows:
      rows.slice(
        0,
        limit
      ),
    total:
      rows.length,
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

function trendFromGrowth(
  v
) {
  const n =
    num(v);

  if (n > 0)
    return "↗";

  if (n < 0)
    return "↘";

  return "→";
}

function num(v) {
  return Number(v) || 0;
}