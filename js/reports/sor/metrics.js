/* ==========================================
   File: js/reports/sor/metrics.js
   FULL REPLACE CODE
   FIXED ERP STATUS FROM PRODUCT MASTER
========================================== */

import { getSalesRows } from "../sales/metrics.js";

import {
  getFilters,
  getDataset
} from "../../core/state.js";

/* ==========================================
   PUBLIC
========================================== */

export function getSorRows() {
  const salesRows =
    getSalesRows() || [];

  const pm =
    getDataset(
      "productMaster"
    ) || [];

  const statusMap =
    buildStatusMap(pm);

  const days =
    getActiveDays();

  const rows =
    salesRows.map((r) =>
      buildPlan(
        r,
        days,
        statusMap
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
  days,
  statusMap
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
    statusMap[
      r.styleId
    ] || "";

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
    upper(
      status
    ) !==
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
    status,
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
   PRODUCT MASTER
========================================== */

function buildStatusMap(
  rows
) {
  const map = {};

  rows.forEach((r) => {
    const id =
      String(
        r.style_id ||
        ""
      ).trim();

    if (!id)
      return;

    map[id] =
      String(
        r.status ||
        ""
      ).trim();
  });

  return map;
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