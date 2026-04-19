/* ==========================================
   File: js/reports/daily-pulse/metrics.js
   FULL REPLACE CODE
   DAILY PULSE ENGINE
========================================== */

import { getDataset } from "../../core/state.js";
import { getFilters } from "../../core/state.js";

/* ==========================================
   PUBLIC
========================================== */

export function getDailyPulseRows(
  sortBy = "MTD",
  order = "HIGH",
  limit = 50
) {
  const sales =
    getDataset("sales") || [];

  const pm =
    getDataset(
      "productMaster"
    ) || [];

  const dates =
    getVisibleDates(
      sales
    );

  const pmMap =
    buildPmMap(pm);

  const map = {};

  sales.forEach((r) => {
    const styleId =
      clean(
        r.style_id
      );

    if (!styleId)
      return;

    const date =
      clean(
        r.order_date
      );

    if (
      !dates.includes(
        date
      )
    )
      return;

    if (!map[styleId]) {
      map[styleId] =
        blankRow(
          styleId,
          pmMap[
            styleId
          ],
          dates
        );
    }

    const row =
      map[styleId];

    const qty =
      num(r.qty);

    row.days[
      date
    ] += qty;

    row.mtd += qty;
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
  sales
) {
  const f =
    getFilters();

  let rows = sales;

  if (
    f.startDate &&
    f.endDate
  ) {
    rows =
      rows.filter(
        (r) =>
          clean(
            r.order_date
          ) >=
            f.startDate &&
          clean(
            r.order_date
          ) <=
            f.endDate
      );
  } else if (
    f.month
  ) {
    rows =
      rows.filter(
        (r) =>
          clean(
            r.order_date
          ).startsWith(
            f.month
          )
      );
  }

  return [
    ...new Set(
      rows.map((r) =>
        clean(
          r.order_date
        )
      )
    )
  ].sort();
}

/* ==========================================
   PM MAP
========================================== */

function buildPmMap(
  rows
) {
  const map = {};

  rows.forEach((r) => {
    const id =
      clean(
        r.style_id
      );

    if (!id)
      return;

    map[id] = {
      erp:
        clean(
          r.erp_sku
        ),
      brand:
        clean(
          r.brand
        ),
      status:
        clean(
          r.status
        )
    };
  });

  return map;
}

/* ==========================================
   BUILD
========================================== */

function blankRow(
  styleId,
  pm,
  dates
) {
  const days = {};

  dates.forEach(
    (d) =>
      (days[d] = 0)
  );

  return {
    styleId,
    erp:
      pm?.erp || "",
    brand:
      pm?.brand ||
      "",
    status:
      pm?.status ||
      "",

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
  const vals =
    dates.map(
      (d) =>
        row.days[d]
    );

  const active =
    vals.length || 1;

  row.drr =
    row.mtd /
    active;

  row.trend =
    getTrend(vals);

  return row;
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
   TREND
========================================== */

function getTrend(
  vals
) {
  const last =
    vals.slice(-3);

  if (
    last.length <
    2
  )
    return "→";

  const first =
    num(last[0]);

  const end =
    num(
      last[
        last.length -
          1
      ]
    );

  if (
    end > first
  )
    return "↗";

  if (
    end < first
  )
    return "↘";

  return "→";
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