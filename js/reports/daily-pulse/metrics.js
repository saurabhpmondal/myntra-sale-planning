/* ==========================================
   File: js/reports/daily-pulse/metrics.js
   FULL REPLACE CODE
   FINAL STRICT VERSION
   Uses existing sales engine + manual raw date filter
========================================== */

import { getSalesRows } from "../sales/metrics.js";
import { getDataset, getFilters } from "../../core/state.js";

/* ========================================== */

export function getDailyPulseRows(
  sortBy = "MTD",
  order = "HIGH",
  limit = 50
) {
  /* trusted visible rows */
  const baseRows =
    getSalesRows() || [];

  /* raw rows for daily split */
  const rawSales =
    getDataset("sales") || [];

  const filters =
    getFilters() || {};

  const filteredRaw =
    applyPulseFilters(
      rawSales,
      filters
    );

  const dates =
    getDates(
      filteredRaw
    );

  const dayMap =
    buildDayMap(
      filteredRaw,
      dates
    );

  const rows =
    baseRows.map((r) => {
      const styleId =
        clean(
          r.styleId ||
            r.style_id
        );

      const days =
        dayMap[
          styleId
        ] ||
        blankDays(
          dates
        );

      const mtd =
        sumDays(
          days,
          dates
        );

      return {
        styleId,
        erp:
          clean(
            r.erp ||
              r.erp_sku
          ),
        brand:
          clean(
            r.brand
          ),
        status:
          clean(
            r.status
          ),
        mtd,
        drr:
          divide(
            mtd,
            dates.length
          ),
        trend:
          getTrend(
            days,
            dates
          ),
        days
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
    dates
  };
}

/* ==========================================
   RAW FILTERS
========================================== */

function applyPulseFilters(
  rows,
  f
) {
  return rows.filter(
    (r) => {
      const dt =
        clean(
          r.order_date
        );

      const style =
        clean(
          r.style_id
        );

      const brand =
        clean(
          r.brand
        );

      const po =
        clean(
          r.po_type
        );

      /* month */
      if (
        f.month &&
        !dt.startsWith(
          f.month
        )
      )
        return false;

      /* start */
      if (
        f.startDate &&
        dt <
          f.startDate
      )
        return false;

      /* end */
      if (
        f.endDate &&
        dt >
          f.endDate
      )
        return false;

      /* brand */
      if (
        f.brand &&
        f.brand !==
          "All Brands" &&
        brand !==
          f.brand
      )
        return false;

      /* po */
      if (
        f.poType &&
        f.poType !==
          "All PO Type" &&
        po !==
          f.poType
      )
        return false;

      /* search */
      if (
        f.search
      ) {
        const q =
          clean(
            f.search
          ).toLowerCase();

        const hay =
          (
            style +
            "|" +
            brand +
            "|" +
            clean(
              r.erp_sku
            )
          ).toLowerCase();

        if (
          !hay.includes(
            q
          )
        )
          return false;
      }

      return true;
    }
  );
}

/* ==========================================
   DATES
========================================== */

function getDates(
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
  const map = {};

  rows.forEach((r) => {
    const id =
      clean(
        r.style_id
      );

    const dt =
      clean(
        r.order_date
      );

    if (
      !id ||
      !dt
    )
      return;

    if (
      !map[id]
    ) {
      map[id] =
        blankDays(
          dates
        );
    }

    map[id][dt] +=
      num(r.qty);
  });

  return map;
}

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

/* ==========================================
   CALCS
========================================== */

function sumDays(
  days,
  dates
) {
  return dates.reduce(
    (t, d) =>
      t +
      num(
        days[d]
      ),
    0
  );
}

function getTrend(
  days,
  dates
) {
  if (
    dates.length < 2
  )
    return "→";

  const a =
    num(
      days[
        dates[
          dates.length -
            2
        ]
      ]
    );

  const b =
    num(
      days[
        dates[
          dates.length -
            1
        ]
      ]
    );

  if (b > a)
    return "↗";

  if (b < a)
    return "↘";

  return "→";
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

function divide(
  a,
  b
) {
  return b
    ? a / b
    : 0;
}