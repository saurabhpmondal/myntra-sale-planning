/* ==========================================
   File: js/reports/xray/metrics.js
   FULL REPLACE CODE
   TRUSTED SOURCE VERSION
   Uses sales/sjit/sor outputs directly
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
  const rows =
    getSalesRows() ||
    [];

  const needle =
    String(
      keyword || ""
    )
      .trim()
      .toLowerCase();

  if (!needle)
    return null;

  const row =
    rows.find(
      (r) =>
        String(
          r.styleId ||
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
    rows.findIndex(
      (x) =>
        String(
          x.styleId
        ) ===
        String(
          row.styleId
        )
    ) + 1;

  const sjitRows =
    getSjitRows() ||
    [];

  const sorRows =
    getSorRows() ||
    [];

  const sjit =
    sjitRows.find(
      (r) =>
        sameStyle(
          r,
          row
        )
    ) || {};

  const sor =
    sorRows.find(
      (r) =>
        sameStyle(
          r,
          row
        )
    ) || {};

  return {
    styleId:
      row.styleId || "",

    erp:
      row.erp || "",

    brand:
      row.brand || "",

    rank,

    gmv:
      num(
        row.gmv
      ),

    units:
      num(
        row.units
      ),

    asp:
      num(
        row.asp
      ),

    dw:
      num(
        row.sharePct
      ),

    growth:
      num(
        row.growthPct
      ),

    returnPct:
      num(
        row.returnPct
      ),

    drr:
      num(
        row.units
      ) / 30,

    sjitStock:
      num(
        row.sjitStock
      ),

    sorStock:
      num(
        row.sorStock
      ),

    sjitSc:
      num(
        sjit.sc ||
        sjit.stockCover
      ),

    sorSc:
      num(
        sor.sc ||
        sor.stockCover
      ),

    shipQty:
      num(
        sjit.northQty ||
        0
      ) +
      num(
        sjit.southQty ||
        0
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
  row,
  sjit,
  sor
) {
  const out =
    [];

  const ship =
    num(
      sjit.northQty
    ) +
    num(
      sjit.southQty
    );

  if (
    ship > 0
  ) {
    out.push(
      `⚡ Ship ${fmt(
        ship
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
      row.returnPct
    ) > 20
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