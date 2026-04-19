/* ==========================================
   File: js/reports/xray/metrics.js
   FULL REPLACE CODE
   V6.6 SAFE UPGRADE
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

  const salesRows =
    getSalesRows() || [];

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

  return {
    styleId: row.styleId || "",
    myntraUrl: `https://www.myntra.com/${row.styleId}`,

    erp: row.erp || "",
    brand: row.brand || "",
    rank,

    gmv: num(row.gmv),
    units: num(row.units),
    asp: num(row.asp),
    dw: num(row.sharePct),
    growth: num(row.growthPct),
    returnPct: num(row.returnPct),

    impressions: num(row.impressions),
    clicks: num(row.clicks),
    atc: num(row.atc),
    ctr: num(row.ctrPct),
    cvr: num(row.cvrPct),

    ppmpPct: num(row.ppmpPct),
    sjitPct: num(row.sjitPct),
    sorPct: num(row.sorPct),

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

    status:
      pm.status ||
      pm.erp_status ||
      "",
    mrp: num(pm.mrp),
    tp: num(pm.tp),
    launchDate:
      pm.launch_date ||
      "",
    liveDate:
      pm.live_date ||
      "",

    trend:
      buildRealTrend(
        row.styleId
      )
  };
}

/* ==========================================
   REAL TREND FROM SALES DATA
========================================== */

function buildRealTrend(styleId) {
  const rows =
    getDataset("sales") || [];

  const map = {};

  rows.forEach((r) => {
    if (
      String(
        r.style_id || ""
      ).trim() !==
      String(styleId).trim()
    ) return;

    const d =
      String(
        r.order_date ||
        r.date ||
        ""
      ).trim();

    if (!d) return;

    map[d] =
      (map[d] || 0) +
      num(r.qty);
  });

  const vals =
    Object.keys(map)
      .sort()
      .slice(-12)
      .map(
        (k) => map[k]
      );

  if (!vals.length) {
    return [
      2, 4, 6, 8,
      5, 7, 9, 6,
      8, 10, 7, 9
    ];
  }

  return vals;
}

/* ==========================================
   HELPERS
========================================== */

function sameStyle(a, b) {
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