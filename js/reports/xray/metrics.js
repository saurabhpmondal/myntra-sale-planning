/* ==========================================
   File: js/reports/xray/metrics.js
   FULL REPLACE CODE
   v6.1 FINAL STABLE
   Uses ONLY existing trusted engines
========================================== */

import { getSalesRows } from "../sales/metrics.js";
import { getSjitRows } from "../sjit/metrics.js";
import { getSorRows } from "../sor/metrics.js";
import { getDataset } from "../../core/state.js";

/* ==========================================
   PUBLIC
========================================== */

export function getXrayData(keyword = "") {
  const needle = String(keyword || "")
    .trim()
    .toLowerCase();

  if (!needle) return null;

  const salesRows = getSalesRows() || [];

  const row = salesRows.find((r) =>
    String(r.styleId || "")
      .toLowerCase()
      .includes(needle)
  );

  if (!row) return null;

  const rank =
    salesRows.findIndex(
      (x) =>
        String(x.styleId) ===
        String(row.styleId)
    ) + 1;

  const sjit =
    (getSjitRows() || []).find((r) =>
      sameStyle(r, row)
    ) || {};

  const sor =
    (getSorRows() || []).find((r) =>
      sameStyle(r, row)
    ) || {};

  const pm =
    (getDataset("productMaster") || []).find(
      (r) =>
        String(
          r.style_id || ""
        ).trim() ===
        String(row.styleId).trim()
    ) || {};

  const trend = buildTrend(
    num(row.units),
    num(row.growthPct)
  );

  const risks = buildRisks(
    row,
    sjit,
    sor
  );

  const actions = buildActions(
    row,
    sjit,
    sor
  );

  return {
    styleId: row.styleId || "",
    erp: row.erp || "",
    brand: row.brand || "",
    rank,

    /* SALES */
    gmv: num(row.gmv),
    units: num(row.units),
    asp: num(row.asp),
    dw: num(row.sharePct),
    growth: num(row.growthPct),
    returnPct: num(row.returnPct),

    /* TRAFFIC */
    impressions: num(row.impressions),
    clicks: num(row.clicks),
    atc: num(row.atc),
    ctr: num(row.ctrPct),
    cvr: num(row.cvrPct),

    /* PO MIX */
    ppmpPct: num(row.ppmpPct),
    sjitPct: num(row.sjitPct),
    sorPct: num(row.sorPct),

    /* STOCK */
    drr: num(sjit.drr || sor.drr),
    sjitStock: num(row.sjitStock),
    sorStock: num(row.sorStock),
    sjitSc: num(sjit.sc),
    sorSc: num(sor.sc),
    northQty: num(sjit.northQty),
    southQty: num(sjit.southQty),
    shipQty:
      num(sjit.northQty) +
      num(sjit.southQty),
    recallQty: num(sor.recallQty),

    /* PM */
    status:
      pm.status ||
      pm.erp_status ||
      "",
    mrp:
      num(pm.mrp),
    tp:
      num(pm.tp),
    launchDate:
      pm.launch_date ||
      pm.launchDate ||
      "",
    liveDate:
      pm.live_date ||
      pm.liveDate ||
      "",

    trend,
    risks,
    actions
  };
}

/* ==========================================
   TREND (display only)
========================================== */

function buildTrend(
  units,
  growth
) {
  const base =
    Math.max(
      1,
      units / 12
    );

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

    if (growth < 0)
      val *= 0.9;

    out.push(
      Math.round(val)
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
  const out = [];

  if (
    num(sjit.sc) > 0 &&
    num(sjit.sc) < 15
  ) {
    out.push(
      "Low SJIT Cover"
    );
  }

  if (
    num(sor.sc) > 45
  ) {
    out.push(
      "High SOR Stock"
    );
  }

  if (
    num(row.returnPct) >
    20
  ) {
    out.push(
      "High Returns"
    );
  }

  if (
    num(row.growthPct) <
    0
  ) {
    out.push(
      "Negative Growth"
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
  const out = [];

  const ship =
    num(sjit.northQty) +
    num(sjit.southQty);

  if (ship > 0) {
    out.push(
      `Ship ${fmt(ship)} units`
    );
  }

  if (
    num(sor.recallQty) >
    0
  ) {
    out.push(
      `Recall ${fmt(
        sor.recallQty
      )} units`
    );
  }

  if (
    num(row.growthPct) <
    0
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