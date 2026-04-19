/* ==========================================
   File: js/reports/daily-pulse/metrics.js
   FULL REPLACE CODE
   REAL DATE-WISE DAILY PULSE
========================================== */

import {
  getDataset,
  getFilters
} from "../../core/state.js";

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

  const products =
    getDataset(
      "productMaster"
    ) || [];

  const filters =
    getFilters();

  const dates =
    buildDates(filters);

  const pMap =
    buildProductMap(
      products
    );

  const map = {};

  sales.forEach((r) => {
    const date =
      val(
        r.order_date
      );

    if (
      !dates.includes(
        date
      )
    )
      return;

    const styleId =
      val(
        r.style_id
      );

    if (!styleId)
      return;

    if (!map[styleId]) {
      const p =
        pMap[
          styleId
        ] || {};

      map[
        styleId
      ] = {
        styleId,
        erp:
          p.erp ||
          "",
        brand:
          p.brand ||
          "",
        status:
          p.status ||
          "",
        mtd: 0,
        drr: 0,
        trend: "→",
        days: {}
      };

      dates.forEach(
        (d) =>
          (map[
            styleId
          ].days[d] = 0)
      );
    }

    const qty =
      num(
        r.qty ||
          r.units
      );

    map[
      styleId
    ].days[
      date
    ] += qty;

    map[
      styleId
    ].mtd += qty;
  });

  const rows =
    Object.values(
      map
    ).map((r) =>
      finalize(
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
   BUILD DATE RANGE
========================================== */

function buildDates(
  f
) {
  const start =
    f.startDate;

  const end =
    f.endDate;

  if (
    !start ||
    !end
  )
    return [];

  const out =
    [];

  let d =
    new Date(start);

  const last =
    new Date(end);

  while (
    d <= last
  ) {
    out.push(
      formatDate(d)
    );

    d.setDate(
      d.getDate() +
        1
    );
  }

  return out;
}

/* ==========================================
   PRODUCT MAP
========================================== */

function buildProductMap(
  rows
) {
  const map = {};

  rows.forEach((r) => {
    const id =
      val(
        r.style_id
      );

    if (!id)
      return;

    map[id] = {
      erp:
        val(
          r.erp_sku
        ),
      brand:
        val(
          r.brand
        ),
      status:
        val(
          r.erp_status
        )
    };
  });

  return map;
}

/* ==========================================
   FINALIZE
========================================== */

function finalize(
  row,
  dates
) {
  const days =
    dates.length || 1;

  row.drr =
    row.mtd / days;

  const vals =
    dates.map(
      (d) =>
        row.days[d]
    );

  const a =
    vals[
      vals.length -
        2
    ] || 0;

  const b =
    vals[
      vals.length -
        1
    ] || 0;

  if (b > a)
    row.trend =
      "↗";
  else if (
    b < a
  )
    row.trend =
      "↘";

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
   HELPERS
========================================== */

function val(v) {
  return String(
    v || ""
  ).trim();
}

function num(v) {
  return Number(v) || 0;
}

function formatDate(
  d
) {
  const y =
    d.getFullYear();

  const m =
    String(
      d.getMonth() +
        1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      d.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${y}-${m}-${day}`;
}