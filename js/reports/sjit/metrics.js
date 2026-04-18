/* ==========================================
   File: js/reports/sjit/metrics.js
   FULL REPLACE CODE
   SALES ENGINE + ACTIVE DAY DRR
========================================== */

import { getSalesRows } from "../sales/metrics.js";
import { getFilters } from "../../core/state.js";

/* ==========================================
   PUBLIC
========================================== */

export function getSjitRows() {
  const salesRows =
    getSalesRows() || [];

  const days =
    getActiveDays();

  const rows =
    salesRows.map((r) =>
      buildPlan(
        r,
        days
      )
    );

  return rows.sort(
    (a, b) =>
      b.totalQty -
      a.totalQty ||
      b.units - a.units
  );
}

/* ==========================================
   BUILD
========================================== */

function buildPlan(
  r,
  days
) {
  const gross =
    num(r.units);

  const returns =
    Math.round(
      gross *
        num(
          r.returnPct
        ) /
        100
    );

  const net =
    Math.max(
      0,
      gross -
        returns
    );

  const drr =
    days > 0
      ? net / days
      : 0;

  const stock =
    num(
      r.sjitStock
    );

  const sc =
    drr > 0
      ? stock / drr
      : 0;

  const target =
    drr * 45;

  let total = 0;
  let recall = 0;

  const badStatus =
    upper(
      r.status
    ) !==
      "CONTINUE" &&
    upper(
      r.status
    ) !== "";

  const badRating =
    num(
      r.rating
    ) > 0 &&
    num(
      r.rating
    ) < 3.5;

  if (
    stock > 0 &&
    (
      drr === 0 ||
      badStatus ||
      badRating
    )
  ) {
    recall = stock;
  } else if (
    sc > 60
  ) {
    recall =
      ceil0(
        stock -
          target
      );
  } else {
    total =
      ceil0(
        target -
          stock
      );
  }

  const split =
    splitQty(
      total
    );

  return {
    styleId:
      r.styleId,
    erp:
      r.erp || "",
    status:
      r.status || "",
    brand:
      r.brand || "",
    rating:
      num(
        r.rating
      ),

    gross,
    returns,
    net,
    returnPct:
      num(
        r.returnPct
      ),

    drr,
    stock,
    sc,

    northQty:
      split.north,
    southQty:
      split.south,
    totalQty:
      total,
    recallQty:
      recall,

    units:
      gross
  };
}

/* ==========================================
   ACTIVE DAYS
========================================== */

function getActiveDays() {
  const f =
    getFilters();

  if (
    f.startDate &&
    f.endDate
  ) {
    const s =
      new Date(
        f.startDate
      );

    const e =
      new Date(
        f.endDate
      );

    const diff =
      Math.floor(
        (e - s) /
          86400000
      ) + 1;

    return Math.max(
      1,
      diff
    );
  }

  return 30;
}

/* ==========================================
   SPLIT
========================================== */

function splitQty(
  qty
) {
  if (
    qty <= 0
  ) {
    return {
      north: 0,
      south: 0
    };
  }

  const north =
    Math.round(
      qty * 0.55
    );

  return {
    north,
    south:
      qty - north
  };
}

/* ==========================================
   HELPERS
========================================== */

function ceil0(v) {
  if (v <= 0)
    return 0;

  return Math.max(
    1,
    Math.ceil(v)
  );
}

function num(v) {
  return Number(v) || 0;
}

function upper(v) {
  return String(
    v || ""
  )
    .trim()
    .toUpperCase();
}