/* ==========================================
   File: js/reports/xray/metrics.js
   FULL REPLACE CODE
   v6.1 EXPANDED METRICS
   Trusted source only
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
    getSalesRows() || [];

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
          r.styleId || ""
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

  const sjit =
    (getSjitRows() || [])
      .find((r) =>
        sameStyle(r, row)
      ) || {};

  const sor =
    (getSorRows() || [])
      .find((r) =>
        sameStyle(r, row)
      ) || {};

  const units =
    num(row.units);

  return {
    styleId:
      row.styleId || "",

    erp:
      row.erp || "",

    brand:
      row.brand || "",

    rank,

    /* SALES */
    gmv:
      num(row.gmv),

    units,

    asp:
      num(row.asp),

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
      units / 30,

    /* STOCK */
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
        sjit.northQty
      ) +
      num(
        sjit.southQty
      ),

    recallQty:
      num(
        sor.recallQty
      ),

    northQty:
      num(
        sjit.northQty
      ),

    southQty:
      num(
        sjit.southQty
      ),

    /* TRAFFIC */
    impressions:
      num(
        row.impressions
      ),

    clicks:
      num(
        row.clicks
      ),

    atc:
      num(
        row.atc
      ),

    ctr:
      num(
        row.ctrPct
      ),

    cvr:
      num(
        row.cvrPct
      ),

    /* PO MIX */
    ppmpPct:
      num(
        row.ppmpPct
      ),

    sjitPct:
      num(
        row.sjitPct
      ),

    sorPct:
      num(
        row.sorPct
      ),

    /* TREND */
    trend:
      buildTrend(
        units,
        num(
          row.growthPct
        )
      ),

    /* RISKS */
    risks:
      buildRisks(
        row,
        sjit,
        sor
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
   TREND
========================================== */

function buildTrend(
  units,
  growth
) {
  const base =
    units / 12;

  const out = [];

  for (
    let i = 1;
    i <= 12;
    i++
  ) {
    let val =
      base *
      (0.8 +
        i * 0.03);

    if (
      growth < 0
    ) {
      val *=
        0.9;
    }

    out.push(
      Math.round(
        val
      )
    );
  }

  return out;
}

/* ==========================================
   RISKS
========================================== */

function buildRisks(
  row,
  sjit,
  sor
) {
  const out =
    [];

  if (
    num(
      sjit.sc ||
        sjit.stockCover
    ) < 15
  ) {
    out.push(
      "Low SJIT Stock"
    );
  }

  if (
    num(
      row.returnPct
    ) > 20
  ) {
    out.push(
      "High Returns"
    );
  }

  if (
    num(
      row.growthPct
    ) < 0
  ) {
    out.push(
      "Negative Growth"
    );
  }

  if (
    num(
      row.ctrPct
    ) < 1
  ) {
    out.push(
      "Weak CTR"
    );
  }

  return out;
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
      `Ship ${fmt(
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
      `Recall ${fmt(
        sor.recallQty
      )} units`
    );
  }

  if (
    num(
      row.growthPct
    ) < 0
  ) {
    out.push(
      "Boost visibility"
    );
  }

  if (!out.length) {
    out.push(
      "Healthy style"
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