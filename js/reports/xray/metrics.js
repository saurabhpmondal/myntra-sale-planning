/* ==========================================
   File: js/reports/xray/metrics.js
   NEW FILE
   Style X-Ray Metrics Engine
   Reuses Existing Engines
========================================== */

import {
  getSalesRows
} from "../sales/metrics.js";

import {
  getSjitRows
} from "../sjit/metrics.js";

import {
  getSorRows
} from "../sor/metrics.js";

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
        num(
          b.units
        ) -
        num(
          a.units
        )
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

  const rank =
    ranked.findIndex(
      (r) =>
        sameStyle(
          r,
          row
        )
    ) + 1;

  const sjit =
    (
      getSjitRows() ||
      []
    ).find(
      (r) =>
        sameStyle(
          r,
          row
        )
    ) || {};

  const sor =
    (
      getSorRows() ||
      []
    ).find(
      (r) =>
        sameStyle(
          r,
          row
        )
    ) || {};

  const units =
    num(
      row.units
    );

  const gmv =
    num(
      row.gmv ||
      row.revenue
    );

  const asp =
    units > 0
      ? gmv /
        units
      : 0;

  const dw =
    num(
      row.dw
    );

  return {
    styleId:
      row.styleId ||
      row.style_id ||
      "",

    erp:
      row.erp ||
      row.erp_sku ||
      "",

    brand:
      row.brand ||
      "",

    rank,

    units,
    gmv,
    asp,
    dw,

    sjitStock:
      num(
        sjit.stock
      ),

    sorStock:
      num(
        sor.stock
      ),

    actions:
      buildActions(
        row,
        sjit,
        sor
      )
  };
}

/* ==========================================
   ACTIONS
========================================== */

function buildActions(
  sales,
  sjit,
  sor
) {
  const out =
    [];

  if (
    num(
      sjit.totalQty
    ) > 0
  ) {
    out.push(
      `⚡ Ship ${fmt(
        sjit.totalQty
      )} units`
    );
  }

  if (
    num(
      sor.recallQty
    ) > 0
  ) {
    out.push(
      `⚠ Recall ${fmt(
        sor.recallQty
      )} units`
    );
  }

  if (
    num(
      sales.returnPct
    ) > 20
  ) {
    out.push(
      "↩ High returns risk"
    );
  }

  if (
    !out.length
  ) {
    out.push(
      "✅ Healthy style"
    );
  }

  return out.slice(
    0,
    3
  );
}

/* ==========================================
   HELPERS
========================================== */

function sameStyle(
  a,
  b
) {
  return (
    String(
      a.styleId ||
      a.style_id ||
      ""
    ) ===
    String(
      b.styleId ||
      b.style_id ||
      ""
    )
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