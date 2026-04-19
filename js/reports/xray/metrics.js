/* ==========================================
   File: js/reports/xray/metrics.js
   GOLD MASTER SAFE VERSION
   Full restore + no new risky logic
========================================== */

import { getSalesRows } from "../sales/metrics.js";
import { getSjitRows } from "../sjit/metrics.js";
import { getSorRows } from "../sor/metrics.js";
import { getDataset } from "../../core/state.js";

export function getXrayData(keyword = "") {
  const needle = String(keyword || "").trim().toLowerCase();
  if (!needle) return null;

  const sales = getSalesRows() || [];

  const row = sales.find((r) =>
    String(r.styleId || "").toLowerCase().includes(needle)
  );

  if (!row) return null;

  const rank =
    sales.findIndex(
      (x) =>
        String(x.styleId) ===
        String(row.styleId)
    ) + 1;

  const sjit =
    (getSjitRows() || []).find(
      (r) => same(r, row)
    ) || {};

  const sor =
    (getSorRows() || []).find(
      (r) => same(r, row)
    ) || {};

  const pm =
    (getDataset("productMaster") || []).find(
      (r) =>
        String(
          r.style_id || ""
        ).trim() ===
        String(row.styleId).trim()
    ) || {};

  const returnUnits = Math.round(
    num(row.units) *
      num(row.returnPct) /
      100
  );

  const netUnits = Math.max(
    0,
    num(row.units) - returnUnits
  );

  return {
    styleId: row.styleId || "",
    myntraUrl:
      "https://www.myntra.com/" +
      row.styleId,

    erp: row.erp || "",
    brand: row.brand || "",
    rank,

    gmv: num(row.gmv),
    units: num(row.units),
    returnUnits,
    netUnits,
    asp: num(row.asp),
    dw: num(row.sharePct),
    growth: num(row.growthPct),
    returnPct: num(row.returnPct),

    impressions:
      num(row.impressions),
    clicks:
      num(row.clicks),
    atc: num(row.atc),
    ctr: num(row.ctrPct),
    cvr: num(row.cvrPct),

    ppmpPct:
      num(row.ppmpPct),
    sjitPct:
      num(row.sjitPct),
    sorPct:
      num(row.sorPct),

    drr:
      num(sjit.drr || sor.drr),
    sjitStock:
      num(row.sjitStock),
    sorStock:
      num(row.sorStock),
    sjitSc:
      num(sjit.sc),
    sorSc:
      num(sor.sc),
    shipQty:
      num(
        sjit.totalQty ||
        sjit.shipQty
      ),
    recallQty:
      num(sor.recallQty),

    status:
      pm.status || "",
    mrp: num(pm.mrp),
    tp: num(pm.tp),
    launchDate:
      pm.launch_date || "",
    liveDate:
      pm.live_date || "",

    trend:
      buildTrend(
        row.styleId
      ),

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

/* ------------------ */

function buildTrend(styleId) {
  const rows =
    getDataset("sales") || [];

  const map = {};

  rows.forEach((r) => {
    if (
      String(
        r.style_id || ""
      ) !==
      String(styleId)
    )
      return;

    const d = String(
      r.order_date || ""
    ).trim();

    if (!d) return;

    map[d] =
      (map[d] || 0) +
      num(r.qty);
  });

  return Object.keys(map)
    .sort()
    .map((k) => ({
      date: k,
      value: map[k]
    }));
}

function buildRisks(
  row,
  sjit,
  sor
) {
  const out = [];

  if (
    num(sjit.sc) > 0 &&
    num(sjit.sc) < 15
  )
    out.push(
      "Low SJIT Cover"
    );

  if (
    num(sor.sc) > 45
  )
    out.push(
      "High SOR Stock"
    );

  if (
    num(row.returnPct) >
    20
  )
    out.push(
      "High Returns"
    );

  if (
    num(row.growthPct) <
    0
  )
    out.push(
      "Negative Growth"
    );

  return out;
}

function buildActions(
  row,
  sjit,
  sor
) {
  const out = [];

  if (
    num(
      sjit.totalQty
    ) > 0
  )
    out.push(
      "Ship " +
        fmt(
          sjit.totalQty
        ) +
        " units"
    );

  if (
    num(
      sor.recallQty
    ) > 0
  )
    out.push(
      "Recall " +
        fmt(
          sor.recallQty
        ) +
        " units"
    );

  if (
    num(row.growthPct) <
    0
  )
    out.push(
      "Boost visibility"
    );

  if (!out.length)
    out.push(
      "Healthy style"
    );

  return out;
}

function same(a, b) {
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