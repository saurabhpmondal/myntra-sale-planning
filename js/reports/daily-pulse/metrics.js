/* ==========================================
   File: js/reports/daily-pulse/metrics.js
   FULL REPLACE CODE
   SAFE RECOVERY VERSION
   Uses trusted sales engine
========================================== */

import {
  getSalesRows
} from "../sales/metrics.js";

/* ==========================================
   PUBLIC
========================================== */

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
        num(
          r.units
        );

      const drr =
        units / 30;

      return {
        styleId:
          pick(
            r,
            [
              "styleId",
              "style_id",
              "style"
            ]
          ),

        erp:
          pick(
            r,
            [
              "erp",
              "erpSku",
              "erp_sku"
            ]
          ),

        brand:
          pick(
            r,
            [
              "brand"
            ]
          ),

        status:
          pick(
            r,
            [
              "status",
              "erpStatus",
              "erp_status"
            ]
          ),

        mtd: units,
        drr,

        trend:
          growthTrend(
            pick(
              r,
              [
                "growthPct",
                "growth",
                "growth_pct"
              ]
            )
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

/* ==========================================
   SORT
========================================== */

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

/* ==========================================
   HELPERS
========================================== */

function pick(
  obj,
  keys
) {
  for (const k of keys) {
    if (
      obj &&
      obj[k] !==
        undefined &&
      obj[k] !==
        null &&
      obj[k] !== ""
    ) {
      return obj[k];
    }
  }

  return "";
}

function growthTrend(
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