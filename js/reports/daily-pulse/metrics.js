/* ==========================================
   File: js/reports/daily-pulse/metrics.js
   FULL REPLACE CODE
   USES SALES ENGINE ONLY
   Date values from trusted filtered sales data
========================================== */

import {
  getSalesRows
} from "../sales/metrics.js";

import {
  getDataset
} from "../../core/state.js";

import {
  applyGlobalFilters
} from "../../filters/filter-engine.js";

/* ========================================== */

export function getDailyPulseRows(
  sortBy = "MTD",
  order = "HIGH",
  limit = 50
) {
  const rows =
    getSalesRows() || [];

  const filteredSales =
    applyGlobalFilters(
      getDataset(
        "sales"
      ) || []
    );

  const dates =
    getDatesFromFilteredSales(
      filteredSales
    );

  const dayMap =
    buildDayMap(
      filteredSales,
      dates
    );

  const finalRows =
    rows.map((r) => {
      const units =
        num(
          r.units
        );

      return {
        styleId:
          r.styleId ||
          "",

        erp:
          r.erp || "",

        brand:
          r.brand || "",

        status:
          "",

        mtd: units,

        drr:
          units /
          Math.max(
            1,
            dates.length
          ),

        trend:
          trend(
            r.growthPct
          ),

        days:
          dayMap[
            r.styleId
          ] ||
          blankDays(
            dates
          )
      };
    });

  sortRows(
    finalRows,
    sortBy,
    order
  );

  return {
    rows:
      finalRows.slice(
        0,
        limit
      ),
    total:
      finalRows.length,
    dates
  };
}

/* ==========================================
   TRUSTED FILTERED SALES DATES
========================================== */

function getDatesFromFilteredSales(
  rows
) {
  return [
    ...new Set(
      rows.map((r) =>
        clean(
          r.order_date
        )
      )
    )
  ]
    .filter(Boolean)
    .sort();
}

/* ==========================================
   DAY MAP
========================================== */

function buildDayMap(
  rows,
  dates
) {
  const valid =
    new Set(dates);

  const map = {};

  rows.forEach((r) => {
    const id =
      clean(
        r.style_id
      );

    const date =
      clean(
        r.order_date
      );

    if (
      !id ||
      !valid.has(
        date
      )
    )
      return;

    if (!map[id]) {
      map[id] =
        blankDays(
          dates
        );
    }

    map[id][date] +=
      num(r.qty);
  });

  return map;
}

/* ========================================== */

function blankDays(
  dates
) {
  const obj = {};

  dates.forEach(
    (d) =>
      (obj[d] = 0)
  );

  return obj;
}

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

function trend(v) {
  const n =
    num(v);

  if (n > 0)
    return "↗";

  if (n < 0)
    return "↘";

  return "→";
}

function clean(v) {
  return String(
    v || ""
  ).trim();
}

function num(v) {
  return Number(v) || 0;
}