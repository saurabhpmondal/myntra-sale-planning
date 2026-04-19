/* ==========================================
   File: js/reports/daily-pulse/metrics.js
   FULL REPLACE CODE
   STRICT FIX - REAL DAILY DATA
========================================== */

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
  const sales =
    applyGlobalFilters(
      getDataset(
        "sales"
      ) || []
    );

  const dates =
    getVisibleDates(
      sales
    );

  const map = {};

  sales.forEach((r) => {
    const id =
      clean(
        r.style_id
      );

    if (!id)
      return;

    const dt =
      clean(
        r.order_date
      );

    if (
      !dates.includes(
        dt
      )
    )
      return;

    if (!map[id]) {
      map[id] =
        blankRow(
          id,
          dates
        );
    }

    const row =
      map[id];

    const qty =
      num(r.qty);

    row.days[dt] +=
      qty;

    row.mtd += qty;

    if (
      !row.brand
    )
      row.brand =
        clean(
          r.brand
        );

    if (
      !row.erp &&
      r.erp_sku
    )
      row.erp =
        clean(
          r.erp_sku
        );

    if (
      !row.status &&
      r.status
    )
      row.status =
        clean(
          r.status
        );
  });

  const rows =
    Object.values(
      map
    ).map((r) =>
      finalizeRow(
        r,
        dates
      )
    );

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
    dates
  };
}

/* ==========================================
   DATES
========================================== */

function getVisibleDates(
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
   BUILD
========================================== */

function blankRow(
  id,
  dates
) {
  const days = {};

  dates.forEach(
    (d) =>
      (days[d] = 0)
  );

  return {
    styleId: id,
    erp: "",
    brand: "",
    status: "",
    mtd: 0,
    drr: 0,
    trend: "→",
    days
  };
}

function finalizeRow(
  row,
  dates
) {
  row.drr =
    row.mtd /
    Math.max(
      1,
      dates.length
    );

  row.trend =
    calcTrend(
      row,
      dates
    );

  return row;
}

/* ==========================================
   TREND
========================================== */

function calcTrend(
  row,
  dates
) {
  if (
    dates.length < 2
  )
    return "→";

  const last =
    row.days[
      dates[
        dates.length -
          1
      ]
    ] || 0;

  const prev =
    row.days[
      dates[
        dates.length -
          2
      ]
    ] || 0;

  if (last > prev)
    return "↗";

  if (last < prev)
    return "↘";

  return "→";
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

function clean(v) {
  return String(
    v || ""
  ).trim();
}

function num(v) {
  return Number(v) || 0;
}