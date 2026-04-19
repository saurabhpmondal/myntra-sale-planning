/* ==========================================
   DAILY PULSE ENGINE
   SAFE NORMALIZED VERSION
========================================== */

import { getDataset, getFilters } from "../../core/state.js";

export function getDailyPulseRows(
  sortBy = "MTD",
  order = "HIGH",
  limit = 50
) {
  const sales = getDataset("sales") || [];
  const pm = getDataset("productMaster") || [];

  const dates = getVisibleDates(sales);
  const pmMap = buildPmMap(pm);

  const map = {};

  sales.forEach((r) => {
    const styleId = clean(
      r.styleId ||
      r.style_id
    );

    if (!styleId) return;

    const date = clean(
      r.date ||
      r.order_date
    );

    if (!dates.includes(date)) return;

    if (!map[styleId]) {
      map[styleId] = blankRow(
        styleId,
        pmMap[styleId],
        dates
      );
    }

    const qty = num(
      r.units ||
      r.qty
    );

    map[styleId].days[date] += qty;
    map[styleId].mtd += qty;
  });

  const rows = Object.values(map).map((r) =>
    finalizeRow(r, dates)
  );

  sortRows(rows, sortBy, order);

  return {
    rows: rows.slice(0, limit),
    total: rows.length,
    dates
  };
}

/* ========================================== */

function getVisibleDates(rows) {
  const f = getFilters();

  let arr = rows;

  if (f.startDate && f.endDate) {
    arr = arr.filter((r) => {
      const d = clean(r.date || r.order_date);
      return d >= f.startDate && d <= f.endDate;
    });
  }

  return [...new Set(
    arr.map((r) =>
      clean(r.date || r.order_date)
    )
  )].sort();
}

function buildPmMap(rows) {
  const map = {};

  rows.forEach((r) => {
    const id = clean(
      r.styleId ||
      r.style_id
    );

    if (!id) return;

    map[id] = {
      erp: clean(
        r.erp ||
        r.erp_sku
      ),
      brand: clean(r.brand),
      status: clean(r.status)
    };
  });

  return map;
}

function blankRow(styleId, pm, dates) {
  const days = {};
  dates.forEach((d) => days[d] = 0);

  return {
    styleId,
    erp: pm?.erp || "",
    brand: pm?.brand || "",
    status: pm?.status || "",
    mtd: 0,
    drr: 0,
    trend: "→",
    days
  };
}

function finalizeRow(row, dates) {
  row.drr =
    row.mtd / Math.max(1, dates.length);

  const vals = dates.map((d) => row.days[d]);
  row.trend = getTrend(vals);

  return row;
}

function sortRows(rows, sortBy, order) {
  const key =
    sortBy === "DRR"
      ? "drr"
      : "mtd";

  rows.sort((a, b) => b[key] - a[key]);

  if (order === "LOW") rows.reverse();
}

function getTrend(vals) {
  if (vals.length < 2) return "→";

  const a = num(vals[vals.length - 2]);
  const b = num(vals[vals.length - 1]);

  if (b > a) return "↗";
  if (b < a) return "↘";
  return "→";
}

function clean(v) {
  return String(v || "").trim();
}

function num(v) {
  return Number(v) || 0;
}