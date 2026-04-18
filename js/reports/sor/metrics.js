/* ==========================================
   File: js/reports/sor/metrics.js
   NEW FILE
   SOR Planning Engine
========================================== */

import { getSalesRows } from "../sales/metrics.js";
import { getFilters } from "../../core/state.js";

/* ==========================================
   PUBLIC
========================================== */

export function getSorRows() {
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
      b.shipQty -
      a.shipQty ||
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
      r.sorStock
    );

  const sc =
    drr > 0
      ? stock / drr
      : 0;

  const status =
    upper(
      r.status
    );

  let ship = 0;
  let recall = 0;

  /* RECALL PRIORITY */
  if (
    drr === 0 &&
    stock > 0
  ) {
    recall =
      stock;
  } else if (
    sc > 45
  ) {
    recall =
      ceil0(
        stock -
          drr * 45
      );
  } else if (
    status &&
    status !==
      "CONTINUE"
  ) {
    recall =
      stock;
  } else {
    ship =
      ceil0(
        drr * 45 -
          stock
      );
  }

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

    shipQty:
      ship,
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