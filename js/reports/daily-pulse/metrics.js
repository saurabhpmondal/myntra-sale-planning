/* ==========================================
   File: js/reports/daily-pulse/metrics.js
   FULL REPLACE CODE
   FIX DATE COLUMNS FINAL
========================================== */

import {
  getSalesRows
} from "../sales/metrics.js";

import {
  getDataset,
  getFilters
} from "../../core/state.js";

/* ========================================== */

export function getDailyPulseRows(
  sortBy = "MTD",
  order = "HIGH",
  limit = 50
) {
  const rows =
    getSalesRows() || [];

  const rawSales =
    getDataset("sales") || [];

  const filters =
    getFilters();

  const dates =
    buildDates(filters);

  const dayMap =
    buildDayMap(
      rawSales,
      dates
    );

  const finalRows =
    rows.map((r) => {
      const styleId =
        pick(
          r,
          [
            "styleId",
            "style_id"
          ]
        );

      const units =
        num(r.units);

      return {
        styleId,

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
            ["brand"]
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

        drr:
          units /
          Math.max(
            1,
            dates.length
          ),

        trend:
          growthTrend(
            pick(
              r,
              [
                "growthPct",
                "growth"
              ]
            )
          ),

        days:
          dayMap[
            styleId
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
   DATE BUILDER
========================================== */

function buildDates(f) {
  if (
    f.startDate &&
    f.endDate
  ) {
    return rangeDates(
      f.startDate,
      f.endDate
    );
  }

  if (f.month) {
    const [
      y,
      m
    ] =
      f.month.split(
        "-"
      );

    const start =
      `${y}-${m}-01`;

    const now =
      new Date();

    const current =
      Number(y) ===
        now.getFullYear() &&
      Number(m) ===
        now.getMonth() +
          1;

    let end;

    if (
      current
    ) {
      const d =
        new Date();

      d.setDate(
        d.getDate() -
          1
      );

      end =
        formatDate(d);
    } else {
      const last =
        new Date(
          Number(y),
          Number(m),
          0
        );

      end =
        formatDate(
          last
        );
    }

    return rangeDates(
      start,
      end
    );
  }

  /* fallback current month */
  const n =
    new Date();

  const y =
    n.getFullYear();

  const m =
    String(
      n.getMonth() +
        1
    ).padStart(
      2,
      "0"
    );

  const start =
    `${y}-${m}-01`;

  const d =
    new Date();

  d.setDate(
    d.getDate() -
      1
  );

  return rangeDates(
    start,
    formatDate(d)
  );
}

function rangeDates(
  start,
  end
) {
  const out = [];

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
   DAILY MAP
========================================== */

function buildDayMap(
  rows,
  dates
) {
  const valid =
    new Set(dates);

  const map = {};

  rows.forEach((r) => {
    const styleId =
      pick(
        r,
        [
          "styleId",
          "style_id"
        ]
      );

    const date =
      pick(
        r,
        [
          "date",
          "order_date"
        ]
      );

    if (
      !styleId ||
      !valid.has(
        date
      )
    )
      return;

    if (
      !map[
        styleId
      ]
    ) {
      map[
        styleId
      ] =
        blankDays(
          dates
        );
    }

    map[
      styleId
    ][date] +=
      num(
        pick(
          r,
          [
            "units",
            "qty"
          ]
        )
      );
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
  )
    rows.reverse();
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