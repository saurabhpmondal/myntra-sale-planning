/* ==========================================
   File: js/reports/xray/metrics.js
   FULL REPLACE CODE
   FIXED APP BREAK ISSUE
   Removed circular dependency with SJIT/SOR metrics
========================================== */

import {
  getSalesRows
} from "../sales/metrics.js";

import {
  getDataset
} from "../../core/state.js";

/* ==========================================
   PUBLIC
========================================== */

export function getXrayData(
  keyword = ""
) {
  const sales =
    getSalesRows() || [];

  const needle =
    String(
      keyword || ""
    )
      .trim()
      .toLowerCase();

  if (!needle)
    return null;

  const ranked =
    [...sales].sort(
      (a, b) =>
        num(b.units) -
        num(a.units)
    );

  const row =
    ranked.find(
      (r) =>
        String(
          r.styleId ||
          r.style_id ||
          ""
        )
          .toLowerCase()
          .includes(
            needle
          )
    );

  if (!row)
    return null;

  const styleId =
    row.styleId ||
    row.style_id ||
    "";

  const rank =
    ranked.findIndex(
      (r) =>
        String(
          r.styleId ||
          r.style_id ||
          ""
        ) === styleId
    ) + 1;

  const units =
    num(row.units);

  const gmv =
    num(
      row.gmv ||
      row.revenue
    );

  const asp =
    units > 0
      ? gmv / units
      : 0;

  const growth =
    num(
      row.growth
    );

  const returnPct =
    num(
      row.returnPct
    );

  const drr =
    num(
      row.drr
    ) ||
    units / 30;

  const brand =
    row.brand || "";

  const brandUnits =
    sales
      .filter(
        (x) =>
          String(
            x.brand || ""
          ) === brand
      )
      .reduce(
        (sum, x) =>
          sum +
          num(
            x.units
          ),
        0
      );

  const dw =
    brandUnits > 0
      ? (units /
          brandUnits) *
        100
      : 0;

  /* SAFE RAW DATA LOOKUP */
  const sjitRows =
    getDataset(
      "sjitStock"
    ) || [];

  const sorRows =
    getDataset(
      "sorStock"
    ) || [];

  const sjitStock =
    sumByStyle(
      sjitRows,
      styleId
    );

  const sorStock =
    sumByStyle(
      sorRows,
      styleId
    );

  const sjitSc =
    drr > 0
      ? sjitStock / drr
      : 0;

  const sorSc =
    drr > 0
      ? sorStock / drr
      : 0;

  const shipQty =
    sjitSc < 45
      ? Math.max(
          0,
          Math.round(
            drr * 45 -
              sjitStock
          )
        )
      : 0;

  return {
    styleId,
    erp:
      row.erp ||
      row.erp_sku ||
      "",
    brand,
    rank,

    units,
    gmv,
    asp,
    dw,
    growth,
    returnPct,
    drr,

    sjitStock,
    sorStock,
    sjitSc,
    sorSc,
    shipQty,

    actions:
      buildActions(
        shipQty,
        returnPct
      )
  };
}

/* ==========================================
   ACTIONS
========================================== */

function buildActions(
  shipQty,
  returnPct
) {
  const out =
    [];

  if (
    shipQty > 0
  ) {
    out.push(
      `⚡ Ship ${fmt(
        shipQty
      )} units`
    );
  }

  if (
    returnPct > 20
  ) {
    out.push(
      "↩ High returns risk"
    );
  }

  if (!out.length) {
    out.push(
      "✅ Healthy style"
    );
  }

  return out;
}

/* ==========================================
   HELPERS
========================================== */

function sumByStyle(
  rows,
  styleId
) {
  return rows
    .filter(
      (r) =>
        String(
          r.style_id ||
          r.styleId ||
          ""
        ) ===
        String(styleId)
    )
    .reduce(
      (sum, r) =>
        sum +
        num(
          r.stock ||
          r.qty ||
          r.quantity
        ),
      0
    );
}

function num(v) {
  return Number(v) || 0;
}

function fmt(v) {
  return Number(
    v || 0
  ).toLocaleString(
    "en-IN"
  );
}